// src/contexts/ApiContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import apiConfig from "../config/api";
import { systemAPI } from "../services/api";

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [baseURL, setBaseURL] = useState(apiConfig.getBaseURL());

  // Initialize API configuration
  useEffect(() => {
    initializeAPI();
  }, []);

  const initializeAPI = async () => {
    try {
      // Try to get configuration from backend
      const config = await systemAPI.getConfig();
      if (config && config.baseURL) {
        apiConfig.setBaseURL(config.baseURL);
        setBaseURL(config.baseURL);
      }
    } catch (error) {
      console.warn(
        "Failed to get config from backend, using default:",
        apiConfig.getBaseURL()
      );
    }
  };

  // Update baseURL dynamically
  const updateBaseURL = async (newBaseURL) => {
    setIsLoading(true);
    try {
      await systemAPI.updateBaseURL(newBaseURL);
      setBaseURL(newBaseURL);
      return { success: true };
    } catch (error) {
      console.error("Failed to update baseURL:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default baseURL
  const resetBaseURL = () => {
    apiConfig.resetConfig();
    setBaseURL(apiConfig.getBaseURL());
  };

  const value = {
    baseURL,
    isLoading,
    updateBaseURL,
    resetBaseURL,
    getConfig: apiConfig.getConfig,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export default ApiContext;
