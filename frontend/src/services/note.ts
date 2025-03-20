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

let abortController = new AbortController()

const cancelPendingRequests = () => {
  abortController.abort()
  abortController = new AbortController()
}

const createNote = async (note: NoteForm): Promise<ApiResponse> => {
  cancelPendingRequests()

  const REQUEST_URL = `${API_CONFIG.NOTE_PATH}/`

  try {
    const { data }: AxiosResponse = await apiClient.post(REQUEST_URL, note, {
      signal: abortController.signal
    })

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return { status: 4, message: 'Solicitud cancelada' }
    }

    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta más tarde'
    }
  }
}

const getNotes = async (): Promise<ApiResponse> => {
  cancelPendingRequests()

  const REQUEST_URL = `${API_CONFIG.NOTE_PATH}`

  try {
    const { data }: AxiosResponse = await apiClient.get(REQUEST_URL, {
      signal: abortController.signal
    })

    return {
      status: 0,
      message: data?.message,
      data: data?.data as Note[]
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return { status: 4, message: 'Solicitud cancelada' }
    }

    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta más tarde'
    }
  }
}

const updateNote = async (id: number, note: NoteForm): Promise<ApiResponse> => {
  cancelPendingRequests()

  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.put(REQUEST_URL, note, {
      signal: abortController.signal
    })

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return { status: 4, message: 'Solicitud cancelada' }
    }

    if (error instanceof AxiosError) {
      if (error.status === HttpStatusCode.Conflict) {
        return {
          status: 3,
          message: error.response?.data.message ?? 'Conflicto al actualizar la nota'
        }
      }

      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta más tarde'
    }
  }
}

const deleteNote = async (id: number): Promise<ApiResponse> => {
  cancelPendingRequests()

  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.delete(REQUEST_URL, {
      signal: abortController.signal
    })

    return {
      status: 0,
      message: data?.message
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return { status: 4, message: 'Solicitud cancelada' }
    }

    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta más tarde'
    }
  }
}

const findNote = async (id: number): Promise<ApiResponse> => {
  cancelPendingRequests()

  const REQUEST_URL = `${API_CONFIG.NOTE_ENDPOINT}${id}`

  try {
    const { data }: AxiosResponse = await apiClient.get(REQUEST_URL, {
      signal: abortController.signal
    })

    return {
      status: 0,
      message: data?.message,
      data: data?.data as Note
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      return { status: 4, message: 'Solicitud cancelada' }
    }

    if (error instanceof AxiosError) {
      return {
        status: 1,
        message:
          error.response?.data.message ??
          'Parece que hubo un problema al conectar con el servidor. Por favor, intenta más tarde'
      }
    }

    return {
      status: 2,
      message: 'Algo salió mal. Intenta más tarde'
    }
  }
}

export { createNote, getNotes, updateNote, deleteNote, findNote, cancelPendingRequests }
