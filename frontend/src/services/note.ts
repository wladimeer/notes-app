import axios from 'axios'
import { API_CONFIG } from '../constants/path'
import type NoteForm from '../interfaces/note-form.interface'
import type ApiResponse from '../interfaces/api-response.interface'
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import type Note from '../interfaces/note.interface'

const apiClient = axios.create({
  baseURL: API_CONFIG.SERVER,
  withCredentials: true
})

const createNote = async (note: NoteForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_PATH}/`

  try {
    const { data }: AxiosResponse = await apiClient.post(REQUEST_URL, note)

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

const getNotes = async (): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_PATH}`

  try {
    const { data }: AxiosResponse = await apiClient.get(REQUEST_URL)

    return {
      status: 0,
      message: data?.message,
      data: data?.data as Note[]
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

const updateNote = async (id: number, note: NoteForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.put(REQUEST_URL, note)

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === HttpStatusCode.Conflict) {
        return {
          status: 3,
          message:
            error.response?.data.message ??
            'Parece que hubo un problema al conectar con el servidor. Por favor, intenta nuevamente más tarde'
        }
      }

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

const deleteNote = async (id: number): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.delete(REQUEST_URL)

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

const findNote = async (id: number): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.get(REQUEST_URL)

    return {
      status: 0,
      message: data?.message,
      data: data?.data as Note
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

export { createNote, getNotes, updateNote, deleteNote, findNote }
