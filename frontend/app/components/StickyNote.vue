<script setup lang="ts">
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note; selected: boolean; editing: boolean }>()
const emit = defineEmits<{
  select: []
  update: [patch: Partial<Note>]
  startEditing: []
  stopEditing: []
}>()

const centered = computed(() => props.note.kind === 'note' && (props.note.shape === 'circle' || props.note.shape === 'arrow'))

// Keeps the text inside the visible part of circle and arrow notes.
const contentStyle = computed(() => {
  const { kind, shape, color, width, height } = props.note
  const textColor = kind === 'text' ? color : '#1f2937'
  if (kind === 'note' && shape === 'circle') return { color: textColor, padding: `${height * 0.15}px ${width * 0.15}px` }
  if (kind === 'note' && shape === 'arrow') {
    const vertical = height * 0.15 + 8
    return { color: textColor, padding: `${vertical}px ${width * 0.3 + 8}px ${vertical}px 16px` }
  }
  return { color: textColor, padding: '16px' }
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
    <NotePaper v-if="note.kind === 'note'" :shape="note.shape" :color="note.color" />
    <ObjectText
      :note="note"
      :editing="editing"
      :centered="centered"
      :box-style="contentStyle"
      :placeholder="note.kind === 'text' ? 'Text…' : undefined"
      @update="emit('update', $event)"
      @stop-editing="emit('stopEditing')"
    />
  </ObjectFrame>
</template>
