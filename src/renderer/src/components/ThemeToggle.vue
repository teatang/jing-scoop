<script setup lang="ts">
import { computed } from 'vue'
import { useScoopStore } from '../stores/scoop'

const store = useScoopStore()

const isDark = computed(() => store.theme === 'dark')
</script>

<template>
  <el-switch
    :model-value="isDark"
    active-text="日"
    inactive-text="夜"
    inline-prompt
    @change="store.toggleTheme()"
  />
</template>

<style scoped></style>
