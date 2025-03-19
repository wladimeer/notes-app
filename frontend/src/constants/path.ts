import ApiKey from '../types/api-key.type'

const API_CONFIG: Record<ApiKey, string> = {
  SERVER: import.meta.env.VITE_SERVER,
  AUTH_PATH: import.meta.env.VITE_AUTH_PATH,
  NOTE_PATH: import.meta.env.VITE_NOTE_PATH,
  USER_REGISTER_ENDPOINT: `${import.meta.env.VITE_AUTH_PATH}/register`,
  USER_LOGIN_ENDPOINT: `${import.meta.env.VITE_AUTH_PATH}/login`,
  USER_LOGOUT_ENDPOINT: `${import.meta.env.VITE_AUTH_PATH}/logout`,
  NOTE_ENDPOINT: `${import.meta.env.VITE_NOTE_PATH}/`
}

export { API_CONFIG }
