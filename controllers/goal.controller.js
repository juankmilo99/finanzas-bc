const Goal = require('../models/goal.model');


// filepath: /c:/Users/juank/Documents/proyectos/Node.js/finanzas-bc/controllers/goal.controller.js

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const { name, target_amount, current_amount, due_date } = req.body;
        const user_id = req.user.id; // Obtener el user_id del token JWT
        const goal = await Goal.create({ name, target_amount, current_amount, due_date, user_id });
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all goals
exports.getAllGoals = async (req, res) => {
    try {
        // Verificar si el usuario tiene el rol de administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo los administradores pueden ver todas las metas' });
        }

        const goals = await Goal.findAll();
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get goal by ID
exports.getGoalById = async (req, res) => {
    try {
        // Verificar si el usuario tiene el rol de administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo los administradores pueden ver esta meta' });
        }

        const { id } = req.params;
        const goal = await Goal.findByPk(id);

        if (!goal) {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get goals by user ID
exports.getGoalsByUserId = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtener el user_id del token JWT
        const goals = await Goal.findAll({ where: { user_id } });

        if (!goals.length) {
            return res.status(404).json({ message: 'No se encontraron metas para este usuario' });
        }

        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, target_amount, current_amount, due_date } = req.body;

        const goal = await Goal.findByPk(id);

        if (!goal) {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }

        // Verificar si el usuario es el creador de la meta o un administrador
        if (goal.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo el creador o un administrador pueden actualizar esta meta' });
        }

        goal.name = name;
        goal.target_amount = target_amount;
        goal.current_amount = current_amount;
        goal.due_date = due_date;

        await goal.save();

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        // Verificar si el usuario es el creador de la meta o un administrador        
        if (goal.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo el creador o un administrador pueden actualizar esta meta' });
        }

        const { id } = req.params;
        const goal = await Goal.findByPk(id);

        if (!goal) {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }

        await goal.destroy();
        res.status(200).json({ message: 'Meta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};