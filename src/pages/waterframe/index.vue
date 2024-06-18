<script setup lang="ts"></script>

<template>
  <div class="waterframe">waterframe</div>
</template>

<style scoped lang="scss">
.waterframe {
  width: 100%;
  height: calc(100vh - 35px);
  position: relative;
  display: flex;
  @include bgColor();
}
</style>
