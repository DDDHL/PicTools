<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
import type { uploadedImagesType } from '@/types'
import { h } from 'vue'
import { NTag, NIcon, useMessage, useModal, NSlider } from 'naive-ui'
import {
  FileArchiveRegular,
  ClockRegular,
  CheckDouble,
  AngleDoubleDown,
} from '@vicons/fa'
import { Compress } from '@vicons/fa'
import type { DataTableColumns } from 'naive-ui'
const publicStore = usePublicStore()
const configStore = useConfigStore()
const columns = ref()
const message = useMessage()
const modal = useModal()
const pagination = {
  pageSize: 11,
}
const loading = ref(false)
const compressConfig = ref({
  quality: 60,
  resolution: '',
  outputName: '',
})
let compressStartTime = 0
onMounted(() => {
  columns.value = createColumns()
})

const compressWatch = window.safeIpc.on(
  'compress-data',
  (compressData: {
    type: 'success' | 'error' | 'compressing' | 'finish'
    data: {
      id: string
      path: string
      selected: boolean
      scale: number
      name: string
      size: number
      compressSize: number
      compressCachePath: string
    } | null
  }) => {
    console.log(compressData)
    let index = publicStore.uploadedImages.findIndex(
      (item) => item.id === compressData.data!.id
    )
    switch (compressData.type) {
      case 'compressing':
        if (index !== -1) publicStore.uploadedImages[index].compressSize = -1
        break
      case 'finish':
        loading.value = false
        message.success(
          `压缩完成！耗时：${(
            (new Date().getTime() - compressStartTime) /
            1000
          ).toFixed(2)}s`
        )
        break
      case 'success':
        if (index !== -1) publicStore.uploadedImages[index] = compressData.data!
        break
      case 'error':
        message.error(`压缩异常：${publicStore.uploadedImages[index].name}`)
        break
    }
  }
)

const compressStart = async () => {
  message.success('开始压缩 ~')
  compressStartTime = new Date().getTime()
  loading.value = true
  await window.safeIpc.invoke('compress-img', {
    imagePaths: JSON.parse(JSON.stringify(publicStore.uploadedImages)),
    outputDir: configStore.exportPath,
    concurrence: configStore.concurrence,
    ...compressConfig.value,
  })
}

const diffData = ref({
  resizeNum: 50,
  loading: false,
  compressPic: 'D:\\成品图\\DSC_0058.jpg',
  normalPic: 'D:\\成品图\\DSC_0060.jpg',
})
// 点击每一行
const rowProps = (row: uploadedImagesType) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      diffData.value.resizeNum = 50
      modal.create({
        title: '压缩图片画质对比',
        preset: 'card',
        style: {
          width: '70vw',
        },
        content: () =>
          h('div', { class: 'rowToast' }, [
            h(NSlider, {
              class: 'slider',
              value: diffData.value.resizeNum,
              tooltip: false,
              ['onUpdate:value']: (value) => {
                diffData.value.resizeNum = value
              },
            }),
            h('img', {
              class: 'compressPic',
              src: diffData.value.compressPic,
            }),
            h(
              'div',
              { class: 'pic', style: `width:${diffData.value.resizeNum}%` },
              [h('img', { class: 'normalPic', src: diffData.value.normalPic })]
            ),
          ]),
      })
    },
  }
}
const createColumns = (): DataTableColumns<uploadedImagesType> => {
  return [
    {
      title: '图片名称',
      key: 'name',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '图片路径',
      key: 'path',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '原文件大小',
      key: 'size',
      width: 120,
      align: 'center',
      sorter: (row1, row2) => {
        return Number(row1.size) - Number(row2.size)
      },
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => {
              if (row.size == null) return '异常'
              return configStore.sizeUnit === 'KB'
                ? (row.size / 1024).toFixed(2) + ' KB'
                : (row.size / (1024 * 1024)).toFixed(2) + ' MB'
            },
          }
        )
      },
    },
    {
      title: '压缩后大小',
      key: 'compressSize',
      width: 120,
      align: 'center',
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.compressSize
              ? row.compressSize === -1
                ? 'warning'
                : 'success'
              : 'info',
            bordered: false,
          },
          {
            default: () => {
              if (row.compressSize == null) return '待压缩'
              if (row.compressSize === -1) return '压缩中'
              return configStore.sizeUnit === 'KB'
                ? (row.compressSize / 1024).toFixed(2) + ' KB'
                : (row.compressSize / (1024 * 1024)).toFixed(2) + ' MB'
            },
            icon: () =>
              h(NIcon, {
                component: row.compressSize
                  ? row.compressSize === -1
                    ? ClockRegular
                    : CheckDouble
                  : FileArchiveRegular,
              }),
          }
        )
      },
    },
    {
      title: '压缩率',
      key: 'compressSize',
      width: 120,
      align: 'center',
      render: (row) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: row.compressSize
              ? row.compressSize === -1
                ? 'warning'
                : 'success'
              : 'info',
            bordered: false,
          },
          {
            default: () => {
              if (row.compressSize == null || row.compressSize === -1)
                return '0'
              return Math.floor((1 - row.compressSize / row.size) * 100) + '%'
            },
            icon: () =>
              h(NIcon, {
                component: AngleDoubleDown,
              }),
          }
        )
      },
    },
  ]
}

