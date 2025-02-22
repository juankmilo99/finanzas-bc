const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const Goal = sequelize.define('Goal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    target_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    current_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: 'goals'
});

Goal.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Goal;