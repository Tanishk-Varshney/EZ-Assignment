import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const login = async (email, password) => {
  const response = await api.post('/ops/login', { username: email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await api.post('/client/signup', { email, password });
  return response.data;
};

// File services
export const getFiles = async () => {
  const response = await api.get('/client/files');
  return response.data;
};

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/client/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(progress);
    },
  });
  return response.data;
};

export const downloadFile = async (filename) => {
  const response = await api.get(`/client/download/${filename}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}; 