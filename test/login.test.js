/* eslint-disable no-undef */
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useConfigStore } from '../src/stores/store'

const mock = new MockAdapter(axios)

describe('Config Store (No Refresh Token)', () => {
  let configStore

  beforeEach(() => {
    setActivePinia(createPinia())
    configStore = useConfigStore()
    mock.reset()
    localStorage.clear()
    vi.clearAllMocks()

    axios.interceptors.request.handlers = []
    axios.interceptors.response.handlers = []
  })

  it('Handles login and sets token + expiry', async () => {
    const mockResponse = {
      data: {
        token: {
          access_token: 'mockAccessToken',
          expires_at: Math.floor(Date.now() / 1000) + 3600
        },
        profile: {
          personal: {
            fullname: 'John Doe'
          }
        }
      }
    }

    mock.onPost('/api/v1/secure/login').reply(200, mockResponse)

    const result = await configStore.login('test@email.com', 'password123')

    expect(result.success).toBe(true)
    expect(configStore.token).toBe('mockAccessToken')
    expect(localStorage.getItem('token')).toBe('mockAccessToken')
  })

  it('Logs out immediately on 401 when token expired (no refresh)', async () => {
    configStore.token = 'expiredToken'
    configStore.tokenExpiry = Math.floor(Date.now() / 1000) - 10

    mock.onGet('/api/v1/secure/data').reply(401)

    const logoutSpy = vi.spyOn(configStore, 'logout')

    configStore.initTokenInterceptor()

    await expect(axios.get('/api/v1/secure/data')).rejects.toThrow()
    expect(logoutSpy).toHaveBeenCalled()
    expect(configStore.token).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})

describe('API URL check', () => {
  it('Uses the real API base URL', async () => {
    const instance = axios.create({
      baseURL: 'https://vd3ab4wh5i.execute-api.us-east-1.amazonaws.com/api/v1/secure',
      timeout: 5000,
    })

    try {
      await instance.post('/login', {
        email: 'test@email.com',
        password: 'wrongpassword'
      })
    } catch (error) {
      expect(error.response.config.baseURL).toBe('https://vd3ab4wh5i.execute-api.us-east-1.amazonaws.com/api/v1/secure')
      expect(error.response.config.url).toBe('/login')
      expect(error.response.status).toBeGreaterThanOrEqual(400)
    }
  })
})
