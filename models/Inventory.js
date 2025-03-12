const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);
