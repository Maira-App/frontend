/**
 * Test for API client functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APIClient, APIError, AuthenticationError } from '../lib/api/client.js';

describe('APIClient', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = new APIClient();
    vi.clearAllMocks();
  });

  describe('request method', () => {
    it('should make successful GET request', async () => {
      const mockData = { message: 'success' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
        headers: new Map([['content-type', 'application/json']]),
      });

      const result = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle 401 authentication errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Unauthorized' } }),
        headers: new Map([['content-type', 'application/json']]),
      });

      await expect(apiClient.get('/protected')).rejects.toThrow(AuthenticationError);
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow(APIError);
    });

    it('should include auth headers when token is present', async () => {
      // Mock token in localStorage
      global.localStorage.getItem.mockReturnValue('mock-token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Map([['content-type', 'application/json']]),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Map([['content-type', 'application/json']]),
      });
    });

    it('should make POST request with body', async () => {
      const postData = { name: 'test' };
      await apiClient.post('/test', postData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
    });

    it('should make PUT request', async () => {
      await apiClient.put('/test', { id: 1 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('should make DELETE request', async () => {
      await apiClient.delete('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});