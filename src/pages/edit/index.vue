<script setup lang="ts">
import PicView from '@/components/PicView.vue'
import { parsePhotoMetadata } from '@/utils/getExif'
import { usePublicStore } from '@/store'
import { useMessage } from 'naive-ui'
const message = useMessage()
const publicStore = usePublicStore()
const selectedStates = computed(() =>
  publicStore.uploadedImages.map((image) => image.selected)
)
const loading = ref(false)
const data = ref({})
onMounted(() => {
  let item = publicStore.uploadedImages.filter((item) => item.selected)
  if (item.length) {
    getExifInfo(item.at(-1)!.path)
  } else {
    // 默认首图选中
    publicStore.uploadedImages[0].selected = true
  }
})

watch(selectedStates, async (newVal, oldVal) => {
  const changedToTrue = newVal.some(
    (selected, index) => selected && !oldVal[index]
  )
  if (changedToTrue) {
    const selectedItems = publicStore.uploadedImages.filter(
      (image) => image.selected
    )
    getExifInfo(selectedItems[0].path)
  }
})

const getExifInfo = async (path: string) => {
  try {
    loading.value = true
    data.value = await parsePhotoMetadata(path)
    console.log(data.value)
  } catch (error) {
    console.log(error)
    message.error('获取图片信息错误')
  }
  loading.value = false
}
</script>

<template>
  <div class="edit">
    <section class="view">
      <PicView />
    </section>
    <section class="tools">
      <div class="item" v-for="(item, key) in data">
        <p>{{ key }}</p>
        <!-- <n-input :value="item" type="text" placeholder="基本的 Input" /> -->
        <p>{{ item }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.edit {
  width: 100%;
  height: calc(100vh - 35px);
  @include bgColor();
  overflow: auto;
  display: flex;
  .view {
    flex: 1;
    margin-left: 1%;
    height: calc(99% - 100px);
    margin-top: 1%;
  }
  .tools {
    width: 350px;
    height: calc(99% - 100px);
    margin: 1% 1% 0 1%;
    background-color: #fff;
    box-shadow: $boxShadow;
    overflow: auto;
    .item {
      width: 100%;
      display: flex;
      margin-bottom: 3%;
      align-items: center;
      p {
        width: 30%;
        text-align: center;
      }
      .n-input {
        width: 65%;
      }
      &:first-child {
        margin-top: 3%;
      }
    }
  }
}
</style>
