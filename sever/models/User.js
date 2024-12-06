const mongose = require('mongoose');

const userSchema = new mongose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }
);
module.exports = mongose.model('User', userSchema);