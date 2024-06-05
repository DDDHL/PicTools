<script setup lang="ts">
import { ImageAdd24Regular } from '@vicons/fluent'
import { usePublicStore, useConfigStore } from '@/store'
import { useMessage } from 'naive-ui'
import { setLocalStore } from '@/hooks/useLocalConfig'
const message = useMessage()
const publicStore = usePublicStore()
const configStore = useConfigStore()
let timer = 0

const loading = ref(false)
const handleUpload = (data: { file: { file: File } }) => {
  if (!publicStore.uploadedImages.length) {
    loading.value = true
  }
  if (
    !publicStore.uploadedImages.some(
      (item) => item.path === data.file.file.path
    )
  ) {
    publicStore.uploadedImages.push(data.file.file)
  }
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    loading.value = false
  }, 1000)
}

const handlePositiveClick = () => {
  publicStore.uploadedImages = []
}

async function selectDirectory() {
  try {
    const path = await window.ipcRenderer.invoke('get-path')
    if (path) {
      configStore.exportPath = path
      setLocalStore()
    } else {
      message.error('设置路径失败')
    }
  } catch (error) {}
}

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="selectImg">
    <section class="tabs">
      <n-h1 class="title"> PicTools </n-h1>
      <n-tabs type="segment" animated>
        <n-tab-pane name="chap1" tab="导入图片">
          <n-spin :show="loading">
            <div class="selectPic">
              <n-upload
                multiple
                directory-dnd
                :default-upload="false"
                :show-file-list="false"
                @before-upload="handleUpload($event)"
              >
                <n-upload-dragger>
                  <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3">
                      <ImageAdd24Regular />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 16px">
                    点击或者拖动文件/文件夹到该区域导入图片
                  </n-text>
                  <n-p depth="3" style="margin: 8px 0 0 0">
                    支持格式：PNG/JPG/JPEG/RAW
                  </n-p>
                </n-upload-dragger>
              </n-upload>
            </div>
          </n-spin>
          <div
            class="picList"
            v-show="!loading && publicStore.uploadedImages.length"
          >
            <p>已导入图片</p>
            <n-popconfirm
              @positive-click="handlePositiveClick"
              positive-text="删除"
              negative-text="取消"
            >
              <template #trigger>
                <n-button type="error"> 删除全部 </n-button>
              </template>
              确定移除导入的图片吗？
            </n-popconfirm>
          </div>
          <div
            class="showList"
            v-show="!loading && publicStore.uploadedImages.length"
          >
            <n-image-group show-toolbar-tooltip>
              <n-space justify="center">
                <n-image
                  v-for="item in publicStore.uploadedImages"
                  width="90"
                  :src="item.path"
                  class="imgItem"
                />
              </n-space>
            </n-image-group>
          </div>
        </n-tab-pane>
        <n-tab-pane name="chap2" tab="导出设置">
          <div class="selectFolder">
            <div class="item">
              <p>导出路径</p>
              <n-button text @click="selectDirectory">
                {{ configStore.exportPath }}
              </n-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </section>
  </div>
</template>

<style scoped lang="scss">
.selectImg {
  width: 80%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: 10%;

  .title {
    text-align: center;
    color: #378af1;
    margin-top: 2vh;
  }
  .selectPic {
    width: 70vw;
  }
  .selectFolder {
    width: 70vw;
    .item {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }
  .picList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  .showList {
    margin-top: 15px;
    border: 1px dashed rgb(224, 224, 230);
    border-radius: 4px;

    .imgItem {
      border: 1px solid #dedede;
      border-radius: 4px;
      margin-top: 5px;
    }
  }
}
</style>
