const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    type: { type: String, enum: ['Stock In', 'Stock Out', 'Adjustment'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    previousQuantity: { type: Number, required: true, min: 0 },
    currentQuantity: { type: Number, required: true, min: 0 },
    note: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
