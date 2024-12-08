const mongoose = require('mongoose');

const url = `mongodb+srv://hau18082003:Phanphuochau18082003@shoppingapp.wuxuw.mongodb.net/`;

mongoose.connect(url).then(() => console.log('Kết nối thành công'))
.catch(err => console.error('Lỗi kết nối:', err));