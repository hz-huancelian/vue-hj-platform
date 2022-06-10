import request from '@/utils/request'

// 查询设备列表信息
export function findByCondition(params) {
  return request({
    url: `/equipment/findByCondition`,
    method: 'get',
    params
  })
}

// 新增设备信息
export function saveEquipment(data) {
  return request({
    url: `/equipment/add`,
    method: 'post',
    data
  })
}

// 修改设备信息
export function updateEquipment(data) {
  return request({
    url: `/equipment/updateById`,
    method: 'post',
    data
  })
}

// 删除设备信息
export function delEquipment(id) {
  return request({
    url: `/equipment/removeById/${id}`,
    method: 'delete'
  })
}

// 设备一级类型集合
export function findEquipmentFirstType() {
  return request({
    url: `/equipment/findEquipmentFirstType`,
    method: 'get'
  })
}

// 根据设备一级类型查询对于二级类型
export function findEquipmentSecondType(rootKey) {
  return request({
    url: `/equipment/findEquipmentSecondType/${rootKey}`,
    method: 'get'
  })
}

/** **************************** 20220326TODO设备获取 ************************************/

export function laboratoryEquipmentTree() {
  return request({
    url: `/equipment/laboratoryEquipmentTree`,
    method: 'get'
  })
}
