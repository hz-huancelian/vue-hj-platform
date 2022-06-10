import request from '@/utils/request'

// 报告信息查看
export function findReportInfosByCondition(params) {
  return request({
    url: `/report/findReportInfosByCondition`,
    method: 'get',
    params
  })
}

// 报告信息历史查看
export function findHisReportInfosByCondition(params) {
  return request({
    url: `/report/findHisReportInfosByCondition`,
    method: 'get',
    params
  })
}
// 分页查询审核列表
export function findReportCheckByPage(params) {
  return request({
    url: `/report/findReportCheckByPage`,
    method: 'get',
    params
  })
}
// 分页查询签发列表
export function findReportSignByPage(params) {
  return request({
    url: `/report/findReportSignByPage`,
    method: 'get',
    params
  })
}

// 报告提交审核
export function reportApproveForUp(data) {
  return request({
    url: `/report/submitReport`,
    method: 'post',
    data
  })
}

// 报告审核
export function reportApprove(data) {
  return request({
    url: `/report/doAuditReport`,
    method: 'post',
    data
  })
}

// 报告签发
export function reportIssue(data) {
  return request({
    url: `/report/doSignReport`,
    method: 'post',
    data
  })
}

// 报告生成
export function genReport(reportCode) {
  return request({
    url: `/report/genReport/${reportCode}`,
    method: 'get'
  })
}

// 线下制作报告提交
export function uploadReport(data) {
  return request({
    url: `/report/uploadReport`,
    method: 'post',
    data
  })
}

/** *********************报告基础信息*********************** */

// 报告基础信息保存
export function saveReportBasic(data) {
  return request({
    url: `/reportBase/save`,
    method: 'post',
    data
  })
}

// 获取当前机构报告模板信息
export function getByOrganId() {
  return request({
    url: `/reportBase/getByOrganId`,
    method: 'get'
  })
}
// 获取当前机构报告模板信息
export function getReportForPdf(id) {
  return request({
    url: `/reportBase/getByOrganId/${id}`,
    method: 'get'
  })
}
