import type { Ref } from 'vue'
import { GRID_SIZE } from '~/utils/grid'

export interface ShortcutContext {
  board: ReturnType<typeof useBoard>
  activeToolId: Ref<string | null>
}

export interface Shortcut {
  // KeyboardEvent.key values; letters in lower case.
  keys: string[]
  // ⌘ on macOS, Ctrl elsewhere.
  mod?: boolean
  label: string
  run(context: ShortcutContext): void
}

// Runs an action on the selected object, if there is one.
function onSelected(action: (board: ShortcutContext['board'], id: number) => void) {
  return ({ board }: ShortcutContext) => {
    const id = board.selectedId.value
    if (id !== null) action(board, id)
  }
}

function moveSelected(dx: number, dy: number) {
  return onSelected((board, id) => board.moveBy(id, dx, dy))
}

// All keyboard shortcuts of the board. Add new ones here.
export const SHORTCUTS: Shortcut[] = [
  { keys: ['c'], mod: true, label: 'Copy', run: onSelected((board, id) => board.copy(id)) },
  { keys: ['x'], mod: true, label: 'Cut', run: onSelected((board, id) => board.cut(id)) },
  { keys: ['v'], mod: true, label: 'Paste', run: ({ board }) => board.paste() },
  { keys: ['d'], mod: true, label: 'Duplicate', run: onSelected((board, id) => board.duplicate(id)) },
  { keys: ['Backspace', 'Delete'], label: 'Delete', run: onSelected((board, id) => board.removeNote(id)) },
  {
    keys: ['Escape'],
    label: 'Cancel tool / deselect',
    run: ({ board, activeToolId }) => {
      if (activeToolId.value) activeToolId.value = null
      else board.select(null)
    },
  },
  { keys: ['ArrowLeft'], label: 'Move left', run: moveSelected(-GRID_SIZE, 0) },
  { keys: ['ArrowRight'], label: 'Move right', run: moveSelected(GRID_SIZE, 0) },
  { keys: ['ArrowUp'], label: 'Move up', run: moveSelected(0, -GRID_SIZE) },
  { keys: ['ArrowDown'], label: 'Move down', run: moveSelected(0, GRID_SIZE) },
]
