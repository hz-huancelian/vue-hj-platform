import request from '@/utils/request'
/** ********************报价单任务调度***********************/
// export function findOfferInfosByCondition(params) {
//   return request({
//     url: `/offerDispatch/findByCondition`,
//     method: 'get',
//     params
//   })
// }

// 分页查询任务调度列表
export function findByCondition(params) {
  return request({
    url: `/scheduleTask/findByCondition`,
    method: 'get',
    params
  })
}

// 分页查询历史人物调度列表
export function findHistoryByCondition(params) {
  return request({
    url: `/scheduleTask/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 查询任务下检测因子信息
export function findJobFactorsById(jobId) {
  return request({
    url: `/scheduleTask/${jobId}/jobFactors`,
    method: 'get'
  })
}

// 根据任务调度ID查询待调度计划
export function findOfferPlanById(taskId) {
  return request({
    url: `/scheduleTask/${taskId}/findOfferPlan`,
    method: 'get'
  })
}

// 调度计划列表查询
export function findOfferPlanByTaskId(taskId) {
  return request({
    url: `/scheduleTask/${taskId}/findOfferPlan`,
    method: 'get'
  })
}
// 查看监测计划下因子信息
export function findFactorsByPlanId(offerPlanId) {
  return request({
    url: `/scheduleTask/${offerPlanId}/findFactors`,
    method: 'get'
  })
}

// 查询多个监测计划下因子信息
export function findFactorsByOfferPlanIds(params) {
  return request({
    url: `/scheduleTask/findFactorsByOfferPlanIds`,
    method: 'get',
    params
  })
}

// 查询多个监测计划下因子信息
export function findJobByTaskId(taskId) {
  return request({
    url: `/scheduleTask/findJobByTaskId/${taskId}`,
    method: 'get'
  })
}
// 保存调度任务(暂存)
export function saveScheduleJob(data) {
  return request({
    url: `/scheduleTask/saveScheduleJob`,
    method: 'post',
    data
  })
}

// 确认调度任务
export function confirmScheduleJob(data) {
  return request({
    url: `/scheduleTask/confirmScheduleJob`,
    method: 'post',
    data
  })
}

// 调度任务列表查询
export function findJobForTask(params) {
  return request({
    url: `/scheduleTask/findJobForTask`,
    method: 'get',
    params
  })
}

// 机构下任务列表查询
export function findJobsByCondition(params) {
  return request({
    url: `/scheduleTask/findJobsByCondition`,
    method: 'get',
    params
  })
}

/** ********************报价单任务调度***********************/

// 根据任务调度ID获取任务调度详情因子信息
export function getOfferFactorByTaskId(dispatchTaskId) {
  return request({
    url: `/offerDispatch/getOfferFactorByTaskId/${dispatchTaskId}`,
    method: 'get'
  })
}

// 调度任务
export function doScheduTask(data) {
  return request({
    url: `/offerDispatch/doScheduTask`,
    method: 'post',
    data
  })
}

// 调度任务详情
export function getLastScheduInfoByTaskId(dispatchTaskId) {
  return request({
    url: `/offerDispatch/getLastScheduInfoByTaskId/${dispatchTaskId}`,
    method: 'get'
  })
}

// 待调度任务统计
export function statisPendingTask() {
  return request({
    url: `/offerDispatch/statisPendingTask`,
    method: 'get'
  })
}

/* *************************************************** */
// 任务列表查看
export function findTaskByCondition(params) {
  return request({
    url: `/offerDispatch/findByCondition`,
    method: 'get',
    params
  })
}

