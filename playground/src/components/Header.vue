<script setup lang="ts">
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <nav flex items-center justify-center sticky top-0 py-5 text-30 bg-white dark:bg-dark>
    <h3 text-rose text-center>
      Preview Highlightjs Themes
      <p text-14>
        (Generated from VS Code themes)
      </p>
    </h3>
    <button
      i-carbon-sun dark:i-carbon-moon
      hover:op-80 transition-opacity absolute right-10
      @click="toggleDark()"
    />
  </nav>
</template>
