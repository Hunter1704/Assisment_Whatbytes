const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/authController');

router.post(
  '/register/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  asyncHandler(c.register)
);

router.post(
  '/login/',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  asyncHandler(c.login)
);

router.post(
  '/refresh/',
  [body('refresh').notEmpty().withMessage('Refresh token is required')],
  validate,
  asyncHandler(c.refresh)
);

module.exports = router;
