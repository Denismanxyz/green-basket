const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    deliveryPerson: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Out for Delivery', 'Completed', 'Failed'],
      default: 'Pending'
    },
    estimatedDeliveryDate: { type: Date, required: true },
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
