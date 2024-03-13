import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const baseUrl = 'http://localhost:5209/api/';
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/json',
  },
});

let retryCounter = 1;
const MAX_RETRIES = 4;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config to include CORS headers
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
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

    // Handle 401 Unauthorized error and limit retries
    if (error.response.status === 401 && !originalRequest._retry && retryCounter < MAX_RETRIES) {
      originalRequest._retry = true;
      retryCounter+=retryCounter;

      // Perform token renewal logic, e.g., making a request to refresh the token
      const refreshToken = localStorage.getItem('refreshToken');
      return axiosInstance
        .post('/auth/refresh', { refreshToken })
        .then((res) => {
          if (res.status === 200) {
            const newToken = res.data.accessToken;

            // Update the stored token in localStorage or any other source
            localStorage.setItem('accessToken', newToken);

            // Update the Authorization header with the new token
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            // Reset the retry counter
            retryCounter = 0;

            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          }
          return Promise.reject(error); // Add this line to handle unsuccessful token renewal
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }

    if (error.response.status === 401 && !originalRequest._retry && retryCounter === MAX_RETRIES) {
      // Show alert to the user to log in again
      enqueueSnackbar('Su sesión ha expirado. Por favor, conéctese de nuevo.', { variant: 'error' });
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
