<script setup lang="ts">
import PicView from '@/components/PicView.vue'
</script>

<template>
  <div class="edit">
    <section class="view">
      <PicView
        img-src="D:\\成品图\\picture\\Microsoft_Pride_21_Abrosexual.jpg"
      />
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
  align-items: center;
  .view {
    width: 80%;
    height: 100%;
  }
  .tools {
    width: 18%;
    height: 70%;
    @include cardStyle;
  }
}
</style>
