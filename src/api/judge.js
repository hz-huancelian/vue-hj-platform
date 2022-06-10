import request from '@/utils/request'

// 分包机构列表
export function getMachanListForPage(params) {
  return request({
    url: `/judge/organ/findPageByCondition`,
    method: 'get',
    params
  })
}

// 分包机构创建
export function addJudgeOrgan(data) {
  return request({
    url: `/judge/organ/addJudgeOrgan`,
    method: 'post',
    data
  })
}

// 分包机构修改
export function updateJudgeOrgan(data) {
  return request({
    url: `/judge/organ/modifyJudgeOrganById`,
    method: 'post',
    data
  })
}

// 分包机构删除
export function delById(id) {
  return request({
    url: `/judge/organ/delById/${id}`,
    method: 'get'
  })
}

/* ************************ 合同评审操作 ************************ */
// 技术负责人条件分页查询技术评审任务
export function findJudgeTaskForTecManagerByCondition(params) {
  return request({
    url: `/judgeTask/findJudgeTaskForTecManagerByCondition`,
    method: 'get',
    params
  })
}

// 查询参与评审人员
export function findAuditUser() {
  return request({
    url: `/judgeTask/findAuditUser`,
    method: 'get'
  })
}

// 技术负责人评审
export function doAuditTask(data) {
  return request({
    url: `/judgeTask/doAuditTask`,
    method: 'post',
    data
  })
}

// 根据评审任务ID查询评审记录
export function getJudgeRecordByJudgeTaskId(judgeTaskId) {
  return request({
    url: `/judgeTask/getJudgeRecordByJudgeTaskId/${judgeTaskId}`,
    method: 'get'
  })
}

// 部门负责人分页查询评审任务
export function findJudgeTaskForDeptManagerByCondition(params) {
  return request({
    url: `/judgeTask/findJudgeTaskForDeptManagerByCondition`,
    method: 'get',
    params
  })
}

// 根据评审任务ID查询评审记录
export function doAuditRecord(data) {
  return request({
    url: `/judgeTask/doAuditRecord`,
    method: 'post',
    data
  })
}

/* ************************NEW************************ */
