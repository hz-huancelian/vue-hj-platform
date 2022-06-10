
import Layout from '@/layout'
const collectRoutes = {
  path: '/sample',
  component: Layout,
  name: 'sample',
  meta: {
    title: '采样管理',
    icon: 'caiyangguanli'
  },
  children: [
    {
      path: 'sampleList',
      component: () => import('@/views/sample'),
      name: 'sampleList',
      meta: { title: '采样列表' }
    },
    // {
    //   path: 'sampleDetail/:sampTaskId',
    //   component: () => import('@/views/sample/sampleDetail'),
    //   name: 'sampleDetail',
    //   meta: { title: '采样任务详情' },
    //   hidden: true
    // },
    {
      path: 'sampleTask',
      component: () => import('@/views/sampleTask'),
      name: 'sampleTask',
      meta: { title: '任务分配' }
    },
    {
      path: 'sampleApprove',
      component: () => import('@/views/sample/approve/approveList'),
      name: 'sampleApprove',
      meta: { title: '采样审核' }
    }
    // {
    //   path: 'sampleAllList/:sampTaskId',
    //   component: () => import('@/views/sample/sampleAllList'),
    //   name: 'sampleAllList',
    //   meta: { title: '样品列表' },
    //   hidden: true
    // }
  ]
}

export default collectRoutes
