import { ApiClient } from '@/lib/api-client';

describe('ApiClient', () => {
  const mockFetch = global.fetch as jest.Mock;
  const mockLocalStorage = window.localStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Token Management', () => {
    it('should retrieve access token from localStorage', () => {
      mockLocalStorage.setItem('accessToken', 'test-access-token');
      const token = (ApiClient as any).getAccessToken();
      expect(token).toBe('test-access-token');
    });

    it('should retrieve refresh token from localStorage', () => {
      mockLocalStorage.setItem('refreshToken', 'test-refresh-token');
      const token = (ApiClient as any).getRefreshToken();
      expect(token).toBe('test-refresh-token');
    });

    it('should set tokens in localStorage', () => {
      ApiClient.setAuthTokens('access-123', 'refresh-456');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-456');
    });

    it('should clear tokens from localStorage', () => {
      ApiClient.logout();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('GET Request', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await ApiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include access token in headers if available', async () => {
      mockLocalStorage.setItem('accessToken', 'test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await ApiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('POST Request', () => {
    it('should make POST request with data', async () => {
      const mockData = { success: true };
      const postData = { email: 'test@example.com', password: 'password' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await ApiClient.post('/auth/login', postData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('PUT Request', () => {
    it('should make PUT request with data', async () => {
      const mockData = { success: true };
      const putData = { name: 'Updated Name' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await ApiClient.put('/users/1', putData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('DELETE Request', () => {
    it('should make DELETE request', async () => {
      const mockData = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await ApiClient.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad Request' }),
      });

      await expect(ApiClient.get('/test')).rejects.toThrow('Bad Request');
    });

    it('should throw generic error when error response has no message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(ApiClient.get('/test')).rejects.toThrow('HTTP 500');
    });

    it('should handle json parse error in error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Parse error');
        },
      });

      await expect(ApiClient.get('/test')).rejects.toThrow('An error occurred');
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token on 401 response', async () => {
      mockLocalStorage.setItem('accessToken', 'old-token');
      mockLocalStorage.setItem('refreshToken', 'refresh-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh token call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'new-token' }),
      });

      // Retry with new token succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
      });

      const result = await ApiClient.get('/protected');

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-token');
      expect(result).toEqual({ data: 'success' });
    });

    it('should redirect to login if refresh fails', async () => {
      mockLocalStorage.setItem('accessToken', 'old-token');
      mockLocalStorage.setItem('refreshToken', 'refresh-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh token call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid refresh token' }),
      });

      await expect(ApiClient.get('/protected')).rejects.toThrow('Session expired');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(window.location.href).toBe('/login?session=expired');
    });

    it('should redirect to login if no refresh token available', async () => {
      mockLocalStorage.setItem('accessToken', 'old-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(ApiClient.get('/protected')).rejects.toThrow('Session expired');

      expect(window.location.href).toBe('/login?session=expired');
    });

    it('should not attempt refresh on 401 without access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(ApiClient.get('/test')).rejects.toThrow('Unauthorized');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      mockLocalStorage.setItem('refreshToken', 'refresh-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'new-access-token' }),
      });

      const result = await ApiClient.refreshAccessToken();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'refresh-token' }),
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(result).toBe(true);
    });

    it('should return false if no refresh token', async () => {
      const result = await ApiClient.refreshAccessToken();
      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return false if refresh request fails', async () => {
      mockLocalStorage.setItem('refreshToken', 'refresh-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await ApiClient.refreshAccessToken();
      expect(result).toBe(false);
    });

    it('should return false if refresh request throws error', async () => {
      mockLocalStorage.setItem('refreshToken', 'refresh-token');

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await ApiClient.refreshAccessToken();
      expect(result).toBe(false);
    });
  });

  describe('Custom Headers', () => {
    it('should merge custom headers with default headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await ApiClient.request('/test', {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value',
          }),
        })
      );
    });
  });
});
