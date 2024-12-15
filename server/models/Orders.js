const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    productName: String,
    quantity: Number,
    orderDate: { type: Date, default: Date.now },
    publicKey: String // Thêm trường publicKey
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;