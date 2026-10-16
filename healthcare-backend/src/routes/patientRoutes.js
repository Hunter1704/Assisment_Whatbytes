const router = require('express').Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/patientController');

const idRule = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');

const fullRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female or other'),
  body('address').optional({ values: 'null' }).isString(),
  body('medicalHistory').optional({ values: 'null' }).isString(),
];

router.use(auth);

router.post('/', fullRules, validate, asyncHandler(c.create));
router.get('/', asyncHandler(c.list));
router.get('/:id/', idRule, validate, asyncHandler(c.get));
router.put('/:id/', idRule, fullRules, validate, asyncHandler(c.update));
router.delete('/:id/', idRule, validate, asyncHandler(c.remove));

module.exports = router;
