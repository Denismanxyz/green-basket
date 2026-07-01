const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    storeCode: { type: String, required: true, unique: true },
    manager: { type: String, required: true },
    location: { type: String, required: true },
    inventory: { type: Number, default: 0 },
    sales: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
