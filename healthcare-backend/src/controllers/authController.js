const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const issueTokens = (user) => ({
  access: jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h',
  }),
  refresh: jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  }),
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

  res.status(201).json({ message: 'User registered successfully', user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

  const tokens = issueTokens(user);
  res.json({
    message: 'Login successful',
    user,
    token: tokens.access,        // Standard JWT token key
    access: tokens.access,       // Supported for refresh flows
    accessToken: tokens.access,  // Alternate standard key
    refresh: tokens.refresh,
  });
};


exports.refresh = async (req, res) => {
  try {
    const payload = jwt.verify(req.body.refresh, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    res.json({ access: issueTokens(user).access });
  } catch (e) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
