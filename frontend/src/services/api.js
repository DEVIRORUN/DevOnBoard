import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes
})

export const analyzeRepository = async (repositoryUrl) => {
  try {
    const response = await apiClient.post('/api/analyze', {
      repository_url: repositoryUrl,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Server error')
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.')
    } else {
      throw new Error('Failed to send request')
    }
  }
}

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health')
    return response.data
  } catch (error) {
    throw new Error('Health check failed')
  }
}

export default apiClient

// Made with Bob
