
import Layout from '@/layout'
const orderRoutes = {
  path: '/order',
  component: Layout,
  redirect: '/order/orderList',
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
      path: 'contractList',
      component: () => import('@/views/contract'),
      name: 'contractList',
      meta: { title: '合同列表' }
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
