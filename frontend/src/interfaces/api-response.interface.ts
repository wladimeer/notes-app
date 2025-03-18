import type User from './user.interface'
import type StatusApiResponse from '../types/status-api-response.type'
import type Note from './note.interface'

interface ApiResponse {
  status: StatusApiResponse
  message: string
  data?: User | Note | Note[]
}

export default ApiResponse
