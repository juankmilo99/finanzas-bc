const Category = require("../models/category.model");

// 🔹 Crear una categoría (Solo admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden agregar categorías." });
    }

    if (!name || !type) {
      return res.status(400).json({ message: "El nombre y el tipo son obligatorios" });
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const newCategory = await Category.create({ name, description, type });
    res.status(201).json(newCategory);

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 🔹 Obtener todas las categorías (Todos los usuarios)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 🔹 Obtener una categoría por ID (Todos los usuarios)
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 🔹 Actualizar una categoría (Solo admin)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type } = req.body;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden modificar categorías." });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.type = type || category.type;
    await category.save();

    res.json(category);

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 🔹 Eliminar una categoría (Solo admin)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar categorías." });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await category.destroy();
    res.json({ message: "Categoría eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
