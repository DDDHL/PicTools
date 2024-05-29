<script setup lang="ts"></script>

<template>
  <div class="home">
    <section class="left">
      <Dock />
    </section>
    <section class="center">
      <Center />
    </section>
    <section class="right">
      <ThemeChange />
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  height: calc(100vh - 35px);
  position: relative;
  overflow: auto;
  display: flex;
  .left {
    width: 150px;
    height: 100%;
  }
  .center {
    width: calc(100% - 150px);
    height: 100%;
  }
  .right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
