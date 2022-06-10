import request from '@/utils/request'
/** ********************样品管理***********************/
// 样品管理列表（采样任务状态：采样中、已完成）
export function findByCondition(params) {
  return request({
    url: `/sample/findByCondition`,
    method: 'get',
    params
  })
}

// 样品管理-样品列表
export function getSamplesBySampTaskId(params) {
  return request({
    url: `/sample/getSamplesBySampTaskId`,
    method: 'get',
    params
  })
}

// 样品管理-样品列表-详情查看
export function getSampleDataBySampItemId(sampItemId) {
  return request({
    url: `/sample/getSampleDataBySampItemId/${sampItemId}`,
    method: 'get'
  })
}

// 申请列表-查看样品详情
export function getSampleDetailBySampItemId(sampItemId) {
  return request({
    url: `/sample/getSampleDetailBySampItemId/${sampItemId}`,
    method: 'get'
  })
}

// 申请入库样品列表
export function getSampStoreApplyList(params) {
  return request({
    url: `/sample/getSampStoreApplyList`,
    method: 'get',
    params
  })
}

// 申请出库样品列表
export function getSampDrawApplyList(params) {
  return request({
    url: `/sample/getSampDrawApplyList`,
    method: 'get',
    params
  })
}

// 样品入库
export function doStoreSample(data) {
  return request({
    url: `/sample/doStoreSample`,
    method: 'post',
    data
  })
}

// 样品出库
export function doDrawSample(data) {
  return request({
    url: `/sample/doDrawSample`,
    method: 'post',
    data
  })
}

// 批量入库
export function batchDoStoreSample(data) {
  return request({
    url: `/sample/batchDoStoreSample`,
    method: 'post',
    data
  })
}
