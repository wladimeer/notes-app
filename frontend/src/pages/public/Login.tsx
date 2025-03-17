import { Card, CardContent, Container, Stack } from '@mui/material'
import { TextField, Button, Link, Typography } from '@mui/material'
import { PAGE_KEY } from '../../constants/page'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const [translation] = useTranslation(PAGE_KEY.LOGIN_PAGE)

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
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
          <Typography variant="h4" fontWeight="600" align="center" marginBottom={3}>
            {translation('page.title')}
          </Typography>

          <Stack justifyContent="center" gap={3} marginBottom={5}>
            <TextField
              fullWidth
              id="username-input"
              placeholder={translation('placeholders.username')}
              label={translation('labels.username')}
              variant="standard"
              size="medium"
              type="text"
            />

            <TextField
              fullWidth
              id="password-input"
              placeholder={translation('placeholders.password')}
              label={translation('labels.password')}
              variant="standard"
              size="medium"
              type="password"
            />
          </Stack>

          <Stack justifyContent="center" gap={5} marginBottom={5}>
            <Button fullWidth size="medium" variant="contained" onClick={handleClick}>
              {translation('buttons.login')}
            </Button>

            <Typography variant="body1" align="center">
              {translation('page.description')}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
            <Typography variant="body1">{translation('indicators.noAccount')}</Typography>
            <Link component="button" variant="body1" underline="none">
              {translation('buttons.register')}
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
