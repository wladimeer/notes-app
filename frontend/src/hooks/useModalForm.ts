import { useReducer } from 'react'
import type { TFunction } from 'i18next'
import type ModalForm from '../interfaces/modal-form.interface'
import type ActionType from '../types/action-type.type'
import type Note from '../interfaces/note.interface'

const useModalForm = () => {
  const initialNote: Note = {
    id: 0,
    title: '',
    content: '',
    created_at: '',
    updated_at: '',
    user_id: 0
  }

  const initialState: ModalForm = {
    title: '',
    visible: false,
    confirm: '',
    cancel: '',
    onConfirm: () => {},
    translation: (() => '') as TFunction,
    note: initialNote
  }

  const reducer = (state: ModalForm, action: ActionType): ModalForm => {
    switch (action.type) {
      case 'SET_TITLE':
        return { ...state, title: action.payload }
      case 'SET_VISIBLE':
        return { ...state, visible: action.payload }
      case 'SET_CONFIRM':
        return { ...state, confirm: action.payload }
      case 'SET_CANCEL':
        return { ...state, cancel: action.payload }
      case 'SET_ON_CONFIRM':
        return { ...state, onConfirm: action.payload }
      case 'SET_TRANSLATION':
        return { ...state, translation: action.payload }
      case 'SET_NOTE':
        return { ...state, note: action.payload }
      case 'SET_SERVER_NOTE':
        return { ...state, serverNote: action.payload ?? state.serverNote }
      case 'SET_RESET':
        return initialState
      default:
        return state
    }
  }

  const [modalForm, dispatch] = useReducer(reducer, initialState)

  const setModalForm = (payload: ModalForm) => {
    dispatch({ type: 'SET_TITLE', payload: payload.title })
    dispatch({ type: 'SET_VISIBLE', payload: payload.visible })
    dispatch({ type: 'SET_CONFIRM', payload: payload.confirm })
    dispatch({ type: 'SET_CANCEL', payload: payload.cancel })
    dispatch({ type: 'SET_ON_CONFIRM', payload: payload.onConfirm })
    dispatch({ type: 'SET_TRANSLATION', payload: payload.translation })
    dispatch({ type: 'SET_NOTE', payload: payload.note })

    if (payload.serverNote !== undefined) {
      dispatch({ type: 'SET_SERVER_NOTE', payload: payload.serverNote })
    }
  }

  const resetModalForm = () => {
    dispatch({ type: 'SET_RESET' })
  }

  return { modalForm, setModalForm, resetModalForm }
}

export default useModalForm
