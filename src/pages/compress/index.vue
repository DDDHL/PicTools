<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
const publicStore = usePublicStore()
const configStore = useConfigStore()
onMounted(async () => {
  // let data: {
  //   buffer: Buffer
  //   fileType: string
  // }[] = await window.ipcRenderer.invoke('read-pic', [
  //   'D:\\testPic\\DSC_0033.JPG',
  // ])
  let data = await window.ipcRenderer.invoke('compress-img', {
    imagePaths: publicStore.uploadedImages.map((item) => {
      return item.path
    }),
    outputDir: configStore.exportPath,
    quality: 60,
  })
  console.log(data)
})
</script>

<template>
  <div class="compress">compress</div>
</template>

<style scoped lang="scss">
.compress {
  width: 100%;
  height: 100%;
  background-color: rgb(60, 44, 23);
}
</style>
