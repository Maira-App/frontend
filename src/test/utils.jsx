/**
 * Test utilities and helpers
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';

// Custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
  const { initialEntries = ['/'], ...renderOptions } = options;

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponses = {
  clients: [
    {
      id: '1',
      full_name: 'Test Client',
      email: 'test@example.com',
      phone: '+1234567890',
      status: 'active',
    }
  ],
  activities: [
    {
      id: '1',
      title: 'Test Activity',
      action_type: 'call_made',
      client_id: '1',
      created_at: new Date().toISOString(),
    }
  ],
  user: {
    id: 'test-user',
    name: 'Test User',
    email: 'test@maira.ai',
  }
};

// Mock fetch responses
export function mockFetch(data, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
}

export function mockFetchError(message = 'API Error', status = 500) {
  global.fetch.mockRejectedValueOnce(new Error(message));
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';