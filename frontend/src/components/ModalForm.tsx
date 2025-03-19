import { Modal, Box, Typography, Stack, Button, TextField } from '@mui/material'
import type ModalFormProps from '../interfaces/modal-form-props.interface'
import type NoteForm from '../interfaces/note-form.interface'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

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
  const { title, visible, confirm, cancel, onConfirm, translation, note } = modalForm

  const initialValues: NoteForm = {
    title: note.title,
    content: note.content
  }

  const handleOnSubmit = (values: NoteForm) => {
    note.title = values.title
    note.content = values.content

    onConfirm(note)
  }

  const handleOnClose = () => {
    resetModalForm()
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, translation('validation.title.min', { min: 5 }))
      .max(50, translation('validation.title.max', { max: 50 }))
      .required(translation('validation.title.required')),
    content: Yup.string()
      .min(10, translation('validation.content.min', { min: 10 }))
      .max(200, translation('validation.content.max', { max: 200 }))
      .required(translation('validation.content.required'))
  })

  return (
    <>
      <Modal
        open={visible}
        onClose={handleOnClose}
        aria-labelledby="modal-form-title"
        aria-describedby="modal-form-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-form-title"
            variant="h6"
            component="h2"
            sx={{ wordBreak: 'break-word' }}
          >
            {title}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {({ handleChange, handleBlur, isSubmitting, touched, values, errors }) => (
              <Form>
                <Stack gap={3} mt={3}>
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
                      type="content"
                      tabIndex={2}
                    />

                    {touched.content && errors.content && (
                      <Typography variant="body1" color="error">
                        {errors.content}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  mt={5}
                  gap={2}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    size="medium"
                  >
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
    </>
  )
}

export default ModalForm
