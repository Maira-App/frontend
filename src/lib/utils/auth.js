/**
 * Authentication utilities
 * Provides helper functions for getting current user context
 */

import { useAuth } from "../../contexts/AuthContext.jsx";

/**
 * Get the current agent ID from auth context
 * Falls back to demo user ID if auth is disabled
 */
export function getCurrentAgentId() {
  // In a real app, this would get the agent ID from the auth context
  // For now, return the demo user ID
  return "550e8400-e29b-41d4-a716-446655440000";
}

/**
 * Get the current user from auth context
 * Falls back to demo user if auth is disabled
 */
export function getCurrentUser() {
  // In a real app, this would get the user from the auth context
  // For now, return the demo user
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    agentId: "550e8400-e29b-41d4-a716-446655440000",
    email: "demo@maira.ai",
    name: "Demo User",
    role: "agent",
  };
}

/**
 * Hook to get current agent ID in React components
 */
export function useCurrentAgentId() {
  const { user } = useAuth();
  return user?.agentId || user?.id || "550e8400-e29b-41d4-a716-446655440000";
}
