import { Modal, Box, Typography, Stack, Button, TextField } from '@mui/material'
import type ModalFormProps from '../interfaces/modal-form-props.interface'
import { getFormNoteSchema } from '../utils/validationsSchemas'
import type NoteForm from '../interfaces/note-form.interface'
import { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'

const style = {
  top: '50%',
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  border: '2px solid transparent',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  width: 400,
  p: 2
}

const ModalForm = ({ modalForm, resetModalForm }: ModalFormProps) => {
  const { title, visible, confirm, cancel, onConfirm, translation, note, serverNote } = modalForm

  const [initialValues, setInitialValues] = useState<NoteForm>({
    title: note.title,
    content: note.content
  })

  useEffect(() => {
    setInitialValues({
      title: note.title,
      content: note.content
    })
  }, [note])

  const handleOnSubmit = (values: NoteForm) => {
    if (serverNote) {
      const mergedNote = {
        title: values.title || serverNote.title,
        content: values.content || serverNote.content,
        updated_at: serverNote.updated_at
      }

      onConfirm({ ...note, ...mergedNote })
    } else {
      onConfirm({ ...note, ...values })
    }
  }

  const handleOnClose = () => {
    resetModalForm()
  }

  const validationSchema = getFormNoteSchema(translation)

  return (
    <Modal
      open={visible}
      onClose={handleOnClose}
      aria-labelledby="modal-form-title"
      aria-describedby="modal-form-description"
    >
      <Box sx={style}>
        <Typography id="modal-form-title" variant="h6" sx={{ wordBreak: 'break-word' }}>
          {title}
        </Typography>

        {serverNote && (
          <Stack gap={3} mt={3}>
            <Typography variant="body2" color="textSecondary">
              <strong>{translation('indicators.serverVersion')}:</strong>
            </Typography>

            <Box>
              <TextField
                fullWidth
                id="server-title"
                label={translation('labels.title')}
                value={serverNote.title}
                variant="standard"
                name="title"
                type="text"
                disabled
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                multiline
                id="server-content"
                label={translation('labels.content')}
                value={serverNote.content}
                variant="standard"
                name="content"
                disabled
              />
            </Box>
          </Stack>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleOnSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, touched, values, errors }) => (
            <Form>
              <Stack gap={3} mt={3}>
                {serverNote && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translation('indicators.localVersion')}:</strong>
                  </Typography>
                )}

                <Box>
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

                  {touched.title && errors.title && (
                    <Typography variant="body1" color="error">
                      {errors.title}
                    </Typography>
                  )}
                </Box>

                <Box>
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
                </Box>
              </Stack>

              <Stack flexDirection="row" alignItems="center" justifyContent="center" mt={5} gap={2}>
                <Button type="submit" variant="contained" color="primary" size="medium">
                  {confirm}
                </Button>
                <Button variant="outlined" color="error" size="medium" onClick={handleOnClose}>
                  {cancel}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}

export default ModalForm
