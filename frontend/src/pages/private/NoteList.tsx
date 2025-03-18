import { useTranslation } from 'react-i18next'
import type Note from '../../interfaces/note.interface'
import { RESPONSE_TYPE } from '../../constants/response'
import { Card, CardContent, Container, Typography, Stack, List } from '@mui/material'
import { TextField, Button, ListItemText, ListSubheader, ListItem } from '@mui/material'
import { getNotes, createNote, deleteNote } from '../../services/note'
import ActionModal from '../../components/ActionModal'
import type NoteForm from '../../interfaces/note-form.interface'
import useActionModal from '../../hooks/useActionModal'
import { ToastContainer, toast } from 'react-toastify'
import { Form, Formik, FormikHelpers } from 'formik'
import { LinearProgress } from '@mui/material'
import { PAGE_KEY } from '../../constants/page'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

const style = {
  width: '100%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  overflow: 'auto',
  maxHeight: 250
}

const NoteList = () => {
  const [translation] = useTranslation(PAGE_KEY.NOTE_PAGE)
  const { actionModal, setActionModal, resetActionModal } = useActionModal()
  const [loading, setLoading] = useState<boolean>(true)
  const [notes, setNotes] = useState<Note[]>([])

  const initialValues: NoteForm = {
    title: '',
    content: ''
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, translation('validation.title.min', { min: 5 }))
      .required(translation('validation.title.required')),
    content: Yup.string()
      .min(10, translation('validation.content.min', { min: 10 }))
      .required(translation('validation.content.required'))
  })

  const handleOnSubmit = async (values: NoteForm, { resetForm }: FormikHelpers<NoteForm>) => {
    const response = await createNote(values)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      toast(response.message, { type: 'success' })
      resetForm()
      loadNotes()
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }
  }

  const handleOnDelete = (note: Note) => {
    setActionModal({
      title: translation('confirmation.deleteNote', { title: note.title }),
      visible: true,
      confirm: translation('buttons.yesContinue'),
      cancel: translation('buttons.cancel'),
      onConfirm: () => handleDelete(note)
    })
  }

  const handleDelete = async (note: Note) => {
    const response = await deleteNote(note.id)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      toast(response.message, { type: 'success' })
      resetActionModal()
      loadNotes()
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }
  }

  const loadNotes = async () => {
    const response = await getNotes()

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      setNotes(response.data as Note[])
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <ActionModal {...{ actionModal, resetActionModal }} />
      <ToastContainer />

      <Card
        variant="elevation"
        sx={{
          width: 700,
          justifyContent: 'center',
          borderRadius: 3,
          padding: 1
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="600" align="center">
            {translation('page.title')}
          </Typography>

          <Stack justifyContent="center" gap={5} mb={5}>
            <Typography variant="body1" align="center">
              {translation('page.description')}
            </Typography>
          </Stack>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {({ handleChange, handleBlur, isSubmitting, touched, values, errors }) => (
              <Form>
                <Stack
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={3}
                  mt={3}
                >
                  <TextField
                    fullWidth
                    id="title-input"
                    placeholder={translation('placeholders.title')}
                    label={translation('labels.title')}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    name="title"
                    type="text"
                    tabIndex={1}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ marginTop: 3, width: 200 }}
                    size="small"
                    tabIndex={-1}
                  >
                    {translation('buttons.addNote')}
                  </Button>
                </Stack>

                {touched.title && errors.title && (
                  <Typography variant="body1" color="error">
                    {errors.title}
                  </Typography>
                )}

                <Stack my={2}>
                  <TextField
                    fullWidth
                    multiline
                    id="content-input"
                    placeholder={translation('placeholders.content')}
                    label={translation('labels.content')}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    name="content"
                    type="content"
                    tabIndex={2}
                  />

                  {touched.content && errors.content && (
                    <Typography variant="body1" color="error">
                      {errors.content}
                    </Typography>
                  )}
                </Stack>
              </Form>
            )}
          </Formik>

          <List
            sx={style}
            subheader={
              <ListSubheader sx={{ px: 0 }}>
                {loading ? (
                  <>
                    {translation('indicators.loadingNotes')}
                    <LinearProgress color="primary" />
                  </>
                ) : notes?.length > 0 ? (
                  translation('indicators.notesListTitle')
                ) : (
                  translation('indicators.noData')
                )}
              </ListSubheader>
            }
          >
            {notes?.map((note) => (
              <ListItem sx={{ px: 0 }} key={note.id} divider>
                <ListItemText
                  sx={{ textWrap: 'pretty', hyphens: 'auto' }}
                  primary={note.title}
                  secondary={note.content}
                />
                <Stack direction="column" spacing={1} ml={1}>
                  <Button variant="outlined" color="primary" size="small">
                    {translation('buttons.updateNote')}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleOnDelete(note)}
                  >
                    {translation('buttons.deleteNote')}
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  )
}

export default NoteList
