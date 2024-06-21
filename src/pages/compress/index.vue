<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
import type { uploadedImagesType } from '@/types'
import { h } from 'vue'
import { NTag, NIcon, useMessage, useModal, NButton, NSlider } from 'naive-ui'
import { FileArchiveRegular, ClockRegular, CheckDouble } from '@vicons/fa'
import type { DataTableColumns } from 'naive-ui'
const publicStore = usePublicStore()
const configStore = useConfigStore()
const columns = ref()
const message = useMessage()
const modal = useModal()
const pagination = {
  pageSize: 11,
}

onMounted(async () => {
  columns.value = createColumns()
  // let data = await window.ipcRenderer.invoke('compress-img', {
  //   imagePaths: JSON.parse(JSON.stringify(publicStore.uploadedImages)),
  //   outputDir: configStore.exportPath,
  //   quality: 60,
  //   resolution: 500,
  //   configStore.concurrence:configStore.concurrence
  // })
  // console.log(data)
})

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
              tooltip: true,
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
  ]
}
</script>

<template>
  <div class="compress">
    <n-h1 class="title"> 图片压缩 </n-h1>
    <div class="tools"></div>
    <div class="table">
      <n-data-table
        :bordered="false"
        :single-line="false"
        :columns="columns"
        :data="publicStore.uploadedImages"
        :pagination="pagination"
        :rowKey="(row: any) => row.id"
        :style="{ height: `64.1vh` }"
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
  text-align: center;
  color: #378af1;
  margin-top: 2vh;
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
    height: 25vh;
    @include cardStyle();
    border-radius: 0;
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
  width: 100%;
  height: 50vh;
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
      top: -50vh;
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
    height: 50vh;
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
    height: 50vh;
    object-fit: cover;
  }
}
</style>
