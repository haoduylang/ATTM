const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateKeyPair, sign, verify } = require('./ciphers/DigitalSignatureUtil');

// Kết nối cơ sở dữ liệu
require('./connection');

// Import Models
const Users = require('./models/Users');
const Orders = require('./models/Orders'); // Nếu bạn có model Orders

// Khởi tạo app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT Secret Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

// ---------------------- ROUTES ----------------------

// Trang chủ
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// ----------------- USER AUTHENTICATION -----------------

app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, password, phone, address } = req.body;

    // Mã hóa mật khẩu
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Tạo cặp khóa
    const { publicKey, privateKey } = await generateKeyPair();

    // Tạo người dùng mới và lưu vào cơ sở dữ liệu
    const newUser = new Users({
      fullname,
      email,
      password: hashedPassword,
      phone,
      address,
      publicKey,
      privateKey
    });

    await newUser.save();

    // Trả về privateKey cho client
    res.status(201).json({
      message: 'User registered successfully',
      privateKey
    });
  } catch (error) {
    console.error("Error in /api/register:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User or Password is incorrect" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "User email or password is incorrect" });
        }

        const payload = { userId: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });

        user.token = token;
        await user.save();

        res.status(200).json({
            user: user.email,
            fullname: user.fullname,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error("Error in /api/login:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const checkUserAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await Users.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;  // Lưu thông tin người dùng vào request
    next();
  } catch (error) {
    console.error("Error in checkUserAuth:", error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// ----------------- ADMIN ROUTES -----------------

// Middleware kiểm tra quyền admin
const checkAdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: 'Unauthorized access: Token missing or invalid' });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await Users.findById(decoded.userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admin role required' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in checkAdminAuth:", error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Trang Admin Dashboard
app.get('/admin/dashboard', checkAdminAuth, (req, res) => {
    res.status(200).json({ message: `Welcome to admin dashboard, ${req.user.fullname}` });
});

// Tạo admin mới
app.post('/admin/create', checkAdminAuth, async (req, res) => {
    try {
        const { fullname, email, password, phone, address } = req.body;

        if (!fullname || !email || !password || !phone || !address) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const existingAdmin = await Users.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newAdmin = new Users({
            fullname,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'admin',
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Error in /admin/create:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Lấy danh sách người dùng
app.get('/admin/users', checkAdminAuth, async (req, res) => {
    try {
        const users = await Users.find({}, 'fullname email phone address publicKey');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in /admin/users:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API để lấy thông tin đơn hàng đã đặt của người dùng
app.get('/api/orders', checkUserAuth, async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id }).populate('user', 'fullname email');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in /api/orders:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API để xử lý chữ ký điện tử và lưu trữ khóa công khai vào cơ sở dữ liệu
app.post('/api/information', checkUserAuth, async (req, res) => {
  try {
    const { data, items, total, shipping } = req.body;
    const user = await Users.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Concatenate product names
    const productName = items.map(item => item.name).join(', ');

    // Sign data
    const signature = sign(data, user.privateKey);

    // Create new order and save to database
    const newOrder = new Orders({
      user: req.user._id,
      productName,
      quantity: items.reduce((acc, item) => acc + item.qty, 0),
      total,
      shipping,
      signature
    });

    await newOrder.save();

    // Return signature and private key to user
    res.status(200).json({ signature, privateKey: user.privateKey });
  } catch (error) {
    console.error("Error in /api/information:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// verify token
app.get('/api/verify-token', checkUserAuth, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// API để xử lý đơn hàng
// filepath: /d:/game/ATTM/server/index.js

app.post('/api/orders', checkUserAuth, async (req, res) => {
  try {
    const { productName, quantity, signatureKey } = req.body;

    const newOrder = new Orders({
      user: req.user._id,
      productName,
      quantity,
      signatureKey // Lưu signatureKey vào đơn hàng
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error("Error in /api/orders:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route để thêm sản phẩm vào giỏ hàng
app.post('/api/cart', checkUserAuth, async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
          return res.status(400).json({ error: "Missing product ID or quantity" });
      }

      const user = req.user; // Đảm bảo người dùng đã xác thực

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const cartItem = user.cart.find(item => item.productId.toString() === productId);
      if (cartItem) {
          // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
          cartItem.quantity += quantity;
      } else {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
          user.cart.push({ productId, quantity });
      }

      await user.save();
      res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
      console.error("Error in /api/cart:", error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});
// Route để lấy giỏ hàng của người dùng
app.get('/api/cart', checkUserAuth, async (req, res) => {
  try {
      const user = req.user; // Đảm bảo người dùng đã xác thực
      await user.populate('cart.productId').execPopulate(); // Populate thông tin sản phẩm

      res.status(200).json(user.cart);
  } catch (error) {
      console.error("Error in /api/cart:", error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});
// API để lấy thông tin người dùng
app.get('/api/user', checkUserAuth, (req, res) => {
    res.status(200).json({ user: req.user });
  });

//-------------QUẢN LÍ ĐƠN HÀNG---------
// Lấy danh sách đơn hàng
app.get('/admin/orders', checkAdminAuth, async (req, res) => {
  try {
    const orders = await Orders.find().populate('user', 'fullname email');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in /admin/orders:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Xác nhận đơn hàng
app.post('/admin/orders/confirm', checkUserAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Cập nhật trạng thái đơn hàng (ví dụ: đã xác nhận)
    order.status = 'confirmed';
    await order.save();

    res.status(200).json({ success: true, message: 'Order confirmed successfully' });
  } catch (error) {
    console.error("Error in /admin/orders/confirm:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kiểm tra thay đổi trên database khi load
app.get('/admin/orders/check', checkAdminAuth, async (req, res) => {
  try {
    const orders = await Orders.find().populate('user', 'fullname email');
    const modifiedOrders = orders.filter(order => order.modified);
    res.status(200).json(modifiedOrders);
  } catch (error) {
    console.error("Error in /admin/orders/check:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  // Xóa đơn hàng
app.delete('/admin/orders/:orderId', checkUserAuth, async (req, res) => {
    try {
      const { orderId } = req.params;
      await Orders.findByIdAndDelete(orderId);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error("Error in /admin/orders/:orderId:", error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// API để thông báo cho admin khi người dùng muốn hủy đơn hàng
app.post('/api/orders/request-cancel', checkUserAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Giả sử bạn có một trường 'cancelRequested' để đánh dấu yêu cầu hủy
    order.cancelRequested = true;
    await order.save();

    // Gửi thông báo cho admin (có thể là email, hoặc lưu vào cơ sở dữ liệu để admin xem)
    // Ở đây, chúng ta chỉ lưu vào cơ sở dữ liệu
    res.status(200).json({ success: true, message: 'Cancel request sent to admin' });
  } catch (error) {
    console.error("Error in /api/orders/request-cancel:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Xử lý vấn đề lộ private key
app.post('/api/report-key-leak', checkUserAuth, async (req, res) => {
  try {
    const user = req.user;
    user.publicKey = null; // Đưa public key về trạng thái không chấp nhận xác thực mới
    await user.save();

    // Phát sinh cặp khóa mới
    const { publicKey, privateKey } = await generateKeyPair();

    user.publicKey = publicKey;
    user.privateKey = privateKey;
    await user.save();

    res.status(200).json({ message: 'Public key updated successfully', privateKey });
  } catch (error) {
    console.error("Error in /api/report-key-leak:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/verify-private-key', checkUserAuth, async (req, res) => {
  try {
    const { privateKey } = req.body;
    const user = await Users.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided private key matches the user's stored private key
    const isValid = privateKey === user.privateKey;

    if (isValid) {
      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false });
    }
  } catch (error) {
    console.error("Error in /api/verify-private-key:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/verify-signature', checkUserAuth, async (req, res) => {
  try {
    const { orderId, signature } = req.body;

    const order = await Orders.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the authenticated user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Prepare data to verify (adjust this as per your signing process)
    const data = `${order.user.fullname}${order.user.email}${order.user.phone}${order.user.address}`;

    // Verify the signature using the user's public key
    const isValid = verify(data, signature, order.user.publicKey);

    if (isValid) {
      // Update order status and set isVerified to true
      order.status = 'verified';
      order.isVerified = true;
      await order.save();
      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false });
    }
  } catch (error) {
    console.error('Error in /api/verify-signature:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ---------------------- SERVER ----------------------
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});