import { Circle, Diamond, Shapes, Square, SquareRoundCorner } from '@lucide/vue'
import FlowShape from '~/components/FlowShape.vue'
import { BORDER_COLORS, DEFAULT_FONT_SIZE, SHAPE_FILLS } from '~/types/note'
import type { NoteShape } from '~/types/note'
import { snapToGrid } from '~/utils/grid'
import type { ToolDefinition } from './types'

export const shapeTool: ToolDefinition = {
  id: 'shape',
  label: 'Shape',
  icon: Shapes,
  component: FlowShape,
  attributes: [
    {
      key: 'shape',
      label: 'Shape type',
      type: 'icon',
      default: 'rectangle',
      options: [
        { value: 'rectangle', label: 'Rectangle', icon: Square },
        { value: 'rounded', label: 'Rounded rectangle', icon: SquareRoundCorner },
        { value: 'diamond', label: 'Diamond', icon: Diamond },
        { value: 'ellipse', label: 'Ellipse', icon: Circle },
      ],
    },
    {
      key: 'color',
      label: 'Shape fill',
      type: 'color',
      default: SHAPE_FILLS[0]!,
      options: SHAPE_FILLS.map(color => ({ value: color, label: color })),
    },
    {
      key: 'borderColor',
      label: 'Shape border',
      type: 'color',
      default: BORDER_COLORS[0]!,
      options: BORDER_COLORS.map(color => ({ value: color, label: color })),
    },
  ],
  create(point, settings) {
    const shape = settings.shape as NoteShape
    const [width, height] = shape === 'diamond' ? [192, 144] : [192, 120]
    return {
      kind: 'shape',
      shape,
      color: settings.color!,
      borderColor: settings.borderColor!,
      borderWidth: 2,
      fontSize: DEFAULT_FONT_SIZE,
      bold: false,
      x: snapToGrid(point.x - width / 2),
      y: snapToGrid(point.y - height / 2),
      width,
      height,
      text: '',
    }
  },
}
