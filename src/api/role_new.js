import request from '@/utils/request'
// TOOD 0726角色管理改造

/* **************************新***************************** */

// 分页查询角色信息
export function listRole(params) {
  return request({
    url: `/role/findRolesByCondition`,
    method: 'get',
    params
  })
}

// 根据角色ID查询角色信息
export function getRole(roleId) {
  return request({
    url: `/role/findRoleByRoleId/${roleId}`,
    method: 'get'
  })
}

// 根据角色ID删除角色信息
export function delRole(roleId) {
  return request({
    url: `/sys/role/delByRoleId/${roleId}`,
    method: 'get'
  })
}

// 根据角色ID批量删除角色信息
export function delByRoleIds(roleIds) {
  return request({
    url: `/sys/role/delByRoleIds/${roleIds}`,
    method: 'get'
  })
}

// 角色新增
export function addRole(data) {
  return request({
    url: `/sys/role/insertRole`,
    method: 'post',
    data
  })
}

// 角色修改
export function updateRole(data) {
  return request({
    url: `/sys/role/updateRole`,
    method: 'post',
    data
  })
}

// 修改角色权限范围
export function dataScope(params) {
  return request({
    url: `/sys/role/authDataScope`,
    method: 'get',
    params
  })
}

// 删除授权用户
export function authUserCancel(params) {
  return request({
    url: `/sys/role/deleteAuthUser`,
    method: 'get',
    params
  })
}

// 批量取消授权用户角色
export function authUserCancelAll(params) {
  return request({
    url: `/sys/role/deleteAuthUsers`,
    method: 'get',
    params
  })
}

// 给用户授权
export function authUserSelectAll(params) {
  return request({
    url: `/sys/role/insertAuthUsers`,
    method: 'get',
    params
  })
}
