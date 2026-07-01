const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const factory = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const crud = factory(Order, {
  searchable: ['orderNumber', 'customerName', 'orderStatus'],
  populate: 'customer store products.product',
  storeScoped: true
});

crud.create = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.body.customer);
  if (!customer) {
    res.status(400);
    throw new Error('Customer not found');
  }

  const orderItems = [];
  let amount = 0;
  let store = req.body.store || req.user.store;
  for (const item of req.body.products || []) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(400);
      throw new Error('Product not found');
    }
    if (product.quantity < item.quantity) {
      res.status(400);
      throw new Error(`${product.productName} has insufficient stock`);
    }
    const previousQuantity = product.quantity;
    product.quantity -= item.quantity;
    product.status = product.quantity <= 10 ? 'Low Stock' : 'Active';
    await product.save();
    if (!store) store = product.store;
    await Inventory.create({
      product: product._id,
      store: product.store,
      type: 'Stock Out',
      quantity: item.quantity,
      previousQuantity,
      currentQuantity: product.quantity,
      note: 'Order sale',
      performedBy: req.user._id
    });
    amount += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      productName: product.productName,
      quantity: item.quantity,
      price: product.price
    });
  }

  const order = await Order.create({
    orderNumber: `GB-${Date.now()}`,
    customer: customer._id,
    customerName: customer.name,
    products: orderItems,
    amount,
    orderStatus: req.body.orderStatus || 'Pending',
    store
  });

  res.status(201).json(order);
});

module.exports = crud;
