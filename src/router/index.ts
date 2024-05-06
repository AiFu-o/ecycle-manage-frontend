import { createRouter, createWebHistory } from 'vue-router'

/**
 * 需要分组填分组名 不需要直接写 false
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/commodity',
    name: 'commodity',
    meta: {
      title: "商品列表",
      group: "商品"
    },
    component: () => import('../views/commodity/index.vue'),
  },
  {
    path: '/commodity-type',
    name: 'commodity-type',
    meta: {
      title: "商品分类",
      group: "商品"
    },
    component: () => import('../views/commodity/index.vue'),
  }
  ]
})

export default router
