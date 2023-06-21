<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { Highlighter } from '../types'

defineProps<{
  highlighter: Highlighter
  highlighters: Highlighter[]
  theme: string,
  themes: string[],
}>()
const emits = defineEmits<{
  (e: 'update:highlighter', v: Highlighter): void
  (e: 'update:theme', v: string): void
}>()
</script>

<template>
  <RadioGroup :model-value="highlighter" @update:model-value="emits('update:highlighter', $event)">
    <RadioGroupLabel text-20>
      Highlighter
    </RadioGroupLabel>
    <div flex flex-wrap gap-10 mt-10>
      <RadioGroupOption
        v-for="hl in highlighters"
        :key="hl"
        v-slot="{ checked }"
        :value="hl"
      >
        <button shrink-0 py-2 px-5 b-1 b-gray rounded-4 :class="{ 'bg-rose !b-rose text-light': checked }">
          {{ hl }}
        </button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
  <RadioGroup :model-value="theme" @update:model-value="emits('update:theme', $event)" mt-10>
    <RadioGroupLabel text-20>
      Themes
    </RadioGroupLabel>
    <div flex flex-wrap gap-10 mt-10>
      <RadioGroupOption
        v-for="the in themes"
        :key="the"
        v-slot="{ checked }"
        :value="the"
      >
        <button shrink-0 py-2 px-5 b-1 b-gray rounded-4 :class="{ 'bg-rose !b-rose text-light': checked }">
          {{ the }}
        </button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
