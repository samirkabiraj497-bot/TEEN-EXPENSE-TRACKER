const VALID_PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

const validateExpenseInput = (data) => {
  const errors = {};
  const { title, amount, category, expense_date, payment_method } = data;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Expense title is required';
  } else if (title.trim().length > 150) {
    errors.title = 'Title must be 150 characters or less';
  }

  const numAmount = parseFloat(amount);
  if (amount === undefined || amount === null || isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a positive number greater than 0';
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (expense_date) {
    const parsedDate = new Date(expense_date);
    if (isNaN(parsedDate.getTime())) {
      errors.expense_date = 'Invalid date provided';
    }
  }

  if (payment_method && !VALID_PAYMENT_METHODS.includes(payment_method)) {
    errors.payment_method = `Payment method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateExpenseInput,
  VALID_PAYMENT_METHODS
};
