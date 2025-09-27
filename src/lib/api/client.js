/**
 * Core API client for MAIRA backend communication
 * Provides a unified interface for making API calls with authentication,
 * error handling, and response transformation
 */

import { config } from "../../config/env.js";

// Custom error classes for better error handling
export class APIError extends Error {
  constructor(message, status, code, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export class AuthenticationError extends APIError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends APIError {
  constructor(message, data = null) {
    super(message, 400, "VALIDATION_ERROR", data);
    this.name = "ValidationError";
  }
}

// Token management
class TokenManager {
  getToken() {
    return localStorage.getItem(config.auth.TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(config.auth.TOKEN_KEY, token);
  }

  removeToken() {
    localStorage.removeItem(config.auth.TOKEN_KEY);
    localStorage.removeItem(config.auth.REFRESH_TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(config.auth.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token) {
    localStorage.setItem(config.auth.REFRESH_TOKEN_KEY, token);
  }
}

const tokenManager = new TokenManager();

// API Client class
class APIClient {
  constructor() {
    this.baseURL = config.api.BASE_URL;
    this.timeout = config.api.TIMEOUT;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = { ...this.defaultHeaders };

    // Always include mock token for development
    if (import.meta.env.DEV) {
      headers.Authorization = "Bearer mock-jwt-token";
    } else if (config.auth.ENABLED) {
      const token = tokenManager.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Add API key if configured
      if (config.api.API_KEY) {
        headers["X-API-Key"] = config.api.API_KEY;
      }
    }

    return headers;
  }

  // Transform response based on status
  async handleResponse(response) {
    const contentType = response.headers.get("content-type");
    const isJSON = contentType && contentType.includes("application/json");

    let data;
    try {
      data = isJSON ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const message =
        data?.error?.message || data?.message || `HTTP ${response.status}`;
      const code = data?.error?.code || "API_ERROR";

      switch (response.status) {
        case 401:
          throw new AuthenticationError(message);
        case 400:
          throw new ValidationError(message, data?.error?.details);
        default:
          throw new APIError(message, response.status, code, data);
      }
    }

    return data;
  }

  // Main request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getAuthHeaders();

    // Merge with custom headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const requestOptions = {
      ...options,
      headers,
      timeout: this.timeout,
    };

    // Add body as JSON if it's an object
    if (options.body && typeof options.body === "object") {
      requestOptions.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new APIError("Request timeout", 408, "TIMEOUT_ERROR");
      }

      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError(`Network error: ${error.message}`, 0, "NETWORK_ERROR");
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  async put(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  }

  async patch(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.post("/auth/login", credentials);

    if (response.token) {
      tokenManager.setToken(response.token);
    }

    if (response.refreshToken) {
      tokenManager.setRefreshToken(response.refreshToken);
    }

    return response;
  }

  async logout() {
    try {
      await this.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors, just clear tokens
      console.warn("Logout request failed:", error.message);
    } finally {
      tokenManager.removeToken();
    }
  }

  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new AuthenticationError("No refresh token available");
    }

    const response = await this.post("/auth/refresh", { refreshToken });

    if (response.token) {
      tokenManager.setToken(response.token);
    }

    return response;
  }

  // Health check
  async health() {
    return this.get("/health");
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();

// Export token manager for external use
export { tokenManager };

// Export for testing or advanced usage
export default APIClient;
