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
  const [baseURL] = useState(apiConfig.getBaseURL());

  const value = {
    baseURL,
    isLoading,
    getConfig: apiConfig.getConfig,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export default ApiContext;
