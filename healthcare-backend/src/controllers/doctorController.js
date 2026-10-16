const { Doctor } = require('../models');

exports.create = async (req, res) => {
  const { name, specialization, email, phone, experienceYears } = req.body;
  const doctor = await Doctor.create({
    name, specialization, email: email || null, phone, experienceYears, createdBy: req.user.id,
  });
  res.status(201).json(doctor);
};

exports.list = async (req, res) => {
  res.json(await Doctor.findAll({ order: [['id', 'ASC']] }));
};

exports.get = async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

// Only the user who created a doctor may modify or delete it
const findOwned = async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) {
    res.status(404).json({ message: 'Doctor not found' });
    return null;
  }
  if (doctor.createdBy !== req.user.id) {
    res.status(403).json({ message: 'You can only modify doctors you created' });
    return null;
  }
  return doctor;
};

exports.update = async (req, res) => {
  const doctor = await findOwned(req, res);
  if (!doctor) return;
  const { name, specialization, email, phone, experienceYears } = req.body;
  await doctor.update({ name, specialization, email: email || null, phone, experienceYears });
  res.json(doctor);
};

exports.remove = async (req, res) => {
  const doctor = await findOwned(req, res);
  if (!doctor) return;
  await doctor.destroy();
  res.status(204).send();
};
