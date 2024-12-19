
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    productName: String,
    quantity: Number,
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' },
    cancelRequested: { type: Boolean, default: false },
    signatureKey: String,
    isVerified: { type: Boolean, default: false } // Thêm trường isVerified
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;