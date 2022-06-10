
import Layout from '@/layout'
const sampleRoutes = {
  path: '/report',
  component: Layout,
  redirect: '/report/reportList',
  name: 'report',
  meta: {
    title: '采样管理',
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
      path: 'pdfView/:path/:type',
      component: () => import('@/views/report/pdlView'),
      name: 'pdfView',
      meta: { title: '报告详情查看' },
      hidden: true
    }
  ]
}

export default sampleRoutes
