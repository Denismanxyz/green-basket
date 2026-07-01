const express = require('express');
const { body } = require('express-validator');
const auth = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  auth.login
);
router.get('/me', protect, auth.me);
router.put('/profile', protect, [body('name').optional().trim().notEmpty()], validate, auth.updateProfile);
router.put(
  '/change-password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 8 })],
  validate,
  auth.changePassword
);

module.exports = router;
