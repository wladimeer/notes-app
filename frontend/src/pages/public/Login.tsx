import { useUserStore } from '../../store/user'
import { ToastContainer, toast } from 'react-toastify'
import { RESPONSE_TYPE } from '../../constants/response'
import InformationModal from '../../components/InformationModal'
import { Card, CardContent, Container, Stack } from '@mui/material'
import useInformationModal from '../../hooks/useInformationModal'
import type UserForm from '../../interfaces/user-form.interface'
import { TextField, Button, Typography } from '@mui/material'
import User from '../../interfaces/user.interface'
import { useNavigate, Link } from 'react-router'
import { PAGE_KEY } from '../../constants/page'
import { useTranslation } from 'react-i18next'
import { signIn } from '../../services/auth'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

const Login = () => {
  const [translation] = useTranslation(PAGE_KEY.LOGIN_PAGE)
  const { informationModal, setInformationModal, resetInformationModal } = useInformationModal()
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const initialValues: UserForm = {
    username: '',
    password: ''
  }

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, translation('validation.username.min'))
      .required(translation('validation.username.required')),
    password: Yup.string()
      .min(4, translation('validation.password.min'))
      .required(translation('validation.password.required'))
  })

  const handleOnSubmit = async (values: UserForm) => {
    const response = await signIn(values.username, values.password)

    if (response.status === RESPONSE_TYPE.SUCCESS) {
      setInformationModal({
        title: translation('page.title'),
        message: translation('indicators.loggingIn'),
        visible: true,
        loading: true
      })

      setUser(response.data as User)

      setTimeout(() => {
        navigate('/')
      }, 1500)
    }

    if (response.status === RESPONSE_TYPE.ERROR) {
      toast(response.message, { type: 'warning' })
    }

    if (response.status === RESPONSE_TYPE.EXCEPTION) {
      toast(response.message, { type: 'error' })
    }
  }

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <InformationModal {...{ informationModal, resetInformationModal }} />
      <ToastContainer />

      <Card
        variant="elevation"
        sx={{
          width: 350,
          justifyContent: 'center',
          borderRadius: 3,
          padding: 1
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="600" align="center">
            {translation('page.title')}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {({ handleChange, handleBlur, isSubmitting, touched, values, errors }) => (
              <Form>
                <Stack justifyContent="center" gap={3} my={3}>
                  <TextField
                    fullWidth
                    id="username-input"
                    placeholder={translation('placeholders.username')}
                    label={translation('labels.username')}
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    name="username"
                    type="text"
                  />

                  {touched.username && errors.username && (
                    <Typography variant="body1" color="error">
                      {errors.username}
                    </Typography>
                  )}

                  <TextField
                    fullWidth
                    id="password-input"
                    placeholder={translation('placeholders.password')}
                    label={translation('labels.password')}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    name="password"
                    type="password"
                  />

                  {touched.password && errors.password && (
                    <Typography variant="body1" color="error">
                      {errors.password}
                    </Typography>
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ marginTop: 3 }}
                    size="medium"
                  >
                    {translation('buttons.login')}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

          <Stack justifyContent="center" gap={5} mb={5}>
            <Typography variant="body1" align="center">
              {translation('page.description')}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
            <Typography variant="body1">{translation('indicators.noAccount')}</Typography>

            <Button component={Link} to="/register" sx={{ textTransform: 'capitalize' }}>
              {translation('buttons.register')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
