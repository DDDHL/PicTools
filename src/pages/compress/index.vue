<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
import type { uploadedImagesType } from '@/types'
import { h } from 'vue'
import { NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
const publicStore = usePublicStore()
const configStore = useConfigStore()
const columns = ref()
const message = useMessage()
const pagination = {
  pageSize: 11,
}

onMounted(async () => {
  columns.value = createColumns()
  console.log(message.success('1'))
  // let data = await window.ipcRenderer.invoke('compress-img', {
  //   imagePaths: JSON.parse(JSON.stringify(publicStore.uploadedImages)),
  //   outputDir: configStore.exportPath,
  //   quality: 60,
  //   resolution: 500,
  //   configStore.concurrence:configStore.concurrence
  // })
  // console.log(data)
})

const createColumns = (): DataTableColumns<uploadedImagesType> => {
  return [
    {
      type: 'selection',
      options: ['all', 'none'],
    },
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
            type: row.compressSize ? 'success' : 'warning',
            bordered: false,
          },
          {
            default: () => {
              if (row.compressSize == null) return '待压缩'
              return configStore.sizeUnit === 'KB'
                ? (row.compressSize / 1024).toFixed(2) + ' KB'
                : (row.compressSize / (1024 * 1024)).toFixed(2) + ' MB'
            },
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
