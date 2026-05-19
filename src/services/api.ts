const API_URL = 'http://localhost:3000/api/auth/v1';

export const api = {
  async signup(data: any) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || result.status === 'error') {
      throw new Error(result.message || 'Failed to sign up');
    }
    return result;
  },

  async login(data: any) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || result.status === 'error') {
      throw new Error(result.message || 'Failed to login');
    }
    return result;
  },

  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
    });
    const result = await response.json();
    if (!response.ok || result.status === 'error') {
      throw new Error(result.message || 'Failed to logout');
    }
    return result;
  }
};
