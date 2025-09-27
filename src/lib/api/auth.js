/**
 * User and authentication API service
 * Uses OAuth integration with orchestration service
 */

import { apiClient } from "./client.js";

export const authService = {
  // Google OAuth Integration
  async getGoogleAuthUrl(agentId) {
    return apiClient.post("/api/auth/google/url", { agentId });
  },

  async getGoogleAuthStatus(agentId) {
    return apiClient.get(`/api/auth/google/status?agentId=${agentId}`);
  },

  async disconnectGoogle(agentId) {
    return apiClient.post("/api/auth/google/disconnect", { agentId });
  },

  // Traditional authentication methods (placeholder - may need backend implementation)
  async login(email, password) {
    // This endpoint doesn't exist in current orchestration service
    // For development, return mock success with proper UUID
    if (process.env.NODE_ENV === "development") {
      // Generate a consistent UUID for the demo user
      const demoUserId = "550e8400-e29b-41d4-a716-446655440000";
      return {
        success: true,
        token: "mock-jwt-token",
        user: {
          id: demoUserId,
          agentId: demoUserId, // Add agentId for backend compatibility
          email,
          name: "Demo User",
        },
      };
    }
    throw new Error("Authentication endpoint not implemented");
  },

  async logout() {
    // Clear local tokens
    return { success: true };
  },

  async refresh() {
    // Token refresh not implemented
    throw new Error("Token refresh not implemented");
  },

  // User profile - not available in current backend
  async getCurrentUser() {
    // For development, return mock user with proper UUID
    if (process.env.NODE_ENV === "development") {
      const demoUserId = "550e8400-e29b-41d4-a716-446655440000";
      return {
        id: demoUserId,
        agentId: demoUserId, // Add agentId for backend compatibility
        email: "demo@maira.ai",
        name: "Demo User",
        role: "agent",
      };
    }
    throw new Error("User profile endpoint not implemented");
  },

  async updateProfile(userData) {
    throw new Error("Profile update not implemented");
  },

  async changePassword(currentPassword, newPassword) {
    throw new Error("Password change not implemented");
  },

  // Password reset - not implemented
  async requestPasswordReset(email) {
    throw new Error("Password reset not implemented");
  },

  async resetPassword(token, newPassword) {
    throw new Error("Password reset not implemented");
  },

  // Session management
  async verifyToken() {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
