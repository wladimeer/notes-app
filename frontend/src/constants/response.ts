import type ResponseKey from '../types/response-type.type'
import type StatusApiResponse from '../types/status-api-response.type'

const RESPONSE_TYPE: Record<ResponseKey, StatusApiResponse> = {
  SUCCESS: 0,
  ERROR: 1,
  EXCEPTION: 2,
  CONFLICT: 3
}

export { RESPONSE_TYPE }
