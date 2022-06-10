import request from '@/utils/request'

// 机构合同基本信息新增
export function addOwnerContBase(data) {
  return request({
    url: `/owner/contract/addOwnerContBase`,
    method: 'post',
    data
  })
}

// 机构合同基本信息修改
export function modifyOwnerContBaseById(data) {
  return request({
    url: `/owner/contract/modifyOwnerContBaseById`,
    method: 'post',
    data
  })
}

// 根据ID查看合同基本信息详情
export function findOwnById(id) {
  return request({
    url: `/owner/contract/findById/${id}`,
    method: 'get'
  })
}

// 根据ID查看合同基本信息详情
export function findByOrganId(organId) {
  return request({
    url: `/owner/contract/findByOrganId/${organId}`,
    method: 'get'
  })
}
