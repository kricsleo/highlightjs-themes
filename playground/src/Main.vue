<script setup lang="ts">
import { createMarkdownRender } from 'unplugin-markdown-2-html/dist/helper'
import markdown from './index.md?raw'
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'

const highlighter = ref<Highlighter>()
const theme = ref<string>()
const hljsRender = await createMarkdownRender()
const prismjsRender = await createMarkdownRender({
  highlight: { prismjs: true },
})
const shikiRender = await createMarkdownRender({
  highlight: { shiki: true },
})
const render = computed(() => {
  switch (highlighter.value) {
    case 'highlightjs': return hljsRender
    case 'prismjs': return prismjsRender
    case 'shiki': return shikiRender
    default: return hljsRender
  }
})
const html = computed(() => render.value(markdown, theme.value).html)
</script>

<template>
  <main max-w-800 mx-auto px-15 pb-20>
    <Header />
    <ToggleTheme
      @update:highlighter="highlighter = $event"
      @update:theme="theme = $event"
    />
    <div v-html="html" />
  </main>
</template>

<style>
*::-webkit-scrollbar {
  display: none;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
pre code {
  display: block;
  padding: 10px 15px;
  border: 1px solid gray;
  border-radius: .25em;
}
pre code * {
  transition: all linear 100ms;
}
</style>
