import axios from 'axios';

export const BASE_URL = 'http://localhost:1000/blogs/v1.0';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle Spring Boot's GlobalException (returns 200 with error shape)
api.interceptors.response.use(
  (response) => {
    const d = response.data;
    if (d && typeof d === 'object' && d.message && d.status && d.error && d.timeStamps) {
      return Promise.reject(new Error(d.message));
    }
    return response;
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message || 'Something went wrong';
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem('vv_token');
      localStorage.removeItem('vv_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(msg));
  }
);

export default api;
