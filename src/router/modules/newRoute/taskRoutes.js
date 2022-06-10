
import Layout from '@/layout'
const taskRoutes = {
  path: '/task',
  component: Layout,
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
      meta: { title: '任务调度  ' }
    }
  ]
}

export default taskRoutes
