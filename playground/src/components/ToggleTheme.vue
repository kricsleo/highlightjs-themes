<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { Highlighter } from '../types'

const emits = defineEmits<{
  (e: 'update:highlighter', v: Highlighter): void
}>()

const themeImports = import.meta.glob('../../**/prismjs/*.css')
const themes = Object.keys(themeImports)
  .map(filepath => filepath.match(/(?<=\/)[^\/]*(?=.css$)/)![0])
const theme = ref(themes[0])

const highlighters: Highlighter[] = ['highlightjs', 'prismjs']
const highlighter = ref(highlighters[0])

watch(theme, () => toggleTheme(highlighter.value, theme.value), { immediate: true })
watch(highlighter, () => {
  toggleTheme(highlighter.value, theme.value)
  emits('update:highlighter', highlighter.value)
}, { immediate: true })

function toggleTheme(highlighter: string, theme: string) {
  const id = 'theme'
  let themeEle = document.getElementById(id) as HTMLLinkElement
  if (themeEle)
    themeEle.remove()

  themeEle = document.createElement('link') as HTMLLinkElement
  themeEle.id = id
  themeEle.rel = 'stylesheet'
  themeEle.href = `/themes/${highlighter}/${theme}.css`
  document.head.appendChild(themeEle)
}
</script>

<template>
  <RadioGroup v-model="highlighter">
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
  <RadioGroup v-model="theme" mt-10>
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
