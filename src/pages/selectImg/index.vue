<script setup lang="ts">
import { ShareCloseTray24Regular, DismissCircle24Regular } from '@vicons/fluent'
import { usePublicStore, useConfigStore } from '@/store'
import { useMessage } from 'naive-ui'
import { setLocalStore } from '@/hooks/useLocalConfig'
const message = useMessage()
const publicStore = usePublicStore()
const configStore = useConfigStore()
const loading = ref(false)

const selectPic = async () => {
  try {
    loading.value = true
    const path = await window.safeIpc.invoke('get-pic', configStore.concurrence)
    if (path && path.length > 0) {
      // 去重用的 Set，存储已存在的图片路径
      const existingPaths = new Set(
        publicStore.uploadedImages.map((item) => item.path)
      )
      const uniqueImages = path.filter(
        (item: any) => !existingPaths.has(item.path)
      )
      publicStore.uploadedImages.push(
        ...uniqueImages.map((item: any) => ({
          id: item.id,
          path: item.path,
          selected: false,
          scale: 1,
          name: item.name,
          size: item.size,
          compressCachePath: item.compressCachePath,
        }))
      )
    }
  } catch (error) {
    message.error('读取图片出错')
  }
  loading.value = false
}

const selectDirectory = async () => {
  try {
    const path = await window.safeIpc.invoke('get-directory-path')
    if (path) {
      configStore.exportPath = path
      setLocalStore()
    } else {
      message.error('设置路径失败')
    }
  } catch (error) {}
}

const deleteImg = (index: number) => {
  publicStore.uploadedImages.splice(index, 1)
}
</script>
<script lang="ts">
export default {
  name: 'selectImg',
}
</script>

<template>
  <div class="selectImg">
    <section class="tabs">
      <n-h1 class="title"> PicTools </n-h1>
      <n-tabs type="segment" animated>
        <n-tab-pane name="chap1" tab="导入图片">
          <n-spin :show="loading">
            <div class="selectPic" @click="selectPic">
              <n-icon size="90" color="#9B9B9C">
                <ShareCloseTray24Regular />
              </n-icon>
              <p>点击该区域导入图片</p>
              <p>支持PNG/JPEG/JPG/GIF/WEBP</p>
            </div>
          </n-spin>
          <div class="picList" v-show="publicStore.uploadedImages.length">
            <p>已导入图片</p>
            <n-popconfirm
              @positive-click="publicStore.uploadedImages = []"
              positive-text="删除"
              negative-text="取消"
            >
              <template #trigger>
                <n-button type="error"> 删除全部 </n-button>
              </template>
              确定移除导入的图片吗？
            </n-popconfirm>
          </div>
          <div class="showList" v-show="publicStore.uploadedImages.length">
            <n-back-top right="2%" />
            <n-image-group>
              <div
                class="iconWrap"
                v-for="(item, index) in publicStore.uploadedImages"
              >
                <n-image
                  lazy
                  object-fit="cover"
                  height="77px"
                  width="105px"
                  :src="
                    item.compressCachePath ? item.compressCachePath : item.path
                  "
                  class="imgItem"
                  :preview-src="item.path"
                />
                <n-icon
                  class="closeIcon"
                  :component="DismissCircle24Regular"
                  @click="deleteImg(index)"
                />
              </div>
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
  height: calc(100vh - 35px);
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
    border: 1px dashed #e0e0e6;
    background-color: #fafafc;
    border-radius: 3px;
    height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    p {
      font-size: 20px;
    }
    p:last-child {
      font-size: 16px;
      color: rgb(118, 124, 130);
    }
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
    margin-bottom: 60px;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 105px);
    gap: 5px;
    padding: 5px;
    .iconWrap {
      position: relative;
      width: 100%;
      height: 100%;
      .closeIcon {
        position: absolute;
        color: #fff;
        transition: color 0.3s;
        z-index: 9;
        top: 4%;
        right: 2%;
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
      .imgItem {
        border: 1px solid #dedede;
        border-radius: 4px;

        img {
          object-fit: cover;
        }
      }
    }
  }
}
</style>
<style>
.n-image-preview-toolbar {
  .n-base-icon:nth-last-child(2) {
    display: none;
    pointer-events: none;
    :is(svg) {
      pointer-events: none;
    }
  }
}
</style>
