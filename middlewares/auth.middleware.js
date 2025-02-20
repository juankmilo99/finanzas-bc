const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Asegúrate de importar el modelo
require('dotenv').config();

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token requerido' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos para obtener su rol
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agregar la información del usuario al request
    req.user = {
      id: user.id,
      role: user.role, // Asegurar que el rol esté presente
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
