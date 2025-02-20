const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db.config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');


const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const transactionRoutes = require('./routes/transaction.routes');
const budgetRoutes = require('./routes/budget.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares

app.use(express.json()); // Para manejar datos JSON
app.use(cors({
  origin: ["http://localhost:3000", "https://tu-dominio-en-produccion.com"], // Permitir solo estos dominios
  credentials: true, // 🔥 Permitir cookies y headers de autenticación
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
}));


// Usar rutas de usuarios

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Conectar con la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.log('Error al conectar a la base de datos:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
