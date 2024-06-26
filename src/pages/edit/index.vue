<script setup lang="ts">
import PicView from '@/components/PicView.vue'
// import EXIF from 'exif-js'
// import { usePublicStore } from '@/store'
// const publicStore = usePublicStore()
</script>

<template>
  <div class="edit">
    <section class="view">
      <PicView />
    </section>
    <section class="tools"></section>
  </div>
</template>

<style scoped lang="scss">
.edit {
  width: 100%;
  height: calc(100vh - 35px);
  @include bgColor();
  display: flex;
  .view {
    width: 79%;
    margin-left: 1%;
    height: calc(99% - 100px);
    margin-top: 1%;
    overflow: hidden;
    border: 1px dashed;
    box-sizing: border-box;
  }
  .tools {
    width: 18%;
    height: calc(99% - 100px);
    margin-top: 1%;
    margin-left: 1%;
    background-color: #fff;
    box-shadow: $boxShadow;
  }
}
</style>
