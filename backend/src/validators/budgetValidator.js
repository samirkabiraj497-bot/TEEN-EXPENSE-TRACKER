const validateBudgetInput = (data) => {
  const errors = {};
  const { category, amount, month, year } = data;

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  const numAmount = parseFloat(amount);
  if (amount === undefined || amount === null || isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Budget amount must be a positive number greater than 0';
  }

  const numMonth = parseInt(month, 10);
  if (isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
    errors.month = 'Month must be an integer between 1 and 12';
  }

  const numYear = parseInt(year, 10);
  if (isNaN(numYear) || numYear < 2020 || numYear > 2100) {
    errors.year = 'A valid year between 2020 and 2100 is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateBudgetInput
};
