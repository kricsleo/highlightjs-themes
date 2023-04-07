<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

const themeImports = import.meta.glob('../../**/*.css')
const themes = Object.keys(themeImports)
  .map(filepath => filepath.match(/(?<=\/)[^\/]*(?=.css$)/)![0])

const theme = ref(themes[0])

watch(theme, () => toggleTheme(theme.value), { immediate: true })

function toggleTheme(theme: string) {
  const id = 'hljs-theme'
  let themeEle = document.getElementById(id) as HTMLLinkElement
  if (themeEle)
    themeEle.remove()

  themeEle = document.createElement('link') as HTMLLinkElement
  themeEle.id = id
  themeEle.rel = 'stylesheet'
  themeEle.href = `/themes/${theme}.css`
  document.head.appendChild(themeEle)
}
</script>

<template>
  <RadioGroup v-model="theme">
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
        <button shrink-0 py-2 px-5 b-1 rounded-4 :class="{ 'bg-rose b-rose': checked }">
          {{ the }}
        </button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
