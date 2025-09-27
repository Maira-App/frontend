/**
 * Authentication Context and Provider
 * Manages user authentication state and provides auth-related functions
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  authService,
  tokenManager,
  AuthenticationError,
} from "../lib/api/index.js";
import { config } from "../config/env.js";

// Auth state shape
const initialAuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_ERROR: "SET_ERROR",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    // If auth is disabled, set a mock user with proper UUID
    if (!config.auth.ENABLED) {
      const demoUserId = "550e8400-e29b-41d4-a716-446655440000";
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          id: demoUserId,
          agentId: demoUserId, // Add agentId for backend compatibility
          email: "demo@maira.ai",
          name: "Demo User",
          role: "agent",
        },
      });
      return;
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      // Check if we have a valid token
      const token = tokenManager.getToken();
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Verify token and get user data
      const user = await authService.getCurrentUser();
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
    } catch (error) {
      console.error("Auth initialization failed:", error);

      // Clear invalid tokens
      tokenManager.removeToken();

      if (error instanceof AuthenticationError) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: error.message || "Authentication failed",
        });
      }
    }
  };

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const response = await authService.login(email, password);

      // Get user data after successful login
      const user = await authService.getCurrentUser();
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });

      return response;
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Refresh token periodically
  useEffect(() => {
    if (!config.auth.ENABLED || !state.isAuthenticated) {
      return;
    }

    const refreshInterval = setInterval(async () => {
      try {
        await authService.refresh();
      } catch (error) {
        console.error("Token refresh failed:", error);
        // If refresh fails, logout user
        logout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);

  const value = {
    // State
    ...state,

    // Actions
    login,
    logout,
    updateProfile,
    clearError,

    // Utilities
    isAuthEnabled: config.auth.ENABLED,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// HOC for protecting routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} />;
  };
}

export default AuthContext;
