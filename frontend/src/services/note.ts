import axios from 'axios'
import { API_CONFIG } from '../constants/path'
import type NoteForm from '../interfaces/note-form.interface'
import type ApiResponse from '../interfaces/api-response.interface'
import type Note from '../interfaces/note.interface'
import { AxiosError, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: API_CONFIG.SERVER,
  withCredentials: true
})

const createNote = async (note: NoteForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_PATH}`

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

const updateNote = async (id: Pick<Note, 'id'>, note: NoteForm): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.put(REQUEST_URL, { params: { id }, ...note })

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

const deleteNote = async (id: Pick<Note, 'id'>): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.put(REQUEST_URL, { params: { id } })

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

const findNote = async (id: Pick<Note, 'id'>): Promise<ApiResponse> => {
  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}`

  try {
    const { data }: AxiosResponse = await apiClient.get(REQUEST_URL, { params: id })

    return {
      status: 0,
      message: data?.message,
      data: data as Note
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
