<script setup lang="ts">
import { html } from './index.md'
import ToggleTheme from './components/ToggleTheme.vue'
import Header from '~/components/Header.vue'
</script>

<template>
  <div max-w-800 mx-auto px-15>
    <main>
      <Header />
      <ToggleTheme />
      <div v-html="html" />
    </main>
  </div>
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

pre {
  border: 1px solid gray;
  border-radius: .25em;
}
</style>
