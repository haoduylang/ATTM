const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Orders', OrderSchema);
