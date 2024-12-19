const mongoose = require('mongoose');

const url = `mongodb+srv://haolang:abc123456@haolang.ylwnt.mongodb.net/?retryWrites=true&w=majority&appName=HaoLang`;

mongoose.connect(url).then(() => console.log('Kết nối thành công'))
.catch(err => console.error('Lỗi kết nối:', err));