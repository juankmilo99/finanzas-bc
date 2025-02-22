const sequelize = require('../config/db.config');

exports.getMetrics = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Consulta SQL directa
        const sqlQuery = `
        SELECT 
            COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
            COUNT(t.id) AS total_transactions,
            (SELECT c.name FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE c.type = 'expense' AND t.user_id = :user_id
             GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) AS top_expense_category,
            (SELECT c.name FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE c.type = 'income' AND t.user_id = :user_id
             GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) AS top_income_category,
            COUNT(DISTINCT DATE(t.transaction_date)) AS active_days
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = :user_id
    `;
    
    const [result] = await sequelize.query(sqlQuery, {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT
    });
    
    // Convertir valores a números para evitar errores en el frontend
    const totalIncome = parseFloat(result.total_income) || 0;
    const totalExpense = parseFloat(result.total_expense) || 0;
    const totalTransactions = parseInt(result.total_transactions) || 0;
    
    // Calcular total de ahorros y tasa de ahorro
    const totalSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    
    // Calcular el promedio de gasto diario
    const activeDays = parseInt(result.active_days) || 1;
    const dailySpendingAvg = totalExpense / activeDays;
    
    res.status(200).json({
        totalIncome,
        totalExpense,
        totalSavings,
        savingsRate,
        dailySpendingAvg,
        totalTransactions,
        topExpenseCategory: result.top_expense_category || null,
        topIncomeCategory: result.top_income_category || null,
        incomeVsExpenses: {
            income: totalIncome,
            expenses: totalExpense
        }
    });
    

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
