
import Layout from '@/layout'
const reportRoutes = {
  path: '/report',
  component: Layout,
  name: 'report',
  meta: {
    title: '报告管理',
    icon: 'baogaoguanli'
  },
  children: [
    {
      path: 'reportList',
      component: () => import('@/views/report/reportList'),
      name: 'reportList',
      meta: { title: '报告列表' }
    },
    {
      path: 'pdfView',
      component: () => import('@/views/report/pdlView'),
      name: 'pdfView',
      meta: { title: '报告详情查看' },
      hidden: true
    }
  ]
}

export default reportRoutes
