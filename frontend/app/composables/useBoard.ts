import { NOTE_COLORS } from '~/types/note'
import type { Note } from '~/types/note'

// Single source of truth for everything on the board. Components only read
// this state and report changes; all writes go through the actions below.
export function useBoard() {
  const notes = useState<Note[]>('board-notes', () => [
    { id: 1, kind: 'note', shape: 'square', color: NOTE_COLORS[0]!, x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!' },
  ])
  const selectedId = useState<number | null>('board-selected', () => null)
  const editingId = useState<number | null>('board-editing', () => null)

  // New items are selected and opened for typing right away.
  function addNote(fields: Omit<Note, 'id'>) {
    const id = Math.max(0, ...notes.value.map(note => note.id)) + 1
    notes.value.push({ id, ...fields })
    selectedId.value = id
    editingId.value = id
  }

  function updateNote(id: number, patch: Partial<Note>) {
    const note = notes.value.find(note => note.id === id)
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
  }
}
