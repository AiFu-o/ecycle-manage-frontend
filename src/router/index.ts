import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    children: [{
      path: '/commodity',
      name: 'commodity',
      meta: {
        title: "全部商品",
        group: "商品"
      },
      component: () => import('../views/commodity/index.vue'),
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  ]
})

export default router