onUnmounted(() => {
  compressWatch()
})
</script>

<template>
  <div class="compress">
    <h2 class="title">图片压缩</h2>
    <div class="tools">
      <div class="top">
        <n-icon size="25">
          <Compress />
        </n-icon>
        <n-button
          strong
          secondary
          type="info"
          :loading="loading"
          @click="compressStart"
        >
          压缩并导出
        </n-button>
      </div>
      <n-divider />
      <div class="bottom">
        <div class="left">
          <div class="input">
            <p>像素:</p>
            <n-input-number
              v-model:value="compressConfig.resolution"
              placeholder="自动 | 保持宽高比"
              clearable
            />
          </div>
          <div class="input">
            <p>后缀:</p>
            <n-input
              v-model:value="compressConfig.outputName"
              placeholder="自动 | 原名称"
              clearable
            />
          </div>
        </div>
        <n-divider vertical />
        <div class="right">
          <p>质量:</p>
          <div class="input">
            <NSlider
              :step="1"
              :format-tooltip="(value: number) => `${value}%`"
              v-model:value="compressConfig.quality"
            />
            <n-input-number
              v-model:value="compressConfig.quality"
              placeholder="请输入质量百分比"
            />
          </div>
        </div>
      </div>
      <n-divider />
    </div>
    <div class="table">
      <n-data-table
        :bordered="false"
        :single-line="false"
        :columns="columns"
        :data="publicStore.uploadedImages"
        :pagination="pagination"
        :rowKey="(row: any) => row.id"
        :style="{ height: `67vh` }"
        flex-height
        striped
        :rowProps="rowProps"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
$width: 90%;
.title {
  margin: 1vh 0;
  color: #378af1;
}
.compress {
  width: 100%;
  height: calc(100vh - 35px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  @include bgColor();
  .tools {
    width: $width;
    height: 19vh;
    @include cardStyle();
    border-radius: 0;

    .top {
      margin-top: 1vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .n-icon {
        margin-left: 1vh;
        color: #378af1;
      }
      .n-button {
        margin-right: 1vh;
      }
    }
    .bottom {
      width: 100%;
      display: flex;
      height: 10vh;
      margin-bottom: 1vh;
      .n-divider {
        height: 8vh;
      }
      .left,
      .right {
        height: 10vh;
      }
      .left {
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .input {
          p {
            text-align: right;
          }
          display: flex;
          align-items: center;
          justify-content: space-around;
          .n-input,
          .n-input-number {
            width: 70%;
          }
        }
      }
      .right {
        width: calc(100% - 300px);
        display: flex;
        align-items: center;
        margin: 0 1%;
        p {
          width: 50px;
        }
        .input {
          width: calc(100% - 50px);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100%;
        }
      }
    }
  }

  .n-divider {
    margin: 1vh 0;
    scale: (0.97);
  }
  .table {
    width: $width;
    margin-top: 2vh;
    :deep(.n-data-table-wrapper) {
      box-shadow: $boxShadow;
    }
    :deep(.n-data-table__pagination) {
      margin-bottom: 2vh;
    }
  }
}
</style>
<style lang="scss">
.rowToast {
  $width: 3vh;
  $height: 70vh;
  width: 100%;
  height: $height;
  position: relative;
  overflow: hidden;
  margin-bottom: 2vh;
  .slider {
    position: absolute;
    top: 50%;
    z-index: 11;
  }
  .n-slider-rail,
  .n-slider-rail__fill {
    background-color: transparent !important;
  }
  .n-slider-handle {
    width: $width !important;
    height: $width !important;
    &::before {
      position: absolute;
      content: '☺︎';
      width: $width;
      height: $width;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 11;
    }
    &::after {
      content: '';
      position: absolute;
      top: calc(-1 * #{$height} / 2);
      right: calc(50% - 1px);
      z-index: 10;
      height: 100vh;
      width: 2px;
      background-color: #fff;
    }
  }
  .compressPic {
    width: 70vw;
    position: absolute;
    height: $height;
    background-color: rebeccapurple;
    object-fit: cover;
  }
  .pic {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 9;
    overflow: hidden;
  }
  .normalPic {
    width: 70vw;
    height: $height;
    object-fit: cover;
  }
}
</style>
