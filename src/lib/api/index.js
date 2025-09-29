/**
 * Centralized API services export
 * Provides easy access to all API services
 */

export {
  apiClient,
  tokenManager,
  APIError,
  AuthenticationError,
  ValidationError,
} from "./client.js";
export { authService } from "./auth.js";
export { clientsService } from "./clients.js";
export { activitiesService, calendarService } from "./activities.js";
export { summariesService, analyticsService } from "./summaries.js";

// Import services for re-export object
import { authService } from "./auth.js";
import { clientsService } from "./clients.js";
import { activitiesService, calendarService } from "./activities.js";
import { summariesService, analyticsService } from "./summaries.js";

// Re-export for convenience
export const api = {
  auth: authService,
  clients: clientsService,
  activities: activitiesService,
  calendar: calendarService,
  summaries: summariesService,
  analytics: analyticsService,
};

export default api;
