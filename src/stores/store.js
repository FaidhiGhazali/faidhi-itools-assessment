import { defineStore } from 'pinia'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'
import { API_HEADERS } from '../config/apiKeys'

export const useConfigStore = defineStore('config', {
  state: () => ({
    apiBaseUrl: '/api/v1/secure/',
    token: localStorage.getItem('token') || null,
    tokenExpiry: localStorage.getItem('tokenExpiry') || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      try {

        delete axios.defaults.headers.common['Authorization'];

        const response = await axios.post(
          `${this.apiBaseUrl}login`,
          { email, password },
          {
            headers: API_HEADERS,
          }
        );

        const tokenData = response.data?.data?.token;
        const userData = response.data?.data?.profile.personal;

        if (tokenData?.access_token) {
          this.token = tokenData.access_token;
          this.tokenExpiry = tokenData.expires_at || null;

          localStorage.setItem('token', tokenData.access_token);
          localStorage.setItem('tokenExpiry', tokenData.expires_at);

          if (userData?.fullname) {
            localStorage.setItem('fullname', userData.fullname);
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`;
          return { success: true };
        } else {
          return { success: false, message: 'Invalid response format' };
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed',
        };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      const themeStore = useThemeStore()
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiry')
      delete axios.defaults.headers.common['Authorization']
      themeStore.setDarkMode(false)
    },

    initTokenInterceptor() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }

      axios.interceptors.request.use(async (config) => {
        const now = Math.floor(Date.now() / 1000)
        if (this.tokenExpiry && now >= this.tokenExpiry) {
          console.log('Token expired, logging out')
          this.logout()
          throw new axios.Cancel('Token expired and no refresh token available')
        }

        config.headers = {
          ...config.headers,
          ...API_HEADERS
        }

        return config
      })

      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const request = error.config;
          console.log(request)

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
