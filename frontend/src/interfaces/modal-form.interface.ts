import type { TFunction } from 'i18next'
import type ActionModal from './action-modal.interface'
import type Note from './note.interface'

interface ModalForm extends Omit<ActionModal, 'onConfirm'> {
  onConfirm: (note: Note) => void
  translation: TFunction
  note: Note
}

export default ModalForm
