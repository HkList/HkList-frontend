import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/user',
    },
    {
      path: '/user',
      component: () => import('@/views/UserPlatform.vue'),
      redirect: '/user/parse',
      children: [
        {
          path: '/user/parse',
          component: () => import('@/components/UserPlatform/ParsePage/index.vue'),
        },
        {
          path: '/user/token',
          component: () => import('@/components/UserPlatform/TokenPage/index.vue'),
        },
        {
          path: '/user/history',
          component: () => import('@/components/UserPlatform/HistoryPage/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/install',
      component: () => import('@/views/Install.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/views/AdminPlatform.vue'),
      redirect: '/admin/account',
      children: [
        {
          path: '/admin/config',
          redirect: '/admin/config/general',
          children: [
            {
              path: '/admin/config/general',
              component: () => import('@/components/AdminPlatform/Config/General.vue'),
            },
            {
              path: '/admin/config/parse',
              component: () => import('@/components/AdminPlatform/Config/Parse/index.vue'),
            },
            {
              path: '/admin/config/limit',
              component: () => import('@/components/AdminPlatform/Config/Limit.vue'),
            },
            {
              path: '/admin/config/mail',
              component: () => import('@/components/AdminPlatform/Config/Mail.vue'),
            },
            {
              path: '/admin/config/proxy',
              component: () => import('@/components/AdminPlatform/Config/Proxy.vue'),
            },
          ],
        },
        {
          path: '/admin/account',
          component: () => import('@/components/AdminPlatform/Account/index.vue'),
        },
        {
          path: '/admin/blacklist',
          component: () => import('@/components/AdminPlatform/Blacklist/index.vue'),
        },
        {
          path: '/admin/record',
          component: () => import('@/components/AdminPlatform/Record/index.vue'),
        },
        {
          path: '/admin/token',
          component: () => import('@/components/AdminPlatform/Token/index.vue'),
        },
      ],
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('admin_password')) {
    if (to.path.includes('login')) return next('/admin')
  } else {
    if (to.path.includes('admin')) return next('/login')
  }
  next()
})

export default router
