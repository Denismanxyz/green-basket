const Product = require('../models/Product');
const factory = require('./crudFactory');

module.exports = factory(Product, {
  searchable: ['productName', 'category', 'sku', 'supplier', 'status'],
  populate: 'store',
  storeScoped: true
});
