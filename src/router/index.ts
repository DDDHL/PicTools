import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/edit',
  },
  {
    path: '/waterframe',
    name: 'waterframe',
    component: () => import('@/pages/waterframe/index.vue'),
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: () => import('@/pages/exchange/index.vue'),
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('@/pages/edit/index.vue'),
  },
  {
    path: '/compress',
    name: 'compress',
    component: () => import('@/pages/compress/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
