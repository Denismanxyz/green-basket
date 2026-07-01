const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, controller.getAll);
router.get('/low-stock', protect, controller.lowStock);
router.post(
  '/movement',
  protect,
  [body('product').isMongoId(), body('type').isIn(['Stock In', 'Stock Out']), body('quantity').isInt({ min: 1 })],
  validate,
  controller.stockMove
);
router.get('/:id', protect, controller.getOne);

module.exports = router;
