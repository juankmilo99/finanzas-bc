const express = require('express');
const financeController = require('../controllers/finance.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /finances/balance:
 *   get:
 *     summary: Get user's financial balance
 *     tags: [Finances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's financial balance
 *       401:
 *         description: Unauthorized
 */
router.get('/balance', authMiddleware, financeController.getBalance);

/**
 * @swagger
 * /finances/summary:
 *   get:
 *     summary: Get user's financial summary
 *     tags: [Finances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's financial summary
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', authMiddleware, financeController.getSummary);


module.exports = router;
