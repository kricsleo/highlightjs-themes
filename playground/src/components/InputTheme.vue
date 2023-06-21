<script setup lang="ts">
import { fetchTheme } from '~/composables/themes';

const input = ref('')
const error = ref('')
const loading = ref(false)
async function search() {
  loading.value = true
  try {
    await fetchTheme(input.value as any)
  } catch(e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center relative my-10 mb-20">
    <input 
      :class="['bg-transparent outline-none border-gray border-b text-14 w-250', { 'border-rose': error }]"
      placeholder="input VS Code theme name" 
      @input="error = ''"
      v-model="input"
      @keydown.enter="search" />
    <p v-if="error" class="text-rose absolute top-100% text-12 whitespace-nowrap">{{ error }}</p>
    <button 
      class="border border-gray rounded-4 px-8 py-4 ml-5 active:op-65 text-14"
      title="search themes"
      @click="search">
      <span v-if="loading" class="block i-carbon-circle-dash animate-spin" />
      <span v-else class="block i-carbon-search" />
    </button>
  </div>
</template>