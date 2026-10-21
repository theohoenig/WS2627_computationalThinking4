<script setup lang="ts">
import type { Note } from '~/types/note'

const MIN_SIZE = 80

const props = defineProps<{ note: Note, zoom: number, selected: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<Note>], select: [], remove: [] }>()

// Mausbewegung ist in Bildschirm-Pixeln, das Post-it liegt in Welt-Koordinaten
function move(event: PointerEvent) {
  startDrag(event, (dx, dy) => emit('update', {
    x: props.note.x + dx / props.zoom,
    y: props.note.y + dy / props.zoom
  }))
}

function resize(event: PointerEvent) {
  startDrag(event, (dx, dy) => emit('update', {
    width: Math.max(MIN_SIZE, props.note.width + dx / props.zoom),
    height: Math.max(MIN_SIZE, props.note.height + dy / props.zoom)
  }))
}
</script>

<template>
  <div
    class="absolute flex flex-col rounded-sm bg-yellow-200 shadow-md"
    :class="{ 'ring-2 ring-blue-500': selected }"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px`, zIndex: note.z }"
    @pointerdown.stop="emit('select')"
    @dblclick.stop
  >
    <div class="h-6 shrink-0 cursor-move" @pointerdown="move" />
    <button
      class="absolute top-0.5 right-1 text-yellow-700 hover:text-yellow-950"
      aria-label="Post-it löschen"
      @click="emit('remove')"
    >
      ✕
    </button>
    <textarea
      class="flex-1 resize-none bg-transparent px-3 pb-3 outline-none select-text"
      placeholder="Text …"
      :value="note.text"
      @input="emit('update', { text: ($event.target as HTMLTextAreaElement).value })"
    />
    <div
      class="absolute right-1 bottom-1 size-3 cursor-nwse-resize border-r-2 border-b-2 border-yellow-500"
      @pointerdown="resize"
    />
  </div>
</template>
