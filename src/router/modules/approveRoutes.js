
import Layout from '@/layout'
const orderRoutes = {
  path: '/approve',
  component: Layout,
  redirect: '/approve/orderApprove',
  name: 'approve',
  meta: {
    title: '审核管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'orderApprove',
      component: () => import('@/views/order/approve/approveList'),
      name: 'orderApprove',
      meta: { title: '报价单审核' }
    },
    {
      path: 'contractApprove',
      component: () => import('@/views/contract/approve'),
      name: 'contractApprove',
      meta: { title: '合同审核' }
    },
    {
      path: 'techContApprove',
      component: () => import('@/views/approve/techContApprove'),
      name: 'techContApprove',
      meta: { title: '技术审核' }
    },
    {
      path: 'sampleApprove',
      component: () => import('@/views/sample/approve/approveList'),
      name: 'sampleApprove',
      meta: { title: '采样审核' }
    },
    {
      path: 'experApprove',
      component: () => import('@/views/laboratory/approve/approveList'),
      name: 'experApprove',
      meta: { title: '实验样品审核' }
    }
  ]
}

export default orderRoutes
