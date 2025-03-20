import { Modal, Box, Typography, Stack, Button } from '@mui/material'
import type ConflictResolutionModalProps from '../interfaces/conflict-resolution-modal-props.interface'

const ConflictResolutionModal = ({
  conflictResolutionModal,
  resetConflictResolutionModal
}: ConflictResolutionModalProps) => {
  const { title, visible, translation, onReload, onMerge, onRetry } = conflictResolutionModal

  const handleOnClose = () => {
    resetConflictResolutionModal()
  }

  return (
    <Modal open={visible} onClose={handleOnClose}>
      <Box
        sx={{
          top: '50%',
          left: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          width: 400,
          p: 3
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {translation('indicators.recentNoteModification')}
        </Typography>

        <Stack spacing={2} mt={3}>
          <Button variant="contained" onClick={onReload} color="primary">
            {translation('buttons.reloadNote')}
          </Button>

          <Button variant="contained" onClick={onMerge} color="secondary">
            {translation('buttons.mergeChanges')}
          </Button>

          <Button variant="contained" onClick={onRetry} color="success">
            {translation('buttons.retryUpdate')}
          </Button>

          <Button variant="outlined" onClick={handleOnClose} color="error">
            {translation('buttons.cancel')}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default ConflictResolutionModal
