import { Modal, Box, Typography, Stack, Button } from '@mui/material'
import type ActionModalProps from '../interfaces/action-modal-props.interface'
import type ActionModal from '../interfaces/action-modal.interface'

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

const ActionModal = ({ actionModal, resetActionModal }: ActionModalProps) => {
  const { title, visible, confirm, cancel, onConfirm } = actionModal

  const handleOnClose = () => {
    resetActionModal()
  }

  return (
    <>
      <Modal
        open={visible}
        onClose={handleOnClose}
        aria-labelledby="information-modal-title"
        aria-describedby="information-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="information-modal-title"
            variant="h6"
            component="h2"
            sx={{ wordBreak: 'break-word' }}
          >
            {title}
          </Typography>

          <Stack flexDirection="row" alignItems="center" justifyContent="center" mt={5} gap={2}>
            <Button variant="contained" color="primary" size="medium" onClick={onConfirm}>
              {confirm}
            </Button>
            <Button variant="outlined" color="error" size="medium" onClick={handleOnClose}>
              {cancel}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}

export default ActionModal
