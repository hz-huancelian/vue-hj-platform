import request from '@/utils/request'

/* ***************************化验室任务调度*************************** */
// 分页查询检测任务列表(未完成的)
export function findByCondition(params) {
  return request({
    url: `/checkTask/findByCondition`,
    method: 'get',
    params
  })
}

// 分页查询检测任务列表(历史，已完成)
export function findHistoryByCondition(params) {
  return request({
    url: `/checkTask/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 根据检测任务号查询检测列表
export function getCheckFactorInfos(params) {
  return request({
    url: `/checkTask/getCheckFactorInfos`,
    method: 'get',
    params
  })
}

// 根据检测任务查询检测因子
export function getOfferFactorsByTaskId(checkTaskId) {
  return request({
    url: `/checkTask/getOfferFactorsByTaskId/${checkTaskId}`,
    method: 'get'
  })
}

// 因子分配
export function assignmentsFactor(data) {
  return request({
    url: `/checkTask/assignmentsFactor`,
    method: 'post',
    data
  })
}

// 检测员列表
export function getCheckUsers() {
  return request({
    url: `/checkTask/getCheckUsers`,
    method: 'get'
  })
}

/* ***************************化验室样品列表*************************** */
// 检测列表
export function findCheckFactorByCondition(params) {
  return request({
    url: `/checkFactor/findAuditCheckFactorByCondition`,
    method: 'get',
    params
  })
}
// 检测列表历史
export function findHisFactorByCondition(params) {
  return request({
    url: `/checkFactor/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 根据检测列表中的检测标准ID查询子因子
export function findSubFactorByCheckStandId(checkStandardId) {
  return request({
    url: `/checkFactor/findSubFactorByCheckStandId/${checkStandardId}`,
    method: 'get'
  })
}

// 检测录入结果提交
export function saveCheckFactorData(data) {
  return request({
    url: `/checkFactor/saveCheckFactorData`,
    method: 'post',
    data
  })
}
// 检测列表提交审核
export function submitCheckFactor(params) {
  return request({
    url: `/checkFactor/submitCheckFactor`,
    method: 'get',
    params
  })
}

// 检测负责人审核检测列表
export function auditCheckFactor(data) {
  return request({
    url: `/checkFactor/auditCheckFactor`,
    method: 'post',
    data
  })
}

// 检测员单个申请领样
export function sampDrawApply(data) {
  return request({
    url: `/checkFactor/sampDrawApply`,
    method: 'post',
    data
  })
}

// 批量审核
export function batchAuditCheckFactor(data) {
  return request({
    url: `/checkFactor/batchAuditCheckFactor`,
    method: 'post',
    data
  })
}

/** **********************检测列表任务查看**************************/
// 分页查询检测任务列表-用于检测列表
export function findCheckTaskByCondition(params) {
  return request({
    url: `/checkTask/findCheckTaskByCondition`,
    method: 'get',
    params
  })
}

// 分页查询检测因子明显-通过任务获取
export function findCheckTaskDetailByCondition0(params) {
  return request({
    url: `/checkTask/findCheckTaskDetailByCondition0`,
    method: 'get',
    params
  })
}

// 分页查询检测因子明显-通过任务获取
export function findCheckTaskDetailByCondition1(params) {
  return request({
    url: `/checkTask/findCheckTaskDetailByCondition1`,
    method: 'get',
    params
  })
}
// 分页查询检测因子明显-通过任务获取
export function batchSampDrawApply(data) {
  return request({
    url: `/checkFactor/batchSampDrawApply`,
    method: 'post',
    data
  })
}
