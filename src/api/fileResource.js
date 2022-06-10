import request from '@/utils/request'

// 条件分页查询文件资源
export function findByCondition(params) {
  return request({
    url: `/fileResource/findByCondition`,
    method: 'get',
    params
  })
}

// 修改文件控制编号
export function updateById(data) {
  return request({
    url: `/fileResource/updateById`,
    method: 'post',
    data
  })
}
