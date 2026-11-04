export type NoteKind = 'note' | 'text' | 'shape'
export type NoteShape = 'square' | 'rounded' | 'circle' | 'arrow' | 'rectangle' | 'diamond' | 'ellipse'

export interface Note {
  id: number
  kind: NoteKind
  shape: NoteShape
  // Paper color for notes, font color for text, fill color for shapes.
  color: string
  x: number
  y: number
  width: number
  height: number
  text: string
  // Optional attributes: an object only has them (and their editors) if its tool sets them.
  fontSize?: number
  bold?: boolean
  borderColor?: string
  borderWidth?: number
}

export const NOTE_COLORS = ['#fde68a', '#fdba74', '#f9a8d4', '#c4b5fd', '#93c5fd', '#86efac']
export const TEXT_COLORS = ['#1f2937', '#6b7280', '#dc2626', '#2563eb', '#16a34a', '#9333ea']
export const SHAPE_FILLS = ['#ffffff', '#dbeafe', '#dcfce7', '#fef9c3', '#fce7f3', '#f3f4f6']
export const BORDER_COLORS = ['#374151', '#2563eb', '#16a34a', '#ea580c', '#dc2626', '#9333ea']
export const BORDER_WIDTHS = [1, 2, 4]
export const FONT_SIZES = [14, 18, 24, 32]
export const DEFAULT_FONT_SIZE = 18
