const Order = require('../models/Order');
const Product = require('../models/Product');
const Report = require('../models/Report');
const factory = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const crud = factory(Report, {
  searchable: ['type', 'title'],
  populate: 'store generatedBy'
});

crud.summary = asyncHandler(async (req, res) => {
  const [sales, inventory, topProducts] = await Promise.all([
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$amount' }, orders: { $sum: 1 } } }]),
    Product.aggregate([{ $group: { _id: '$category', quantity: { $sum: '$quantity' }, value: { $sum: { $multiply: ['$quantity', '$price'] } } } }]),
    Order.aggregate([
      { $unwind: '$products' },
      { $group: { _id: '$products.productName', quantity: { $sum: '$products.quantity' } } },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.json({ sales: sales[0] || { total: 0, orders: 0 }, inventory, topProducts });
});

crud.exportCsv = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort('-createdAt').limit(500);
  const rows = ['Order Number,Customer,Status,Amount,Created At'];
  orders.forEach((order) => {
    rows.push([order.orderNumber, order.customerName, order.orderStatus, order.amount, order.createdAt.toISOString()].join(','));
  });
  res.header('Content-Type', 'text/csv');
  res.attachment('green-basket-sales-report.csv');
  res.send(rows.join('\n'));
});

module.exports = crud;
