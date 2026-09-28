const ExpenseModel = require('../models/expenseModel');
const BudgetModel = require('../models/budgetModel');

const DEMO_EXPENSES = [
  { title: 'Pizza with school friends', amount: 350, category: 'Food', description: 'Weekend lunch after exams', daysAgo: 0, payment_method: 'UPI' },
  { title: 'Metro smart card recharge', amount: 200, category: 'Transport', description: 'Weekly metro travel', daysAgo: 1, payment_method: 'UPI' },
  { title: 'Maths Reference Guidebook', amount: 420, category: 'Education', description: 'Bought for term revision', daysAgo: 2, payment_method: 'Debit Card' },
  { title: 'Mobile Data Booster 5G', amount: 199, category: 'Mobile/Data', description: 'Monthly data pack', daysAgo: 3, payment_method: 'UPI' },
  { title: 'Steam Summer Sale Game', amount: 499, category: 'Gaming', description: 'RPG game discount', daysAgo: 4, payment_method: 'Debit Card' },
  { title: 'Movie Ticket & Popcorn', amount: 380, category: 'Entertainment', description: 'Friday evening show', daysAgo: 5, payment_method: 'UPI' },
  { title: 'Burger & French Fries combo', amount: 180, category: 'Food', description: 'Snack break', daysAgo: 7, payment_method: 'Cash' },
  { title: 'Spotify Student Premium', amount: 59, category: 'Subscriptions', description: 'Monthly music stream', daysAgo: 8, payment_method: 'UPI' },
  { title: 'Graphic T-Shirt', amount: 650, category: 'Shopping', description: 'College fest wear', daysAgo: 10, payment_method: 'UPI' },
  { title: 'Badminton shuttlecocks tube', amount: 280, category: 'Sports', description: 'Practice sessions', daysAgo: 12, payment_method: 'Cash' },
  { title: 'Auto-rickshaw fare', amount: 60, category: 'Transport', description: 'Ride back home in rain', daysAgo: 14, payment_method: 'Cash' },
  { title: 'Ice Cream Sundae', amount: 120, category: 'Food', description: 'Evening dessert treat', daysAgo: 16, payment_method: 'UPI' },
  { title: 'Birthday gift for classmate', amount: 500, category: 'Gifts', description: 'Notebook set and chocolates', daysAgo: 18, payment_method: 'UPI' },
  { title: 'School stationery kit', amount: 150, category: 'Education', description: 'Pens, highlighters, notebook', daysAgo: 21, payment_method: 'Cash' },
  // Previous month expenses for rich month-over-month comparison
  { title: 'School picnic fee', amount: 800, category: 'Travel', description: 'Day outing trip', daysAgo: 35, payment_method: 'UPI' },
  { title: 'Cafeteria snacks & drinks', amount: 320, category: 'Food', description: 'Lunch treats', daysAgo: 38, payment_method: 'Cash' },
  { title: 'Concert wristband pass', amount: 750, category: 'Entertainment', description: 'Music fest', daysAgo: 40, payment_method: 'Debit Card' },
  { title: 'Sneakers discount buy', amount: 1400, category: 'Shopping', description: 'Sport shoes', daysAgo: 42, payment_method: 'Debit Card' },
  { title: 'Metro travel card', amount: 400, category: 'Transport', description: 'Monthly pass', daysAgo: 45, payment_method: 'UPI' }
];

const DEMO_BUDGETS = [
  { category: 'Food', amount: 2500 },
  { category: 'Transport', amount: 1000 },
  { category: 'Entertainment', amount: 1200 },
  { category: 'Shopping', amount: 1500 },
  { category: 'Gaming', amount: 800 },
  { category: 'Education', amount: 1000 }
];

const seedDemoDataForUser = async (userId) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const createdExpenses = [];
  for (const item of DEMO_EXPENSES) {
    const itemDate = new Date();
    itemDate.setDate(itemDate.getDate() - item.daysAgo);
    const dateStr = itemDate.toISOString().split('T')[0];

    const exp = await ExpenseModel.create({
      user_id: userId,
      title: item.title,
      amount: item.amount,
      category: item.category,
      description: `[Demo] ${item.description}`,
      expense_date: dateStr,
      payment_method: item.payment_method
    });
    createdExpenses.push(exp);
  }

  const createdBudgets = [];
  for (const b of DEMO_BUDGETS) {
    try {
      const budget = await BudgetModel.create({
        user_id: userId,
        category: b.category,
        amount: b.amount,
        month: currentMonth,
        year: currentYear
      });
      createdBudgets.push(budget);
    } catch (e) {
      // If already exists for this category/month, ignore
    }
  }

  return {
    expensesCount: createdExpenses.length,
    budgetsCount: createdBudgets.length
  };
};

module.exports = {
  seedDemoDataForUser
};
