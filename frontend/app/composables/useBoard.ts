import { DEFAULT_FONT_SIZE, NOTE_COLORS } from '~/types/note'
import type { Note } from '~/types/note'
import { GRID_SIZE } from '~/utils/grid'

type NoteFields = Omit<Note, 'id'>

function withoutId({ id: _id, ...fields }: Note): NoteFields {
  return fields
}

// Single source of truth for everything on the board. Components only read
// this state and report changes; all writes go through the actions below.
export function useBoard() {
  const notes = useState<Note[]>('board-notes', () => [
    {
      id: 1, kind: 'note', shape: 'square', color: NOTE_COLORS[0]!, x: 120, y: 120, width: 192, height: 192,
      text: 'Hello, board!', fontSize: DEFAULT_FONT_SIZE, bold: false,
    },
  ])
  const selectedId = useState<number | null>('board-selected', () => null)
  const editingId = useState<number | null>('board-editing', () => null)
  const clipboard = useState<NoteFields | null>('board-clipboard', () => null)

  // New items are selected and, unless told otherwise, opened for typing right away.
  function addNote(fields: NoteFields, { edit = true } = {}) {
    const id = Math.max(0, ...notes.value.map(note => note.id)) + 1
    notes.value.push({ id, ...fields })
    selectedId.value = id
    editingId.value = edit ? id : null
  }

  function findNote(id: number) {
    return notes.value.find(note => note.id === id)
  }

  function updateNote(id: number, patch: Partial<Note>) {
    const note = findNote(id)
    if (note) Object.assign(note, patch)
  }

  function removeNote(id: number) {
    notes.value = notes.value.filter(note => note.id !== id)
    if (selectedId.value === id) selectedId.value = null
    if (editingId.value === id) editingId.value = null
  }

  function select(id: number | null) {
    selectedId.value = id
    if (editingId.value !== id) editingId.value = null
  }

  function startEditing(id: number) {
    editingId.value = id
  }

  function stopEditing() {
    editingId.value = null
  }

  function copy(id: number) {
    const note = findNote(id)
    if (note) clipboard.value = withoutId(note)
  }

  function cut(id: number) {
    copy(id)
    removeNote(id)
  }

  // Each paste lands one grid step further, so repeated pastes don't stack exactly.
  function paste() {
    if (!clipboard.value) return
    const fields = { ...clipboard.value, x: clipboard.value.x + GRID_SIZE, y: clipboard.value.y + GRID_SIZE }
    clipboard.value = fields
    addNote(fields, { edit: false })
  }

  function duplicate(id: number) {
    const note = findNote(id)
    if (note) addNote({ ...withoutId(note), x: note.x + GRID_SIZE, y: note.y + GRID_SIZE }, { edit: false })
  }

  function moveBy(id: number, dx: number, dy: number) {
    const note = findNote(id)
    if (note) updateNote(id, { x: note.x + dx, y: note.y + dy })
  }

  return {
    notes: readonly(notes),
    selectedId: readonly(selectedId),
    editingId: readonly(editingId),
    addNote,
    updateNote,
    removeNote,
    select,
    startEditing,
    stopEditing,
    copy,
    cut,
    paste,
    duplicate,
    moveBy,
  }
}
