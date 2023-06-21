<script setup lang="ts">
import ToggleTheme from './components/ToggleTheme.vue'
import type { Highlighter } from './types'
import Header from '~/components/Header.vue'
import { vscodeTheme2HljsTheme, vscodeTheme2PrismjsTheme, VSCodeThemeId } from '../../src'
import { getHighlighter, Highlighter as ShikiHighlighter } from 'shiki-es'
import prismjs from 'prismjs'
import hljs from 'highlight.js'
import ts from './fixtures/ts.ts?raw'
import html from './fixtures/html.html?raw'
import css from './fixtures/css.css?raw'
import 'prismjs/components/prism-typescript' 
import { themes, fetchTheme, insertTheme } from '~/composables/themes'

const highlighters: Highlighter[] = ['shiki', 'highlight.js', 'prism.js']
const highlighter = ref<Highlighter>('prism.js')
const theme = ref<VSCodeThemeId>('kricsleo.gentle-clean.Gentle Clean Vitesse')
let shikiHighlighter: ShikiHighlighter

watch([highlighter, theme], async () => {
  const themeName = theme.value
  const themeJSON = await fetchTheme(themeName)
  switch(highlighter.value) {
    case 'shiki': {
      if(!shikiHighlighter) {
        shikiHighlighter = await getHighlighter({ theme: themeJSON as any, langs: ['html', 'css', 'typescript'] })
      }
      if(!shikiHighlighter.getLoadedThemes().includes(themeName as any)) {
        await shikiHighlighter.loadTheme(themeJSON as any)
      }
      const codeEls = Array.from(document.getElementsByTagName('code') as unknown as HTMLElement[]).map(el => ({
        el,
        code: el.innerText,
        lang: Array.from(el.classList).find(t => t.startsWith('lang'))!.split('-')[1]
      }))
      if(highlighter.value !== 'shiki' || theme.value !== themeName ) {
        return
      }
      codeEls.forEach(el => {
        const highlighted = shikiHighlighter.codeToHtml(el.code, { lang: el.lang, theme: themeName })
          .replace('><code>', `><code class="language-${el.lang}">`)
        el.el.parentElement!.outerHTML = highlighted
      })
      break; 
    }
    case 'highlight.js': {
      purgePreEls()
      hljs.highlightAll()
      const highlightjsCSS = vscodeTheme2HljsTheme(themeJSON)
      insertTheme(highlightjsCSS)
      break; 
    }
    case 'prism.js': {
      purgePreEls()
      prismjs.highlightAll()
      const prismjsCSS = vscodeTheme2PrismjsTheme(themeJSON)
      insertTheme(prismjsCSS)
      break;
    }
  }
}, { immediate: true })

function purgePreEls() {
  const preEls = Array.from(document.getElementsByTagName('pre') as unknown as HTMLElement[])
  preEls.forEach(el => {
    el.removeAttribute('class')
    el.removeAttribute('style')
  })
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
    <h3 class="py-4 mt-10"># TypeScript</h3>
    <pre><code class="language-typescript">{{ ts }}</code></pre>
    <h3 class="py-4 mt-10"># HTML</h3>
    <pre><code class="language-html">{{ html }}</code></pre>
    <h3 class="py-4 mt-10"># CSS</h3>
    <pre><code class="language-css">{{ css }}</code></pre>
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
