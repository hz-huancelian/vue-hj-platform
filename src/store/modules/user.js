import { login, phoneLogin, doLogout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  userId: '',
  userInfo: '',
  platformPositionId: '',
  avatar: '',
  introduction: '',
  organId: '',
  resetForm: '',
  roles: [],
  permissions: [],
  sysBaseUrl: 'https://www.huancelian.com'
  // sysBaseUrl: 'http://182.92.73.87:9900'
  // sysBaseUrl: 'http://8.136.159.136:8083'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERINFO: (state, user) => {
    state.userInfo = user
    state.userId = user.userId
    state.platformPositionId = user.platformPositionId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORGAN: (state, organId) => {
    state.organId = organId
  },
  SET_RESETTYPE: (state, type) => {
    state.resetForm = type
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { result } = response
        commit('SET_TOKEN', result)
        setToken(result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  phoneLogin({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      phoneLogin({ phone: phone.trim(), password: password }).then(response => {
        const { result } = response
        commit('SET_TOKEN', result)
        setToken(result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { result } = response
        if (!result) {
          reject('个人信息获取失败，请重新登录')
        }

        const { avatarPath, roles, organId, resources } = result
        debugger
        if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roles)
          commit('SET_PERMISSIONS', resources)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_ORGAN', organId)
        commit('SET_USERINFO', result)
        commit('SET_AVATAR', avatarPath)
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      doLogout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetAttrPath({ commit }, path) {
    commit('SET_AVATAR', path)
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      resolve()
    })
  },
  resetCompForm({ commit }, type) {
    commit('SET_RESETTYPE', type)
  },
  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
