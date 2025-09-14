
import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://granthalaya.onrender.com/api',
    baseURL: process.env.REACT_APP_API_URL, 
});

// Interceptor 1: Add the Authorization header to outgoing requests
// This part is mostly the same as your original code.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    // Don't add the token to the refresh endpoint or public endpoints
    if (token && config.url !== '/token/refresh/') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- NEW AND CRITICAL ---
// Interceptor 2: Handle token expiration and automatically refresh it
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we are already refreshing the token, push this request to a queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // If there's no refresh token, logout the user
        // You can add your logout logic here, e.g., window.location = '/login';
        return Promise.reject(error);
      }
      
      try {
        const response = await api.post('/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Update the header for the original request and any new requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Process the queue with the new token
        processQueue(null, newAccessToken);
        
        // Retry the original request with the new token
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh token is also invalid, logout the user
        processQueue(refreshError, null);
        console.error('Refresh token failed:', refreshError);
        // Add your logout logic here, e.g., window.location = '/login';
        localStorage.clear(); // Clear all storage
        window.location.reload(); // Force a reload to go to the login page

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
