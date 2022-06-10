import request from '@/utils/request'

export function getDicKey(rootKey) {
  return request({
    url: `/common/findDictMap/${rootKey}`,
    method: 'get'
  })
}

// 获取采样组长信息
export function findSampLeaders() {
  return request({
    url: `/common/findSampLeaders`,
    method: 'get'
  })
}

// 获取检测员信息
export function findCheckEmps() {
  return request({
    url: `/common/findCheckEmps`,
    method: 'get'
  })
}

// 获取监测频次
export function findMonitorFreq() {
  return request({
    url: `/common/findMonitorFreq`,
    method: 'get'
  })
}

// 机构列表查询
export function findValidList() {
  return request({
    url: `/judge/organ/findValidList`,
    method: 'get'
  })
}

/** ********************平台公用字典********************* */

// 查询所有的一级分类
export function findFstClasses() {
  return request({
    url: `/platform/factor/findFstClasses`,
    method: 'get'
  })
}

// 根据一级分类查看下面所有的二级分类
export function findSecdClassByClassId(classId) {
  return request({
    url: `/platform/factor/findSecdClassByClassId/${classId}`,
    method: 'get'
  })
}

// 查询树状分类
export function findTreeClasses() {
  return request({
    url: `/platform/factor/findClassTrees`,
    method: 'get'
  })
}

// 获取省份
export function getFirstLevel() {
  return request({
    url: `/sysRegion/getFirstLevel`,
    method: 'get'
  })
}

// 获取区县信息
export function getSubRegionByRegionCode(regionCode) {
  return request({
    url: `/sysRegion/getSubRegionByRegionCode/${regionCode}`,
    method: 'get'
  })
}
