import request from '@/utils/request'

// 查询部门列表信息
export function registOrigan(data) {
  return request({
    url: `/organ/registOrigan`,
    method: 'post',
    data
  })
}

// 修改密码
export function modifyPassword(data) {
  return request({
    url: `/organ/modifyPassword`,
    method: 'post',
    data
  })
}
