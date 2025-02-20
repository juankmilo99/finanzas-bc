// models/bankImport.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const BankImport = sequelize.define('BankImport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = BankImport;
