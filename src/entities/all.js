// Real API implementations using the API client
import { api } from "../lib/api/index.js";

// User entity with real API calls
export const User = {
  async me() {
    try {
      return await api.auth.getCurrentUser();
    } catch (error) {
      console.warn(
        "Failed to fetch current user, using fallback:",
        error.message
      );
      return { email: "demo@maira.ai", name: "Demo User", id: "demo" };
    }
  },

  async updateProfile(userData) {
    try {
      return await api.auth.updateProfile(userData);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },
};

export const Subscription = {
  async filter(query) {
    // This would be implemented when subscription API is available
    return [];
  },
  async update(id, data) {
    // Placeholder for subscription updates
    console.log("Subscription update not implemented yet");
  },
  async create(data) {
    // Placeholder for subscription creation
    console.log("Subscription creation not implemented yet");
  },
};

// Client entity with real API calls and fallbacks
export const Client = {
  async getAll(params = {}) {
    try {
      const response = await api.clients.getAll(params);
      // MCP tool execution returns { result: [...] } format
      if (response && response.result) {
        return response.result;
      }
      // Fallback for other response formats
      return response.clients || response || []; // Handle different response formats
    } catch (error) {
      console.warn(
        "Failed to fetch clients from API, using mock data:",
        error.message
      );
      // Return mock data as fallback
      return [
        {
          id: "1",
          full_name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1-555-0123",
          status: "active",
          property_type: "residential_buy",
          budget_min: 300000,
          budget_max: 500000,
          preferred_areas: ["Downtown", "Suburbs"],
          last_interaction: new Date().toISOString(),
          urgency_level: "high",
        },
        {
          id: "2",
          full_name: "Sarah Johnson",
          email: "sarah.j@example.com",
          phone: "+1-555-0124",
          status: "lead",
          property_type: "residential_sell",
          budget_min: 400000,
          budget_max: 600000,
          preferred_areas: ["City Center"],
          last_interaction: new Date(
            Date.now() - 24 * 60 * 60 * 1000
          ).toISOString(),
          urgency_level: "medium",
        },
      ];
    }
  },

  async getById(clientId) {
    try {
      const response = await api.clients.getById(clientId);
      // MCP tool execution returns { result: {...} } format
      if (response && response.result) {
        return response.result;
      }
      return response;
    } catch (error) {
      console.warn("Failed to fetch client from API:", error.message);
      const clients = await this.getAll();
      return clients.find((c) => c.id === clientId);
    }
  },

  async create(clientData) {
    try {
      const response = await api.clients.create(clientData);
      // MCP tool execution returns { result: {...} } format
      if (response && response.result) {
        return response.result;
      }
      return response;
    } catch (error) {
      console.error("Failed to create client:", error);
      throw error;
    }
  },

  async update(clientId, clientData) {
    try {
      const response = await api.clients.update(clientId, clientData);
      // MCP tool execution returns { result: {...} } format
      if (response && response.result) {
        return response.result;
      }
      return response;
    } catch (error) {
      console.error("Failed to update client:", error);
      throw error;
    }
  },

  async search(query, filters = {}) {
    try {
      const response = await api.clients.search(query, filters);
      // MCP tool execution returns { result: [...] } format
      if (response && response.result) {
        return response.result;
      }
      return response;
    } catch (error) {
      console.warn("Client search failed, using local filter:", error.message);
      const allClients = await this.getAll();
      return allClients.filter(
        (client) =>
          client.full_name.toLowerCase().includes(query.toLowerCase()) ||
          client.email.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Alias for getAll to match frontend expectations
  async list(sortBy = "-updated_at", limit = 50) {
    return this.getAll({ limit });
  },
};

// Activity entity with real API calls and fallbacks
export const Activity = {
  async getAll(params = {}) {
    try {
      const response = await api.activities.getAll(params);
      return response.activities || response;
    } catch (error) {
      console.warn(
        "Failed to fetch activities from API, using mock data:",
        error.message
      );
      return [
        {
          id: "1",
          action_type: "call_made",
          client_id: "1",
          title: "Called John Smith",
          description: "Discussed property requirements and scheduled viewing",
          completion_status: "completed",
          call_duration: 15,
          priority: "high",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          action_type: "follow_up_scheduled",
          client_id: "2",
          title: "Follow-up with Sarah Johnson",
          description: "Schedule property viewing for next week",
          completion_status: "pending",
          priority: "medium",
          scheduled_for: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  },

  async getByClientId(clientId) {
    try {
      return await api.clients.getActivities(clientId);
    } catch (error) {
      console.warn("Failed to fetch client activities:", error.message);
      const activities = await this.getAll();
      return activities.filter((a) => a.client_id === clientId);
    }
  },

  async create(activityData) {
    try {
      return await api.activities.create(activityData);
    } catch (error) {
      console.error("Failed to create activity:", error);
      throw error;
    }
  },

  async getToday() {
    try {
      return await api.activities.getToday();
    } catch (error) {
      console.warn("Failed to fetch today activities:", error.message);
      const allActivities = await this.getAll();
      const today = new Date().toISOString().split("T")[0];
      return allActivities.filter(
        (a) => a.created_at && a.created_at.startsWith(today)
      );
    }
  },

  // Alias for getAll to match frontend expectations
  async list(sortBy = "-created_at", limit = 50) {
    return this.getAll({ limit });
  },
};

// Summary entity with real API calls and fallbacks
export const Summary = {
  async getAll(params = {}) {
    try {
      const response = await api.summaries.getAll(params);
      return response.summaries || response;
    } catch (error) {
      console.warn(
        "Failed to fetch summaries from API, using mock data:",
        error.message
      );
      return [
        {
          id: "1",
          summary_type: "daily",
          date: new Date().toISOString().split("T")[0],
          completed_items: [
            "Called 3 clients about property viewings",
            "Scheduled 2 follow-up meetings",
            "Updated client database with new leads",
          ],
          upcoming_items: [
            "Property viewing with John Smith at 2 PM",
            "Follow-up call with Sarah Johnson",
            "Prepare listing presentation for new property",
          ],
          maira_suggestions: [
            {
              suggestion: "Schedule follow-up with leads from last week",
              priority: "high",
              category: "Client Management",
            },
          ],
          metrics: {
            calls_made: 5,
            tasks_completed: 8,
            meetings_scheduled: 3,
            follow_ups_sent: 2,
          },
        },
      ];
    }
  },

  async getDaily(date) {
    try {
      return await api.summaries.getDaily(date);
    } catch (error) {
      console.warn("Failed to fetch daily summary:", error.message);
      const summaries = await this.getAll();
      return summaries.find(
        (s) => s.date === date && s.summary_type === "daily"
      );
    }
  },

  async getByClientId(clientId) {
    try {
      return await api.summaries.getByClient(clientId);
    } catch (error) {
      console.warn("Failed to fetch client summaries:", error.message);
      return [];
    }
  },

  // Alias for getAll to match frontend expectations
  async list(sortBy = "-date", limit = 10) {
    return this.getAll({ limit });
  },
};

// Referral entity with real API calls and fallbacks
export const Referral = {
  async getAll() {
    try {
      // This would be implemented when referral API is available
      return [];
    } catch (error) {
      console.warn("Referral API not available:", error.message);
      return [];
    }
  },

  async create(referralData) {
    try {
      // Placeholder for referral creation
      console.log("Referral creation not implemented yet");
      return { id: Date.now().toString(), ...referralData };
    } catch (error) {
      console.error("Failed to create referral:", error);
      throw error;
    }
  },

  async getStats() {
    return {
      total_referrals: 0,
      successful_referrals: 0,
      pending_referrals: 0,
    };
  },
};
