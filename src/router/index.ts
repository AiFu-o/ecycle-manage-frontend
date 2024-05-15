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
        }, {
          path: '/commodity-category/edit/:id',
          name: 'commodity-categor-edit',
          meta: {
            title: "商品分类编辑",
          },
          component: () => import('../views/commodity-category/edit.vue'),
        },
        {
          path: '/provider-apply',
          name: 'provider-apply',
          meta: {
            title: "回收商申请单",
            group: "用户"
          },
          component: () => import('../views/provider-apply/index.vue'),
        },
        {
          path: '/provider-apply/detail/:id',
          name: 'provider-apply-detail',
          meta: {
            title: "回收商申请单详情",
          },
          component: () => import('../views/provider-apply/detail.vue'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
  ]
})

export default router
