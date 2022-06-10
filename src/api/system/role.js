import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/role/findRolesByCondition',
    method: 'get',
    params: query
  })
}

// 查询角色列表
export function getAllRole() {
  return request({
    url: '/role/selectRoleAll',
    method: 'get'
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/role/findRoleByRoleId/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role/insertRole',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/role/delByRoleId/' + roleId,
    method: 'get'
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/role/export',
    method: 'get',
    params: query
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}
