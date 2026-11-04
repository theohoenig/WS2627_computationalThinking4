<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { FONT_SIZES } from '~/types/note'
import type { Note } from '~/types/note'
import type { ToolDefinition } from '~/tools/types'

defineProps<{ note: Note; tool: ToolDefinition }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
const open = ref(false)

function pick(fontSize: number) {
  emit('update', { fontSize })
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="sm" class="min-w-9 tabular-nums" aria-label="Font size" title="Font size">
        {{ note.fontSize }}
      </Button>
    </PopoverTrigger>
    <PopoverContent side="top" class="w-auto flex-row gap-1 p-1.5">
      <Button
        v-for="size in FONT_SIZES"
        :key="size"
        :variant="size === note.fontSize ? 'secondary' : 'ghost'"
        size="sm"
        class="tabular-nums"
        :aria-label="`Font size ${size}`"
        @click="pick(size)"
      >
        {{ size }}
      </Button>
    </PopoverContent>
  </Popover>
</template>
