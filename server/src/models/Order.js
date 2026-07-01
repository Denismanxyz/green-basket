const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    products: [orderItemSchema],
    amount: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
