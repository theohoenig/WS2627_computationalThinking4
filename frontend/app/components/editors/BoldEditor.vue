<script setup lang="ts">
import { Bold } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { Note } from '~/types/note'
import type { ToolDefinition } from '~/tools/types'

defineProps<{ note: Note; tool: ToolDefinition }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
</script>

<template>
  <Button
    :variant="note.bold ? 'secondary' : 'ghost'"
    size="icon-sm"
    aria-label="Bold"
    title="Bold"
    :aria-pressed="note.bold"
    @click="emit('update', { bold: !note.bold })"
  >
    <Bold />
  </Button>
</template>
