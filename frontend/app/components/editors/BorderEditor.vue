<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { BORDER_COLORS, BORDER_WIDTHS } from '~/types/note'
import type { Note } from '~/types/note'
import type { ToolDefinition } from '~/tools/types'

defineProps<{ note: Note; tool: ToolDefinition }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon-sm" aria-label="Border" title="Border">
        <span class="size-4 rounded-sm" :style="{ border: `${note.borderWidth}px solid ${note.borderColor}` }" />
      </Button>
    </PopoverTrigger>
    <PopoverContent side="top" class="w-auto gap-2 p-2">
      <div class="flex gap-1.5">
        <button
          v-for="color in BORDER_COLORS"
          :key="color"
          class="size-6 rounded-full transition-transform hover:scale-110"
          :class="color === note.borderColor ? 'outline-2 outline-offset-2 outline-blue-500' : ''"
          :style="{ background: color }"
          :aria-label="`Border ${color}`"
          @click="emit('update', { borderColor: color })"
        />
      </div>
      <div class="flex gap-1">
        <Button
          v-for="width in BORDER_WIDTHS"
          :key="width"
          :variant="width === note.borderWidth ? 'secondary' : 'ghost'"
          size="sm"
          class="flex-1"
          :aria-label="`Border width ${width}`"
          @click="emit('update', { borderWidth: width })"
        >
          <span class="w-6 bg-foreground" :style="{ height: `${width}px` }" />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
