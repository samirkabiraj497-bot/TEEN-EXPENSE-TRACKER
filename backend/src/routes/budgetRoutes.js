const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { validateBudgetInput } = require('../validators/budgetValidator');

// All budget routes require authentication
router.use(authenticate);

router.get('/', budgetController.getBudgets);
router.post('/', validateRequest(validateBudgetInput), budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
