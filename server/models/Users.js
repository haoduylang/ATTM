const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    publicKey: {
        type: String
    }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;