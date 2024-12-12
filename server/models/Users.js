const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: 'user' },
    token: { type: String, default: null },
});

module.exports = mongoose.model('Users', UserSchema);
