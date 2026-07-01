const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    supplier: { type: String, required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Low Stock'], default: 'Active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
