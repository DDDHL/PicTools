<script setup lang="ts">
import {
  Subtract24Regular,
  Maximize24Regular,
  Dismiss24Regular,
  ArrowExpand24Regular,
} from '@vicons/fluent'
const isMaximized = ref(false)

function minimizeWindow() {
  console.log('Minimize window')
}

function toggleMaximizeWindow() {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    console.log('Maximize window')
  } else {
    console.log('Restore window')
  }
}

function closeWindow() {
  console.log('Close window')
}
</script>

<template>
  <div class="titleBar">
    <section class="control">
      <div class="item">
        <n-icon size="20">
          <Subtract24Regular @click="minimizeWindow" />
        </n-icon>
      </div>
      <div class="item">
        <n-icon size="20">
          <component
            :is="isMaximized ? ArrowExpand24Regular : Maximize24Regular"
            @click="toggleMaximizeWindow"
          />
        </n-icon>
      </div>
      <div class="item">
        <n-icon size="20">
          <Dismiss24Regular @click="closeWindow" />
        </n-icon>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.titleBar {
  width: 100vw;
  height: 35px;
  background-color: #e8e8e8;
  display: flex;
  user-select: none;
  align-items: center;
  justify-content: flex-end;
  -webkit-app-region: drag;
  .control {
    height: 30px;
    display: flex;
    -webkit-app-region: no-drag;
    .item {
      width: 40px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #dedede;
      }
      &:active {
        background-color: #dbdbdb;
      }
    }
  }
}
</style>
