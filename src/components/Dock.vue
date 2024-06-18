<script setup lang="ts">
import { usePublicStore } from '@/store'
const publicStore = usePublicStore()
const container = ref<HTMLElement | null>(null)
const { uploadedImages } = storeToRefs(publicStore)
const handleMouseOver = (i: number) => {
  uploadedImages.value = uploadedImages.value.map((item, index) => {
    if (index === i) return { ...item, scale: 1.4 }
    if (index === i - 1 || index === i + 1) return { ...item, scale: 1.25 }
    if (index === i - 2 || index === i + 2) return { ...item, scale: 1.1 }
    return { ...item, scale: 1 }
  })
}

const resetScale = () => {
  uploadedImages.value = uploadedImages.value.map((item) => ({
    ...item,
    scale: 1,
  }))
}
</script>

<template>
  <div
    class="container"
    ref="container"
    :style="{
      marginLeft: `${publicStore.collapsed ? 32 : 77.5}px`,
    }"
    v-show="
      publicStore.uploadedImages.length &&
      $route.fullPath !== '/selectImg' &&
      $route.fullPath !== '/compress' &&
      $route.fullPath !== '/setting'
    "
    @mouseleave="resetScale"
  >
    <div
      class="item"
      v-for="(item, index) in uploadedImages"
      :key="index"
      :style="{ '--scale': item.scale }"
      @mouseover="handleMouseOver(index)"
    >
      <div class="menu"></div>
      <div class="gap" v-if="index !== uploadedImages.length - 1"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: auto;
  padding: 15px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  height: 80px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  z-index: 999;
}

.item {
  --scale: 1;
  padding-bottom: calc((var(--scale) * 50px) - (50px / var(--scale)));
  height: 100%;
  display: flex;
  align-items: flex-end;
  transition: all 0.35s;

  .menu {
    width: calc(50px * var(--scale));
    height: calc(50px * var(--scale));
    background: #000;
    border-radius: calc(10px * var(--scale));
    transition: all 0.35s;
    cursor: pointer;
  }

  .gap {
    width: calc(15px * var(--scale));
    height: 50px;
    background: transparent;
    transition: all 0.35s;
  }
}
</style>
