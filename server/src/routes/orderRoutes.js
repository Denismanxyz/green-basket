const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, controller.getAll);
router.post(
  '/',
  protect,
  [body('customer').isMongoId(), body('products').isArray({ min: 1 }), body('products.*.product').isMongoId(), body('products.*.quantity').isInt({ min: 1 })],
  validate,
  controller.create
);
router.route('/:id').get(protect, controller.getOne).put(protect, controller.update).delete(protect, controller.remove);

module.exports = router;
