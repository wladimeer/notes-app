import i18n from 'i18next'
import AppRouter from './routers/AppRouter'
import { I18nextProvider } from 'react-i18next'
import notFoundEN from './locales/en/notFound.json'
import notFoundES from './locales/es/notFound.json'
import { COMPONENT_KEY } from './constants/component'
import languageSwitcherES from './locales/es/languageSwitcher.json'
import languageSwitcherEN from './locales/en/languageSwitcher.json'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LANGUAGE_CODE } from './constants/language'
import loginEN from './locales/en/login.json'
import loginES from './locales/es/login.json'
import { PAGE_KEY } from './constants/page'
import './App.css'

const theme = createTheme({
  typography: {
    fontFamily: '"Reddit Sans Condensed", sans-serif'
  }
})

i18n.init({
  interpolation: { escapeValue: false },
  resources: {
    [LANGUAGE_CODE.SPANISH]: {
      [PAGE_KEY.NOT_FOUND_PAGE]: notFoundES,
      [COMPONENT_KEY.LANGUAGE_SWITCHER]: languageSwitcherES,
      [PAGE_KEY.LOGIN_PAGE]: loginES
    },
    [LANGUAGE_CODE.ENGLISH]: {
      [PAGE_KEY.NOT_FOUND_PAGE]: notFoundEN,
      [COMPONENT_KEY.LANGUAGE_SWITCHER]: languageSwitcherEN,
      [PAGE_KEY.LOGIN_PAGE]: loginEN
    }
  },
  lng: LANGUAGE_CODE.SPANISH,
  fallbackLng: LANGUAGE_CODE.DEFAULT
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <AppRouter />
        <LanguageSwitcher />
      </I18nextProvider>
    </ThemeProvider>
  )
}

export default App
