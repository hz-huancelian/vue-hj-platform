
import Layout from '@/layout'
const laborRoutes = {
  path: '/check',
  component: Layout,
  redirect: '/check/orderList',
  name: 'check',
  meta: {
    title: '实验室管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'laboratory',
      component: () => import('@/views/laboratory/index'),
      name: 'laboratory',
      meta: { title: '实验样品列表' }
    }
  ]
}

export default laborRoutes
