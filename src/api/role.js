import request from '@/utils/request'

// 角色列表
export function getRoleList(params) {
  return request({
    url: `/sys/role/getPageByCondition`,
    method: 'get',
    params
  })
}

// 角色新增
export function addRoleInfo(params) {
  return request({
    url: `/sys/role/saveRole`,
    method: 'get',
    params
  })
}

// 角色修改
export function updRoleInfo(data) {
  return request({
    url: `/sys/role/modifyRoleById`,
    method: 'post',
    data
  })
}

// 角色配置
export function saveRolePerms(data) {
  return request({
    url: `/sys/role/saveRolePerms`,
    method: 'post',
    data
  })
}

// 删除角色信息
export function delRolePerms(roleId) {
  return request({
    url: `/sys/role/delByRoleId/${roleId}`,
    method: 'get'
  })
}

// 角色列表查看
export function findPermsByRoleId(roleId) {
  return request({
    url: `/sys/role/findPermsByRoleId/${roleId}`,
    method: 'get'
  })
}

// 获取角色列表字典
export function findRoleList() {
  return request({
    url: `/sys/role/findRoleList`,
    method: 'get'
  })
}
