import LanguageCode from '../types/language-code.type'

interface LanguageStore {
  languageCode: LanguageCode
  setLanguage: (code: LanguageCode) => Promise<void>
}

export default LanguageStore
