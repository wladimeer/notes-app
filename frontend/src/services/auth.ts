import axios from 'axios'
import { API_CONFIG } from '../constants/path'
import type UserForm from '../interfaces/user-form.interface'
import type ApiResponse from '../interfaces/api-response.interface'
import type User from '../interfaces/user.interface'
import { AxiosError, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: API_CONFIG.SERVER,
  withCredentials: true
})

const signIn = async (user: UserForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.USER_LOGIN_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.post(REQUEST_URL, user)

    return {
      status: 0,
      message: data?.message,
      data: data as User
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta nuevamente más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta nuevamente en unos minutos'
    }
  }
}

const signOut = async (): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.USER_LOGOUT_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.post(REQUEST_URL)

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta nuevamente más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta nuevamente en unos minutos'
    }
  }
}

const createUser = async (user: UserForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.USER_REGISTER_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.post(REQUEST_URL, user)

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta nuevamente más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta nuevamente en unos minutos'
    }
  }
}

export { signIn, signOut, createUser }
