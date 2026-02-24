import axios from 'axios';

// En producción, no usar localhost
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Si estamos en producción y no hay variable, mostrar error
  if (import.meta.env.PROD) {
    console.error('VITE_API_URL no está configurada en producción');
    return ''; // Esto causará un error visible
  }
  
  // Solo en desarrollo usar localhost
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Instancia de axios configurada con la URL base
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para agregar el token de autenticación a las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar errores de respuesta
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
