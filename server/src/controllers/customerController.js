const Customer = require('../models/Customer');
const Order = require('../models/Order');
const factory = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const crud = factory(Customer, { searchable: ['name', 'email', 'phone', 'address'] });

crud.getDetails = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  const orderHistory = await Order.find({ customer: customer._id }).sort('-createdAt').limit(25);
  res.json({ customer, orderHistory });
});

module.exports = crud;
