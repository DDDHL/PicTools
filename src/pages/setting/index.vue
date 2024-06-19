<script setup lang="ts">
import { Info24Regular } from '@vicons/fluent'
import { useConfigStore } from '@/store'
import { setLocalStore } from '@/hooks/useLocalConfig'
import { useMessage, useDialog } from 'naive-ui'
const configStore = useConfigStore()
const dialog = useDialog()
const message = useMessage()
const concurrenceOptions = computed(() => {
  return Array.from({ length: 20 }, (_v, k) => ({
    label: k + 1,
    value: k + 1,
  }))
})

const deleteCache = () => {
  const d = dialog.warning({
    title: '警告',
    content: '确定删除缓存？删除后无法恢复!',
    negativeText: '取消',
    positiveText: '确认删除',
    onPositiveClick: () => {
      d.loading = true
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
          message.success('删除成功')
        }, 3000)
      })
    },
  })
}

const recoverConfig = () => {
  const d = dialog.warning({
    title: '警告',
    content: '确定恢复默认配置？',
    negativeText: '取消',
    positiveText: '确认恢复',
    onPositiveClick: () => {
      d.loading = true
      return new Promise<void>((resolve) => {
        configStore.$reset()
        setLocalStore()
        resolve()
        message.success('恢复成功')
      })
    },
  })
}
</script>

<template>
  <div class="setting">
    <div class="list">
      <n-list bordered>
        <template #header>
          <h3>软件设置</h3>
        </template>
        <template #footer>
          <p style="color: #b6b7b8">Design by holden</p>
        </template>
        <n-list-item
          ><div class="leftWrap">
            <p>默认菜单栏展开</p>
            <n-tooltip placement="bottom" trigger="click">
              <template #trigger>
                <n-icon size="15" color="#262626">
                  <Info24Regular />
                </n-icon>
              </template>
              <span>软件打开时是否展开菜单栏</span>
            </n-tooltip>
          </div>
          <template #suffix>
            <div class="rightWrap">
              <n-switch
                :round="false"
                v-model:value="configStore.menuExpand"
                @update:value="setLocalStore()"
              />
            </div>
          </template>
        </n-list-item>
        <n-list-item>
          <div class="leftWrap">
            <p>缓存文件</p>
            <n-tooltip placement="bottom" trigger="click">
              <template #trigger>
                <n-icon size="15" color="#262626">
                  <Info24Regular />
                </n-icon>
              </template>
              <span>导入图片生成的略缩图文件</span>
            </n-tooltip>
          </div>
          <template #suffix>
            <div class="rightWrap">
              <n-button type="error" @click="deleteCache">删除</n-button>
            </div>
          </template>
        </n-list-item>
        <n-list-item>
          <div class="leftWrap">
            <p>配置文件</p>
            <n-tooltip placement="bottom" trigger="click">
              <template #trigger>
                <n-icon size="15" color="#262626">
                  <Info24Regular />
                </n-icon>
              </template>
              <span>恢复默认配置文件</span>
            </n-tooltip>
          </div>
          <template #suffix>
            <div class="rightWrap">
              <n-button type="info" @click="recoverConfig">恢复</n-button>
            </div>
          </template>
        </n-list-item>
        <n-list-item>
          <div class="leftWrap">
            <p>文件大小显示单位</p>
          </div>
          <template #suffix>
            <div class="rightWrap">
              <n-select
                v-model:value="configStore.sizeUnit"
                :options="[
                  {
                    label: 'MB',
                    value: 'MB',
                  },
                  {
                    label: 'KB',
                    value: 'KB',
                  },
                ]"
                @update:value="setLocalStore()"
              />
            </div>
          </template>
        </n-list-item>
        <n-list-item>
          <div class="leftWrap">
            <p>压缩并发数量</p>
            <n-tooltip placement="bottom" trigger="click">
              <template #trigger>
                <n-icon size="15" color="#262626">
                  <Info24Regular />
                </n-icon>
              </template>
              <span>控制压缩的图片并发数量，与机器性能正相关</span>
            </n-tooltip>
          </div>
          <template #suffix>
            <div class="rightWrap">
              <n-select
                v-model:value="configStore.concurrence"
                :options="concurrenceOptions"
                @update:value="setLocalStore()"
              />
            </div>
          </template>
        </n-list-item>
      </n-list>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting {
  width: 100%;
  height: calc(100vh - 35px);
  display: flex;
  justify-content: center;
  @include bgColor();
  .list {
    margin-top: 3vh;
    width: calc(100% - 6vh);
    .leftWrap {
      display: flex;
      align-items: center;
      p {
        margin-right: 5px;
      }
    }
    .rightWrap {
      display: flex;
      justify-content: flex-end;
      width: 10vw;
      .n-button {
        width: 10vw;
      }
    }
  }
}
</style>
