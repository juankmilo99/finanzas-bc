const Transaction = require('../models/transaction.model');

exports.getBalance = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtener el usuario autenticado

        // Calcular ingresos totales
        const totalIncome = await Transaction.sum('amount', {
            where: { user_id, type: 'income' }
        });

        // Calcular gastos totales
        const totalExpenses = await Transaction.sum('amount', {
            where: { user_id, type: 'expense' }
        });

        // Balance general
        const balance = (totalIncome || 0) - (totalExpenses || 0);

        res.status(200).json({
            balance,
            totalIncome: totalIncome || 0,
            totalExpenses: totalExpenses || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Obtener ingresos y gastos totales
        const totalIncome = await Transaction.sum('amount', {
            where: { user_id, type: 'income' }
        });

        const totalExpenses = await Transaction.sum('amount', {
            where: { user_id, type: 'expense' }
        });

        // Obtener ingreso y gasto más alto
        const highestIncome = await Transaction.max('amount', {
            where: { user_id, type: 'income' }
        });

        const highestExpense = await Transaction.max('amount', {
            where: { user_id, type: 'expense' }
        });

        // Calcular promedios
        const incomeCount = await Transaction.count({
            where: { user_id, type: 'income' }
        });

        const expenseCount = await Transaction.count({
            where: { user_id, type: 'expense' }
        });

        const averageIncome = incomeCount ? totalIncome / incomeCount : 0;
        const averageExpense = expenseCount ? totalExpenses / expenseCount : 0;

        res.status(200).json({
            totalIncome: totalIncome || 0,
            totalExpenses: totalExpenses || 0,
            balance: (totalIncome || 0) - (totalExpenses || 0),
            highestIncome: highestIncome || 0,
            highestExpense: highestExpense || 0,
            averageIncome: parseFloat(averageIncome.toFixed(2)),
            averageExpense: parseFloat(averageExpense.toFixed(2))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

