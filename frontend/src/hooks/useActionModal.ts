import { useReducer } from 'react'
import type ActionModal from '../interfaces/action-modal.interface'
import type ActionType from '../types/action-type.type'

const useActionModal = () => {
  const initialState: ActionModal = {
    title: '',
    visible: false,
    confirm: '',
    cancel: '',
    onConfirm: () => {}
  }

  const reducer = (state: ActionModal, action: ActionType): ActionModal => {
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
      case 'SET_RESET':
        return initialState
      default:
        return state
    }
  }

  const [actionModal, dispatch] = useReducer(reducer, initialState)

  const setActionModal = (payload: ActionModal) => {
    dispatch({ type: 'SET_TITLE', payload: payload.title })
    dispatch({ type: 'SET_VISIBLE', payload: payload.visible })
    dispatch({ type: 'SET_CONFIRM', payload: payload.confirm })
    dispatch({ type: 'SET_CANCEL', payload: payload.cancel })
    dispatch({ type: 'SET_ON_CONFIRM', payload: payload.onConfirm || null })
  }

  const resetActionModal = () => {
    dispatch({ type: 'SET_RESET' })
  }

  return { actionModal, setActionModal, resetActionModal }
}

export default useActionModal
