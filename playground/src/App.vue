<script setup lang="ts">
import { html } from './index.md'
import ToggleTheme from './components/ToggleTheme.vue'
import Header from '~/components/Header.vue'
</script>

<template>
  <main max-w-800 mx-auto px-15 pb-20>
    <Header />
    <ToggleTheme shrink-0 />
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
