import { ArrowBigRight, Circle, Square, SquareRoundCorner, StickyNote as StickyNoteIcon } from '@lucide/vue'
import StickyNote from '~/components/StickyNote.vue'
import { NOTE_COLORS } from '~/types/note'
import type { NoteShape } from '~/types/note'
import { snapToGrid } from '~/utils/grid'
import type { ToolDefinition } from './types'

export const noteTool: ToolDefinition = {
  id: 'note',
  label: 'Post-it',
  icon: StickyNoteIcon,
  component: StickyNote,
  attributes: [
    {
      key: 'shape',
      label: 'Post-it shape',
      type: 'icon',
      default: 'square',
      options: [
        { value: 'square', label: 'Square', icon: Square },
        { value: 'rounded', label: 'Rounded square', icon: SquareRoundCorner },
        { value: 'circle', label: 'Circle', icon: Circle },
        { value: 'arrow', label: 'Arrow', icon: ArrowBigRight },
      ],
    },
    {
      key: 'color',
      label: 'Post-it color',
      type: 'color',
      default: NOTE_COLORS[0]!,
      options: NOTE_COLORS.map(color => ({ value: color, label: color })),
    },
  ],
  create(point, settings) {
    const shape = settings.shape as NoteShape
    const [width, height] = shape === 'arrow' ? [240, 144] : [192, 192]
    return {
      kind: 'note',
      shape,
      color: settings.color!,
      x: snapToGrid(point.x - width / 2),
      y: snapToGrid(point.y - height / 2),
      width,
      height,
      text: '',
    }
  },
}
