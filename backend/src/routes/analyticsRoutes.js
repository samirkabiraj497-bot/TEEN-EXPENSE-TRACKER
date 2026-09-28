const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/summary', analyticsController.getSummary);
router.get('/category', analyticsController.getCategoryBreakdown);
router.get('/monthly', analyticsController.getMonthlyTrend);
router.get('/comparison', analyticsController.getComparison);
router.get('/suggestions', analyticsController.getSuggestions);

module.exports = router;
