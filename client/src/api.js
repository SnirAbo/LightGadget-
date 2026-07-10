import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lightgadget.onrender.com/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['x-access-token'] = token;
  }
  return config;
});

export default api;
