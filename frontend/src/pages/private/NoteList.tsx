import { useTranslation } from 'react-i18next'
import { useUserStore } from '../../store/user'
import type Note from '../../interfaces/note.interface'
import { RESPONSE_TYPE } from '../../constants/response'
import InformationModal from '../../components/InformationModal'
import useInformationModal from '../../hooks/useInformationModal'
import useConflictResolutionModal from '../../hooks/useConflictResolutionModal'
import { Card, CardContent, Container, Typography, Stack, List } from '@mui/material'
import { TextField, Button, ListItemText, ListSubheader, ListItem } from '@mui/material'
import { getNotes, createNote, deleteNote, updateNote, findNote } from '../../services/note'
import ConflictResolutionModal from '../../components/ConflictResolutionModal'
import { getFormNoteSchema } from '../../utils/validationsSchemas'
import type NoteForm from '../../interfaces/note-form.interface'
import { cancelPendingRequests } from '../../services/note'
import useActionModal from '../../hooks/useActionModal'
import { ToastContainer, toast } from 'react-toastify'
import ActionModal from '../../components/ActionModal'
import { Form, Formik, FormikHelpers } from 'formik'
import { ROUTE_CONFIG } from '../../constants/route'
import useModalForm from '../../hooks/useModalForm'
import ModalForm from '../../components/ModalForm'
import { LinearProgress } from '@mui/material'
import { PAGE_KEY } from '../../constants/page'
import { signOut } from '../../services/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const style = {
  width: '100%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  overflow: 'auto',
  maxHeight: 250
}

const NoteList = () => {
  const [translation] = useTranslation(PAGE_KEY.NOTE_PAGE)
  const { conflictResolutionModal, setConflictResolutionModal, resetConflictResolutionModal } =
    useConflictResolutionModal()
  const { informationModal, setInformationModal, resetInformationModal } = useInformationModal()
  const { actionModal, setActionModal, resetActionModal } = useActionModal()
  const { modalForm, setModalForm, resetModalForm } = useModalForm()
  const removeUser = useUserStore((state) => state.removeUser)
  const [loading, setLoading] = useState<boolean>(true)
  const [notes, setNotes] = useState<Note[]>([])
  const navigate = useNavigate()

  const initialValues: NoteForm = {
    title: '',
    content: ''
  }

  const validationSchema = getFormNoteSchema(translation)

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

  const handleOnUpdate = (note: Note) => {
    setModalForm({
      title: translation('indicators.updatedOf', { title: note.title }),
      visible: true,
      confirm: translation('buttons.updateNote'),
      cancel: translation('buttons.cancel'),
      onConfirm: (updatedNote?: Note) => {
        if (updatedNote) {
          handleUpdate(updatedNote)
        }
      },
      translation,
      note
    })
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

  const handleUpdate = async (note: Note) => {
    const response = await updateNote(note.id, note)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      toast(response.message, { type: 'success' })
      resetModalForm()
      loadNotes()
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }

    if (response.status === RESPONSE_TYPE.CONFLICT) {
      setConflictResolutionModal({
        title: translation('indicators.updateConflict'),
        visible: true,
        translation: translation,
        onReload: () => reloadNote(note),
        onMerge: () => mergeChanges(note),
        onRetry: () => retryUpdate(note)
      })
    }
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

  const handleLogout = async () => {
    const response = await signOut()

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      setInformationModal({
        title: translation('page.title'),
        message: translation('indicators.sessionClosed'),
        visible: true,
        loading: true
      })

      setTimeout(() => {
        removeUser()
        navigate(ROUTE_CONFIG.LOGIN)
      }, 2500)
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }
  }

  const reloadNote = async (note: Note) => {
    const response = await findNote(note.id)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      const note = response.data as Note

      loadNotes()

      setModalForm({
        title: translation('indicators.updatedOf', { title: note.title }),
        visible: true,
        confirm: translation('buttons.updateNote'),
        cancel: translation('buttons.cancel'),
        onConfirm: (updatedNote?: Note) => {
          if (updatedNote) {
            handleUpdate(updatedNote)
          }
        },
        translation,
        note
      })

      toast(translation('indicators.noteReloaded'), { type: 'info' })
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }

    resetConflictResolutionModal()
  }

  const retryUpdate = (note: Note) => {
    handleUpdate(note)
    resetConflictResolutionModal()
  }

  const mergeChanges = async (note: Note) => {
    const response = await findNote(note.id)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      const serverNote = response.data as Note

      setModalForm({
        title: translation('indicators.mergeChanges'),
        visible: true,
        confirm: translation('buttons.updateNote'),
        cancel: translation('buttons.cancel'),
        onConfirm: (mergedNote?: Note) => {
          if (mergedNote) {
            handleUpdate(mergedNote)
          }
        },
        translation,
        note: note,
        serverNote: serverNote
      })
    }

    resetConflictResolutionModal()
  }

  const loadNotes = async () => {
    const response = await getNotes()

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      setNotes(response.data as Note[])
      setLoading(false)
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }
  }

  useEffect(() => {
    cancelPendingRequests()
    loadNotes()

    return () => {
      cancelPendingRequests()
    }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <ConflictResolutionModal {...{ conflictResolutionModal, resetConflictResolutionModal }} />
      <InformationModal {...{ informationModal, resetInformationModal }} />
      <ActionModal {...{ actionModal, resetActionModal }} />
      <ModalForm {...{ modalForm, resetModalForm }} />

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
          <Stack flexDirection="row" justifyContent="space-between" gap={1} mb={5}>
            <Typography variant="h4" fontWeight="600" align="left">
              {translation('page.title')}
            </Typography>

            <Button
              fullWidth={false}
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleLogout}
            >
              {translation('buttons.signOut')}
            </Button>
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
                    type="text"
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
              <ListItem sx={{ px: 0, paddingRight: 1 }} key={note.id} divider>
                <ListItemText
                  sx={{ wordBreak: 'break-word', textWrap: 'pretty', hyphens: 'auto' }}
                  primary={note.title}
                  secondary={note.content}
                />
                <Stack direction="column" spacing={1} ml={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleOnUpdate(note)}
                  >
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
