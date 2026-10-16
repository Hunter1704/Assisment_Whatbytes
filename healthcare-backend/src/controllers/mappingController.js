const { Mapping, Patient, Doctor } = require('../models');

exports.create = async (req, res) => {
  const patientId = req.body.patient ?? req.body.patientId ?? req.body.patient_id;
  const doctorId = req.body.doctor ?? req.body.doctorId ?? req.body.doctor_id;

  const p = await Patient.findOne({ where: { id: patientId, createdBy: req.user.id } });
  if (!p) return res.status(404).json({ message: 'Patient not found' });

  const d = await Doctor.findByPk(doctorId);
  if (!d) return res.status(404).json({ message: 'Doctor not found' });

  const [mapping, created] = await Mapping.findOrCreate({
    where: { patientId: p.id, doctorId: d.id },
  });
  if (!created) return res.status(409).json({ message: 'Doctor already assigned to this patient' });

  res.status(201).json(mapping);
};

// All mappings for patients owned by the authenticated user, or filter by patient_id
exports.list = async (req, res) => {
  const patientId = req.query.patient_id ?? req.query.patientId;
  if (patientId !== undefined) {
    req.params.patient_id = patientId;
    return exports.byPatient(req, res);
  }

  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, attributes: ['id', 'name'], where: { createdBy: req.user.id } },
      { model: Doctor, attributes: ['id', 'name', 'specialization', 'email', 'phone', 'experienceYears'] },
    ],
    order: [['id', 'ASC']],
  });
  res.json(mappings);
};

// All doctors assigned to one patient (returns array of doctor objects with mappingId and patientId)
exports.byPatient = async (req, res) => {
  const patient = await Patient.findOne({
    where: { id: req.params.patient_id, createdBy: req.user.id },
  });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [{ model: Doctor }],
  });

  const doctors = mappings
    .filter((m) => m.Doctor)
    .map((m) => ({
      mappingId: m.id,
      patientId: patient.id,
      ...m.Doctor.toJSON(),
    }));

  res.json(doctors);
};

exports.remove = async (req, res) => {
  const mapping = await Mapping.findByPk(req.params.id, { include: [Patient] });
  if (!mapping || !mapping.Patient || mapping.Patient.createdBy !== req.user.id) {
    return res.status(404).json({ message: 'Mapping not found' });
  }
  await mapping.destroy();
  res.status(204).send();
};
