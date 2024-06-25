<script setup lang="ts">
import { V3DragZoomContainer } from 'v3-drag-zoom'
import { usePublicStore } from '@/store'
const publicStore = usePublicStore()
const imgSrc = computed(() => {
  let item = publicStore.uploadedImages.filter((item) => item.selected)
  if (item.length) {
    return item.at(-1)!.path
  }
  publicStore.uploadedImages[0].selected = true
  return publicStore.uploadedImages[0].path
})
</script>

<template>
  <v3-drag-zoom-container class="picView">
    <img :src="imgSrc" alt="img" />
  </v3-drag-zoom-container>
</template>

<style scoped lang="scss">
.picView {
  width: 100%;
  height: 100%;
  background-color: #333;
  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
