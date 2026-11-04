<script setup lang="ts">
import { SHORTCUTS } from '~/shortcuts'
import { defaultSettings, findTool } from '~/tools'

const board = useBoard()

const activeToolId = ref<string | null>(null)
const settings = ref(defaultSettings())

const canvas = useTemplateRef('canvas')
const selectedNote = computed(() => board.notes.value.find(note => note.id === board.selectedId.value))

useShortcuts(SHORTCUTS, { board, activeToolId })

function onCanvasPointerDown(event: PointerEvent) {
  if (!activeToolId.value || !canvas.value) {
    board.select(null)
    return
  }
  // Keeps the browser from moving focus away from the new item's text.
  event.preventDefault()
  const tool = findTool(activeToolId.value)
  const point = canvas.value.toCanvasPoint(event.clientX, event.clientY)
  board.addNote(tool.create(point, settings.value[tool.id]!))
  activeToolId.value = null
}
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
      @start-editing="board.startEditing(note.id)"
      @stop-editing="board.stopEditing()"
    />
    <SelectionBar
      v-if="selectedNote"
      :note="selectedNote"
      :tool="findTool(selectedNote.kind)"
      @update="board.updateNote(selectedNote.id, $event)"
      @remove="board.removeNote(selectedNote.id)"
    />
  </InfiniteCanvas>
  <Toolbar v-model:active-tool-id="activeToolId" v-model:settings="settings" />
</template>
