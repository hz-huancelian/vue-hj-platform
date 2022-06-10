import request from '@/utils/request'

// 因子列表
export function getFactorListForPage(params) {
  return request({
    url: `/factor/findCheckStandardsByCondition`,
    method: 'get',
    params
  })
}

// 因子修改
export function updateStandard(data) {
  return request({
    url: `/factor/modifyCheckStandardById`,
    method: 'post',
    data
  })
}

/** **************************************************** */
// 分页查询因子套餐信息
export function findPageByCondition(params) {
  return request({
    url: `/factor/group/findPageByCondition`,
    method: 'get',
    params
  })
}
// 查询因子套餐信息 - 自由因子套餐
export function findFreeFactorGroup() {
  return request({
    url: `/factor/group/findFreeFactorGroup`,
    method: 'get'
  })
}

// 查询因子套餐信息 - 自由因子套餐
export function findHomFactorGroup() {
  return request({
    url: `/factor/group/findHomFactorGroup`,
    method: 'get'
  })
}

// 因子套餐新增
export function saveFactorGroup(data) {
  return request({
    url: `/factor/group/saveFactorGroup`,
    method: 'post',
    data
  })
}

// 因子套餐修改
export function modifyFactorGroupByGroupId(data) {
  return request({
    url: `/factor/group/modifyFactorGroupByGroupId`,
    method: 'post',
    data
  })
}
// 因子套餐删除
export function delByGroupId(groupId) {
  return request({
    url: `/factor/group/delByGroupId/${groupId}`,
    method: 'get'
  })
}

// 因子套餐复制
export function copyByGroupId(groupId) {
  return request({
    url: `/factor/group/copyByGroupId/${groupId}`,
    method: 'get'
  })
}

// 根据套餐ID查看套餐信息
export function findCheckStandardsByGroupId(groupId) {
  return request({
    url: `/factor/group/findCheckStandardsByGroupId/${groupId}`,
    method: 'get'
  })
}

// 查看套餐信息
export function findGroupList() {
  return request({
    url: `/factor/group/findList`,
    method: 'get'
  })
}
// 查看套餐信息
export function findGroupListForType(params) {
  return request({
    url: `/factor/group/findPageByCondition`,
    method: 'get'
  })
}

