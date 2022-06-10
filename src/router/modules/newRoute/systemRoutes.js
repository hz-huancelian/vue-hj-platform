
import Layout from '@/layout'
const systemRoutes = {
  path: '/system',
  component: Layout,
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'xitongguanli'
  },
  children: [
    {
      path: 'userList',
      component: () => import('@/views/system/user/userList'),
      name: 'userList',
      meta: { title: '用户列表' }
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
    // {
    //   path: 'deptNewList',
    //   component: () => import('@/views/system/dept/deptNewList'),
    //   name: 'deptNewList',
    //   meta: { title: '部门列表-新' }
    // },
    {
      path: 'ownContract',
      component: () => import('@/views/system/compone'),
      name: 'ownContract',
      meta: { title: '机构信息' }
    },
    {
      path: 'userNewList',
      component: () => import('@/views/system/user/index'),
      name: 'userNewList',
      meta: { title: '用户列表-新' }
    },
    {
      path: 'newRoleList',
      component: () => import('@/views/system/role'),
      name: 'newRoleList',
      meta: { title: '角色列表-新' }
    },
    {
      path: 'newDeptList',
      component: () => import('@/views/system/dept'),
      name: 'newDeptList',
      meta: { title: '部门列表-新' }
    },
    {
      path: 'postList',
      component: () => import('@/views/system/post'),
      name: 'postList',
      meta: { title: '岗位管理-新' }
    }
  ]
}

export default systemRoutes
