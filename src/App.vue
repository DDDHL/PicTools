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
    <n-dialog-provider>
      <n-message-provider>
        <div class="container">
          <TitleBar />
          <div class="router-view">
            <router-view />
          </div>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .router-view {
    flex: 1;
    overflow: auto;
  }
}
</style>
