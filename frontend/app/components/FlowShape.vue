<script setup lang="ts">
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note; selected: boolean; editing: boolean }>()
const emit = defineEmits<{
  select: []
  update: [patch: Partial<Note>]
  startEditing: []
  stopEditing: []
}>()

// The SVG is sized in px (no viewBox), so corners and strokes never stretch when resizing.
const inset = computed(() => (props.note.borderWidth ?? 0) / 2)
const paint = computed(() => ({
  'fill': props.note.color,
  'stroke': props.note.borderColor,
  'stroke-width': props.note.borderWidth,
  'stroke-linejoin': 'round' as const,
}))

const diamondPoints = computed(() => {
  const { width: w, height: h } = props.note
  const i = inset.value
  return `${w / 2},${i} ${w - i},${h / 2} ${w / 2},${h - i} ${i},${h / 2}`
})

// Keeps the text inside the visible part of each shape.
const contentStyle = computed(() => {
  const { shape, width, height } = props.note
  const factor = shape === 'diamond' ? 0.25 : shape === 'ellipse' ? 0.15 : 0
  const padding = factor ? `${height * factor}px ${width * factor}px` : '12px'
  return { color: '#1f2937', padding }
})
</script>

<template>
  <ObjectFrame
    :note="note"
    :selected="selected"
    :editing="editing"
    @select="emit('select')"
    @update="emit('update', $event)"
    @start-editing="emit('startEditing')"
  >
    <svg class="pointer-events-none absolute inset-0 overflow-visible" :width="note.width" :height="note.height">
      <polygon v-if="note.shape === 'diamond'" :points="diamondPoints" v-bind="paint" />
      <ellipse
        v-else-if="note.shape === 'ellipse'"
        :cx="note.width / 2"
        :cy="note.height / 2"
        :rx="note.width / 2 - inset"
        :ry="note.height / 2 - inset"
        v-bind="paint"
      />
      <rect
        v-else
        :x="inset"
        :y="inset"
        :width="note.width - inset * 2"
        :height="note.height - inset * 2"
        :rx="note.shape === 'rounded' ? 16 : 0"
        v-bind="paint"
      />
    </svg>
    <ObjectText
      :note="note"
      :editing="editing"
      centered
      :box-style="contentStyle"
      @update="emit('update', $event)"
      @stop-editing="emit('stopEditing')"
    />
  </ObjectFrame>
</template>
