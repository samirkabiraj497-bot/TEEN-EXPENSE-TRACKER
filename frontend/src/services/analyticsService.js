import api from './api';

const analyticsService = {
  async getSummary(params = {}) {
    const response = await api.get('/analytics/summary', { params });
    return response.data;
  },

  async getCategoryBreakdown(params = {}) {
    const response = await api.get('/analytics/category', { params });
    return response.data;
  },

  async getMonthlyTrend() {
    const response = await api.get('/analytics/monthly');
    return response.data;
  },

  async getComparison() {
    const response = await api.get('/analytics/comparison');
    return response.data;
  },

  async getSuggestions() {
    const response = await api.get('/analytics/suggestions');
    return response.data;
  }
};

export default analyticsService;
