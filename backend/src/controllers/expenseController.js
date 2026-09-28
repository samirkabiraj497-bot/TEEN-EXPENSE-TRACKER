const ExpenseModel = require('../models/expenseModel');

const expenseController = {
  async getExpenses(req, res, next) {
    try {
      const { category, from, to, search, sort, page = 1, limit = 50 } = req.query;
      const numPage = Math.max(1, parseInt(page, 10));
      const numLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const offset = (numPage - 1) * numLimit;

      const result = await ExpenseModel.findUserExpenses(req.user.id, {
        category,
        from,
        to,
        search,
        sort,
        limit: numLimit,
        offset
      });

      return res.status(200).json({
        success: true,
        data: {
          expenses: result.expenses,
          pagination: {
            page: numPage,
            limit: numLimit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount / numLimit) || 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const expense = await ExpenseModel.findById(id, req.user.id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense record not found or access denied.'
        });
      }

      return res.status(200).json({
        success: true,
        data: expense
      });
    } catch (error) {
      next(error);
    }
  },

  async createExpense(req, res, next) {
    try {
      const { title, amount, category, description, expense_date, payment_method } = req.body;

      const newExpense = await ExpenseModel.create({
        user_id: req.user.id,
        title,
        amount,
        category,
        description,
        expense_date,
        payment_method
      });

      return res.status(201).json({
        success: true,
        message: 'Expense added successfully!',
        data: newExpense
      });
    } catch (error) {
      next(error);
    }
  },

  async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await ExpenseModel.findById(id, req.user.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Expense record not found or access denied.'
        });
      }

      const updatedExpense = await ExpenseModel.update(id, req.user.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully!',
        data: updatedExpense
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await ExpenseModel.findById(id, req.user.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Expense record not found or access denied.'
        });
      }

      await ExpenseModel.delete(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = expenseController;
