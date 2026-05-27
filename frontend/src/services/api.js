export function getAuthHeaders() {
    const token = localStorage.getItem('access');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  