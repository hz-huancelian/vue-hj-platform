
import Layout from '@/layout'
const stockRoutes = {
  path: '/stock',
  component: Layout,
  redirect: '/stock/stockList',
  name: 'stock',
  meta: {
    title: '样品管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'stockList',
      component: () => import('@/views/stock/stockList'),
      name: 'stockList',
      meta: { title: '库存列表' }
    },
    {
      path: 'inStockList',
      component: () => import('@/views/stock/inStockList'),
      name: 'inStockList',
      meta: { title: '入库申请列表' }
    },
    {
      path: 'outStockList',
      component: () => import('@/views/stock/outStockList'),
      name: 'outStockList',
      meta: { title: '出库申请列表' }
    }
  ]
}

export default stockRoutes
