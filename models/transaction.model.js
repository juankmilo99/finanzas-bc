const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Category = require('./category.model');
const User = require('./user.model');


const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'transactions'
});

// Relación con Category para obtener el type desde ahí
Transaction.belongsTo(Category, { foreignKey: 'category_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Transaction;
