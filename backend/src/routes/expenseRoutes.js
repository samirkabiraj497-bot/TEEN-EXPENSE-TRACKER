const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { validateExpenseInput } = require('../validators/expenseValidator');

// All expense routes require authentication
router.use(authenticate);

router.get('/', expenseController.getExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', validateRequest(validateExpenseInput), expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
