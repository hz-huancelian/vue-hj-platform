
import Layout from '@/layout'
const userRoutes = {
  path: '/task',
  component: Layout,
  redirect: '/task/userList',
  name: 'task',
  meta: {
    title: '调度管理',
    icon: 'diaoduguanli'
  },
  children: [
    {
      path: 'orderOutSource',
      component: () => import('@/views/task/orderOutSource'),
      name: 'orderOutSource',
      meta: { title: '分包判定' }
    },
    {
      path: 'orderReportTask',
      component: () => import('@/views/task/orderReportTask'),
      name: 'orderReportTask',
      meta: { title: '任务调度' }
    },
    {
      path: 'sampleTask',
      component: () => import('@/views/sampleTask'),
      name: 'sampleTask',
      meta: { title: '采样任务' }
    },
    {
      path: 'laborTask',
      component: () => import('@/views/laboratoryTask'),
      name: 'laborTask',
      meta: { title: '检测任务' }
    }

  ]
}

export default userRoutes
