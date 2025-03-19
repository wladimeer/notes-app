import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getFormUserSchema = (translation: TFunction) =>
  Yup.object({
    username: Yup.string()
      .min(4, translation('validation.username.min', { min: 4 }))
      .max(10, translation('validation.username.max', { max: 10 }))
      .required(translation('validation.username.required')),
    password: Yup.string()
      .min(4, translation('validation.password.min', { min: 4 }))
      .max(10, translation('validation.password.max', { max: 10 }))
      .required(translation('validation.password.required'))
  })

const getFormNoteSchema = (translation: TFunction) =>
  Yup.object({
    title: Yup.string()
      .min(5, translation('validation.title.min', { min: 5 }))
      .max(50, translation('validation.title.max', { max: 50 }))
      .required(translation('validation.title.required')),
    content: Yup.string()
      .min(10, translation('validation.content.min', { min: 10 }))
      .max(200, translation('validation.content.max', { max: 200 }))
      .required(translation('validation.content.required'))
  })

export { getFormUserSchema, getFormNoteSchema }
