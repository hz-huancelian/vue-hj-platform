import request from '@/utils/request'
/** ********************采样调度任务管理***********************/
// 采样任务列表
export function findByCondition(params) {
  return request({
    url: `/sampTask/findByCondition`,
    method: 'get',
    params
  })
}
// 采样历史任务列表
export function findHistoryTaskByCondition(params) {
  return request({
    url: `/sampTask/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 任务单号查询检测因子
export function getOfferFactorsByTaskId(sampTaskId) {
  return request({
    url: `/sampTask/getOfferFactorsByTaskId/${sampTaskId}`,
    method: 'get'
  })
}

// 合样并分配任务 废弃
// export function combinedSampleAndAssignments(data) {
//   return request({
//     url: `/sampTask/combinedSampleAndAssignments`,

//     method: 'post',
//     data
//   })
// }

// 样品标签信息
export function getSampTaskItemById(params) {
  return request({
    url: `/sampTask/getSampTaskItemById`,
    method: 'get',
    params
  })
}

// 采样任务分配因子列表信息
export function getOfferFactorsById(sampItemId) {
  return request({
    url: `/sampTask/getOfferFactorsById/${sampItemId}`,
    method: 'get'
  })
}

// 根据任务单号查询检测因子(自检)
// export function getZjOfferFactorsByTaskId(sampItemId) {
//   return request({
//     url: `/sampTask/getZjOfferFactorsByTaskId/${sampItemId}`,
//     method: 'get'
//   })
// }

// 根据任务单号查询检测因子（分包）
// export function getWbOfferFactorsByTaskId(sampItemId) {
//   return request({
//     url: `/sampTask/getWbOfferFactorsByTaskId/${sampItemId}`,
//     method: 'get'
//   })
// }

/** ********************采样列表管理***********************/
//  采样列表
export function findSampItemByCondition(params) {
  return request({
    url: `/sampItem/findByCondition`,
    method: 'get',
    params
  })
}

//  采样列表(历史)
export function findHisSampItemByCondition(params) {
  return request({
    url: `/sampItem/findHistoryByCondition`,
    method: 'get',
    params
  })
}

/** ********************采样审核管理***********************/
// 待审核采样列表-组长确认
// export function findAuditSampItemByCondition(params) {
//   return request({
//     url: `/sampItem/findAuditSampItemForLeaderByCondition`,
//     method: 'get',
//     params
//   })
// }

// 待审核采样列表-负责人审核
export function findAuditSampForMasterCondition(params) {
  return request({
    url: `/sampItem/findAuditSampItemForManageByCondition`,
    method: 'get',
    params
  })
}

//  分页查询采样任务列表 (历史，已完成的)
export function findHistoryByCondition(params) {
  return request({
    url: `/sampItem/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 查询采样列表详情
export function getSampleItemDetailBySampItemId(sampItemId) {
  return request({
    url: `/sampItem/getSampleItemDetailBySampItemId/${sampItemId}`,
    method: 'get'
  })
}

// 采样列表审核
export function doAuditSampItem(data) {
  return request({
    url: `/sampItem/doAuditSampItem`,
    method: 'post',
    data
  })
}
// ////////TODO///////////
// 采样组长确认
export function doAuditSampItemForLeader(data) {
  return request({
    url: `/sampItem/doAuditSampItemForLeader`,
    method: 'post',
    data
  })
}

// 采样组长批量确认
export function batchDoAuditSampItemForLeader(data) {
  return request({
    url: `/sampItem/batchDoAuditSampItemForLeader`,
    method: 'post',
    data
  })
}

// 采样负责人审批
export function doAuditSampItemForManager(data) {
  return request({
    url: `/sampItem/doAuditSampItemForManager`,
    method: 'post',
    data
  })
}

// 采样负责人批量审批
export function batchDoAuditSampItemForManager(data) {
  return request({
    url: `/sampItem/batchDoAuditSampItemForManager`,
    method: 'post',
    data
  })
}
/** ********************采样审核管理 TODO NEW 20220320***********************/
// 采样确认任务列表查询(状态处于“采样中”的)
export function findSampTaskForManagerByCondition(params) {
  return request({
    url: `/sampItem/findSampTaskForManagerByCondition`,
    method: 'get',
    params
  })
}

// 采样样品审核列表（待审核）
export function findAuditSampItemForManageByCondition(params) {
  return request({
    url: `/sampItem/findAuditSampItemForManageByCondition`,
    method: 'get',
    params
  })
}
// 采样样品审核列表（已审核）
export function findHisAuditSampItemForManageByCondition(params) {
  return request({
    url: `/sampItem/findHisAuditSampItemForManageByCondition`,
    method: 'get',
    params
  })
}

// 采样确认任务列表查询(状态处于“采样中”的)
export function findSampleTaskForLeaderByCondition(params) {
  return request({
    url: `/sampItem/findSampleTaskForLeaderByCondition`,
    method: 'get',
    params
  })
}

// 采样样品确认列表查询（“待确认”）
export function findAuditSampItemForLeaderByCondition(params) {
  return request({
    url: `/sampItem/findAuditSampItemForLeaderByCondition`,
    method: 'get',
    params
  })
}
// 采样样品确认列表查询（“已确认”）
export function findHisAuditSampItemForLeaderByCondition(params) {
  return request({
    url: `/sampItem/findHisAuditSampItemForLeaderByCondition`,
    method: 'get',
    params
  })
}

/** ********************采样任务查看*************************/
// 采样列表
export function findSampTaskByCondition(params) {
  return request({
    url: `/sampTask/findSampTaskByCondition`,
    method: 'get',
    params
  })
}

// 采样列表-查看样品
export function findSampTaskDetailByCondition(params) {
  return request({
    url: `/sampTask/findSampTaskDetailByCondition`,
    method: 'get',
    params
  })
}

/** ********************采样任务查看 TODO NEW 20220320*************************/
// 分页查询采样任务列表 (待分配任务)
export function findNewSampTaskByCondition(params) {
  return request({
    url: `/sampTask/findByCondition`,
    method: 'get',
    params
  })
}

// 分页查询采样任务列表 (历史任务)
export function findHisSampTaskByCondition(params) {
  return request({
    url: `/sampTask/findHistoryByCondition`,
    method: 'get',
    params
  })
}

// 根据任务单号查询检测因子(自检)
export function getZjJobFactorsByJobId(params) {
  return request({
    url: `/sampTask/getZjJobFactorsByJobId`,
    method: 'get',
    params
  })
}

// 根据任务单号查询检测因子（外包）
export function getWbJobFactorsByJobId(params) {
  return request({
    url: `/sampTask/getWbJobFactorsByJobId`,
    method: 'get',
    params
  })
}

// 查询任务因子点位列表
export function getFactorPointsBySampTaskId(jobId) {
  return request({
    url: `/sampTask/getFactorPointsBySampTaskId/${jobId}`,
    method: 'get'
  })
}

// 根据任务单号获取因子信息(任务详情因子信息)
export function getJobFactorsByJobId(jobId) {
  return request({
    url: `/sampTask/getJobFactorsByJobId/${jobId}`,
    method: 'get'
  })
}

// 查询合样列表
export function getSampleListByCondition(params) {
  return request({
    url: `/sampTask/getSampleListByCondition`,
    method: 'get',
    params
  })
}

// 保存合样列表
export function saveSampleList(data) {
  return request({
    url: `/sampTask/saveSampleList`,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 删除合样列表（单个），负责人可以任意删除，组长只能删除自己
export function deleteSampleListById(sampleListId) {
  return request({
    url: `/sampTask/deleteSampleListById/${sampleListId}`,
    method: 'delete'
  })
}

// 确认合样列表（1、采样任务所有因子全部完成合样；2、只允许采样负责人操作）
export function confirmSampleList(data) {
  return request({
    url: `/sampTask/confirmSampleList`,
    method: 'post',
    data
  })
}

// 采样位置分配
export function assignFactorPoint(data) {
  return request({
    url: `/sampTask/assignFactorPoint`,
    method: 'post',
    data
  })
}

// 采样位置分配信息查询
export function getSampleTaskPointBySampTaskId(sampTaskId) {
  return request({
    url: `/sampTask/getSampleTaskPointBySampTaskId/${sampTaskId}`,
    method: 'get'
  })
}

// 保存合样备注
export function saveCombinedRemark(data) {
  return request({
    url: `/sampTask/saveCombinedRemark`,
    method: 'post',
    data
  })
}

// 根据采样任务ID获取样品标签信息（确认合样后）
export function getSampleItemBySampTaskId(params) {
  return request({
    url: `/sampTask/getSampleItemBySampTaskId`,
    method: 'get',
    params
  })
}

