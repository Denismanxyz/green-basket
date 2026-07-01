const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  store: user.store
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password').populate('store');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({ token: signToken(user), user: sanitizeUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: sanitizeUser(req.user) });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const matches = await user.matchPassword(req.body.currentPassword);
  if (!matches) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
});
