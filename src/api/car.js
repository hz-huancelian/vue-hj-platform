import request from '@/utils/request'

// 查询设备列表信息
export function findByCondition(params) {
  return request({
    url: `/car/findByCondition`,
    method: 'get',
    params
  })
}

// 新增设备信息
export function saveCar(data) {
  return request({
    url: `/car/add`,
    method: 'post',
    data
  })
}

// 修改设备信息
export function updateCar(data) {
  return request({
    url: `/car/updateById`,
    method: 'post',
    data
  })
}

// 车辆调度
export function carScheduling(data) {
  return request({
    url: `/car/carScheduling`,
    method: 'post',
    data
  })
}

// 删除设备信息
export function delCar(id) {
  return request({
    url: `/car/removeById/${id}`,
    method: 'delete'
  })
}
