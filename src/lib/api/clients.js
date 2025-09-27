/**
 * Client management API service
 * Uses MCP tools through orchestration service
 */

import { apiClient } from "./client.js";
import { getCurrentAgentId } from "../utils/auth.js";

export const clientsService = {
  // Get all clients with optional filtering
  async getAll(params = {}) {
    return apiClient.post("/api/tools/execute", {
      toolName: "search_clients",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        query: "%", // Use wildcard to get all clients
        limit: params.limit || 50,
      },
    });
  },

  // Get a specific client by ID
  async getById(clientId) {
    return apiClient.post("/api/tools/execute", {
      toolName: "get_client_context",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
      },
    });
  },

  // Create a new client
  async create(clientData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "create_client",
      args: {
        client: {
          agent_id: getCurrentAgentId(), // Get from auth context
          ...clientData,
        },
      },
    });
  },

  // Update an existing client - maps to update_client_notes for now
  async update(clientId, clientData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "update_client_notes",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
        notes: clientData.notes || "Updated client information",
      },
    });
  },

  // Delete a client - not available in MCP tools, return error
  async delete(clientId) {
    throw new Error("Client deletion not supported");
  },

  // Search clients
  async search(query, filters = {}) {
    return apiClient.post("/api/tools/execute", {
      toolName: "search_clients",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        query,
        limit: filters.limit || 10,
      },
    });
  },

  // Get client activities - use get_client_context which includes history
  async getActivities(clientId, params = {}) {
    return apiClient.post("/api/tools/execute", {
      toolName: "get_client_context",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
      },
    });
  },

  // Add note to client
  async addNote(clientId, note) {
    return apiClient.post("/api/tools/execute", {
      toolName: "update_client_notes",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
        notes: note,
      },
    });
  },

  // Get client notes - use get_client_context
  async getNotes(clientId) {
    return apiClient.post("/api/tools/execute", {
      toolName: "get_client_context",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
      },
    });
  },

  // Update client status - not directly available, use log_interaction
  async updateStatus(clientId, status) {
    return apiClient.post("/api/tools/execute", {
      toolName: "log_interaction",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: clientId,
        interaction_type: "other",
        notes: `Status updated to: ${status}`,
      },
    });
  },

  // Schedule follow-up - use calendar service
  async scheduleFollowUp(clientId, followUpData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "schedule_appointment",
      args: {
        appointment: {
          agent_id: getCurrentAgentId(), // Get from auth context
          title: `Follow-up: ${followUpData.title || "Client Meeting"}`,
          start_time: followUpData.start_time,
          end_time: followUpData.end_time,
          client_id: clientId,
          ...followUpData,
        },
      },
    });
  },

  // Get client statistics - not available in MCP tools, return mock data
  async getStats() {
    // This would need to be implemented as a specific MCP tool
    return {
      total: 0,
      active: 0,
      inactive: 0,
      new_this_month: 0,
    };
  },

  // Bulk operations - not supported
  async bulkUpdate(clientIds, updateData) {
    throw new Error("Bulk update not supported");
  },

  async bulkDelete(clientIds) {
    throw new Error("Bulk delete not supported");
  },
};

export default clientsService;
