import { createRouter, createWebHistory } from 'vue-router'

/**
 * 需要分组填分组名 不需要直接写 false
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: {
        title: ''
      },
      component: () => import('../views/index.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/home/index.vue'),
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
          path: '/commodity-category',
          name: 'commodity-category',
          meta: {
            title: "商品分类",
            group: "商品"
          },
          component: () => import('../views/commodity-category/index.vue'),
        },
        {
          path: '/commodity-category/create',
          name: 'commodity-categor-create',
          meta: {
            title: "商品分类新建",
          },
          component: () => import('../views/commodity-category/edit.vue'),
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
