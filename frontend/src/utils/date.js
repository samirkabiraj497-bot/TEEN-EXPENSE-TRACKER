/**
 * Date utility helpers for TeenSpend
 */

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentMonthAndYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    monthName: now.toLocaleString('default', { month: 'long' })
  };
};

export const getMonthName = (monthNumber) => {
  const date = new Date(2026, monthNumber - 1, 1);
  return date.toLocaleString('default', { month: 'long' });
};
