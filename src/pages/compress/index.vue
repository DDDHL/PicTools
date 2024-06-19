<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
import type { uploadedImagesType } from '@/types'
import { h } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
const publicStore = usePublicStore()
const configStore = useConfigStore()
const data = ref<uploadedImagesType[]>()
const columns = ref()
const message = useMessage()
const pagination = {
  pageSize: 10,
}

onMounted(async () => {
  data.value = createData()
  columns.value = createColumns({
    sendMail(rowData) {
      message.info('send mail to ' + rowData.name)
    },
  })
  console.log(configStore.sizeUnit)
  // let data = await window.ipcRenderer.invoke('compress-img', {
  //   imagePaths: JSON.parse(JSON.stringify(publicStore.uploadedImages)),
  //   outputDir: configStore.exportPath,
  //   quality: 60,
  //   resolution: 500,
  // })
  // console.log(data)
})

const createColumns = ({
  sendMail,
}: {
  sendMail: (rowData: uploadedImagesType) => void
}): DataTableColumns<uploadedImagesType> => {
  return [
    {
      title: '图片名称',
      key: 'name',
    },
    {
      title: '图片路径',
      key: 'path',
    },
    {
      title: '原文件大小',
      key: 'size',
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
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => sendMail(row),
          },
          { default: () => 'Send Email' }
        )
      },
    },
  ]
}

const createData = (): uploadedImagesType[] => {
  return publicStore.uploadedImages
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
        :data="data"
        :pagination="pagination"
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
    height: 150px;
    @include cardStyle();
    border-radius: 0;
  }
  .table {
    width: $width;
    height: 100px;
    margin-top: 2vh;

    :deep(.n-data-table-wrapper) {
      box-shadow: $boxShadow;
    }
  }
}
</style>
