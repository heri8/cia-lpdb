// src/config/api.js

// Default configuration
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Dynamic configuration that can be updated at runtime
let dynamicConfig = { ...defaultConfig };

export const apiConfig = {
  // Get current configuration
  getConfig: () => ({ ...dynamicConfig }),

  // Update configuration (useful when baseURL changes)
  updateConfig: (newConfig) => {
    dynamicConfig = { ...dynamicConfig, ...newConfig };
    console.log("API Config updated:", dynamicConfig);
  },

  // Reset to default configuration
  resetConfig: () => {
    dynamicConfig = { ...defaultConfig };
  },

  // Get baseURL
  getBaseURL: () => dynamicConfig.baseURL,

  // Set baseURL dynamically (from backend parameter)
  setBaseURL: (baseURL) => {
    dynamicConfig.baseURL = baseURL;
    console.log("BaseURL updated to:", baseURL);
  },
};

export default apiConfig;
