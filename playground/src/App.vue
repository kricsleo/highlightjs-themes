<script setup lang="ts">
import Header from '~/components/Header.vue'
import { html } from './index.md'
</script>

<template>
  <div max-w-800 mx-auto px-15 font-sans text="gray-700 dark:gray-200">
    <main>
      <Header />
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
