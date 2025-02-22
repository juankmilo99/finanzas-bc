const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get financial metrics for the authenticated user
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns various financial metrics
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, metricsController.getMetrics);

module.exports = router;
