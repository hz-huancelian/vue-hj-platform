import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
import 'babel-polyfill'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import '@/styles/index.scss' // 全局样式

import '@/utils/filter' // base filter

import App from './App.vue'
import router from './router'
import store from './store'

import './icons'
import './permission'
import './utils/error-log'
import UUID from 'vue-uuid'
Vue.use(UUID)

// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
import directive from './directive' // directive
import Print from '@/utils/print' // 引入附件的js文件
Vue.use(Print) // 注册

import VueBarcode from '@xkeshi/vue-barcode' // 导入条形码插件
Vue.component('barcode', VueBarcode)

import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
import * as filters from './filters'

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}
Vue.use(directive)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
