<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import type { Note } from '~/types/note'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const MIN_SIZE = GRID_SIZE * 3
const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const props = defineProps<{ note: Note; selected: boolean; editing: boolean }>()
const emit = defineEmits<{
  select: []
  update: [patch: Partial<Note>]
  remove: []
  startEditing: []
  stopEditing: []
}>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const box = useTemplateRef<HTMLElement>('box')
const content = useTemplateRef<HTMLElement>('content')

let interaction: { mode: Mode; startX: number; startY: number; start: Note } | null = null

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

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (props.editing) return
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { ...props.note } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the note so the opposite corner stays put.
function nextRect(mode: Mode, start: Note, dx: number, dy: number): Partial<Note> {
  if (mode === 'move') return { x: snapToGrid(start.x + dx), y: snapToGrid(start.y + dy) }
  const width = Math.max(MIN_SIZE, snapToGrid(start.width + (mode.endsWith('e') ? dx : -dx)))
  const height = Math.max(MIN_SIZE, snapToGrid(start.height + (mode.startsWith('s') ? dy : -dy)))
  return {
    width,
    height,
    x: mode.endsWith('w') ? start.x + start.width - width : start.x,
    y: mode.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  emit('update', nextRect(interaction.mode, interaction.start, dx, dy))
}

function onPointerUp() {
  interaction = null
}

function updateText() {
  const text = content.value!.innerText
  // An emptied contenteditable can still report a lone line break.
  emit('update', { text: text === '\n' ? '' : text })
}

// The text is written into the DOM by hand, so Vue never re-renders it under the caret while typing.
function syncText() {
  if (content.value && !props.editing) content.value.innerText = props.note.text
}

function finishEditing() {
  content.value?.blur()
}

// Grows the note to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  if (!box.value || !content.value) return
  const { paddingTop, paddingBottom } = getComputedStyle(box.value)
  const used = content.value.offsetHeight + parseFloat(paddingTop) + parseFloat(paddingBottom)
  const needed = Math.max(MIN_SIZE, Math.ceil(used / GRID_SIZE) * GRID_SIZE)
  if (needed > props.note.height) emit('update', { height: needed })
}

watch(() => props.note.text, syncText)
watch(() => [props.note.text, props.note.width, props.note.height, props.editing], fitToContent)
onMounted(() => {
  syncText()
  fitToContent()
})

// Focuses the text and selects it whenever the board puts this note into edit mode.
watch(() => props.editing, async (editing) => {
  if (!editing) return syncText()
  await nextTick()
  if (!content.value) return
  content.value.focus()
  getSelection()?.selectAllChildren(content.value)
}, { immediate: true })
</script>

<template>
  <div
    class="absolute text-lg touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : 'hover:ring-1 hover:ring-blue-400',editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @dblclick="emit('startEditing')"
  >
    <NotePaper v-if="note.kind === 'note'" :shape="note.shape" :color="note.color" />

    <!-- Same element for showing and editing. Wraps only at spaces; long words may overflow,
         evenly on both sides when centered. -->
    <div
      ref="box"
      class="relative flex size-full"
      :class="centered ? 'items-center justify-center' : 'items-start justify-start'"
      :style="contentStyle"
    >
      <div
        ref="content"
        class="relative w-fit min-w-full shrink-0 whitespace-pre-wrap wrap-normal outline-none before:pointer-events-none before:absolute before:opacity-40 before:content-[attr(data-placeholder)]"
        :class="[centered ? 'text-center before:inset-x-0' : 'text-left', editing ? '' : 'select-none']"
        :contenteditable="editing ? 'plaintext-only' : 'false'"
        :data-placeholder="note.kind === 'text' && !note.text ? 'Text…' : undefined"
        @input="updateText"
        @blur="emit('stopEditing')"
        @keydown.escape="finishEditing"
      />
    </div>

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
      <!-- Counter-scaled so the button keeps its screen size at any zoom level. -->
      <button
        class="absolute bottom-full left-1/2 mb-3 flex size-8 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-md ring-1 ring-foreground/10 hover:text-destructive"
        :style="{ transform: `translateX(-50%) scale(${1 / scale})`, transformOrigin: 'bottom center' }"
        aria-label="Delete"
        title="Delete"
        @pointerdown.stop
        @click="emit('remove')"
      >
        <Trash2 class="size-4" />
      </button>
    </template>
  </div>
</template>
