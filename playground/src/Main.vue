<script setup lang="ts">
import { createMarkdownRender } from 'unplugin-markdown-2-html/dist/helper'
import markdown from './index.md?raw'
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'

const highlighter = ref<Highlighter>('prismjs')
const theme = ref<string>('vitesse-dark')
const html = ref<string>()

watch([highlighter, theme], async () => {
  const render = await (async () => {
    switch(highlighter.value) {
      case 'highlightjs': return createMarkdownRender({highlight: { highlightjs: true}})
      case 'prismjs': return createMarkdownRender({highlight: { prismjs: true}})
      case 'shiki': return createMarkdownRender({highlight: { shiki: { theme: theme.value as any }}})
      default: return createMarkdownRender({highlight: { shiki: { theme: theme.value as any }}})
    }
  })()
  html.value = render(markdown).html
  toggleTheme()
}, { immediate: true })

function toggleTheme() {
  const id = 'theme'
  let themeEle = document.getElementById(id) as HTMLLinkElement
  themeEle?.remove()

  if (highlighter.value === 'shiki')
    return

  themeEle = document.createElement('link') as HTMLLinkElement
  themeEle.id = id
  themeEle.rel = 'stylesheet'
  themeEle.href = `/themes/${highlighter.value}/${theme.value}.css`
  document.head.appendChild(themeEle)
}
</script>

<template>
  <main max-w-800 mx-auto px-15 pb-20>
    <Header />
    <ToggleTheme
      v-model:highlighter="highlighter"
      v-model:theme="theme" />
    {{ html }}
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
