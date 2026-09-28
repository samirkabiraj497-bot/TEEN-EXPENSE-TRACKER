import api from './api';

const expenseService = {
  async getExpenses(params = {}) {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  async getExpenseById(id) {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(expenseData) {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  async updateExpense(id, updateData) {
    const response = await api.put(`/expenses/${id}`, updateData);
    return response.data;
  },

  async deleteExpense(id) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }
};

export default expenseService;
