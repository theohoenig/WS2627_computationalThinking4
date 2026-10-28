export type NoteKind = 'note' | 'text'
export type NoteShape = 'square' | 'rounded' | 'circle' | 'arrow'

export interface Note {
  id: number
  kind: NoteKind
  shape: NoteShape
  // Paper color for notes, font color for text.
  color: string
  x: number
  y: number
  width: number
  height: number
  text: string
}

export const NOTE_COLORS = ['#fde68a', '#fdba74', '#f9a8d4', '#c4b5fd', '#93c5fd', '#86efac']
export const TEXT_COLORS = ['#1f2937', '#6b7280', '#dc2626', '#2563eb', '#16a34a', '#9333ea']
