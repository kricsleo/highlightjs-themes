/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import UnpluginMarkdown2Html from 'unplugin-markdown-2-html/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    // https://github.com/hannoeru/vite-plugin-pages
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router'],
      vueTemplate: true,
    }),
    // https://github.com/antfu/vite-plugin-components
    Components({ dirs: [] }),
    // https://github.com/antfu/unocss => unocss.config.ts
    Unocss(),
    UnpluginMarkdown2Html({
      highlight: { prismjs: true },
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
