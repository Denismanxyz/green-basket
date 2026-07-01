const express = require('express');
const controller = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, controller.summary);
router.get('/export-csv', protect, controller.exportCsv);
router.route('/').get(protect, controller.getAll).post(protect, controller.create);
router.route('/:id').get(protect, controller.getOne).put(protect, controller.update).delete(protect, controller.remove);

module.exports = router;
