import type { Component } from 'vue'
import BoldEditor from '~/components/editors/BoldEditor.vue'
import BorderEditor from '~/components/editors/BorderEditor.vue'
import ColorEditor from '~/components/editors/ColorEditor.vue'
import FontSizeEditor from '~/components/editors/FontSizeEditor.vue'
import type { Note } from '~/types/note'

export interface EditorDefinition {
  // The editor only shows for objects that have this attribute.
  key: keyof Note
  // Props: note, tool. Emits: update(patch).
  component: Component
}

// Which editor belongs to which attribute, in selection-bar order.
export const EDITORS: EditorDefinition[] = [
  { key: 'color', component: ColorEditor },
  { key: 'borderColor', component: BorderEditor },
  { key: 'fontSize', component: FontSizeEditor },
  { key: 'bold', component: BoldEditor },
]
