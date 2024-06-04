<script setup lang="ts">
import TitleBar from '@/components/TitleBar.vue'
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
  DrawImage24Regular,
  ResizeImage24Regular,
  ImageArrowCounterclockwise24Regular,
  ImageAltText24Regular,
} from '@vicons/fluent'

const collapsed = ref(true)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'waterframe',
          },
        },
        { default: () => '图片水印' }
      ),
    key: 'waterframe',
    icon: renderIcon(ResizeImage24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'edit',
          },
        },
        { default: () => '图片修改' }
      ),
    key: 'edit',
    icon: renderIcon(DrawImage24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'compress',
          },
        },
        { default: () => '图片压缩' }
      ),
    key: 'compress',
    icon: renderIcon(ImageAltText24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'exchange',
          },
        },
        { default: () => '格式转换' }
      ),
    key: 'exchange',
    icon: renderIcon(ImageArrowCounterclockwise24Regular),
  },
]
</script>

<template>
  <TitleBar />
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style scoped lang="scss">
:deep(.n-layout-sider-scroll-container) {
  height: calc(100vh - 35px);
}
</style>
