import type { TFunction } from 'i18next'

interface ConflictResolutionModal {
  title: string
  visible: boolean
  translation: TFunction
  onReload: () => void
  onMerge: () => void
  onRetry: () => void
}

export default ConflictResolutionModal
