
import Layout from '@/layout'
const basicRoutes = {
  path: '/basic',
  component: Layout,
  redirect: '/basic/orderList',
  name: 'basic',
  meta: {
    title: '基础信息管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'customList',
      component: () => import('@/views/customer/customerList'),
      name: 'customList',
      meta: { title: '客户列表' }
    },
    {
      path: 'judgeList',
      component: () => import('@/views/system/judge'),
      name: 'judgeList',
      meta: { title: '分包机构列表' }
    },
    {
      path: 'factorList',
      component: () => import('@/views/system/factor/factorList'),
      name: 'factorList',
      meta: { title: '因子列表' }
    }
  ]
}

export default basicRoutes
