<script setup lang="ts">
import TitleBar from '@/components/TitleBar.vue'
import { useThemeStore } from '@/store'
const themeStore = useThemeStore()
</script>

<template>
  <n-config-provider
    :theme="themeStore.theme"
    :theme-overrides="themeStore.themeOverrides"
  >
    <n-global-style />
    <TitleBar />
    <router-view />
  </n-config-provider>
</template>

<style scoped lang="scss"></style>
