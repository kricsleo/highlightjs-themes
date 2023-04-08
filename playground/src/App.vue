<script setup lang="ts">
import { createMarkdownRender } from 'unplugin-markdown-2-html/dist/helper'
import markdown from './index.md?raw'
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'

const highlighter = ref<Highlighter>()
const hljsRender = createMarkdownRender()
const prismjsjsRender = createMarkdownRender({
  highlight: { prismjs: true },
})
const render = computed(() => highlighter.value === 'highlightjs' ? hljsRender : prismjsjsRender)
const html = computed(() => render.value(markdown).html)
</script>

<template>
  <main max-w-800 mx-auto px-15 pb-20>
    <Header />
    <ToggleTheme shrink-0 @update:highlighter="highlighter = $event" />
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
