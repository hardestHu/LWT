import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/content',
    component: Layout,
    name: 'content',
    meta: { title: '内容发布', icon: 'el-icon-s-help' },
    redirect: '/content/banner',
    children: [
      {
        path: 'banner',
        name: 'banner',
        meta: { title: 'banner' }
      },
      {
        path: 'notice',
        name: 'notice',
        meta: { title: '通知公告' }
      },
      {
        path: 'news',
        name: 'news',
        meta: { title: '新区资讯' }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    name: 'menu',
    meta: { title: '入口管理', icon: 'el-icon-s-help' },
    redirect: '/menu/news',
    children: [
      {
        path: 'news',
        name: 'news',
        meta: { title: '政策资讯' }
      },
      {
        path: 'credential',
        name: 'credential',
        meta: { title: '证件办理' }
      },
      {
        path: 'life',
        name: 'life',
        meta: { title: '生活服务' }
      }
    ]
  },
  {
    path: '/authority',
    component: Layout,
    name: 'authority',
    meta: { title: '权限管理', icon: 'el-icon-s-help' },
    redirect: '/authority/member',
    children: [
      {
        path: 'member',
        name: 'member',
        meta: { title: '成员管理' }
      },
      {
        path: 'notice',
        name: 'notice',
        meta: { title: '权限说明' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
