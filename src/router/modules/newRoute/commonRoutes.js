
import Layout from '@/layout'
const basicRoutes = {
  path: '/proDashboard',
  component: Layout,
  name: 'proDashboard',
  children: [
    {
      path: 'proIndex',
      component: () => import('@/views/dashboard/proIndex'),
      name: 'proIndex',
      meta: { title: '工作台', icon: 'dashboard' }
    }
  ]
}

export default basicRoutes
