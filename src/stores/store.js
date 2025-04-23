import { defineStore } from 'pinia'
import axios from 'axios'
import { API_HEADERS } from '../config/apiKeys' // Import API headers used in all authenticated requests

// Authentication and config store
export const useConfigStore = defineStore('config', {
  state: () => ({
    apiBaseUrl: '/api/v1/secure/', // Base URL for API set inside quasar.config.js
    token: localStorage.getItem('token') || null, // Token stored in localStorage for persistence
    tokenExpiry: localStorage.getItem('tokenExpiry') || null, // Token expiry stored in localStorage for persistence
    loading: false  // Global loading state for API calls
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // Used to protect routes, true if token exists
  },

  actions: {
    // Handle user login and token storage
    async login(email, password) {
      this.loading = true;
      try {

        delete axios.defaults.headers.common['Authorization']; // Clear previous auth headers before login

        const response = await axios.post(
          `${this.apiBaseUrl}login`,
          { email, password },
          {
            headers: API_HEADERS,
          }
        );

        const tokenData = response.data?.data?.token;
        const userData = response.data?.data?.profile.personal;

         // Store token if exists in response
        if (tokenData?.access_token) {
          this.token = tokenData.access_token;
          this.tokenExpiry = tokenData.expires_at || null;

          localStorage.setItem('token', tokenData.access_token);
          localStorage.setItem('tokenExpiry', tokenData.expires_at);

          // Store user name for UI header
          if (userData?.fullname) {
            localStorage.setItem('fullname', userData.fullname);
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`; // Set default auth header for future Axios calls
          return { success: true };
        } else {
          return { success: false, message: 'Invalid response format' };
        }
      } catch (error) {
        // Handle login errors
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed',
        };
      } finally {
        // Set loading to false after function is executed
        this.loading = false;
      }
    },

    // Clear token and reset theme on logout
    logout() {
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiry')
      delete axios.defaults.headers.common['Authorization']
    },

    // To attach token and custom headers to all Axios requests
    initTokenInterceptor() {

       // Set header if token exists
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }

      // Request interceptor to attach headers and check token expiry
      axios.interceptors.request.use(async (config) => {
        const now = Math.floor(Date.now() / 1000)
        if (this.tokenExpiry && now >= this.tokenExpiry) {
          console.log('Token expired, logging out')
          this.logout()
          throw new axios.Cancel('Token expired and no refresh token available')
        }

        // Attach required API headers
        config.headers = {
          ...config.headers,
          ...API_HEADERS
        }

        return config
      })

      // Response interceptor to catch 401 errors and redirect
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const request = error.config;
          console.log(request)

          // To check if token expired or unauthorized, it will logout and redirect
          if (
            error.response?.status === 401 &&
            this.tokenExpiry &&
            Math.floor(Date.now() / 1000) >= this.tokenExpiry
          ) {
            console.log('Token expired, redirecting to login...');
            this.logout();
            window.location.href = '/login';
          }

          return Promise.reject(error);
        }
      );


    },
  },
})
