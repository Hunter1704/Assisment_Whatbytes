const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define(
  'Patient',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 150 } },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    address: { type: DataTypes.TEXT },
    medicalHistory: { type: DataTypes.TEXT },
  },
  { tableName: 'patients' }
);

module.exports = Patient;
