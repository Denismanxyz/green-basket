const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Sales', 'Inventory', 'Daily', 'Monthly'], required: true },
    title: { type: String, required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    topSellingProducts: [{ name: String, quantity: Number }],
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    periodStart: Date,
    periodEnd: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
