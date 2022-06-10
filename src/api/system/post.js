import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/post/selectPostList',
    method: 'get',
    params: query
  })
}

// 查询岗位列表
export function selectPostAll() {
  return request({
    url: '/post/selectPostAll',
    method: 'get'
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/selectPostById/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/post/insertPost',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/post/updatePost',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/post/deletePostById/' + postId,
    method: 'get'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/post/export',
    method: 'get',
    params: query
  })
}
