const router = require('express').Router();
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/mappingController');

router.use(auth);

router.post(
  '/',
  [
    body().custom((value, { req }) => {
      const patientId = req.body.patient ?? req.body.patientId ?? req.body.patient_id;
      const doctorId = req.body.doctor ?? req.body.doctorId ?? req.body.doctor_id;

      if (!patientId || !Number.isInteger(Number(patientId)) || Number(patientId) < 1) {
        throw new Error('Patient ID must be a positive integer');
      }
      if (!doctorId || !Number.isInteger(Number(doctorId)) || Number(doctorId) < 1) {
        throw new Error('Doctor ID must be a positive integer');
      }
      return true;
    }),
  ],
  validate,
  asyncHandler(c.create)
);

router.get(
  '/',
  [query('patient_id').optional().isInt({ min: 1 }).withMessage('patient_id must be a positive integer')],
  validate,
  asyncHandler(c.list)
);

router.get(
  '/:patient_id/',
  [param('patient_id').isInt({ min: 1 }).withMessage('patient_id must be a positive integer')],
  validate,
  asyncHandler(c.byPatient)
);

router.delete(
  '/:id/',
  [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')],
  validate,
  asyncHandler(c.remove)
);

module.exports = router;
