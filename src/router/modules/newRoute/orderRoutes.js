
import Layout from '@/layout'
const orderRoutes = {
  path: '/order',
  component: Layout,
  name: 'order',
  meta: {
    title: '报价单管理',
    icon: 'baojiadanguanli'
  },
  children: [
    {
      path: 'orderList',
      component: () => import('@/views/order/index'),
      name: 'orderList',
      meta: { title: '报价单列表' }
    },
    {
      path: 'orderApprove',
      component: () => import('@/views/order/approve/approveList'),
      name: 'orderApprove',
      meta: { title: '报价单审核' }
    },
    {
      path: 'mealList',
      component: () => import('@/views/order/factor/mealList'),
      name: 'mealList',
      meta: { title: '因子套餐' }
    }
  ]
}

export default orderRoutes
