import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'
import hideOtherRoutes from './modules/hideOtherRoutes'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard' },
        hidden: true
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/index'),
        name: 'profile',
        meta: { title: '个人中心', noCache: true },
        hidden: true
      },
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '密码修改', noCache: true },
        hidden: true
      },
      {
        path: 'sysPdfView',
        component: () => import('@/views/report/pdlView'),
        name: 'sysPdfView',
        meta: { title: '详情查看' },
        hidden: true
      },
      {
        path: 'sampleDetail/:sampTaskId',
        component: () => import('@/views/sample/sampleDetail'),
        name: 'sampleDetail',
        meta: { title: '采样任务详情' },
        hidden: true
      },
      {
        path: 'sampleAllList/:sampTaskId',
        component: () => import('@/views/sample/sampleAllList'),
        name: 'sampleAllList',
        meta: { title: '样品列表' },
        hidden: true
      },
      {
        path: 'laboratoryDetail/:checkTaskId',
        component: () => import('@/views/laboratory/laboratoryDetail'),
        name: 'laboratoryDetail',
        meta: { title: '检测任务因子列表' },
        hidden: true
      }
    ]
  },
  hideOtherRoutes
]

export const asyncRoutes = [
  // orderRoutes,
  // taskRoutes,
  // contractRoutes,
  // collectRoutes,
  // stockRoutes,
  // checkRoutes,
  // reportRoutes,
  // basicRoutes,
  // systemRoutes

]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重制 router
}

export default router
