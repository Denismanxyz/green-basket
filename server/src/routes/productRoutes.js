const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const productValidation = [
  body('productName').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('sku').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('quantity').isInt({ min: 0 }),
  body('supplier').trim().notEmpty(),
  body('store').isMongoId()
];

router.get('/', protect, controller.getAll);
router.post('/', protect, productValidation, validate, controller.create);
router.route('/:id').get(protect, controller.getOne).put(protect, controller.update).delete(protect, controller.remove);

module.exports = router;
