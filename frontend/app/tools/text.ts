import { Type } from '@lucide/vue'
import StickyNote from '~/components/StickyNote.vue'
import { TEXT_COLORS } from '~/types/note'
import { snapToGrid } from '~/utils/grid'
import type { ToolDefinition } from './types'

export const textTool: ToolDefinition = {
  id: 'text',
  label: 'Text',
  icon: Type,
  component: StickyNote,
  attributes: [
    {
      key: 'color',
      label: 'Text color',
      type: 'color',
      default: TEXT_COLORS[0]!,
      options: TEXT_COLORS.map(color => ({ value: color, label: color })),
    },
  ],
  create(point, settings) {
    const width = 240
    const height = 72
    return {
      kind: 'text',
      shape: 'square',
      color: settings.color!,
      x: snapToGrid(point.x - width / 2),
      y: snapToGrid(point.y - height / 2),
      width,
      height,
      text: '',
    }
  },
}
