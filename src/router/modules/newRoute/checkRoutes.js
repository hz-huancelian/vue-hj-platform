
import Layout from '@/layout'
const checkRoutes = {
  path: '/check',
  component: Layout,
  name: 'check',
  meta: {
    title: '检测管理',
    icon: 'jianceguanli'
  },
  children: [
    {
      path: 'laboratory',
      component: () => import('@/views/laboratory/index'),
      name: 'laboratory',
      meta: { title: '检测列表' }
    },
    {
      path: 'laborTask',
      component: () => import('@/views/laboratoryTask'),
      name: 'laborTask',
      meta: { title: '检测任务' }
    },
    {
      path: 'experApprove',
      component: () => import('@/views/laboratory/approve/approveList'),
      name: 'experApprove',
      meta: { title: '检测审核' }
    }

  ]
}

export default checkRoutes
