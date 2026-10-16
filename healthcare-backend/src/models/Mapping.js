const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mapping = sequelize.define(
  'Mapping',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id',
      },
    },
  },
  {
    tableName: 'mappings',
    indexes: [
      {
        unique: true,
        fields: ['patientId', 'doctorId'],
      },
    ],
  }
);

module.exports = Mapping;
