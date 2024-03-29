import { enqueueSnackbar } from 'notistack'; // Import enqueueSnackbar
import axios from 'axios';

const baseUrl = "https://stands-gw-di2h7zbs.uk.gateway.dev/";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/json',
  },
});

// Function to redirect the user to the login page
const redirectToLogin = () => {
  window.location.href = '/login';
};

// Add a request interceptor to handle CORS
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config to include CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    // Check if the error response status is 401 (Unauthorized) and redirect to the login page if so
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axiosInstance.post('/auth/validate-token', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((res) => {
          // If the token is verified, retry the original request
          return axiosInstance(originalRequest);
        })
        .catch(() => {
          localStorage.removeItem('accessToken')
          redirectToLogin();
          enqueueSnackbar('La sesión ha expirado, por favor conéctese de nuevo.', { variant: 'error' });
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
