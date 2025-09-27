/**
 * Activities and events API service
 * Uses MCP tools through orchestration service
 */

import { apiClient } from "./client.js";
import { getCurrentAgentId } from "../utils/auth.js";

export const activitiesService = {
  // Get all activities - use client interaction logs
  async getAll(params = {}) {
    // This would need a specific MCP tool for activity aggregation
    // For now, return empty as this needs backend implementation
    return { activities: [] };
  },

  // Get a specific activity by ID - not directly supported
  async getById(activityId) {
    throw new Error("Activity lookup by ID not supported");
  },

  // Create a new activity - use log_interaction
  async create(activityData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "log_interaction",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        client_id: activityData.client_id,
        interaction_type: activityData.type || "other",
        notes: activityData.description || activityData.notes,
      },
    });
  },

  // Update an existing activity - not directly supported
  async update(activityId, activityData) {
    throw new Error("Activity updates not supported");
  },

  // Delete an activity - not supported
  async delete(activityId) {
    throw new Error("Activity deletion not supported");
  },

  // Get activities by date range - not directly supported
  async getByDateRange(startDate, endDate, params = {}) {
    return { activities: [] };
  },

  // Get today's activities - use today's agenda
  async getToday() {
    return apiClient.post("/api/tools/execute", {
      toolName: "get_todays_agenda",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
      },
    });
  },

  // Get upcoming activities - not directly supported
  async getUpcoming(days = 7) {
    return { activities: [] };
  },

  // Mark activity as completed - use add_meeting_notes
  async markCompleted(activityId, completionData = {}) {
    return apiClient.post("/api/tools/execute", {
      toolName: "add_meeting_notes",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        appointment_id: activityId,
        notes: completionData.notes || "Meeting completed",
      },
    });
  },

  // Get activity statistics - not available
  async getStats(params = {}) {
    return {
      total: 0,
      completed: 0,
      pending: 0,
      today: 0,
    };
  },

  // Get activities by type - not directly supported
  async getByType(actionType, params = {}) {
    return { activities: [] };
  },
};

export const calendarService = {
  // Get calendar events for today
  async getEvents(params = {}) {
    if (params.date) {
      return apiClient.post("/api/tools/execute", {
        toolName: "get_daily_schedule",
        args: {
          agent_id: getCurrentAgentId(), // Get from auth context
          date_str: params.date,
        },
      });
    } else {
      return apiClient.post("/api/tools/execute", {
        toolName: "get_todays_agenda",
        args: {
          agent_id: getCurrentAgentId(), // Get from auth context
        },
      });
    }
  },

  // Create calendar event
  async createEvent(eventData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "schedule_appointment",
      args: {
        appointment: {
          agent_id: getCurrentAgentId(), // Get from auth context
          title: eventData.title,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          client_id: eventData.client_id,
          appointment_type: eventData.type || "meeting",
          location: eventData.location,
          notes: eventData.notes,
        },
      },
    });
  },

  // Update calendar event - use reschedule_appointment
  async updateEvent(eventId, eventData) {
    return apiClient.post("/api/tools/execute", {
      toolName: "reschedule_appointment",
      args: {
        request: {
          agent_id: getCurrentAgentId(), // Get from auth context
          appointment_id: eventId,
          new_start_time: eventData.start_time,
          new_end_time: eventData.end_time,
          reason: eventData.reason || "Updated appointment",
        },
      },
    });
  },

  // Delete calendar event - not directly supported
  async deleteEvent(eventId) {
    throw new Error("Event deletion not supported");
  },

  // Get events by date
  async getEventsByDate(date) {
    return apiClient.post("/api/tools/execute", {
      toolName: "get_daily_schedule",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        date_str: date,
      },
    });
  },

  // Get calendar availability
  async getAvailability(date, duration = 60) {
    return apiClient.post("/api/tools/execute", {
      toolName: "find_available_slots",
      args: {
        agent_id: getCurrentAgentId(), // Get from auth context
        date_str: date,
        duration_minutes: duration,
      },
    });
  },

  // Schedule meeting
  async scheduleMeeting(meetingData) {
    return this.createEvent(meetingData);
  },
};

export default { activitiesService, calendarService };
