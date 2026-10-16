const { Patient } = require('../models');

const findOwned = (req) =>
  Patient.findOne({ where: { id: req.params.id, createdBy: req.user.id } });

exports.create = async (req, res) => {
  const { name, age, gender, address, medicalHistory } = req.body;
  const patient = await Patient.create({
    name, age, gender, address, medicalHistory, createdBy: req.user.id,
  });
  res.status(201).json(patient);
};

exports.list = async (req, res) => {
  const patients = await Patient.findAll({
    where: { createdBy: req.user.id },
    order: [['id', 'ASC']],
  });
  res.json(patients);
};

exports.get = async (req, res) => {
  const patient = await findOwned(req);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

exports.update = async (req, res) => {
  const patient = await findOwned(req);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  const { name, age, gender, address, medicalHistory } = req.body;
  await patient.update({ name, age, gender, address, medicalHistory });
  res.json(patient);
};

exports.remove = async (req, res) => {
  const patient = await findOwned(req);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  await patient.destroy();
  res.status(204).send();
};
