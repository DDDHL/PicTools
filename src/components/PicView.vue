<script setup lang="ts">
defineProps<{
  imgSrc: string
}>()
</script>

<template>
  <div class="picView">
    <img :src="imgSrc" alt="img" />
  </div>
</template>

<style scoped lang="scss">
.picView {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
