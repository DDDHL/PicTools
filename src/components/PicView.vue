<script setup lang="ts">
import Panzoom from '@panzoom/panzoom'
import { usePublicStore } from '@/store'
const publicStore = usePublicStore()
const container = ref<HTMLDivElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const imgSrc = computed(() => {
  let item = publicStore.uploadedImages.filter((item) => item.selected)
  return item.at(-1)?.path
})
let panzoomInstance: any
const centerImage = () => {
  if (container.value && image.value) {
    const containerRect = container.value.getBoundingClientRect()
    const imageRect = image.value.getBoundingClientRect()
    const initialX = (containerRect.width - imageRect.width) / 2
    const initialY = (containerRect.height - imageRect.height) / 2
    panzoomInstance.pan(initialX, initialY)
  }
}

onMounted(() => {
  if (image.value && container.value) {
    panzoomInstance = Panzoom(image.value, {
      maxScale: 100,
      minScale: 0.125,
      panOnlyWhenZoomed: true,
      setTransform: (
        elem: HTMLElement,
        transform: { x: number; y: number; scale: number }
      ) => {
        elem.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
      },
    })
    container.value.addEventListener('wheel', panzoomInstance.zoomWithWheel)
    centerImage()
  }
})

watch(imgSrc, () => {
  if (panzoomInstance) {
    panzoomInstance.reset()
    nextTick(() => {
      centerImage()
    })
  }
})
</script>

<template>
  <div class="picView" ref="container">
    <img :src="imgSrc" alt="img" ref="image" />
  </div>
</template>

<style scoped lang="scss">
.picView {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px dashed;
  box-sizing: border-box;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
