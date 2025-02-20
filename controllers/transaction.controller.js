const Transaction = require('../models/transaction.model');

// controllers/transaction.controller.js

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, category_id, type, transaction_date } = req.body;
        const user_id = req.user.id; // Obtener el user_id del token JWT
        const transaction = await Transaction.create({ amount, description, category_id, user_id, type, transaction_date });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        // Verificar si el usuario tiene el rol de administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo los administradores pueden ver todas las transacciones' });
        }

        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTransactionsByUserId = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtener el user_id del token JWT
        const transactions = await Transaction.findAll({ where: { user_id } });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No se encontraron transacciones para este usuario' });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category_id, type, transaction_date } = req.body;

        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        // Verificar si el usuario es el creador de la transacción o un administrador
        if (transaction.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo el creador o un administrador pueden actualizar esta transacción' });
        }

        transaction.amount = amount;
        transaction.description = description;
        transaction.category_id = category_id;
        transaction.type = type;
        transaction.transaction_date = transaction_date;

        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        // Verificar si el usuario tiene el rol de administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado, solo los administradores pueden eliminar transacciones' });
        }

        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        await transaction.destroy();
        res.status(200).json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};