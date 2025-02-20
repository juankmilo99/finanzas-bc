// models/budget.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Category = require('./category.model'); // Relación con la categoría
const User = require('./user.model');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  limit_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false, // No necesitamos timestamps para presupuestos
  tableName: 'budgets'
});

Budget.belongsTo(Category, { foreignKey: 'category_id' }); // Relación con Category
Budget.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Budget;
