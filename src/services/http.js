import axios from "axios";
import apiConfig from "../config/api";

class HTTPService {
  constructor() {
    this.config = apiConfig.getConfig();
    this.instance = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      // timeout: 30000,
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response
          ? error.response.data?.message ||
            `HTTP Error ${error.response.status}`
          : error.message;

        console.error("API Request failed (Axios):", errorMessage);

        // Melempar error dengan pesan yang lebih informatif
        return Promise.reject({
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    );
  }

  async get(endpoint, options = {}) {
    // Axios menangani params secara otomatis di object options
    const response = await this.instance.get(endpoint, options);
    return response.data;
  }

  async post(endpoint, data, options = {}) {
    const response = await this.instance.post(endpoint, data, options);
    return response.data;
  }

  async put(endpoint, data, options = {}) {
    const response = await this.instance.put(endpoint, data, options);
    return response.data;
  }

  async patch(endpoint, data, options = {}) {
    const response = await this.instance.patch(endpoint, data, options);
    return response.data;
  }

  async delete(endpoint, options = {}) {
    const response = await this.instance.delete(endpoint, options);
    return response.data;
  }

  // File upload (Menggunakan FormData, Axios secara otomatis menghapus Content-Type header
  // jika data adalah FormData agar boundary bisa disetel oleh browser)
  async upload(endpoint, formData, options = {}) {
    const response = await this.instance.post(endpoint, formData, options);
    return response.data;
  }
}

// Create singleton instance
export const httpService = new HTTPService();
export default httpService;
