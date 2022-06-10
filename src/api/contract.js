import request from '@/utils/request'

// 查询合同列表
export function findContInfosByCondition(params) {
  return request({
    url: `/cont/findContInfosByCondition`,
    method: 'get',
    params
  })
}

// 查询历史合同列表
export function findHisContInfosByCondition(params) {
  return request({
    url: `/cont/findHisContInfosByCondition`,
    method: 'get',
    params
  })
}

// 分包合同列表
export function findSubContInfosByCondition(params) {
  return request({
    url: `/cont/findSubContInfosByCondition`,
    method: 'get',
    params
  })
}

// 合同信息完善
export function saveContract(data) {
  return request({
    url: `/cont/saveCont`,
    method: 'post',
    data
  })
}

// 合同信息详情查看
export function findContPerfectInfoById(contId) {
  return request({
    url: `/cont/findContPerfectInfoById/${contId}`,
    method: 'get'
  })
}
// 合同PDF地址获取
export function findContFileById(contId) {
  return request({
    url: `/cont/findContFileById/${contId}`,
    method: 'get'
  })
}

// 合同信息上传完善
export function saveLocalContract(data) {
  return request({
    url: `/cont/saveCont2`,
    method: 'post',
    data
  })
}

// 获取合同基础信息（乙方信息）
export function getPartBInfo() {
  return request({
    url: `/cont/getPartBInfo`,
    method: 'get'
  })
}

// 获取合同基础信息（甲方信息）
export function getPartAInfo(id) {
  return request({
    url: `/cont/getPartAInfo/${id}`,
    method: 'get'
  })
}

// 合同提交审核
export function submitCont(contId) {
  return request({
    url: `/cont/submitCont/${contId}`,
    method: 'get'
  })
}

// 合同作废
export function invalidCont(contId) {
  return request({
    url: `/cont/invalidCont/${contId}`,
    method: 'get'
  })
}

// 合同审核
export function auditCont(data) {
  return request({
    url: `/cont/auditCont`,
    method: 'post',
    data
  })
}

/* ***************************合同审核**************************** */
// 查询合同列表
export function findApproveConByCondition(params) {
  return request({
    url: `/approval/contract/findContInfosByCondition`,
    method: 'get',
    params
  })
}

// 产看合同审核信息
export function findAuditRecordsByContId(contId) {
  return request({
    url: `/approval/contract/findAuditRecordsByContId/${contId}`,
    method: 'get'
  })
}

// 合同号校验
export function checkSupContCode(params) {
  return request({
    url: `/cont/checkSupContCode`,
    method: 'get',
    params
  })
}
