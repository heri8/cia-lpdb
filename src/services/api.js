// src/services/api.js
import httpService from "./http";
import apiConfig from "../config/api";

// Authentication API
export const authAPI = {
  login: (credentials) => httpService.post("/auth/login", credentials),

  logout: () => httpService.post("/auth/logout"),

  refreshToken: () => httpService.post("/auth/refresh"),

  getProfile: () => httpService.get("/auth/profile"),
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

  download: (documentId) =>
    httpService.get(`/documents/${documentId}/download`),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => httpService.get("/analytics/dashboard"),

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

  // Dynamic baseURL update from backend
  updateBaseURL: async (newBaseURL) => {
    // Validate the new baseURL
    try {
      const response = await fetch(`${newBaseURL}/system/health`);
      if (response.ok) {
        apiConfig.setBaseURL(newBaseURL);
        return { success: true, message: "BaseURL updated successfully" };
      }
    } catch (error) {
      throw new Error("Failed to validate new BaseURL");
    }
  },
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

// Export all APIs
export default {
  auth: authAPI,
  applications: applicationsAPI,
  documents: documentsAPI,
  analytics: analyticsAPI,
  system: systemAPI,
  llm: llmAPI,
};
