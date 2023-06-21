<script setup lang="ts">
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <div px-15 bg-white dark:bg-dark>
    <nav max-w-800 mx-auto flex items-center justify-center sticky top-0 py-5 text-30 z-1>
      <h3 text-rose text-center>
        Preview Highlight Themes
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
  </div>
</template>
