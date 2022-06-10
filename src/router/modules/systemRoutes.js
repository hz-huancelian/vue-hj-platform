
import Layout from '@/layout'
const systemRoutes = {
  path: '/system',
  component: Layout,
  redirect: '/system/userList',
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'userList',
      component: () => import('@/views/system/user/userList'),
      name: 'userList',
      meta: { title: '用户列表' }
    },
    {
      path: 'userNewList',
      component: () => import('@/views/system/user/index'),
      name: 'userNewList',
      meta: { title: '用户列表-新' }
    },
    {
      path: 'roleList',
      component: () => import('@/views/system/role/roleList'),
      name: 'roleList',
      meta: { title: '角色列表' }
    },
    {
      path: 'deptList',
      component: () => import('@/views/system/dept/deptList'),
      name: 'deptList',
      meta: { title: '部门列表' }
    },
    {
      path: 'ownContract',
      component: () => import('@/views/system/compone'),
      name: 'ownContract',
      meta: { title: '机构信息' }
    }
  ]
}

export default systemRoutes
