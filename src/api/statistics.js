import request from '@/utils/request'
/** ********************采样调度任务管理***********************/
// 总经理顶部汇总指标
export function findTopAggregateIndicators() {
  return request({
    url: `/statistics/gm/topAggregateIndicators`,
    method: 'get'
  })
}
// 有效合同统计
export function findValidContracts(params) {
  return request({
    url: `/statistics/validContracts`,
    method: 'get',
    params
  })
}

// 任务完成统计
export function findCompleteTask(params) {
  return request({
    url: `/statistics/completeTask`,
    method: 'get',
    params
  })
}

// 任务区域统计
export function findTaskCity(params) {
  return request({
    url: `/statistics/taskCity`,
    method: 'get',
    params
  })
}

// 全部合同统计（当前月份及过去11个月的数据，有效的合同）
export function findValidContractsForPass11Month() {
  return request({
    url: `/statistics/validContractsForPass11Month`,
    method: 'get'
  })
}

// 报告发放统计
export function findIssueReport(params) {
  return request({
    url: `/statistics/issueReport`,
    method: 'get',
    params
  })
}

// 部门员工数统计
export function findDeptUserCnt(params) {
  return request({
    url: `/statistics/deptUserCnt`,
    method: 'get',
    params
  })
}

// 人员流动情况
export function findStaffTurnover(params) {
  return request({
    url: `/statistics/staffTurnover`,
    method: 'get',
    params
  })
}

// 技术负责人待办
export function findTdToDoList() {
  return request({
    url: `/statistics/td/toDoList`,
    method: 'get'
  })
}

/** ********************* 调度部门-负责人  *********************** */
// 待办事项
export function findDispatchToDoList() {
  return request({
    url: `/statistics/ddb/dispatchToDoList`,
    method: 'get'
  })
}

// 调度任务数
export function findOfferDispatchTaskCnt(params) {
  return request({
    url: `/statistics/ddb/offerDispatchTaskCnt`,
    method: 'get',
    params
  })
}

// 分包判断任务数
export function findOfferJudgeInfoCnt(params) {
  return request({
    url: `/statistics/ddb/offerJudgeInfoCnt`,
    method: 'get',
    params
  })
}
// 任务数
export function findOfferDispatchInfoCnt(params) {
  return request({
    url: `/statistics/ddb/offerDispatchInfoCnt`,
    method: 'get',
    params
  })
}

/** ****************业务负责人********************** */
// 待办事项
export function findManagerToDoList() {
  return request({
    url: `/statistics/scb/managerToDoList`,
    method: 'get'
  })
}

// 全员签订合同额（元）:技术评审和合同审核全部通过的合同
export function findSortContAmount(params) {
  return request({
    url: `/statistics/scb/sortContAmount`,
    method: 'get',
    params
  })
}

// 全员签订合同数（份）:技术评审和合同审核全部通过的合同
export function findSortContNum(params) {
  return request({
    url: `/statistics/scb/sortContNum`,
    method: 'get',
    params
  })
}

/** ****************业务员********************** */
// 待办事项
export function findOwnerValidContractsForPass11Month() {
  return request({
    url: `/statistics/scb/ownerValidContractsForPass11Month`,
    method: 'get'
  })
}

/** ****************采样********************** */
// 采样组长待办事项
export function findCybManagerToDoList() {
  return request({
    url: `/statistics/cyb/managerToDoList`,
    method: 'get'
  })
}
// 采样组长待办事项
export function findSampleLeaderToDoList() {
  return request({
    url: `/statistics/cy/sampleLeaderToDoList`,
    method: 'get'
  })
}

// 全部采样任务数
export function findcyTaskCnt(params) {
  return request({
    url: `/statistics/cyb/cyTaskCnt`,
    method: 'get',
    params
  })
}

// 全部已采集各类样品总数
export function findSampleClassificationCnt(params) {
  return request({
    url: `/statistics/cyb/sampleClassificationCnt`,
    method: 'get',
    params
  })
}

// 全部采样统计（当前月份及过去11个月的数据，审核通过的样品）
export function findallSampledItemsForPass11Month() {
  return request({
    url: `/statistics/cyb/allSampledItemsForPass11Month`,
    method: 'get'
  })
}

// 我的采样统计（当前月份及过去11个月的数据，审核通过的样品）
export function findOwnerSampledItemsForPass11Month(params) {
  return request({
    url: `/statistics/cyb/ownerSampledItemsForPass11Month`,
    method: 'get',
    params
  })
}

// 全部已采集样品数
export function findSortSampledNum(params) {
  return request({
    url: `/statistics/cyb/sortSampledNum`,
    method: 'get',
    params
  })
}

/* *********************设备管理************************  */
// 设备数
export function findEquipmentCnt() {
  return request({
    url: `/statistics/sb/equipmentCnt`,
    method: 'get'
  })
}
// 设备状态 idle-闲置中  use-使用中 maintain-维修中
// {"xNameData":["现场采样设备","",], "idle":[12,6,],"use":[10,5,],"maintain":[11,4,]}
export function findEquipmentStatus() {
  return request({
    url: `/statistics/sb/equipmentStatsuCnt`,
    method: 'get'
  })
}

/* *********************样品管理************************  */

// 样品总数统计
export function findSampleManagerToDoList() {
  return request({
    url: `/statistics/yp/sampleManagerToDoList`,
    method: 'get'
  })
}

// 样品总数统计
export function findSampleManagementCnt(params) {
  return request({
    url: `/statistics/yp/sampleManagementCnt`,
    method: 'get',
    params
  })
}

// 在库各类样品数统计
// {"xNameData":["水","气","噪声"...], "xValData": [112, 98, 50...]}
export function findStoredSampleClassificationCnt(params) {
  return request({
    url: `/statistics/yp/storedSampleClassificationCnt`,
    method: 'get',
    params
  })
}

/* *********************报告************************  */
// 报告统计
export function findIssueReportForPass11Month() {
  return request({
    url: `/statistics/bg/issueReportForPass11Month`,
    method: 'get'
  })
}
// 当前报告任务数
// {"xNameData":["水","气","噪声"...], "xValData": [112, 98, 50...]}
export function findReportStatusCnt() {
  return request({
    url: `/statistics/bg/reportStatusCnt`,
    method: 'get'
  })
}

/* *********************检测************************  */
// 全部检测任务数
// {"xNameData":["水","气","噪声"...], "xValData": [112, 98, 50...]}
export function findCheckTaskCnt(params) {
  return request({
    url: `/statistics/jc/checkTaskCnt`,
    method: 'get',
    params
  })
}

// 待办
export function findCheckManagerToDoList() {
  return request({
    url: `/statistics/jc/checkManagerToDoList`,
    method: 'get'
  })
}

// 检测样品数排名
export function findSortCheckedSample(params) {
  return request({
    url: `/statistics/jc/sortCheckedSample`,
    method: 'get',
    params
  })
}

// 各类已检测样品数
export function findCheckedSampleClassificationCnt(params) {
  return request({
    url: `/statistics/jc/checkedSampleClassificationCnt`,
    method: 'get',
    params
  })
}

// 我的检测任务数
export function findOwnerCheckFactorCnt(params) {
  return request({
    url: `/statistics/jc/ownerCheckFactorCnt`,
    method: 'get',
    params
  })
}

