<script setup lang="ts">
import type { Note } from '~/types/note'

const NOTE_SIZE = 200
const GRID_SIZE = 24

// Verschiebung (x, y) und Zoom der Ansicht: Bildschirm = Welt * zoom + Verschiebung
const view = reactive({ x: 0, y: 0, zoom: 1 })
const notes = ref<Note[]>([])
const selectedId = ref<number | null>(null)
let nextId = 1
// Höchster z-Wert: angeklickte Post-its bekommen einen neuen, damit sie vorne liegen
let topZ = 0

function addNote(screenX: number, screenY: number) {
  selectedId.value = nextId
  notes.value.push({
    id: nextId++,
    x: (screenX - view.x) / view.zoom - NOTE_SIZE / 2,
    y: (screenY - view.y) / view.zoom - NOTE_SIZE / 2,
    width: NOTE_SIZE,
    height: NOTE_SIZE,
    z: ++topZ,
    text: ''
  })
}

function selectNote(note: Note) {
  selectedId.value = note.id
  note.z = ++topZ
}

function removeNote(id: number) {
  notes.value = notes.value.filter(note => note.id !== id)
  if (selectedId.value === id) selectedId.value = null
}

// Backspace löscht das ausgewählte Post-it, außer man tippt gerade Text
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Backspace' || selectedId.value === null) return
  if (event.target instanceof HTMLTextAreaElement) return
  removeNote(selectedId.value)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function addNoteInCenter() {
  addNote(window.innerWidth / 2, window.innerHeight / 2)
}

function pan(event: PointerEvent) {
  selectedId.value = null
  startDrag(event, (dx, dy) => {
    view.x += dx
    view.y += dy
  })
}

function zoom(event: WheelEvent) {
  // Trackpad-Pinch kommt als Wheel-Event mit ctrlKey und kleinen Werten
  const speed = event.ctrlKey ? 0.01 : 0.002
  const newZoom = Math.min(4, Math.max(0.1, view.zoom * Math.exp(-event.deltaY * speed)))
  // Der Punkt unter der Maus bleibt an derselben Stelle
  view.x = event.clientX - (event.clientX - view.x) * newZoom / view.zoom
  view.y = event.clientY - (event.clientY - view.y) * newZoom / view.zoom
  view.zoom = newZoom
}

const gridStyle = computed(() => ({
  backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
  backgroundSize: `${GRID_SIZE * view.zoom}px ${GRID_SIZE * view.zoom}px`,
  backgroundPosition: `${view.x}px ${view.y}px`
}))
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden bg-neutral-50 select-none touch-none"
    :style="gridStyle"
    @pointerdown="pan"
    @wheel.prevent="zoom"
    @dblclick="addNote($event.clientX, $event.clientY)"
  >
    <div
      class="absolute top-0 left-0 origin-top-left"
      :style="{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }"
    >
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :zoom="view.zoom"
        :selected="note.id === selectedId"
        @update="Object.assign(note, $event)"
        @select="selectNote(note)"
        @remove="removeNote(note.id)"
      />
    </div>

    <button
      class="absolute top-4 left-4 rounded-md bg-white px-4 py-2 text-sm font-medium shadow hover:bg-neutral-100"
      @pointerdown.stop
      @dblclick.stop
      @click="addNoteInCenter"
    >
      + Post-it
    </button>
  </div>
</template>
