<script setup lang="ts">
import { usePublicStore, useConfigStore } from '@/store'
const publicStore = usePublicStore()
const configStore = useConfigStore()
onMounted(async () => {
  let data = await window.ipcRenderer.invoke('compress-img', {
    imagePaths: JSON.parse(JSON.stringify(publicStore.uploadedImages)),
    outputDir: configStore.exportPath,
    quality: 60,
    resolution: 500,
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
