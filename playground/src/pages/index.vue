<script setup lang="ts">
import Header from '~/components/Header.vue'
import { html } from '../index.md'
</script>

<template>
  <main>
    <Header />
    <div v-html="html" />
  </main>
</template>
