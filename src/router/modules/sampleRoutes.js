
import Layout from '@/layout'
const sampleRoutes = {
  path: '/sample',
  component: Layout,
  redirect: '/sample/sampleList',
  name: 'sample',
  meta: {
    title: '采样管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'sampleList',
      component: () => import('@/views/sample'),
      name: 'sampleList',
      meta: { title: '采样列表' }
    }
    // {
    //   path: 'sampleDetail/:sampTaskId',
    //   component: () => import('@/views/sample/sampleDetail'),
    //   name: 'sampleDetail',
    //   meta: { title: '采样任务详情' },
    //   hidden: true
    // }
  ]
}

export default sampleRoutes
