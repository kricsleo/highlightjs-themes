<script setup lang="ts">
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <nav flex items-center justify-center sticky top-0 py-5 text-30 bg-white dark:bg-dark text-rose>
    <h3>Preview themes</h3>
    <button
      i-carbon-sun dark:i-carbon-moon
      hover:op-80 transition-opacity absolute right-10
      @click="toggleDark()" />
  </nav>
</template>
