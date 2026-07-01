const express = require('express');
const controller = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, controller.getAll).post(protect, controller.create);
router.put('/:id/complete', protect, controller.complete);
router.route('/:id').get(protect, controller.getOne).put(protect, controller.update).delete(protect, controller.remove);

module.exports = router;
