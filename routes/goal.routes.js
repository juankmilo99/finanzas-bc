const express = require('express');
const goalController = require('../controllers/goal.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Endpoints for managing goals
 */

/**
 * @swagger
 * /goals/user:
 *   get:
 *     summary: Get goals by the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals for the user
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authMiddleware, goalController.getGoalsByUserId);

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all goals
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, goalController.getAllGoals);

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get a goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The goal ID
 *     responses:
 *       200:
 *         description: The goal data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Goal not found
 */
router.get('/:id', authMiddleware, goalController.getGoalById);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
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
 *                 example: "Save for a car"
 *               target_amount:
 *                 type: number
 *                 example: 10000
 *               current_amount:
 *                 type: number
 *                 example: 1000
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, goalController.createGoal);

/**
 * @swagger
 * /goals/{id}:
 *   put:
 *     summary: Update an existing goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Save for a car"
 *               target_amount:
 *                 type: number
 *                 example: 10000
 *               current_amount:
 *                 type: number
 *                 example: 2000
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Goal not found
 */
router.put('/:id', authMiddleware, goalController.updateGoal);

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Goal not found
 */
router.delete('/:id', authMiddleware, goalController.deleteGoal);

module.exports = router;