import { useTranslation } from 'react-i18next'
import { CL, US } from 'country-flag-icons/react/3x2'
import { MenuItem, InputLabel, FormControl } from '@mui/material'
import { Select, SelectChangeEvent } from '@mui/material'
import LanguageCode from '../types/language-code.type'
import { COMPONENT_KEY } from '../constants/component'
import { LANGUAGE_CODE } from '../constants/language'
import { useLanguageStore } from '../store/language'
import { useCallback, useEffect } from 'react'

const LanguageSwitcher = () => {
  const { languageCode, setLanguage } = useLanguageStore()
  const [translation, { changeLanguage }] = useTranslation(COMPONENT_KEY.LANGUAGE_SWITCHER)

  const handleChange = ({ target: { value } }: SelectChangeEvent) => {
    const newLanguage = value as LanguageCode
    changeLanguage(newLanguage)
    setLanguage(newLanguage)
  }

  const loadLanguage = useCallback(() => {
    changeLanguage(languageCode)
  }, [changeLanguage, languageCode])

  useEffect(loadLanguage, [loadLanguage])

  return (
    <FormControl size="small" sx={{ position: 'absolute', bottom: 10, right: 10 }}>
      <InputLabel id="language-select-label">{translation('indicators.language')}</InputLabel>
      <Select
        id="language-select"
        labelId="language-select-label"
        label={translation('indicators.language')}
        onChange={handleChange}
        value={languageCode}
        autoWidth
      >
        <MenuItem value={LANGUAGE_CODE.SPANISH}>
          <CL title="Chile" width={35} />
        </MenuItem>
        <MenuItem value={LANGUAGE_CODE.ENGLISH}>
          <US title="United States" width={35} />
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default LanguageSwitcher
