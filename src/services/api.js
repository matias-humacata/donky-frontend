import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (nombre, email, password) => api.post('/auth/register', { nombre, email, password }),
};

// Clientes
export const clientesAPI = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.patch(`/clientes/${id}`, data),
  delete: (id, force = false) => api.delete(`/clientes/${id}?force=${force}`),
  block: (id) => api.patch(`/clientes/${id}/block`),
  unblock: (id) => api.patch(`/clientes/${id}/unblock`),
};

// Vehículos
export const vehiculosAPI = {
  getAll: (params) => api.get('/vehiculos', { params }),
  getById: (id) => api.get(`/vehiculos/id/${id}`),
  getByPatente: (patente) => api.get(`/vehiculos/patente/${patente}/historial`),
  create: (data) => api.post('/vehiculos', data),
  update: (id, data) => api.patch(`/vehiculos/id/${id}`, data),
  delete: (id, force = false) => api.delete(`/vehiculos/id/${id}?force=${force}`),
};

// Turnos
export const turnosAPI = {
  getAll: (params) => api.get('/turnos', { params }),
  getPendientes: () => api.get('/turnos/pendientes'),
  getAllHistory: () => api.get('/turnos/all'),
  getById: (id) => api.get(`/turnos/${id}`),
  create: (data) => api.post('/turnos', data),
  aprobar: (id) => api.patch(`/turnos/${id}/aprobar`),
  rechazar: (id) => api.patch(`/turnos/${id}/rechazar`),
  cancelar: (id) => api.patch(`/turnos/${id}/cancelar`),
};

// Configuración del Taller
export const tallerAPI = {
  get: () => api.get('/taller'),
  update: (data) => api.post('/taller', data),
};

// Métricas
export const metricasAPI = {
  get: () => api.get('/metricas/resumen'),
};

export default api;

