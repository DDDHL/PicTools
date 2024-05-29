<script setup lang="ts">
import { useThemeStore } from '@/store'
import {
  WindowMaximizeRegular,
  WindowRestoreRegular,
  WindowMaximize,
  WindowRestore,
  WindowCloseRegular,
  WindowClose,
} from '@vicons/fa'
import { Subtract12Filled } from '@vicons/fluent'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const themeStore = useThemeStore()
const isMaximized = ref(false)

window.ipcRenderer.on('maximize', () => {
  isMaximized.value = true
})

window.ipcRenderer.on('restore', () => {
  isMaximized.value = false
})

function minimizeWindow() {
  window.ipcRenderer.send('minimize')
}

function toggleMaximizeWindow() {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    window.ipcRenderer.send('maximize')
  } else {
    window.ipcRenderer.send('restore')
  }
}

function closeWindow() {
  window.ipcRenderer.send('close')
}
</script>

<template>
  <div
    class="titleBar"
    :style="{
      borderBottom: `1px solid ${themeVars.borderColor}`,
      background: themeVars.cardColor,
    }"
  >
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
            :is="
              themeStore.theme === null
                ? isMaximized
                  ? WindowRestoreRegular
                  : WindowMaximizeRegular
                : isMaximized
                  ? WindowRestore
                  : WindowMaximize
            "
          />
        </n-icon>
      </div>
      <div class="item" @click="closeWindow">
        <n-icon size="15">
          <component
            :is="themeStore.theme === null ? WindowCloseRegular : WindowClose"
          />
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
        background-color: #dedede;
      }
      &:active {
        background-color: #dbdbdb;
      }
    }
  }
}
</style>
