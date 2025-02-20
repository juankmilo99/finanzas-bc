const Budget = require('../models/budget.model');

// Crear un nuevo presupuesto
exports.createBudget = async (req, res) => {
    try {
      const { category_id, limit_amount, start_date, end_date } = req.body;
      const user_id = req.user.id; // Obtener el user_id del token JWT
      const budget = await Budget.create({ category_id, user_id, limit_amount, start_date, end_date });
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Obtener todos los presupuestos (solo admin)
exports.getAllBudgets = async (req, res) => {
    try {
      // Verificar si el usuario tiene el rol de administrador
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo los administradores pueden ver todos los presupuestos' });
      }
  
      const budgets = await Budget.findAll();
      res.status(200).json(budgets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Obtener un presupuesto por ID (solo admin)
exports.getBudgetById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const budget = await Budget.findByPk(req.params.id);
    if (budget) {
      res.status(200).json(budget);
    } else {
      res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener presupuestos por user_id
exports.getBudgetsByUserId = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtener el user_id del token JWT
        const budgets = await Budget.findAll({ where: { user_id } });

        if (!budgets.length) {
            return res.status(404).json({ message: 'No se encontraron presupuestos para este usuario' });
        }

        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un presupuesto por ID (verificar si el usuario es el creador o admin)
exports.updateBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const { category_id, limit_amount, start_date, end_date } = req.body;
  
      const budget = await Budget.findByPk(id);
  
      if (!budget) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }
  
      // Verificar si el usuario es el creador del presupuesto o un administrador
      if (budget.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo el creador o un administrador pueden actualizar este presupuesto' });
      }
  
      budget.category_id = category_id;
      budget.limit_amount = limit_amount;
      budget.start_date = start_date;
      budget.end_date = end_date;
  
      await budget.save();
  
      res.status(200).json(budget);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Eliminar un presupuesto por ID (verificar si el usuario es el creador o admin)
exports.deleteBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
  
      if (!budget) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }
  
      // Verificar si el usuario es el creador del presupuesto o un administrador
      if (budget.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo el creador o un administrador pueden eliminar este presupuesto' });
      }
  
      await budget.destroy();
      res.status(200).json({ message: 'Presupuesto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };