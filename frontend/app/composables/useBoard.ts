import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
// This is also the only place that talks to the backend: changes are applied locally first, then sent.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  async function load() {
    try {
      objects.value = await $fetch<BoardObject[]>('/api/objects')
    }
    catch (error) {
      console.error(error)
    }
  }

  // If the backend rejects a change, the local state is out of sync, so reload it from the backend.
  async function send<T>(request: () => Promise<T>) {
    try {
      return await request()
    }
    catch (error) {
      console.error(error)
      await load()
    }
  }

  // The backend assigns the id, so the object only appears once the backend has answered.
  async function create(fields: Omit<BoardObject, 'id'>) {
    const object = await send(() => $fetch<BoardObject>('/api/objects', { method: 'POST', body: fields }))
    if (!object) return
    objects.value = [...objects.value, object]
    return object.id
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    return create({ ...defaults, ...template, x, y } as Omit<BoardObject, 'id'>)
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const { id: _, ...fields } = source
    return create(fields)
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    send(() => $fetch(`/api/objects/${id}`, { method: 'DELETE' }))
  }

  function updateObject(id: string, changes: Partial<Rect> & StyleChanges & { text?: string }) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
  }

  // Sends the current state of an object. Used after changes that happen in many small steps (dragging, typing).
  function saveObject(id: string) {
    const object = objects.value.find(object => object.id === id)
    if (!object) return
    const { id: _, ...fields } = object
    send(() => $fetch(`/api/objects/${id}`, { method: 'PATCH', body: fields }))
  }

  // Local only: the caller saves once the gesture or the editing is over.
  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
    send(() => $fetch(`/api/objects/${id}`, { method: 'PATCH', body: changes }))
  }

  return { objects: readonly(objects), load, addObject, addCopy, removeObject, saveObject, moveObject, resizeObject, updateText, updateStyle }
}
