import { defineStore } from 'pinia'
import axios from 'axios'
import { API_HEADERS } from '../config/apiKeys' // Import API headers used in all authenticated requests

// Clear token at start
localStorage.removeItem('token');
localStorage.removeItem('tokenExpiry');
localStorage.removeItem('role');

// Authentication and config store
export const useConfigStore = defineStore('config', {
  state: () => ({
    apiBaseUrl: '/api/v1/secure/', // Base URL for API set inside quasar.config.js
    token: null, // Initialize token as null on app start
    tokenExpiry: null, // Initialize tokenExpiry as null on app start
    loading: false,  // Global loading state for API calls
    role: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // Used to protect routes, true if token exists
    userRole: (state) => state.role, // Getter to access the role
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
        const userRole = response.data?.data?.profile?.current_active_organization.roles[0] || 'staff';

         // Store token if exists in response
        if (tokenData?.access_token) {
          this.token = tokenData.access_token;
          this.tokenExpiry = tokenData.expires_at || null;
          this.role = userRole;

          localStorage.setItem('token', tokenData.access_token); // Save tokenData in localStorage
          localStorage.setItem('tokenExpiry', tokenData.expires_at); // Save tokenExpiry in localStorage
          localStorage.setItem('role', userRole); // Save role in localStorage

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
