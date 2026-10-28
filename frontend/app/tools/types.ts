import type { Component } from 'vue'
import type { Note } from '~/types/note'

export interface ToolOption {
  value: string
  label: string
  icon?: Component
}

// One small attribute button below a tool, e.g. shape or color.
export interface ToolAttribute {
  key: string
  label: string
  type: 'color' | 'icon'
  options: ToolOption[]
  default: string
}

// Attribute key → chosen value.
export type ToolSettings = Record<string, string>

// Everything that makes a tool different; the toolbar and canvas handle the rest.
export interface ToolDefinition {
  // Equals the `kind` of the objects this tool creates.
  id: Note['kind']
  label: string
  icon: Component
  attributes: ToolAttribute[]
  // Draws this tool's objects. Props: note, selected, editing.
  // Emits: select, update(patch), remove, startEditing, stopEditing.
  component: Component
  create(point: { x: number; y: number }, settings: ToolSettings): Omit<Note, 'id'>
}
