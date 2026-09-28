const BudgetModel = require('../models/budgetModel');
const ExpenseModel = require('../models/expenseModel');

const budgetController = {
  async getBudgets(req, res, next) {
    try {
      const now = new Date();
      const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

      // Retrieve user's configured budgets
      const budgets = await BudgetModel.findUserBudgets(req.user.id, { month, year });

      // Retrieve all expenses for this month to calculate spent amount per budget category
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const { expenses } = await ExpenseModel.findUserExpenses(req.user.id, {
        from: startDate,
        to: endDate,
        limit: 1000
      });

      // Calculate spending per category
      const spentByCategory = {};
      expenses.forEach(exp => {
        const cat = exp.category;
        spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(exp.amount);
      });

      // Attach spending progress and status to each budget item
      const enrichedBudgets = budgets.map(b => {
        const spent = spentByCategory[b.category] || 0;
        const limit = Number(b.amount);
        const remaining = Math.max(0, limit - spent);
        const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;

        let status = 'safe'; // safe, warning, near_limit, exceeded
        let statusText = 'Safe';
        let alertMessage = null;

        if (spent > limit) {
          status = 'exceeded';
          statusText = 'Exceeded';
          alertMessage = `🚨 Your ${b.category} budget has been exceeded by ₹${(spent - limit).toLocaleString('en-IN')}.`;
        } else if (percent >= 90) {
          status = 'near_limit';
          statusText = 'Near Limit';
          alertMessage = `⚠️ You've used ${percent}% of your ${b.category} budget.`;
        } else if (percent >= 80) {
          status = 'warning';
          statusText = 'Warning';
          alertMessage = `⚠️ You've used ${percent}% of your ${b.category} budget.`;
        }

        return {
          ...b,
          spent,
          remaining,
          percent,
          status,
          statusText,
          alertMessage
        };
      });

      const totalBudget = enrichedBudgets.reduce((sum, b) => sum + Number(b.amount), 0);
      const totalSpentOnBudgets = enrichedBudgets.reduce((sum, b) => sum + b.spent, 0);

      return res.status(200).json({
        success: true,
        data: {
          month,
          year,
          totalBudget,
          totalSpentOnBudgets,
          budgets: enrichedBudgets
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createBudget(req, res, next) {
    try {
      const now = new Date();
      const { category, amount, month = now.getMonth() + 1, year = now.getFullYear() } = req.body;

      const newBudget = await BudgetModel.create({
        user_id: req.user.id,
        category,
        amount,
        month,
        year
      });

      return res.status(201).json({
        success: true,
        message: 'Budget allocated successfully!',
        data: newBudget
      });
    } catch (error) {
      next(error);
    }
  },

  async updateBudget(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await BudgetModel.findById(id, req.user.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Budget record not found or access denied.'
        });
      }

      const updated = await BudgetModel.update(id, req.user.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Budget updated successfully!',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteBudget(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await BudgetModel.findById(id, req.user.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Budget record not found or access denied.'
        });
      }

      await BudgetModel.delete(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Budget deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = budgetController;
