type ActionType =
  | { type: 'SET_VISIBLE'; payload: boolean }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload?: boolean }
  | { type: 'SET_CONFIRM'; payload: string }
  | { type: 'SET_CANCEL'; payload: string }
  | { type: 'SET_ON_CONFIRM'; payload: () => void }
  | { type: 'SET_RESET' }

export default ActionType
