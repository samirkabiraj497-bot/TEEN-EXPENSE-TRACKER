import api from './api';

const budgetService = {
  async getBudgets(params = {}) {
    const response = await api.get('/budgets', { params });
    return response.data;
  },

  async createBudget(budgetData) {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  async updateBudget(id, updateData) {
    const response = await api.put(`/budgets/${id}`, updateData);
    return response.data;
  },

  async deleteBudget(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  }
};

export default budgetService;
