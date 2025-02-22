const sequelize = require('../config/db.config');

exports.getMetrics = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Consulta SQL directa
        const sqlQuery = `
            SELECT 
                SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense,
                COUNT(t.id) AS total_transactions,
                (SELECT c.name FROM transactions t
                 JOIN categories c ON t.category_id = c.id
                 WHERE c.type = 'expense' AND t.user_id = :user_id
                 GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) AS top_expense_category,
                (SELECT c.name FROM transactions t
                 JOIN categories c ON t.category_id = c.id
                 WHERE c.type = 'income' AND t.user_id = :user_id
                 GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) AS top_income_category
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = :user_id
        `;

        // Ejecutar la consulta
        const [result] = await sequelize.query(sqlQuery, {
            replacements: { user_id },
            type: sequelize.QueryTypes.SELECT
        });

        // Respuesta JSON con métricas
        res.status(200).json({
            totalIncome: result.total_income || 0,
            totalExpense: result.total_expense || 0,
            totalTransactions: result.total_transactions || 0,
            topExpenseCategory: result.top_expense_category || null,
            topIncomeCategory: result.top_income_category || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
