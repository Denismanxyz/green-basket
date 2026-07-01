const Delivery = require('../models/Delivery');
const factory = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const crud = factory(Delivery, {
  searchable: ['deliveryPerson', 'deliveryAddress', 'status'],
  populate: 'order'
});

crud.complete = asyncHandler(async (req, res) => {
  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed', completedAt: new Date() },
    { new: true }
  );
  if (!delivery) {
    res.status(404);
    throw new Error('Delivery not found');
  }
  res.json(delivery);
});

module.exports = crud;
