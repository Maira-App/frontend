/**
 * Custom hook for managing client data fetching with auto-refresh
 * Best practices for real-time client data management
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@/entities/all";

export const useClientData = (refreshIntervalMs = 30000) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);

  const refreshIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // Optimized fetch function with proper error handling
  const fetchClients = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Fetch clients associated with the current logged-in agent using MCP
        const data = await Client.list("-updated_date");

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setClients(data);
          setLastFetchTime(new Date());

          console.log(
            `✅ Loaded ${
              data.length
            } clients for agent at ${new Date().toLocaleTimeString()}`
          );
        }
      } catch (error) {
        console.error("Error loading clients:", error);

        if (isMountedRef.current) {
          setError(
            `Failed to load clients: ${error.message || "Please try again."}`
          );
          // Keep existing clients on error to avoid clearing the UI
          if (clients.length === 0) {
            setClients([]);
          }
        }
      }

      if (showLoading && isMountedRef.current) {
        setIsLoading(false);
      }
    },
    [clients.length]
  );

  // Set up auto-refresh
  useEffect(() => {
    if (!isAutoRefreshEnabled || !isMountedRef.current) return;

    refreshIntervalRef.current = setInterval(() => {
      fetchClients(false); // Don't show loading spinner for auto-refresh
    }, refreshIntervalMs);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, fetchClients, refreshIntervalMs]);

  // Pause auto-refresh when tab is not visible (performance optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, pause auto-refresh
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      } else if (isAutoRefreshEnabled && isMountedRef.current) {
        // Tab is visible again, resume auto-refresh
        refreshIntervalRef.current = setInterval(() => {
          fetchClients(false);
        }, refreshIntervalMs);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAutoRefreshEnabled, fetchClients, refreshIntervalMs]);

  // Initial fetch
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => !prev);
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchClients(true);
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    lastFetchTime,
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    refresh,
    // Computed values
    clientCount: clients.length,
    hasClients: clients.length > 0,
  };
};
