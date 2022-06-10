const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  userId: state => state.user.userId,
  platformPositionId: state => state.user.platformPositionId,
  organId: state => state.user.organId,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  local_routes: state => state.permission.localRoutes,
  errorLogs: state => state.errorLog.logs,

  permissions: state => state.user.permissions,
  topbarRouters: state => state.permission.topbarRouters,
  defaultRoutes: state => state.permission.defaultRoutes,
  sidebarRouters: state => state.permission.sidebarRouters,
  sysBaseUrl: state => state.user.sysBaseUrl
}
export default getters
