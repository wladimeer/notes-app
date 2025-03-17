import type User from './user.interface'
import type StatusApiResponse from '../types/status-api-response.type'

interface ApiResponse {
  status: StatusApiResponse
  message: string
  data?: User
}

export default ApiResponse
