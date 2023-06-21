<script setup lang="ts">
import { fetchTheme } from '~/composables/themes';

const input = ref('')
const error = ref(false)
async function search() {
  try {
    await fetchTheme(input.value as any)
  } catch(e) {
    console.log('e', e)
    error.value = true
  }
}
</script>

<template>
  <div class="flex items-center">
    <input 
      :class="['bg-transparent outline-none border-gray border-b text-14 w-250', { 'border-rose': error }]"
      placeholder="input VS Code theme name" 
      @input="error = false"
      v-model="input"
      @keydown.enter="search" />
    <button 
      class="border border-gray rounded-4 px-4 py-2 ml-5 active:op-65"
      @click="search">
      <span class="block i-carbon-search text-14" />
    </button>
  </div>
</template>