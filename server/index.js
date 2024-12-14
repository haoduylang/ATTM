const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateKeyPair, sign, verify } = require('./DigitalSignatureUtil'); // Import các hàm từ DigitalSignatureUtil

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

// API để xử lý chữ ký điện tử và lưu trữ khóa công khai vào cơ sở dữ liệu
app.post('/api/checkout', async (req, res) => {
    try {
        const { userId, data, productName, quantity } = req.body;

        // Tạo cặp khóa
        const { publicKey, privateKey } = await generateKeyPair();

        // Ký dữ liệu
        const signature = sign(data, privateKey);

        // Lưu khóa công khai vào cơ sở dữ liệu
        await Users.findByIdAndUpdate(userId, { publicKey: publicKey.toString('base64') });

        // Tạo đơn hàng mới và lưu vào cơ sở dữ liệu
        const newOrder = new Orders({
            user: userId,
            productName,
            quantity,
            publicKey: publicKey.toString('base64')
        });

        await newOrder.save();

        // Trả về chữ ký và privateKey cho người dùng
        res.status(200).json({ signature, privateKey: privateKey.toString('base64') });
    } catch (error) {
        console.error("Error in /api/checkout:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---------------------- SERVER ----------------------
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});