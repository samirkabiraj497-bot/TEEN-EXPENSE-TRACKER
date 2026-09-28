/**
 * Currency utility helpers for formatting amounts in Indian Rupees (₹)
 */

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(Number(num) || 0);
};
