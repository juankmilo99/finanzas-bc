const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Desactivar logs de SQL
  dialectOptions: {
    ssl: {
      require: true, // Activar SSL
      rejectUnauthorized: false, // Para evitar problemas de certificación si no tienes certificados válidos
    },
  },
});

module.exports = sequelize;
