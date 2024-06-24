<script setup lang="ts">
import {
  WindowMaximizeRegular,
  WindowRestoreRegular,
  WindowCloseRegular,
} from '@vicons/fa'
import { Subtract12Filled } from '@vicons/fluent'
const isMaximized = ref(false)

const maxWatch = window.safeIpc.on('maximize', () => {
  isMaximized.value = true
})

const restoreWatch = window.safeIpc.on('restore', () => {
  isMaximized.value = false
})

function minimizeWindow() {
  window.safeIpc.send('minimize')
}

function toggleMaximizeWindow() {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    window.safeIpc.send('maximize')
  } else {
    window.safeIpc.send('restore')
  }
}

function closeWindow() {
  window.safeIpc.send('close')
}

onUnmounted(() => {
  maxWatch()
  restoreWatch()
})
</script>

<template>
  <div class="titleBar">
    <section class="left">
      <img src="/logo.ico" alt="icon" />
      <p>PicTools</p>
    </section>
    <section class="control">
      <div class="item" @click="minimizeWindow">
        <n-icon size="20">
          <Subtract12Filled />
        </n-icon>
      </div>
      <div class="item" @click="toggleMaximizeWindow">
        <n-icon size="15">
          <component
            :is="isMaximized ? WindowRestoreRegular : WindowMaximizeRegular"
          />
        </n-icon>
      </div>
      <div class="item" @click="closeWindow">
        <n-icon size="15">
          <component :is="WindowCloseRegular" />
        </n-icon>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.titleBar {
  width: 100vw;
  height: 35px;
  display: flex;
  user-select: none;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  border: 1px solid #efeff5;
  .left {
    display: flex;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
      margin: 0 5px;
    }
  }
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
        background-color: #e3e3e3;
      }
      &:active {
        background-color: #cacaca;
      }
    }
  }
}
</style>
