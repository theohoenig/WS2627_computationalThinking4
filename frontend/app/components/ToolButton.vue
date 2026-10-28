<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { ToolDefinition, ToolSettings } from '~/tools/types'

defineProps<{ tool: ToolDefinition; active: boolean }>()
const settings = defineModel<ToolSettings>('settings', { required: true })
const emit = defineEmits<{ toggle: []; activate: [] }>()

// Choosing an attribute means "I want to create this next", so the tool turns on.
function pick(key: string, value: string) {
  settings.value = { ...settings.value, [key]: value }
  emit('activate')
}
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <Button
      :variant="active ? 'secondary' : 'ghost'"
      class="size-12 [&_svg:not([class*=size-])]:size-6"
      :aria-label="`New ${tool.label.toLowerCase()}`"
      :title="`New ${tool.label.toLowerCase()}`"
      @click="emit('toggle')"
    >
      <component :is="tool.icon" />
    </Button>
    <div class="flex gap-0.5">
      <AttributePicker
        v-for="attribute in tool.attributes"
        :key="attribute.key"
        :attribute="attribute"
        :model-value="settings[attribute.key]!"
        @update:model-value="pick(attribute.key, $event)"
      />
    </div>
  </div>
</template>
