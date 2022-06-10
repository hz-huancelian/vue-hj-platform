import request from '@/utils/request'
/** ********************系统操作***********************/
export function login(data) {
  return request({
    url: '/sys/login/doLoginByUsername',
    method: 'post',
    data
  })
}

export function phoneLogin(data) {
  return request({
    url: '/sys/login/doLoginByPhone',
    method: 'post',
    data
  })
}

// 用户个人信息获取
export function getInfo() {
  return request({
    url: `/sys/login/getUserInfo`,
    method: 'get'
  })
}

// 用户个人信息获取
export function doLogout() {
  return request({
    url: `/sys/login/doLogout`,
    method: 'post'
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

// 用户个人密码重置
export function resetPersonPassword(data) {
  return request({
    url: `/sys/user/resetPassword`,
    method: 'post',
    data
  })
}

/** ********************用户管理***********************/
// 用户列表
export function getUserListForPage(params) {
  return request({
    url: `/sys/user/getByCondition`,
    method: 'get',
    params
  })
}

// 用户新增
export function addUserInfo(data) {
  return request({
    url: `/sys/user/save`,
    method: 'post',
    data
  })
}

// 用户个人信息修改
export function saveUserInfo(data) {
  return request({
    url: `/sys/user/modifyUserById`,
    method: 'post',
    data
  })
}

// 管理员重置个人密码
export function resetUserPassword(userId) {
  return request({
    url: `/sys/user/resetPersonPassword/${userId}`,
    method: 'get'
  })
}

// 添加其他职位
export function saveOtherPositions(data) {
  return request({
    url: `/sys/user/saveOtherPositions`,
    method: 'post',
    data
  })
}

/* ************************用户管理-新************************* */

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
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
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/sys/user/uploadAvatarPath',
    method: 'post',
    data: data
  })
}
