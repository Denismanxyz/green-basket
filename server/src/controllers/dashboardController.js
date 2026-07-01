const Product = require('../models/Product');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Store = require('../models/Store');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    inventoryAgg,
    todaysOrders,
    revenueAgg,
    lowStockProducts,
    pendingDeliveries,
    recentOrders,
    storeSales
  ] = await Promise.all([
    Product.countDocuments(),
    Product.aggregate([{ $group: { _id: null, count: { $sum: '$quantity' } } }]),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, revenue: { $sum: '$amount' } } }]),
    Product.find({ quantity: { $lte: 10 } }).populate('store').sort('quantity').limit(10),
    Delivery.countDocuments({ status: { $in: ['Pending', 'Out for Delivery'] } }),
    Order.find().populate('store').sort('-createdAt').limit(8),
    Store.find().select('storeName sales inventory').sort('storeCode')
  ]);

  res.json({
    totalProducts,
    inventoryCount: inventoryAgg[0]?.count || 0,
    todaysOrders,
    revenue: revenueAgg[0]?.revenue || 0,
    lowStockProducts,
    pendingDeliveries,
    recentOrders,
    charts: {
      storeLabels: storeSales.map((store) => store.storeName),
      sales: storeSales.map((store) => store.sales),
      inventory: storeSales.map((store) => store.inventory)
    }
  });
});
