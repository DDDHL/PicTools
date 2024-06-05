<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import TitleBar from '@/components/TitleBar.vue'
import { usePublicStore } from '@/store'
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useLocalConfig } from '@/hooks/useLocalConfig'
import {
  DrawImage24Regular,
  ResizeImage24Regular,
  ImageArrowCounterclockwise24Regular,
  ImageAltText24Regular,
  Home24Regular,
} from '@vicons/fluent'
import router from './router'
const collapsed = ref(true)
const publicStore = usePublicStore()

useLocalConfig()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

watch(
  () => publicStore.uploadedImages,
  (newVal) => {
    if (newVal.length) {
      menuOptions.value.forEach((item) => {
        if (item.key !== 'selectImg') item.disabled = false
      })
    } else {
      menuOptions.value.forEach((item) => {
        if (item.key !== 'selectImg') item.disabled = true
      })
      router.push('/selectImg')
    }
  },
  {
    deep: true,
  }
)

const changeMenu = (e: string) => {
  router.push(e)
}

const menuOptions = ref<MenuOption[]>([
  {
    label: '首页设置',
    disabled: false,
    key: 'selectImg',
    icon: renderIcon(Home24Regular),
  },
  {
    label: '图片水印',
    disabled: true,
    key: 'waterframe',
    icon: renderIcon(ResizeImage24Regular),
  },
  {
    label: '图片修改',
    disabled: true,
    key: 'edit',
    icon: renderIcon(DrawImage24Regular),
  },
  {
    label: '图片压缩',
    disabled: true,
    key: 'compress',
    icon: renderIcon(ImageAltText24Regular),
  },
  {
    label: '格式转换',
    disabled: true,
    key: 'exchange',
    icon: renderIcon(ImageArrowCounterclockwise24Regular),
  },
])
</script>

<template>
  <TitleBar />
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-space vertical>
        <n-layout has-sider>
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="155"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
          >
            <n-menu
              default-value="selectImg"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              @update-value="changeMenu"
            />
          </n-layout-sider>
          <n-layout>
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </n-layout>
        </n-layout>
      </n-space>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped lang="scss">
:deep(.n-layout-sider-scroll-container) {
  height: calc(100vh - 35px);
}
</style>
