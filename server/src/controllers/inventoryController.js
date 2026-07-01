const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const factory = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const crud = factory(Inventory, {
  searchable: ['type', 'note'],
  populate: 'product store performedBy',
  storeScoped: true
});

crud.stockMove = asyncHandler(async (req, res) => {
  const { product: productId, type, quantity, note } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const previousQuantity = product.quantity;
  const moveQty = Number(quantity);
  if (type === 'Stock Out' && previousQuantity < moveQty) {
    res.status(400);
    throw new Error('Insufficient stock for stock out');
  }

  product.quantity = type === 'Stock In' ? previousQuantity + moveQty : previousQuantity - moveQty;
  product.status = product.quantity <= 10 ? 'Low Stock' : 'Active';
  await product.save();

  const movement = await Inventory.create({
    product: product._id,
    store: product.store,
    type,
    quantity: moveQty,
    previousQuantity,
    currentQuantity: product.quantity,
    note,
    performedBy: req.user._id
  });

  res.status(201).json(movement);
});

crud.lowStock = asyncHandler(async (req, res) => {
  const products = await Product.find({ quantity: { $lte: 10 } }).populate('store').sort('quantity');
  res.json(products);
});

module.exports = crud;
