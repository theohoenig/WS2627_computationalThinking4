<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import type { ToolAttribute } from '~/tools/types'

const props = defineProps<{ attribute: ToolAttribute; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const open = ref(false)
const value = computed(() => props.modelValue)
const current = computed(() => props.attribute.options.find(option => option.value === value.value))

// Emits even when the same option is picked again, so it still turns the tool on.
function pick(next: string) {
  emit('update:modelValue', next)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon-xs" :aria-label="attribute.label" :title="attribute.label">
        <span v-if="attribute.type === 'color'" class="size-4 rounded-full ring-1 ring-black/15" :style="{ background: value }" />
        <component :is="current?.icon" v-else />
      </Button>
    </PopoverTrigger>
    <PopoverContent side="top" class="w-auto flex-row gap-1.5 p-2">
      <template v-if="attribute.type === 'color'">
        <button
          v-for="option in attribute.options"
          :key="option.value"
          class="size-6 rounded-full ring-1 ring-black/15 transition-transform hover:scale-110"
          :class="option.value === value ? 'outline-2 outline-offset-2 outline-blue-500' : ''"
          :style="{ background: option.value }"
          :aria-label="option.label"
          @click="pick(option.value)"
        />
      </template>
      <template v-else>
        <Button
          v-for="option in attribute.options"
          :key="option.value"
          :variant="option.value === value ? 'secondary' : 'ghost'"
          size="icon-sm"
          :aria-label="option.label"
          :title="option.label"
          @click="pick(option.value)"
        >
          <component :is="option.icon" />
        </Button>
      </template>
    </PopoverContent>
  </Popover>
</template>
