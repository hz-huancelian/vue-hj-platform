import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

// 路由守卫功能实现
router.beforeEach(async(to, from, next) => {
  // 开始进度块
  NProgress.start()
  // 设置页面头
  document.title = getPageTitle(to.meta.title)
  // 判断当前是否登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录过了 直接跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        if (store.getters.roles.length === 0) {
          try {
            // 判断当前用户是否已拉取完user_info信息
            store.dispatch('user/getInfo').then(() => {
              store.dispatch('GenerateRoutes').then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
                router.addRoutes(accessRoutes) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              }).catch(() => {
                store.dispatch('user/logout').then(() => {
                  // Message.error(error)
                  next({ path: '/login' })
                  NProgress.done()
                })
              })
            }).catch(() => {
              store.dispatch('user/resetToken').then(() => {
                next({ path: '/login' })
              })
              NProgress.done()
            })
          } catch (error) {
            await store.dispatch('user/resetToken')
            // Message.error(error || '服务器信息获取失败')
            next(`/login`)
            NProgress.done()
          }
        } else {
          next()
        }

        // try {
        //   // 个人信息获取 -- 接口请求获取权限
        //   const { roles, userType } = await store.dispatch('user/getInfo')
        //   // 获取路由列表
        //   const accessRoutes = await store.dispatch('generateRoutes_old', userType === '0' ? ['admin'] : roles)
        //   router.addRoutes(accessRoutes)
        //   next({ ...to, replace: true })
        // } catch (error) {
        //   await store.dispatch('user/resetToken')
        //   Message.error(error || '服务器信息获取失败')
        //   next(`/login`)
        //   NProgress.done()
        // }
      }
    }
  } else {
    // 没有token信息
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单界面放行
      next()
    } else {
      // 非白名单界面 跳转到登录
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭进度块
  NProgress.done()
})
