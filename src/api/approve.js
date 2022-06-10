import request from '@/utils/request'

// 分页查询报价单列表
export function findOfferInfosByCondition(params) {
  return request({
    url: `/approval/offer/findOfferByCondition`,
    method: 'get',
    params
  })
}

// 报价单审核
export function offerInfosCheck(params) {
  return request({
    url: `/approval/offer/check`,
    method: 'get',
    params
  })
}

// 产看报价单审核信息
export function findOfferApprovalRecordByOfferId(offerId) {
  return request({
    url: `/approval/offer/findOfferApprovalRecordByOfferId/${offerId}`,
    method: 'get'
  })
}

// 分包判断查看
export function findOfferJudgeByCondition(params) {
  return request({
    url: `/approval/offer/findOfferJudgeByCondition`,
    method: 'get',
    params
  })
}

// 分包登记
export function offerJudge(data) {
  return request({
    url: `/approval/offer/judge`,
    method: 'post',
    data
  })
}

/** ************************合同评审************************** */

// 评审判定
export function auditOffer(data) {
  return request({
    url: `/approval/offer/auditOffer`,
    method: 'post',
    data
  })
}

// 合同评审
export function doAuditCont(data) {
  return request({
    url: `/approval/contract/doAuditCont`,
    method: 'post',
    data
  })
}

/** ************************合同评审************************** */

// 分页查询调度任务
export function findOfferDispatch(params) {
  return request({
    url: `/offerDispatch/info/findByCondition`,
    method: 'get',
    params
  })
}
