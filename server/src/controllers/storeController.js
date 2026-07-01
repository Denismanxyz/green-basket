const Store = require('../models/Store');
const factory = require('./crudFactory');

module.exports = factory(Store, { searchable: ['storeName', 'storeCode', 'manager', 'location'] });
