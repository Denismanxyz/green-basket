const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    address: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
