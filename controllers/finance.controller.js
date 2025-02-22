const Transaction = require('../models/transaction.model');
const Category = require('../models/category.model');
const { Op, fn, col, literal } = require('sequelize');

exports.getBalance = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtener el usuario autenticado

        // Calcular ingresos totales
        const totalIncome = await Transaction.sum('amount', {
            where: {
                user_id,
                '$Category.type$': 'income'
            },
            include: [{
                model: Category,
                attributes: []
            }]
        });

        // Calcular gastos totales
        const totalExpenses = await Transaction.sum('amount', {
            where: {
                user_id,
                '$Category.type$': 'expense'
            },
            include: [{
                model: Category,
                attributes: []
            }]
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

        // Obtener ingresos agrupados por año y mes
        const incomeByMonth = await Transaction.findAll({
            attributes: [
                [fn('EXTRACT', literal('YEAR FROM transaction_date')), 'year'],
                [fn('TO_CHAR', col('transaction_date'), 'YYYY-MM'), 'month'],
                [fn('SUM', col('amount')), 'income']
            ],
            where: {
                user_id,
                '$Category.type$': 'income'
            },
            include: [{
                model: Category,
                attributes: []
            }],
            group: [literal('year'), literal('month')],
            order: [literal('year'), literal('month')]
        });

        // Obtener gastos agrupados por año y mes
        const expenseByMonth = await Transaction.findAll({
            attributes: [
                [fn('EXTRACT', literal('YEAR FROM transaction_date')), 'year'],
                [fn('TO_CHAR', col('transaction_date'), 'YYYY-MM'), 'month'],
                [fn('SUM', col('amount')), 'expense']
            ],
            where: {
                user_id,
                '$Category.type$': 'expense'
            },
            include: [{
                model: Category,
                attributes: []
            }],
            group: [literal('year'), literal('month')],
            order: [literal('year'), literal('month')]
        });

        // Combinar ingresos y gastos por mes
        const summary = incomeByMonth.map(income => {
            const year = income.get('year');
            let month = income.get('month');
            // Ajustar manualmente el mes
            const [yearStr, monthStr] = month.split('-');
            const adjustedMonth = new Date(yearStr, parseInt(monthStr) - 1, 1).toLocaleString('es-ES', { month: 'long' });
            const expense = expenseByMonth.find(exp => exp.get('year') === year && exp.get('month') === month);
            return {
                year: year,
                month: adjustedMonth,
                income: parseFloat(income.get('income')),
                expense: expense ? parseFloat(expense.get('expense')) : 0
            };
        });

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};