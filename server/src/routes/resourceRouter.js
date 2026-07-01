const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');

const resourceRouter = (controller, options = {}) => {
  const router = express.Router();
  const adminOnly = options.adminOnly ? [authorize('admin')] : [];

  router.route('/').get(protect, controller.getAll).post(protect, ...adminOnly, controller.create);
  router.route('/:id').get(protect, controller.getOne).put(protect, ...adminOnly, controller.update).delete(protect, authorize('admin'), controller.remove);
  return router;
};

module.exports = resourceRouter;
