const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Función para iniciar sesión y obtener un token JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar JWT con ID y ROLE
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Agregamos el role
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// Función para obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Función para actualizar datos del usuario autenticado
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar datos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Función para eliminar usuario (solo admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const userRole = req.user.role; // Rol del usuario autenticado
    const userToDeleteId = parseInt(req.params.id, 10); 


    const user = await User.findByPk(userToDeleteId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    
    if (userId !== userToDeleteId && userRole !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este usuario' });
    }

    await user.destroy();
    res.json({ message: 'Cuenta eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};





