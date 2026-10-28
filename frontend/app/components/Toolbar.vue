<script setup lang="ts">
import { TOOLS } from '~/tools'
import type { ToolSettings } from '~/tools/types'

const activeToolId = defineModel<string | null>('activeToolId', { required: true })
const settings = defineModel<Record<string, ToolSettings>>('settings', { required: true })

function toggle(id: string) {
  activeToolId.value = activeToolId.value === id ? null : id
}
</script>

<template>
  <div class="fixed bottom-14 left-1/2 z-10 flex -translate-x-1/2 gap-3 rounded-2xl bg-background p-2 shadow-lg ring-1 ring-foreground/10">
    <template v-for="(tool, index) in TOOLS" :key="tool.id">
      <div v-if="index > 0" class="w-px self-stretch bg-border" />
      <ToolButton
        :tool="tool"
        :active="activeToolId === tool.id"
        :settings="settings[tool.id]!"
        @update:settings="settings = { ...settings, [tool.id]: $event }"
        @toggle="toggle(tool.id)"
        @activate="activeToolId = tool.id"
      />
    </template>
  </div>
</template>
