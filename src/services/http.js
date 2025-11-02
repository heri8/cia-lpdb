// src/services/http.js
import apiConfig from "../config/api";

class HTTPService {
  constructor() {
    this.config = apiConfig.getConfig();
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      data = null,
      headers = {},
      ...restOptions
    } = options;

    const url = `${this.config.baseURL}${endpoint}`;

    const config = {
      method,
      headers: {
        ...this.config.headers,
        ...headers,
      },
      ...restOptions,
    };

    if (data) {
      if (config.headers["Content-Type"] === "application/json") {
        config.body = JSON.stringify(data);
      } else {
        config.body = data;
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", data });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // File upload
  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      data: formData,
      headers: {
        ...options.headers,
        // Let browser set Content-Type for FormData
      },
    });
  }
}

// Create singleton instance
export const httpService = new HTTPService();
export default httpService;
