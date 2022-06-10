import Vue from 'vue'
import * as dayjs from 'dayjs'
import { parseTime } from '@/utils'

Vue.filter('NumberFormat', function(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('MoneyFormat', function(value) {
  if (!value) {
    return '0.00'
  }
  const intPartFormat = Number(value).toFixed(2) // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('WeightFormat', function(value) {
  if (!value) {
    return '0.000'
  }
  const intPartFormat = Number(value).toFixed(3) // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) {
    return ''
  }
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) {
    return ''
  }
  return dayjs(dataStr).format(pattern)
})

Vue.filter('TimeFormat', function(dataStr, pattern = 'YYYY.MM.DD') {
  if (!dataStr) {
    return ''
  }
  return dayjs(dataStr).format(pattern)
})

Vue.filter('Time2Format', function(dataStr, pattern = '{y}年{m}月{d}日') {
  if (!dataStr) {
    return ''
  }
  return parseTime(dataStr, pattern)
})

Vue.filter('Money2Chinese', function(money) {
  // 汉字的数字
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  var cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  var cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  var cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  var cnInteger = '整'
  // 整型完以后的单位
  var cnIntLast = '元'
  // 最大处理的数字
  var maxNum = 999999999999999.9999
  // 金额整数部分
  var integerNum
  // 金额小数部分
  var decimalNum
  // 输出的中文金额字符串
  var chineseStr = ''
  // 分离金额后用的数组，预定义
  var parts
  if (money === '') { return '' }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    var decLen = decimalNum.length
    for (var ii = 0; ii < decLen; ii++) {
      var nn = decimalNum.substr(ii, 1)
      if (nn !== '0') {
        chineseStr += cnNums[Number(nn)] + cnDecUnits[ii]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
})

/** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function(value, vlength = 12) {
  if (!value) {
    return ''
  }
  if (value.length > vlength) {
    return value.slice(0, vlength) + '...'
  }
  return value
})
