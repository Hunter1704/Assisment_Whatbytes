const sequelize = require('../config/db');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

// User associations
User.hasMany(Patient, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Doctor, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdBy' });

// Patient <-> Doctor mapping with explicit foreign keys & DB cascade
Patient.hasMany(Mapping, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Mapping.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

Doctor.hasMany(Mapping, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId', onDelete: 'CASCADE' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };
