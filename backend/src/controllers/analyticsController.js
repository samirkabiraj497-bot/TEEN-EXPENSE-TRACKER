const ExpenseModel = require('../models/expenseModel');
const BudgetModel = require('../models/budgetModel');
const suggestionService = require('../services/suggestionService');

const analyticsController = {
  async getSummary(req, res, next) {
    try {
      const { range = 'month', from, to } = req.query;
      const allExpenses = await ExpenseModel.getAllUserExpenses(req.user.id);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const todayStr = now.toISOString().split('T')[0];

      // Determine date window based on filter
      let startDateStr = '';
      let endDateStr = todayStr;

      switch (range) {
        case 'today':
          startDateStr = todayStr;
          break;
        case 'week': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
          startDateStr = oneWeekAgo.toISOString().split('T')[0];
          break;
        }
        case 'last_month': {
          const firstDayLastMonth = new Date(currentYear, currentMonth - 2, 1);
          const lastDayLastMonth = new Date(currentYear, currentMonth - 1, 0);
          startDateStr = firstDayLastMonth.toISOString().split('T')[0];
          endDateStr = lastDayLastMonth.toISOString().split('T')[0];
          break;
        }
        case 'year': {
          startDateStr = `${currentYear}-01-01`;
          break;
        }
        case 'custom': {
          startDateStr = from || `${currentYear}-01-01`;
          endDateStr = to || todayStr;
          break;
        }
        case 'month':
        default: {
          startDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
          break;
        }
      }

      // Filter period expenses
      const periodExpenses = allExpenses.filter(e => 
        e.expense_date >= startDateStr && e.expense_date <= endDateStr
      );

      const totalSpent = periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      // Today's spending
      const todayExpenses = allExpenses.filter(e => e.expense_date === todayStr);
      const todaySpent = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      // Calculate days in period for daily average
      const startD = new Date(startDateStr);
      const endD = new Date(endDateStr);
      const diffDays = Math.max(1, Math.round(Math.abs((endD - startD) / (24 * 60 * 60 * 1000))) + 1);
      const avgDailySpent = Math.round(totalSpent / diffDays);

      // Top spending category
      const categoryMap = {};
      periodExpenses.forEach(e => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
      });
      const sortedCats = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
      const topCategory = sortedCats.length > 0 ? {
        category: sortedCats[0][0],
        amount: sortedCats[0][1],
        percentage: totalSpent > 0 ? Math.round((sortedCats[0][1] / totalSpent) * 100) : 0
      } : { category: 'None', amount: 0, percentage: 0 };

      // Remaining budget for current month
      const budgets = await BudgetModel.findUserBudgets(req.user.id, {
        month: currentMonth,
        year: currentYear
      });
      const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);

      // Monthly expenses for budget remaining calculation
      const currentMonthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const currentMonthExpenses = allExpenses.filter(e => e.expense_date >= currentMonthStart && e.expense_date <= todayStr);
      const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const remainingBudget = totalBudget > 0 ? (totalBudget - currentMonthTotal) : 0;

      const totalTransactions = periodExpenses.length;
      const avgTransaction = totalTransactions > 0 ? Math.round(totalSpent / totalTransactions) : 0;

      return res.status(200).json({
        success: true,
        data: {
          period: { range, from: startDateStr, to: endDateStr, days: diffDays },
          totalSpent,
          todaySpent,
          avgDailySpent,
          remainingBudget,
          totalBudget,
          currentMonthTotal,
          topCategory,
          totalTransactions,
          avgTransaction
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBreakdown(req, res, next) {
    try {
      const { range = 'month', from, to } = req.query;
      const allExpenses = await ExpenseModel.getAllUserExpenses(req.user.id);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const todayStr = now.toISOString().split('T')[0];

      let startDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      let endDateStr = todayStr;

      if (range === 'last_month') {
        startDateStr = new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0];
        endDateStr = new Date(currentYear, currentMonth - 1, 0).toISOString().split('T')[0];
      } else if (range === 'year') {
        startDateStr = `${currentYear}-01-01`;
      } else if (range === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
        startDateStr = oneWeekAgo.toISOString().split('T')[0];
      } else if (range === 'custom' && from) {
        startDateStr = from;
        endDateStr = to || todayStr;
      }

      const filtered = allExpenses.filter(e => e.expense_date >= startDateStr && e.expense_date <= endDateStr);
      const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

      const categoryData = {};
      filtered.forEach(e => {
        if (!categoryData[e.category]) {
          categoryData[e.category] = { amount: 0, count: 0 };
        }
        categoryData[e.category].amount += Number(e.amount);
        categoryData[e.category].count += 1;
      });

      const categories = Object.entries(categoryData).map(([name, val]) => ({
        name,
        amount: val.amount,
        count: val.count,
        percentage: total > 0 ? Number(((val.amount / total) * 100).toFixed(1)) : 0
      })).sort((a, b) => b.amount - a.amount);

      return res.status(200).json({
        success: true,
        data: {
          total,
          categories
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getMonthlyTrend(req, res, next) {
    try {
      const allExpenses = await ExpenseModel.getAllUserExpenses(req.user.id);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // Group by date for current month
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfMonth = new Date(currentYear, currentMonth, 0);
      const daysInMonth = endOfMonth.getDate();

      const dailyData = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayExpenses = allExpenses.filter(e => e.expense_date === dateStr);
        const amount = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        dailyData.push({
          date: dateStr,
          day: `Day ${day}`,
          shortDate: `${day}/${currentMonth}`,
          amount,
          count: dayExpenses.length
        });
      }

      // Also compute past 6 months aggregate for macro trend
      const monthlyMacro = [];
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
        const y = targetDate.getFullYear();
        const m = targetDate.getMonth() + 1;
        const prefix = `${y}-${String(m).padStart(2, '0')}`;
        const monthName = targetDate.toLocaleString('default', { month: 'short' });

        const mExpenses = allExpenses.filter(e => e.expense_date.startsWith(prefix));
        const amount = mExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

        monthlyMacro.push({
          month: `${monthName} ${y}`,
          monthName,
          amount,
          count: mExpenses.length
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          currentMonthDays: dailyData,
          pastSixMonths: monthlyMacro
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getComparison(req, res, next) {
    try {
      const allExpenses = await ExpenseModel.getAllUserExpenses(req.user.id);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      
      const prevDate = new Date(currentYear, currentMonth - 2, 1);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth() + 1;
      const prevMonthPrefix = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

      const currentExpenses = allExpenses.filter(e => e.expense_date.startsWith(currentMonthPrefix));
      const prevExpenses = allExpenses.filter(e => e.expense_date.startsWith(prevMonthPrefix));

      const currentTotal = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const prevTotal = prevExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      const diffAmount = currentTotal - prevTotal;
      const percentChange = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;

      const currentCount = currentExpenses.length;
      const prevCount = prevExpenses.length;

      const currentAvg = currentCount > 0 ? Math.round(currentTotal / currentCount) : 0;
      const prevAvg = prevCount > 0 ? Math.round(prevTotal / prevCount) : 0;

      // Category breakdown comparison
      const catCurrent = {};
      const catPrev = {};

      currentExpenses.forEach(e => {
        catCurrent[e.category] = (catCurrent[e.category] || 0) + Number(e.amount);
      });

      prevExpenses.forEach(e => {
        catPrev[e.category] = (catPrev[e.category] || 0) + Number(e.amount);
      });

      const allCategories = Array.from(new Set([...Object.keys(catCurrent), ...Object.keys(catPrev)]));
      const categoryComparison = allCategories.map(cat => ({
        category: cat,
        current: catCurrent[cat] || 0,
        previous: catPrev[cat] || 0,
        diff: (catCurrent[cat] || 0) - (catPrev[cat] || 0)
      })).sort((a, b) => b.current - a.current);

      return res.status(200).json({
        success: true,
        data: {
          currentMonth: {
            name: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
            total: currentTotal,
            count: currentCount,
            avgTransaction: currentAvg
          },
          previousMonth: {
            name: prevDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
            total: prevTotal,
            count: prevCount,
            avgTransaction: prevAvg
          },
          difference: {
            amount: Math.abs(diffAmount),
            increased: diffAmount > 0,
            percentChange,
            summary: diffAmount > 0
              ? `You have spent ₹${Math.abs(diffAmount).toLocaleString('en-IN')} more this month compared to last month.`
              : diffAmount < 0
                ? `You have saved ₹${Math.abs(diffAmount).toLocaleString('en-IN')} this month compared to last month.`
                : 'Spending is exactly on par with last month.'
          },
          categoryComparison
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getSuggestions(req, res, next) {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      const prevDate = new Date(currentYear, currentMonth - 2, 1);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth() + 1;
      const prevMonthPrefix = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

      const allExpenses = await ExpenseModel.getAllUserExpenses(req.user.id);
      const budgets = await BudgetModel.findUserBudgets(req.user.id, { month: currentMonth, year: currentYear });

      const currentExpenses = allExpenses.filter(e => e.expense_date.startsWith(currentMonthPrefix));
      const prevExpenses = allExpenses.filter(e => e.expense_date.startsWith(prevMonthPrefix));

      const insights = suggestionService.generateInsights({
        currentMonthExpenses: currentExpenses,
        previousMonthExpenses: prevExpenses,
        budgets
      });

      return res.status(200).json({
        success: true,
        data: insights
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;
