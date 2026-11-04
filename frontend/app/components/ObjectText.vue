<script setup lang="ts">
import type { StyleValue } from 'vue'
import { DEFAULT_FONT_SIZE } from '~/types/note'
import type { Note } from '~/types/note'

const MIN_SIZE = GRID_SIZE * 3

// Editable text of a board object. `boxStyle` sets padding and text color per shape.
const props = defineProps<{
  note: Note
  editing: boolean
  centered: boolean
  boxStyle: StyleValue
  placeholder?: string
}>()
const emit = defineEmits<{
  update: [patch: Partial<Note>]
  stopEditing: []
}>()

const box = useTemplateRef<HTMLElement>('box')
const content = useTemplateRef<HTMLElement>('content')

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
watch(
  () => [props.note.text, props.note.width, props.note.height, props.note.fontSize, props.note.bold, props.editing],
  fitToContent,
)
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

<!-- Same element for showing and editing. Wraps only at spaces; long words may overflow,
     evenly on both sides when centered. -->
<template>
  <div
    ref="box"
    class="relative flex size-full"
    :class="centered ? 'items-center justify-center' : 'items-start justify-start'"
    :style="boxStyle"
  >
    <div
      ref="content"
      class="relative w-fit min-w-full shrink-0 whitespace-pre-wrap wrap-normal outline-none before:pointer-events-none before:absolute before:opacity-40 before:content-[attr(data-placeholder)]"
      :class="[centered ? 'text-center before:inset-x-0' : 'text-left', editing ? '' : 'select-none']"
      :style="{ fontSize: `${note.fontSize ?? DEFAULT_FONT_SIZE}px`, fontWeight: note.bold ? 700 : 400 }"
      :contenteditable="editing ? 'plaintext-only' : 'false'"
      :data-placeholder="placeholder && !note.text ? placeholder : undefined"
      @input="updateText"
      @blur="emit('stopEditing')"
      @keydown.escape="finishEditing"
    />
  </div>
</template>
