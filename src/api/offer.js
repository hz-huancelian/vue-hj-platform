import request from '@/utils/request'

// 分页查询报价单列表
export function findOfferInfosByCondition(params) {
  return request({
    url: `/offer/findOfferInfosByCondition`,
    method: 'get',
    params
  })
}

// 分页查询报价单列表
export function findHistoryOfferInfosByCondition(params) {
  return request({
    url: `/offer/findHistoryOfferInfosByCondition`,
    method: 'get',
    params
  })
}

// 新增报价单信息
export function saveOffer(data) {
  return request({
    url: `/offer/saveOffer`,
    method: 'post',
    data
  })
}

// 修改报价单信息
export function updateOffer(data) {
  return request({
    url: `/offer/modifyOfferByOfferId`,
    method: 'post',
    data
  })
}

// 报价单信息删除
export function delOffer(offerId) {
  return request({
    url: `/offer/delByOfferId/${offerId}`,
    method: 'get'
  })
}

// 报价单信息复制
export function copyOfferByOfferId(offerId) {
  return request({
    url: `/offer/copyOfferByOfferId/${offerId}`,
    method: 'get'
  })
}

// 报价单提交审核
export function commitByOfferId(offerId) {
  return request({
    url: `/offer/commitByOfferId/${offerId}`,
    method: 'get'
  })
}

// 报价单详情信息
export function findOfferDetailsByOfferId(offerId) {
  return request({
    url: `/offer/findOfferDetailsByOfferId/${offerId}`,
    method: 'get'
  })
}

/** ****************报价单审核*************************/
// 查询部门列表信息
export function getApproveOrderList(params) {
  return request({
    url: `/sys/order/findApproveList`,
    method: 'get',
    params
  })
}

/** ****************分包机构*************************/
// 查询分包机构相关因子的能力表
export function getOrderOutSourceInfos(offerId) {
  return request({
    url: `/offer/findJudgeOfferFactorVosByOfferId/${offerId}`,
    method: 'get'
  })
}

// 查询分包机构
export function findJudgeOfferFactorQryVoByOfferId(offerId) {
  return request({
    url: `/offer/findJudgeOfferFactorQryVoByOfferId/${offerId}`,
    method: 'get'
  })
}
