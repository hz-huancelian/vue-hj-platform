import Layout from '@/layout'
const hideOtherRoutes = {
  path: '/other',
  component: Layout,
  name: 'other',
  hidden: true,
  children: [
    {
      path: 'orderReportTaskList/:taskId',
      component: () => import('@/views/task/orderReportTaskList'),
      name: 'orderReportTaskList',
      meta: { title: '任务列表' }
    },
    {
      path: 'masterConfirm/:sampTaskId',
      component: () => import('@/views/sample/masterConfirmList'),
      name: 'masterConfirm',
      meta: { title: '采样确认列表' }
    },
    {
      path: 'masterApproveList/:sampTaskId',
      component: () => import('@/views/sample/masterApproveList'),
      name: 'masterApproveList',
      meta: { title: '采样审核列表' }
    },
    {
      path: 'stockList/:sampTaskId',
      component: () => import('@/views/stock/stockList'),
      name: 'stockList',
      meta: { title: '样品列表' }
    },
    {
      path: 'laboratorTask/:checkTaskId',
      component: () => import('@/views/laboratory/laborTaskIndex'),
      name: 'laboratorTask',
      meta: { title: '检测列表' }
    }
  ]
}

export default hideOtherRoutes
