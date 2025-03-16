import LanguageCode from '../types/language-code.type'

interface LanguageState {
  languageCode: LanguageCode
  setLanguage: (code: LanguageCode) => Promise<void>
}

export default LanguageState
