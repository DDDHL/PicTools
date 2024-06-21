import { createApp } from 'vue'
import App from './App.vue'
import './style/public.css'
import router from '@/router'
import pinia from '@/store'
import { vLoading } from '@/directive/loading/index'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

createApp(App)
  .directive('loading', vLoading)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
