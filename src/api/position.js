import request from '@/utils/request'

// 根据部门ID查看职位列表信息
export function getDeptListForId(deptId) {
  return request({
    url: `/sys/position/listByDeptId/${deptId}`,
    method: 'get'
  })
}

// 新增职位信息
export function createPositionInfo(data) {
  return request({
    url: `/sys/position/add`,
    method: 'post',
    data
  })
}

// 新增职位信息
export function updatePositionInfo(data) {
  return request({
    url: `/sys/position/modify`,
    method: 'post',
    data
  })
}
