import { Link } from 'react-router'
import { useUserStore } from '../../store/user'
import { Divider, Button, Container, Stack, Typography, Box } from '@mui/material'
import { PAGE_KEY } from '../../constants/page'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const [translation] = useTranslation(PAGE_KEY.NOT_FOUND_PAGE)
  const { isUserValid } = useUserStore()

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack
        gap={5}
        sx={{
          width: 350,
          justifyContent: 'center',
          borderRadius: 3,
          padding: 1
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="600" align="center" mb={1}>
            {translation('page.title')}
          </Typography>
          <Divider />
          <Typography variant="body1" align="center" mt={3}>
            {translation('page.description')}
          </Typography>
        </Box>

        {isUserValid() ? (
          <Button component={Link} to="/">
            {translation('buttons.toHome')}
          </Button>
        ) : (
          <Button component={Link} to="/login">
            {translation('buttons.login')}
          </Button>
        )}
      </Stack>
    </Container>
  )
}

export default NotFound
