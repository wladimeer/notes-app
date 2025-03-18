interface ActionModal {
  title: string
  visible: boolean
  confirm: string
  cancel: string
  onConfirm: () => void
}

export default ActionModal
