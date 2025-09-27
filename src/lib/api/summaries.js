/**
 * Summaries and analytics API service
 */

import { apiClient } from './client.js';

export const summariesService = {
  // Get all summaries with optional filtering
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/summaries?${queryParams}` : '/summaries';
    return apiClient.get(endpoint);
  },

  // Get a specific summary by ID
  async getById(summaryId) {
    return apiClient.get(`/summaries/${summaryId}`);
  },

  // Get daily summary
  async getDaily(date) {
    return apiClient.get(`/summaries/daily/${date}`);
  },

  // Get weekly summary
  async getWeekly(weekStart) {
    return apiClient.get(`/summaries/weekly/${weekStart}`);
  },

  // Get client-specific summary
  async getByClient(clientId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams 
      ? `/summaries/client/${clientId}?${queryParams}` 
      : `/summaries/client/${clientId}`;
    return apiClient.get(endpoint);
  },

  // Generate new summary
  async generate(summaryData) {
    return apiClient.post('/summaries/generate', summaryData);
  },

  // Get summary statistics
  async getStats(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/summaries/stats?${queryParams}` : '/summaries/stats';
    return apiClient.get(endpoint);
  },

  // Get MAIRA suggestions
  async getSuggestions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/summaries/suggestions?${queryParams}` : '/summaries/suggestions';
    return apiClient.get(endpoint);
  },

  // Export summary data
  async export(summaryId, format = 'pdf') {
    return apiClient.get(`/summaries/${summaryId}/export?format=${format}`, {
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : 'application/json',
      },
    });
  },
};

export const analyticsService = {
  // Get dashboard metrics
  async getDashboardMetrics(period = '7d') {
    return apiClient.get(`/analytics/dashboard?period=${period}`);
  },

  // Get performance metrics
  async getPerformanceMetrics(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams 
      ? `/analytics/performance?${queryParams}` 
      : '/analytics/performance';
    return apiClient.get(endpoint);
  },

  // Get client conversion funnel
  async getConversionFunnel(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams 
      ? `/analytics/conversion?${queryParams}` 
      : '/analytics/conversion';
    return apiClient.get(endpoint);
  },

  // Get activity trends
  async getActivityTrends(period = '30d') {
    return apiClient.get(`/analytics/trends?period=${period}`);
  },

  // Get MAIRA usage statistics
  async getUsageStats(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams 
      ? `/analytics/usage?${queryParams}` 
      : '/analytics/usage';
    return apiClient.get(endpoint);
  },
};

export default { summariesService, analyticsService };