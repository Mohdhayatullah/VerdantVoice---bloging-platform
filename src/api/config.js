import axios from 'axios';

// export const BASE_URL = 'http://localhost:1000/blogs/v1.0';
export const BASE_URL = 'https://blogsbackend-3g0m.onrender.com/blogs/v1.0';

const api = axios.create({ baseURL: BASE_URL });

const extractErrorMessage = (payload, fallback = 'Something went wrong') => {
  if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload === 'string') {
    const looksLikeHtml = /<html|<body|<head|whitelabel/i.test(payload);
    if (looksLikeHtml) {
      return fallback;
    }

    const compact = payload.replace(/\s+/g, ' ').trim();
    if (compact) {
      return compact.length > 220 ? `${compact.slice(0, 220)}…` : compact;
    }
  }

  return fallback;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === 'object' && data.message && data.status && data.error && data.timeStamps) {
      return Promise.reject(new Error(data.message));
    }
    return response;
  },
  (error) => {
    const msg = extractErrorMessage(error?.response?.data, error.message || 'Something went wrong');
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem('vv_token');
      localStorage.removeItem('vv_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(msg));
  }
);

export default api;
