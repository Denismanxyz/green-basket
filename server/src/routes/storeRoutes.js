const controller = require('../controllers/storeController');
const resourceRouter = require('./resourceRouter');

module.exports = resourceRouter(controller, { adminOnly: true });
