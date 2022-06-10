module.exports = {
  title: '环测链',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
    * @type {boolean} true | false
    * @description Whether need tagsView
    */
  tagsView: true,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
    * @type {boolean} true | false 固定在顶部
    * @description Whether fix the header
    */
  fixedHeader: false,

  /**
    * @type {boolean} true | false
    * @description Whether show the logo in sidebar
    */
  sidebarLogo: true,

  /**
    * @type {string | array} 'production' | ['production', 'development']
    * @description Need show err logs component.
    * The default is only used in the production env
    * If you want to also use it in dev, you can pass ['production', 'development']
    */
  errorLog: ['production', 'development']
}
