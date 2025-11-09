// src/contexts/ApiContext.jsx
import React, { createContext, useContext, useState } from "react";
import apiConfig from "../config/api";

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

  // Update baseURL dynamically
  const updateBaseURL = async (newBaseURL) => {
    setIsLoading(true);
    try {
      apiConfig.setBaseURL(newBaseURL);
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
