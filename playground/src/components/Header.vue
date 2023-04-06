<script setup lang="ts">
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <div px-20 py-10 text-30 text-right>
    <button
      i-carbon-sun dark:i-carbon-moon
      hover:op-80 transition-opacity
      @click="toggleDark()" />
  </div>
</template>
