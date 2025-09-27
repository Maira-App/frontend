/**
 * Environment configuration for MAIRA frontend
 * Centralizes all environment variable access with validation and defaults
 */

// Helper function to get environment variables with validation
const getEnvVar = (name, defaultValue = '', required = false) => {
  const value = import.meta.env[name] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value;
};

// Convert string to boolean
const getBooleanEnvVar = (name, defaultValue = false) => {
  const value = import.meta.env[name];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  API_KEY: getEnvVar('VITE_API_KEY'),
  TIMEOUT: 30000, // 30 seconds
};

// Authentication Configuration
export const AUTH_CONFIG = {
  ENABLED: getBooleanEnvVar('VITE_AUTH_ENABLED', false),
  TOKEN_KEY: 'maira_auth_token',
  REFRESH_TOKEN_KEY: 'maira_refresh_token',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Feature Flags
export const FEATURES = {
  CHAT_ENABLED: getBooleanEnvVar('VITE_ENABLE_CHAT', true),
  VOICE_AGENT_ENABLED: getBooleanEnvVar('VITE_ENABLE_VOICE_AGENT', true),
  ANALYTICS_ENABLED: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
  DEBUG_MODE: getBooleanEnvVar('VITE_DEBUG_MODE', false),
};

// External Services
export const EXTERNAL_SERVICES = {
  SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN'),
  POSTHOG_KEY: getEnvVar('VITE_POSTHOG_KEY'),
};

// App Configuration
export const APP_CONFIG = {
  NAME: getEnvVar('VITE_APP_NAME', 'MAIRA'),
  VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  SUPPORT_EMAIL: getEnvVar('VITE_SUPPORT_EMAIL', 'support@maira.ai'),
  ENVIRONMENT: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// URLs and Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  CALENDAR: '/calendar',
  SUMMARIES: '/summaries',
  BILLING: '/billing',
};

// Default configuration object
export const config = {
  api: API_CONFIG,
  auth: AUTH_CONFIG,
  features: FEATURES,
  external: EXTERNAL_SERVICES,
  app: APP_CONFIG,
  routes: ROUTES,
};

// Environment validation function
export const validateEnvironment = () => {
  const errors = [];
  
  if (AUTH_CONFIG.ENABLED && !API_CONFIG.API_KEY) {
    errors.push('API_KEY is required when authentication is enabled');
  }
  
  if (FEATURES.ANALYTICS_ENABLED && !EXTERNAL_SERVICES.POSTHOG_KEY) {
    errors.push('POSTHOG_KEY is required when analytics is enabled');
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  
  return true;
};

// Log configuration in development
if (APP_CONFIG.IS_DEVELOPMENT && FEATURES.DEBUG_MODE) {
  console.group('🔧 MAIRA Configuration');
  console.log('Environment:', APP_CONFIG.ENVIRONMENT);
  console.log('API Base URL:', API_CONFIG.BASE_URL);
  console.log('Auth Enabled:', AUTH_CONFIG.ENABLED);
  console.log('Features:', FEATURES);
  console.groupEnd();
}

export default config;