// src/services/api.js
import httpService from "./http";

// Authentication API
export const authAPI = {
  login: (credentials) => httpService.post("/auth/login", credentials),

  logout: () => httpService.post("/auth/logout"),

  refreshToken: () => httpService.post("/auth/refresh"),

  getProfile: () => httpService.get("/auth/profile"),
};

export const dashboardAPI = {
  getStats: () => httpService.get("/dashboard/stats"),

  getRecentApplications: (limit = 5) =>
    httpService.get("/dashboard/recent-applications", { params: { limit } }),

  getOtsRecommendations: (limit = 3) =>
    httpService.get("/dashboard/ots-recommendations", { params: { limit } }),

  getRecentActivity: (limit = 5) =>
    httpService.get("/dashboard/recent-activity", { params: { limit } }),
};

// Applications API
export const applicationsAPI = {
  getAll: (params = {}) => httpService.get("/applications", { params }),

  getById: (id) => httpService.get(`/applications/${id}`),

  create: (data) => httpService.post("/applications", data),

  update: (id, data) => httpService.put(`/applications/${id}`, data),

  delete: (id) => httpService.delete(`/applications/${id}`),

  uploadDocuments: (id, formData) =>
    httpService.upload(`/applications/${id}/documents`, formData),

  getScoring: (id) => httpService.get(`/applications/${id}/scoring`),
};

// Documents API
export const documentsAPI = {
  upload: (formData) => httpService.upload("/documents/upload", formData),

  process: (documentId) => httpService.post(`/documents/${documentId}/process`),

  getStatus: (documentId) => httpService.get(`/documents/${documentId}/status`),

  getUploadedDocuments: (applicationId) =>
    httpService.get(`/applications/${applicationId}/documents`),

  getUploadHistory: (applicationId) =>
    httpService.get(`/applications/${applicationId}/upload-history`),

  download: (documentId) =>
    httpService.get(`/documents/${documentId}/download`),
};

// Analytics API
export const analyticsAPI = {
  getDashboardAnalytics: () => httpService.get("/analytics/dashboard"),

  getApplicationTrends: (period) =>
    httpService.get("/analytics/trends", { params: { period } }),

  getScoringDistribution: () =>
    httpService.get("/analytics/scoring-distribution"),

  getPerformanceMetrics: () => httpService.get("/analytics/performance"),
};

// System API
export const systemAPI = {
  getConfig: () => httpService.get("/system/config"),

  updateConfig: (data) => httpService.put("/system/config", data),

  getStatus: () => httpService.get("/system/status"),

  checkHealth: () => httpService.get("/health"),
};

// Customers API
export const customersAPI = {
  getAll: (params) => httpService.get("/nasabah", { params }),

  getById: (id) => httpService.get(`/nasabah/${id}`),
};

// LLM Assistant API
export const llmAPI = {
  askQuestion: (question, context = {}) =>
    httpService.post("/llm/ask", { question, context }),

  getRecommendations: (applicationId) =>
    httpService.get(`/llm/recommendations/${applicationId}`),

  analyzeApplication: (applicationId) =>
    httpService.post(`/llm/analyze/${applicationId}`),
};

export const adminAPI = {
  getAllUsers: (params = {}) => httpService.get("/admin/users", { params }),

  getAuditLogs: (params = {}) =>
    httpService.get("/admin/audit-logs", { params }),

  createUser: (userData) => httpService.post("/admin/users", userData),
};

// Export all APIs
export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  applications: applicationsAPI,
  documents: documentsAPI,
  analytics: analyticsAPI,
  system: systemAPI,
  llm: llmAPI,
  admin: adminAPI,
  customers: customersAPI
};
