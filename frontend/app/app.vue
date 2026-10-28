<script setup lang="ts">
import { defaultSettings, findTool } from '~/tools'

const board = useBoard()

const activeToolId = ref<string | null>(null)
const settings = ref(defaultSettings())

const canvas = useTemplateRef('canvas')

function onCanvasPointerDown(event: PointerEvent) {
  if (!activeToolId.value || !canvas.value) {
    board.select(null)
    return
  }
  // Keeps the browser from moving focus away from the new item's textarea.
  event.preventDefault()
  const tool = findTool(activeToolId.value)
  const point = canvas.value.toCanvasPoint(event.clientX, event.clientY)
  board.addNote(tool.create(point, settings.value[tool.id]!))
  activeToolId.value = null
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') activeToolId.value = null
  // Delete/Backspace while typing edits text instead of removing the note.
  const typing = event.target instanceof HTMLElement && (event.target.isContentEditable || event.target instanceof HTMLInputElement)
  const selected = board.selectedId.value
  if ((event.key === 'Delete' || event.key === 'Backspace') && !typing && selected !== null) {
    board.removeNote(selected)
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <InfiniteCanvas ref="canvas" :placing="activeToolId !== null" @pointerdown="onCanvasPointerDown">
    <component
      :is="findTool(note.kind).component"
      v-for="note in board.notes.value"
      :key="note.id"
      :note="note"
      :selected="board.selectedId.value === note.id"
      :editing="board.editingId.value === note.id"
      @select="board.select(note.id)"
      @update="board.updateNote(note.id, $event)"
      @remove="board.removeNote(note.id)"
      @start-editing="board.startEditing(note.id)"
      @stop-editing="board.stopEditing()"
    />
  </InfiniteCanvas>
  <Toolbar v-model:active-tool-id="activeToolId" v-model:settings="settings" />
</template>
