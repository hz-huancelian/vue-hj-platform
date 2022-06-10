
import Layout from '@/layout'
const contractRoutes = {
  path: '/contract',
  component: Layout,
  name: 'contract',
  meta: {
    title: '合同管理',
    icon: 'hetongguanli'
  },
  children: [
    {
      path: 'contractList',
      component: () => import('@/views/contract'),
      name: 'contractList',
      meta: { title: '合同列表' }
    },
    {
      path: 'subContList',
      component: () => import('@/views/contract/subContract'),
      name: 'subContList',
      meta: { title: '分包合同列表' }
    },
    {
      path: 'contractApprove',
      component: () => import('@/views/contract/approve'),
      name: 'contractApprove',
      meta: { title: '合同审核' }
    },
    {
      path: 'techApprove',
      component: () => import('@/views/approve/techApprove'),
      name: 'techApprove',
      meta: { title: '评审判定' }
    },
    {
      path: 'techContApprove',
      component: () => import('@/views/approve/techContApprove'),
      name: 'techContApprove',
      meta: { title: '合同评审' }
    }
  ]
}

export default contractRoutes
