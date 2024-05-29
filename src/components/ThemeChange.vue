<template>
  <n-row gutter="12">
    <n-form inline>
      <n-col :span="4">
        <n-form-item label="主题色">
          <n-color-picker
            v-model:value="primaryColor"
            :show-alpha="false"
            :on-complete="setThemeOverrides"
          />
        </n-form-item>
      </n-col>
    </n-form>
  </n-row>
  <n-space>
    <n-button
      :type="themeStore.theme === null ? '' : 'primary'"
      @click="themeStore.theme = darkTheme"
      >深色</n-button
    >
    <n-button
      :type="themeStore.theme === null ? 'primary' : ''"
      @click="themeStore.theme = null"
      >浅色</n-button
    >
  </n-space>
</template>

<script lang="ts" setup>
import { generate } from '@ant-design/colors'
import { darkTheme, commonDark } from 'naive-ui'
import { useThemeStore } from '@/store'
const themeStore = useThemeStore()
const generateColors = ref<string[]>([])
const primaryColor = ref('#3580ED') // 定义一个主色

setThemeOverrides()

function setThemeOverrides() {
  generateColors.value = themeStore.theme
    ? generate(primaryColor.value, {
        // generate支持传入theme为dark生成暗黑色系
        theme: 'dark',
        // 暗黑色系生成的背景色，这里可以传入主题暗黑模式下的背景色
        backgroundColor: commonDark.bodyColor,
      })
    : generate(primaryColor.value)
  const commonColors = {
    primaryColor: generateColors.value[5],
    primaryColorHover: generateColors.value[4],
    primaryColorPressed: generateColors.value[5],
    primaryColorSuppl: generateColors.value[6],
  }
  themeStore.themeOverrides.common = commonColors
}

watch(
  () => themeStore.theme,
  () => {
    setThemeOverrides()
  }
)
</script>
