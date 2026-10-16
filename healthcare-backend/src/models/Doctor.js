const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define(
  'Doctor',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    specialization: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20) },
    experienceYears: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
  },
  { tableName: 'doctors' }
);

module.exports = Doctor;
