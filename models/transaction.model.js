const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Category = require('./category.model'); // Relación con la categoría
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
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
  tableName: 'transactions' // Asegúrate de que el nombre de la tabla sea correcto
});

Transaction.belongsTo(Category, { foreignKey: 'category_id' }); // Relación con Category
Transaction.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Transaction;