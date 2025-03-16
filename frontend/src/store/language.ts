import { create } from 'zustand'
import LanguageCode from '../types/language-code.type'
import LanguageState from '../interfaces/language-state.interface'
import { DEFAULT_LANGUAGE_CODE } from '../constants/language'

const useLanguageStore = create<LanguageState>((set) => ({
  languageCode: DEFAULT_LANGUAGE_CODE,
  setLanguage: async (code: LanguageCode) => {
    set({ languageCode: code })
  }
}))

export { useLanguageStore }
