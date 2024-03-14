import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const baseUrl = 'http://localhost:5295/';
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/json',
  },
});

// Función para redirigir al usuario al inicio de sesión
const redirectToLogin = () => {
  window.location.href = '/login';
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config to include CORS headers
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:5295';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    // Check if error response status is 401 (Unauthorized) and redirect to login page if so
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axiosInstance.post('/auth/validate-token', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((res) => {
          // If token is verified, retry original request
          return axiosInstance(originalRequest);
        })
        .catch(() => {
          // If token verification fails, redirect to login page
          enqueueSnackbar('La sesión ha expirado, por favor conéctese de nuevo.', { variant: 'error' });
          redirectToLogin();
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
