import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock environment variables for tests
import.meta.env = {
  ...import.meta.env,
  VITE_API_BASE_URL: 'http://localhost:3000',
  VITE_AUTH_ENABLED: 'false',
  VITE_DEBUG_MODE: 'true',
  DEV: true,
  PROD: false,
  MODE: 'test'
};

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Setup after each test
afterEach(() => {
  vi.clearAllMocks();
});