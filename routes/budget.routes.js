const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Endpoints for managing budgets
 */

/**
 * @swagger
 * /budgets/user:
 *   get:
 *     summary: Get budgets for the authenticated user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets for the user
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authMiddleware, budgetController.getBudgetsByUserId);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Monthly Groceries"
 *               amount:
 *                 type: number
 *                 example: 500.00
 *               category:
 *                 type: string
 *                 example: "Food"
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, budgetController.createBudget);

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all budgets
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, budgetController.getAllBudgets);

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The budget ID
 *     responses:
 *       200:
 *         description: The budget data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */
router.get('/:id', authMiddleware, budgetController.getBudgetById);

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The budget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Budget Name"
 *               amount:
 *                 type: number
 *                 example: 750.00
 *               category:
 *                 type: string
 *                 example: "Updated Category"
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */
router.put('/:id', authMiddleware, budgetController.updateBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The budget ID
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */
router.delete('/:id', authMiddleware, budgetController.deleteBudget);

module.exports = router;
