const router = require('express').Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/doctorController');

const idRule = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');

const rules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Invalid email'),
  body('phone').optional({ values: 'null' }).isString(),
  body('experienceYears').optional({ values: 'null' }).isInt({ min: 0 }).withMessage('experienceYears must be >= 0'),
];

router.use(auth);

router.post('/', rules, validate, asyncHandler(c.create));
router.get('/', asyncHandler(c.list));
router.get('/:id/', idRule, validate, asyncHandler(c.get));
router.put('/:id/', idRule, rules, validate, asyncHandler(c.update));
router.delete('/:id/', idRule, validate, asyncHandler(c.remove));

module.exports = router;
