import { create } from 'zustand'
import LanguageCode from '../types/language-code.type'
import { persist, createJSONStorage } from 'zustand/middleware'
import LanguageStore from '../interfaces/language-store.interface'
import { LANGUAGE_CODE } from '../constants/language'
import { STORAGE_KEY } from '../constants/storage'

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      languageCode: LANGUAGE_CODE.DEFAULT,
      setLanguage: async (code: LanguageCode) => set({ languageCode: code })
    }),
    {
      name: STORAGE_KEY.LANGUAGE,
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export { useLanguageStore }
