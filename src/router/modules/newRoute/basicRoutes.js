
import Layout from '@/layout'
const basicRoutes = {
  path: '/basic',
  component: Layout,
  name: 'basic',
  meta: {
    title: '基础信息管理',
    icon: 'jichuxinxiguanli'
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
    },
    {
      path: 'equipment',
      component: () => import('@/views/equipment'),
      name: 'equipment',
      meta: { title: '设备管理' }
    },
    {
      path: 'control',
      component: () => import('@/views/system/control'),
      name: 'control',
      meta: { title: '控制编号管理' }
    }
  ]
}

export default basicRoutes
