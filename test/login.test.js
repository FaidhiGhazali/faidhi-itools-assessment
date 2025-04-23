/* eslint-disable no-undef */
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useConfigStore } from '../src/stores/store'

// Mock the axios instance for simulating API responses
const mock = new MockAdapter(axios)

describe('Config Store (No Refresh Token)', () => {
  let configStore

  // Set up a Pinia store and reset mock and localStorage before test
  beforeEach(() => {
    setActivePinia(createPinia()) // Activate Pinia store
    configStore = useConfigStore() // Create and get the store instance
    mock.reset() // Reset mock adapter to clear any previous mock data
    localStorage.clear() // Clear localStorage before each test
    vi.clearAllMocks() // Clear any mocked function calls

    // Remove existing request/response interceptors on axios to avoid interference
    axios.interceptors.request.handlers = []
    axios.interceptors.response.handlers = []
  })

  // Test login functionality to simulates a successful login and sets the token + expiry
  it('Handles login and sets token + expiry', async () => {
    const mockResponse = {
      data: {
        token: {
          access_token: 'mockAccessToken', // Simulated access token
          expires_at: Math.floor(Date.now() / 1000) + 3600
        },
        profile: {
          personal: {
            fullname: 'John Doe' // Simulated user profile
          }
        }
      }
    }

    // Simulate a successful login API response
    mock.onPost('/api/v1/secure/login').reply(200, mockResponse)

    // Call login action from the store
    const result = await configStore.login('test@email.com', 'password123')

    // Validate the success response and token being set
    expect(result.success).toBe(true)
    expect(configStore.token).toBe('mockAccessToken')
    expect(localStorage.getItem('token')).toBe('mockAccessToken')
  })

  // Test to handle 401 error due to expired token without refresh token
  it('Logs out immediately on 401 when token expired (no refresh)', async () => {
    // Set token and token expiry to simulate an expired token
    configStore.token = 'expiredToken'
    configStore.tokenExpiry = Math.floor(Date.now() / 1000) - 10

    // Simulate a 401 Unauthorized response from the API
    mock.onGet('/api/v1/secure/data').reply(401)

    const logoutSpy = vi.spyOn(configStore, 'logout') // Check on the logout method

    configStore.initTokenInterceptor() // Initialize the token interceptor to handle token expiry

    // Attempt to make an API call, expecting the interceptor to handle the 401 error
    await expect(axios.get('/api/v1/secure/data')).rejects.toThrow() // Expect error to be thrown
    expect(logoutSpy).toHaveBeenCalled() // To ensure logout was triggered
    expect(configStore.token).toBe(null) // To ensure token was cleared
    expect(localStorage.getItem('token')).toBe(null) // To ensure token was removed from localStorage
  })
})

describe('API URL check', () => {
   // Test to verify that the correct base URL is used for API requests
   it('Uses the real API base URL', async () => {
    // Create a new axios instance with a mock base URL for testing
    const instance = axios.create({
      baseURL: 'https://vd3ab4wh5i.execute-api.us-east-1.amazonaws.com/api/v1/secure', // Mock API URL
      timeout: 5000, // Set timeout for the request
    })

    try {
      // Simulate a failed login attempt with wrong credentials
      await instance.post('/login', {
        email: 'test@email.com',
        password: 'wrongpassword'
      })
    } catch (error) {
      // Verify that the base URL and error response status are correct
      expect(error.response.config.baseURL).toBe('https://vd3ab4wh5i.execute-api.us-east-1.amazonaws.com/api/v1/secure')
      expect(error.response.config.url).toBe('/login')
      expect(error.response.status).toBeGreaterThanOrEqual(400) // Check for a 400+ error status
    }
  })
})
