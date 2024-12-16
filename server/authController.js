const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Đảm bảo sử dụng đúng model của bạn
const router = express.Router();

// Hàm xử lý đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Trả về ID, email và role
      process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY', // Sử dụng secret key từ environment hoặc mặc định
      { expiresIn: '1h' }
    );

    // Phản hồi thành công với thông tin người dùng và token
    res.json({
      success: true,
      user: { email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
