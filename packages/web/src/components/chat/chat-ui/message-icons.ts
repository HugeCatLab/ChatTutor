import {
  faStickyNote,
  faDiagramProject,
  faCalculator,
  faFile,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { ClientMessage } from '@chat-tutor/shared'

export const messageIcons: Record<ClientMessage['type'], IconDefinition | null> = {
  'user': null,
  'agent': null,
  'note': faStickyNote,
  'mermaid': faDiagramProject,
  'ggb': faCalculator,
  'page-create': faFile,
  'plan': faListCheck,
  'error': null,
}

