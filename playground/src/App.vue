<script setup lang="ts">
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'
import { downloadVSCodeTheme, VSCodeTheme, vscodeTheme2HljsTheme, vscodeTheme2PrismjsTheme, VSCodeThemeId } from '../../src'
import { getHighlighter, Highlighter as ShikiHighlighter } from 'shiki-es'
import prismjs from 'prismjs'
import hljs from 'highlight.js'
import ts from './fixtures/ts.ts?raw'
import html from './fixtures/html.html?raw'
import css from './fixtures/css.css?raw'

const highlighters: Highlighter[] = ['shiki', 'highlight.js', 'prism.js']
const themes = reactive<Record<string, VSCodeTheme>>({})
const highlighter = ref<Highlighter>('prism.js')
const theme = ref<VSCodeThemeId>('kricsleo.gentle-clean.Gentle Clean Vitesse')
let shikiHighlighter: ShikiHighlighter

watch([highlighter, theme], async () => {
  const themeJSON = await fetchTheme(theme.value)
  console.log('highlighter.value', highlighter.value, theme.value)
  switch(highlighter.value) {
    case 'shiki': {
      if(!shikiHighlighter) {
        shikiHighlighter = await getHighlighter({ theme: themeJSON as any, langs: ['html', 'css', 'typescript'] })
      }
      if(!shikiHighlighter.getLoadedThemes().includes(theme.value as any)) {
        await shikiHighlighter.loadTheme(themeJSON as any)
      }
      const codeEls = Array.from(document.getElementsByTagName('code') as unknown as HTMLElement[]).map(el => ({
        el,
        code: el.innerText,
        className: el.className,
        lang: Array.from(el.classList).find(t => t.startsWith('lang'))!.split('-')[1]
      }))
      codeEls.forEach(el => {
        const highlighted = shikiHighlighter.codeToHtml(el.code, { lang: el.lang, theme: theme.value })
        el.el.parentElement!.outerHTML = highlighted
        el.el.className = el.className
      })
      break; 
    }
    case 'highlight.js': {
      const highlightjsCSS = vscodeTheme2HljsTheme(themeJSON)
      hljs.highlightAll()
      insertTheme(highlightjsCSS)
      break; 
    }
    case 'prism.js': {
      const prismjsCSS = vscodeTheme2PrismjsTheme(themeJSON)
      prismjs.highlightAll(false, () => {
        insertTheme(prismjsCSS)
      })
      break;
    }
  }
}, { immediate: true })


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
    {{ highlighter }}
    <ToggleTheme 
      :highlighters="highlighters"
      :themes="Object.keys(themes)"
      v-model:highlighter="highlighter" 
      v-model:theme="theme" />
    <pre>
      <code class="language-typescript"> {{ ts }} </code>
    </pre>
    <pre>
      <code class="language-html"> {{ html }} </code>
    </pre>
    <pre>
      <code class="language-css"> {{ css }} </code>
    </pre>
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
