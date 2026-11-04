<script setup lang="ts">
import type { Note } from '~/types/note'
import type { ToolDefinition } from '~/tools/types'

const props = defineProps<{ note: Note; tool: ToolDefinition }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()

// Uses the palette of the object's own tool, so post-its, text and shapes each get theirs.
const attribute = computed(() => props.tool.attributes.find(attribute => attribute.key === 'color')!)
</script>

<template>
  <AttributePicker
    :attribute="attribute"
    :model-value="note.color"
    size="icon-sm"
    @update:model-value="emit('update', { color: $event })"
  />
</template>
