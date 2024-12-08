const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
dotenv.config(); // Load các biến môi trường từ file .env
const app = express();
const jwt = require('jsonwebtoken');
// Kết nối tới MongoDB với async/await
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true, // Cấu hình tối ưu hóa kết nối
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Dừng server nếu không thể kết nối
    }
}

// Gọi hàm kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/v1/auth', authRoute);

// Khởi động server
const PORT = process.env.PORT || 8000; // Đọc cổng từ .env, mặc định là 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
