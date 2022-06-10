import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/sys/user/getByCondition',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/sys/user/findUserByUserId/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user/modifyUserById',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/sys/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetOriganPassword(userId) {
  return request({
    url: '/sys/user/resetOriganPassword/' + userId,
    method: 'get'
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/sys/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: '/sys/user/uploadAvatarPath',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/sys/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/sys/user/authRole',
    method: 'put',
    params: data
  })
}

// 用户注销
export function invalidUserByUserId(userId) {
  return request({
    url: '/sys/user/invalidUserByUserId/' + userId,
    method: 'get'
  })
}

// 用户注销
export function onlineUserByUserId(userId) {
  return request({
    url: '/sys/user/enableUserByUserId/' + userId,
    method: 'get'
  })
}

// 用户个人信息获取
export function editUserById(data) {
  return request({
    url: `/sys/user/editUserById`,
    method: 'post',
    data
  })
}
