import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/dept/selectDeptList',
    method: 'get',
    params: query
  })
}

// // 查询部门列表（排除节点）
// export function listDeptExcludeChild(deptId) {
//   return request({
//     url: '/dept/list/exclude/' + deptId,
//     method: 'get'
//   })
// }

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/dept/selectDeptById/' + deptId,
    method: 'get'
  })
}

// // 根据角色ID查询部门树结构
// export function roleDeptTreeselect(roleId) {
//   return request({
//     url: '/dept/roleDeptTreeselect/' + roleId,
//     method: 'get'
//   })
// }

// 新增部门
export function addDept(data) {
  return request({
    url: '/dept/insertDept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/dept/updateDept',
    method: 'post',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/dept/deleteDeptById/' + deptId,
    method: 'get'
  })
}
