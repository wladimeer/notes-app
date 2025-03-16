import ApiConfig from '../interfaces/api-config.interface'

const API_CONFIG: ApiConfig = {
  SERVER: import.meta.env.VITE_SERVER,
  AUTH_PATH: import.meta.env.VITE_AUTH_PATH,
  NOTE_PATH: import.meta.env.VITE_NOTE_PATH,
  USER_REGISTER_ENDPOINT: `${import.meta.env.VITE_AUTH_PATH}/register`,
  USER_LOGIN_ENDPOINT: `${import.meta.env.VITE_AUTH_PATH}/login`,
  NOTE_ENDPOINT: `${import.meta.env.VITE_NOTE_PATH}/`
}

export { API_CONFIG }
