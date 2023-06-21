<script setup lang="ts">
import { html } from './index.md'
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'
import { downloadVSCodeTheme, VSCodeTheme, vscodeTheme2HljsTheme, vscodeTheme2PrismjsTheme, VSCodeThemeId } from '../../src'
import { getHighlighter, Highlighter as ShikiHighlighter } from 'shiki-es'
import prismjs from 'prismjs'
import hljs from 'highlight.js'

const highlighters: Highlighter[] = ['shiki', 'highlight.js', 'prism.js']
const highlighter = ref<Highlighter>('prism.js')
const theme = ref<VSCodeThemeId>('kricsleo.gentle-clean.Gentle Clean Vitesse')
const themes = reactive<Record<string, VSCodeTheme>>({})
let shikiHighlighter: ShikiHighlighter

watchEffect(async () => {
  const themeJSON = await fetchTheme(theme.value)
  switch(highlighter.value) {
    case 'shiki': {
      if(!shikiHighlighter) {
        shikiHighlighter = await getHighlighter({ theme: themeJSON as any })
      }
      if(!shikiHighlighter.getLoadedThemes().includes(theme.value as any)) {
        shikiHighlighter.loadTheme(themeJSON as any)
      }
      const codeEls = Array.from(document.getElementsByClassName('code') as unknown as HTMLElement[]).map(el => ({
        el,
        code: el.innerText,
        lang: Array.from(el.classList).find(t => t.startsWith('lang'))!.split('-')[1]
      }))
      codeEls.forEach(el => {
        const highlighted = shikiHighlighter.codeToHtml(el.code, { lang: el.lang, theme: theme.value })
        el.el.innerHTML = highlighted
      })
      return 
    }
    case 'highlight.js': {
      const highlightjsCSS = vscodeTheme2HljsTheme(themeJSON)
      hljs.highlightAll()
      insertTheme(highlightjsCSS)
      return 
    }
    case 'prism.js': {
      const prismjsCSS = vscodeTheme2PrismjsTheme(themeJSON)
      return (code: string, lang: string, theme: string) => {
        prismjs.highlightAll(false, () => {
          insertTheme(prismjsCSS)
        })
      }
    }
  }
})


async function fetchTheme(theme: VSCodeThemeId) {
  if(!themes[theme]) {
    const themeJSON = await downloadVSCodeTheme(theme)
    themeJSON.name = theme
    themes[theme] = themeJSON
  }
  return themes[theme]
}

function insertTheme(css: string) {
  const id = 'theme';
  (document.getElementById(id) as HTMLLinkElement)?.remove()
  const themeEle = document.createElement('style') as HTMLStyleElement
  themeEle.id = id
  themeEle.innerHTML = css
  document.head.appendChild(themeEle)
}
</script>

<template>
  <main max-w-800 mx-auto px-15 pb-20>
    <Header />
    <ToggleTheme 
      :highlighters="highlighters"
      :themes="Object.keys(themes)"
      v-model:highlighter="highlighter" 
      v-model:theme="theme" />
    <section v-html="html" />
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
