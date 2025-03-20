import { useReducer } from 'react'
import type ConflictResolutionModal from '../interfaces/conflict-resolution-modal.interface'
import type ActionType from '../types/action-type.type'
import type { TFunction } from 'i18next'

const useConflictResolutionModal = () => {
  const initialState: ConflictResolutionModal = {
    title: '',
    visible: false,
    translation: (() => '') as TFunction,
    onReload: () => {},
    onMerge: () => {},
    onRetry: () => {}
  }

  const reducer = (state: ConflictResolutionModal, action: ActionType): ConflictResolutionModal => {
    switch (action.type) {
      case 'SET_TITLE':
        return { ...state, title: action.payload }
      case 'SET_VISIBLE':
        return { ...state, visible: action.payload }
      case 'SET_TRANSLATION':
        return { ...state, translation: action.payload }
      case 'SET_ON_RELOAD':
        return { ...state, onReload: action.payload }
      case 'SET_ON_MERGE':
        return { ...state, onMerge: action.payload }
      case 'SET_ON_RETRY':
        return { ...state, onRetry: action.payload }
      case 'SET_RESET':
        return initialState
      default:
        return state
    }
  }

  const [conflictResolutionModal, dispatch] = useReducer(reducer, initialState)

  const setConflictResolutionModal = (payload: ConflictResolutionModal) => {
    dispatch({ type: 'SET_TITLE', payload: payload.title })
    dispatch({ type: 'SET_VISIBLE', payload: payload.visible })
    dispatch({ type: 'SET_TRANSLATION', payload: payload.translation })
    dispatch({ type: 'SET_ON_RELOAD', payload: payload.onReload })
    dispatch({ type: 'SET_ON_MERGE', payload: payload.onMerge })
    dispatch({ type: 'SET_ON_RETRY', payload: payload.onRetry })
  }

  const resetConflictResolutionModal = () => {
    dispatch({ type: 'SET_RESET' })
  }

  return { conflictResolutionModal, setConflictResolutionModal, resetConflictResolutionModal }
}

export default useConflictResolutionModal
