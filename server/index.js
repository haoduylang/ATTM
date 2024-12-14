// Import các module cần thiết
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Kết nối cơ sở dữ liệu
require('./connection');

// Import Models
const Users = require('./models/Users');
const Orders = require('./models/Orders'); // Nếu có model Orders

// Khởi tạo app
const app = express();
const port = process.env.PORT || 3000;

// JWT Secret Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------- ROUTES ----------------------

// Trang chủ
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// ----------------- USER AUTHENTICATION -----------------

// Đăng ký
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password, phone, address } = req.body;

        if (!fullname || !email || !password || !phone || !address) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new Users({
            fullname,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
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
// Middleware kiểm tra người dùng đã đăng nhập hay chưa
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
        const users = await Users.find({}, 'fullname email phone address');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in /admin/users:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
// Thêm sản phẩm vào giỏ hàng (API route)
// Verify token endpoint
// API để xác minh token của người dùng trước khi cho phép thêm sản phẩm vào giỏ hàng
app.get('/api/verify-token', checkUserAuth, (req, res) => {
    res.status(200).json({ message: "Token is valid" });
  });
  app.post('/api/cart', checkUserAuth, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({ error: "Missing product ID or quantity" });
      }
  
      const user = req.user; // Đảm bảo người dùng đã xác thực
      

      
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error in /api/cart:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// ---------------------- SERVER ----------------------
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});