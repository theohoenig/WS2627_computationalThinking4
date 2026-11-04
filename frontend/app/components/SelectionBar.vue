<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { EDITORS } from '~/editors'
import type { Note } from '~/types/note'
import type { ToolDefinition } from '~/tools/types'

const props = defineProps<{ note: Note; tool: ToolDefinition }>()
const emit = defineEmits<{ update: [patch: Partial<Note>]; remove: [] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editors = computed(() => EDITORS.filter(editor => props.note[editor.key] !== undefined))
</script>

<!-- Anchored at the object's top center and counter-scaled, so the bar keeps its screen size at any zoom. -->
<template>
  <div
    class="absolute"
    :style="{
      left: `${note.x + note.width / 2}px`,
      top: `${note.y}px`,
      transform: `scale(${1 / scale})`,
      transformOrigin: '0 0',
    }"
  >
    <div
      class="absolute bottom-3 left-0 flex -translate-x-1/2 items-center gap-0.5 rounded-lg bg-background p-1 shadow-md ring-1 ring-foreground/10"
      @pointerdown.stop
    >
      <component
        :is="editor.component"
        v-for="editor in editors"
        :key="editor.key"
        :note="note"
        :tool="tool"
        @update="emit('update', $event)"
      />
      <div class="mx-0.5 h-5 w-px bg-border" />
      <Button
        variant="ghost"
        size="icon-sm"
        class="text-muted-foreground hover:text-destructive"
        aria-label="Delete"
        title="Delete"
        @click="emit('remove')"
      >
        <Trash2 />
      </Button>
    </div>
  </div>
</template>
