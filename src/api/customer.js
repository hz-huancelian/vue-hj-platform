import request from '@/utils/request'

// 查询客户列表信息
export function getCustomerForPage(params) {
  return request({
    url: `/cus/contract/findByCondition`,
    method: 'get',
    params
  })
}

// 客户基本信息新增
export function addCusContBase(data) {
  return request({
    url: `/cus/contract/addCusContBase`,
    method: 'post',
    data
  })
}

// 客户基本信息修改
export function modifyCusContBaseById(data) {
  return request({
    url: `/cus/contract/modifyCusContBaseById`,
    method: 'post',
    data
  })
}

// 客户基本信息删除
export function delCusContBaseById(id) {
  return request({
    url: `/cus/contract/removeById/${id}`,
    method: 'delete'
  })
}

// 根据ID查看合同基本信息详情
export function fuzzyQuery(companyName) {
  return request({
    url: `/cus/contract/fuzzyQuery/${companyName}`,
    method: 'get'
  })
}

// 根据ID查看合同基本信息详情
export function findById(id) {
  return request({
    url: `/cus/contract/findById/${id}`,
    method: 'get'
  })
}
