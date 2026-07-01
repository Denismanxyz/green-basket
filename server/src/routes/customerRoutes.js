const express = require('express');
const controller = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, controller.getAll).post(protect, controller.create);
router.get('/:id/details', protect, controller.getDetails);
router.route('/:id').get(protect, controller.getOne).put(protect, controller.update).delete(protect, controller.remove);

module.exports = router;
