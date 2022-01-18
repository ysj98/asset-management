import sg_calc from 'sg-calc'
import store from "store";
/**
 * 工具函数库
 */
class Units {
  // 判断是否是移动端访问
  isMobile () {
    var userAgentInfo = navigator.userAgent
    var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        return true
      }
    }
    return false
  }
  isDate (value) {
    return Object.prototype.toString.call(value) === '[object Date]'
  }
  isArray (value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
  isReg (value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
  }
  isFun (value) {
    return Object.prototype.toString.call(value) === '[object Function]'
  }
  isObeject (value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  }
  isString (value) {
    return Object.prototype.toString.call(value) === '[object String]'
  }
  // 是否是微信环境
  isWechat () {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  }
  // 取[begin, end]间的数据整数
  GetRandom (begin, end) {
    var num = Math.random() * 100000000
    return Math.floor(num % (end - begin + 1) + begin)
  }
  // 取len长的随机字符串
  GetRandString (len, range) {
    range = range || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var s = range.split('')
    var ret = ''
    for (var i = 0; i < len; i++) {
      ret += s[this.GetRandom(0, s.length - 1)]
    }
    return ret
  }
  // 取时间戳(秒)
  GetTimestamp (timestr) {
    var t
    if (timestr) {
      t = new Date(timestr)
    } else {
      t = new Date()
    }
    return parseInt(t.getTime() / 1000)
  }
    /* 时间格式转换
    *
    * 对Date的扩展，将 Date 转化为指定格式的String
    * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    * 例子：
    * (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
    * (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
    *
    * 参考: http://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
    */
  TimeTo (timestamp, format) {
    var t = timestamp > 0 ? new Date(+timestamp) : new Date()
    var o = {
      'M+': t.getMonth() + 1, //月份
      'd+': t.getDate(), //日
      'h+': t.getHours(), //小时
      'm+': t.getMinutes(), //分
      's+': t.getSeconds(), //秒
      'q+': Math.floor((t.getMonth() + 3) / 3), //季度
      S: t.getMilliseconds() //毫秒
    }
    var fmt = format || 'yyyy.MM.dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (t.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
  xlsxDate(serial, format = '-') {
    var utc_days = Math.floor(serial - 25569)
    var utc_value = utc_days * 86400
    var date_info = new Date(utc_value * 1000)
    var returnDate = date_info.getFullYear()
    returnDate += format + (date_info.getMonth() < 9 ? '0' + (date_info.getMonth() + 1) : (date_info.getMonth() + 1))
    returnDate += format + (date_info.getDate() < 10 ? '0' + date_info.getDate() : date_info.getDate())
    return returnDate
  }
  // 调整控件高度，使页面不因控件太高而出现滚动条
  AdjustHeight (elem) {
    // elem.style.overflowY = 'auto'
    elem.style.height = document.body.clientHeight + 'px'
    const HasScroll = function() {
      return (
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight)
      )
    }
    if (!HasScroll()) {
      return
    }
    let cur = document.body.clientHeight
    let step = cur / 2
    cur += 10

    for (let i = 0; i < 100; i++) {
      if (step < 1 || cur < 0) {
        break
      }
      // 如果还有滚动条，高度再减小
      let hasScroll = HasScroll()
      if (hasScroll) {
        cur -= step
      } else {
        step = step / 2
        cur += step
      }
      cur = parseInt(cur)
      if (cur > 0) {
        elem.style.height = cur + 'px'
      }
    }
    if (cur <= 20) {
      cur = ''
    } else {
      cur = cur + 'px'
    }
    elem.style.height = cur + 'px'
    return cur
  }
  // 解析地址栏url参数
  parseURL (url) {
    var a = document.createElement('a')
    a.href = url
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port || '80',
      query: a.search,
      params: (function() {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s
        for ( ; i < len; i++) {
          if (!seg[i]) {
            continue
          }
          s = seg[i].split('=')
          ret[s[0]] = s[1]
        }
        return ret
      })(),
      file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    }
  }
    /**
   ** 除法函数，用来得到精确的除法结果
    ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    ** 调用：accDiv(arg1,arg2)
    ** 返回值：arg1除以arg2的精确结果
    **/
  accDiv (arg1, arg2, digital = 4) {
    let t1 = 0
    let t2 = 0
    let r1
    let r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {
      console.error(e)
    }
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {
      console.error(e)
    }

    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return Number((r1 / r2 * Math.pow(10, t2 - t1)).toFixed(digital))
  }
  /**
   ** 减法函数，用来得到精确的减法结果
    ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
    ** 调用：accSub(arg1,arg2)
    ** 返回值：arg1加上arg2的精确结果
    **/
  accSub (arg1, arg2) {
    let r1
    let r2
    let m
    let n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
      console.error(e)
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
      console.error(e)
    }
    m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
    n = r1 >= r2 ? r1 : r2
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
  }
  /**
   ** 加法函数，用来得到精确的加法结果
    ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    ** 调用：accAdd(arg1,arg2)
    ** 返回值：arg1加上arg2的精确结果
    **/
  accAdd (arg1, arg2) {
    let r1
    let r2
    let m
    let c
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
      console.error(e)
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
      console.error(e)
    }
    c = Math.abs(r1 - r2)
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
      let cm = Math.pow(10, c)
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''))
        arg2 = Number(arg2.toString().replace('.', '')) * cm
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm
        arg2 = Number(arg2.toString().replace('.', ''))
      }
    } else {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', ''))
    }
    return (arg1 + arg2) / m
  }
  //把数字 转成汉字数字
  toChineseNum (num) {
    const keys = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    var count = ['', '十', '百', '千']
    var str = ''
    var nums = num
      .toString()
      .split('')
      .reverse()
    nums.map(function(a, index) {
      str =
        keys[a] +
        (a == 0 ? '' : count[index > 3 ? index - 4 : index]) +
        (index == '4' ? '万' : '') +
        str
    })
    return str.replace(/(零(?=零))|(零$)|(零(?=万))/g, '')
  }
  // 阿拉伯数字转换为简写汉字
  transformChinese (money) {
    var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 汉字的数字
    var cnIntRadice = ['', '拾', '佰', '仟'] // 基本单位
    var cnIntUnits = ['', '万', '亿', '兆'] // 对应整数部分扩展单位
    var cnDecUnits = ['角', '分', '毫', '厘'] // 对应小数部分单位
    // var cnInteger = '整' // 整数金额时后面跟的字符
    var cnIntLast = '元' // 整型完以后的单位
    var maxNum = 999999999999999.9999 // 最大处理的数字
    var IntegerNum // 金额整数部分
    var DecimalNum // 金额小数部分
    var ChineseStr = '' // 输出的中文金额字符串
    var parts // 分离金额后用的数组，预定义
    if (money === '') {
      return ''
    }
    money = parseFloat(money)
    if (money >= maxNum) {
      return ''
    }
    if (money === 0) {
      ChineseStr = cnNums[0] + cnIntLast
      return ChineseStr
    }
    money = money.toString() // 转换为字符串
    if (money.indexOf('.') === -1) {
      IntegerNum = money
      DecimalNum = ''
    } else {
      parts = money.split('.')
      IntegerNum = parts[0]
      DecimalNum = parts[1].substr(0, 4)
    }
    if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
      let zeroCount = 0
      let IntLen = IntegerNum.length
      for (let i = 0; i < IntLen; i++) {
        let n = IntegerNum.substr(i, 1)
        let p = IntLen - i - 1
        let q = p / 4
        let m = p % 4
        if (n === '0') {
          zeroCount++
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0]
          }
          zeroCount = 0 // 归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
        }
        if (m === 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q]
        }
      }
      ChineseStr += cnIntLast
      // 整型部分处理完毕
    }
    if (DecimalNum !== '') { // 小数部分
      let decLen = DecimalNum.length
      for (let i = 0; i < decLen; i++) {
        let n = DecimalNum.substr(i, 1)
        if (n !== '0') {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
        }
      }
    }
    if (ChineseStr === '') {
      ChineseStr += cnNums[0] + cnIntLast
    }
    return ChineseStr
  }

  // 金额大写转换，支持负金额
  digitUppercase (n) {
    var fraction = ['角', '分']
    var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ]
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ]
    var head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    var s = ''
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      var p = ''
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  }
  // 数组去重
  unique (arr = []) {
    return arr.filter(function(element, index, self) {
      return self.indexOf(element) === index
    })
  }
  // 用于遍历数组和对象元素
  each (o, callback = () => false) {
    // 如果是对象
    if (this.isObeject(o)) {
      for (let i in  o) {
        if (callback(o[i], i, o) === false) {
          return
        }
      }
    }
    // 如果是数组
    if (this.isArray(o)) {
      for (let i = 0; i < o.length;  i++) {
        if (callback(o[i], i, o) === false) {
          return
        }
      }
    }
  }
  // 深度克隆 对象
  deepClone (v, o = v) {
    if (this.isDate(v)) {
      o = new Date(v.getTime())
    }
    this.isObeject(v) && (o = {})
    this.isArray(v) && (o = [])
    if (this.isObeject(v) || this.isArray(v)) {
      for (let key in v) {
        o[key] = this.deepClone(v[key])
      }
    }
    return o
  }
  // 截取文件名包括后缀
  getFileName (str) {
    return str.substring(str.lastIndexOf('/')+1)
  }
  // 把扁平结构处理成树结构
  buildTree(list, child = 'id', parent = 'parentId'){
    let temp = {}
    let tree = []
    for(let i in list){
        temp[list[i][child]] = list[i]
    }
    for(let i in temp){
        if(temp[i][parent]) {
            if(!temp[temp[i][parent]].children) {
                temp[temp[i][parent]].children = []
            }
            temp[temp[i][parent]].children.push(temp[i])
        } else {
            tree.push(temp[i])
        }
    }
    return tree
  }
  // 获取id
  getUuid  () {
    this.uuid = this.uuid || (this.uuid = 0)
    return ++this.uuid
  }
}
/**
 * 节流函数，对多次触发的函数，单位时间内只执行一次
 * @param {Function} fun 需被节流的函数
 * @param {Number} delay 单位时间
 */
var unit = new Units()
export default unit
export var utils = unit
export function throttle(fun, delay) {
  let last, deferTimer
  return function () {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    }else {
      last = now
      fun.apply(that,_args)
    }
  }
}

/**
 * 防抖函数，对多次触发的函数，只执行最后一次
 * @param {Function} fun 需被防抖的函数
 * @param {Number} delay 单位时间
 */
export  function debounce(fun, delay) {
  return function (args) {
    let that = this
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.call(that, args)
    }, delay)
  }
}

/**
 * 置换函数，置换数组中两个元素的位置
 * @param {Array} arr 源数组
 * @param {Number} indexA 索引A
 * @param {Number} indexB 索引B
 */
export function swap(arr, indexA, indexB) {
  [arr[indexA], arr[indexB]] = [arr[indexB], arr[indexA]];
}

// 父级窗口方法
export const win = {
  isParent: window.self !== window.top,
  /**
   * 打开父级菜单页面
   * @param {*} tabUrl 菜单 URL 地址
   * @param {*} tabTitle 菜单 显示标题
   * @param {*} operDescId 菜单ID
   */
  openPortalMenu (tabUrl, tabTitle, operDescId) {
    if (this.isParent) {
      if ( window.parent.openPortalMenu) {
        window.parent.openPortalMenu(tabUrl, tabTitle, operDescId)
        return null
      }
      if ( window.parent.openNewPage) {
        window.parent.openNewPage(tabUrl, tabTitle, operDescId)
        return null
      }
    } else {
      console.log('当前没有处于 Portal 中。')
    }
  }
}

// 数学方法
export const calc = {
  // 加
  add: sg_calc.add,
  // 减
  minus: sg_calc.minus,
  // 乘
  multiply: sg_calc.multiply,
  // 除
  divide: sg_calc.divide,
}
// 生成uuid
// len: 长度
// radix: 基数
export function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

// 快速复制对象里的值
export function getTargetObject (targetObject, propsArray) {
  if (typeof (targetObject) !== "object" || !Array.isArray(propsArray)) {
  throw new Error("参数格式不正确");
  }
  const result = {};
  Object.keys(targetObject).filter(key => propsArray.includes(key)).forEach(key => {
  result[key] = targetObject[key];
  })
  return result;
 }
export function isObject (obj)  {
  return obj !== null && typeof obj === 'object'
}
/**
 * 参考 vue 2.6.12 src/shared/util.js
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 * 利用递归判断两个数据是否相同以及形状是否相同
 */
export function looseEqual (a, b) {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/*
* 获取一个数组内 某些属性重复的元素 放到一个集合中 返回一个数组
* @getStrFn 根据 指定属性判断重复 组合得到的字符串当作key来判断
* */
export function getArrayRepeat(arr,getStrFn){
  if (!arr || !arr.length){
    return []
  }
  let resMap = new Map()
  let resArr = []
  for (let i = 0; i < arr.length; i++){
    let keyStr = getStrFn(arr[i],i,arr)
    if (resMap.has(keyStr)){
      resMap.get(keyStr).push(arr[i])
    }else {
      resMap.set(keyStr, [arr[i]])
    }
  }
  resMap.forEach(ele=>{
    resArr.push(ele)
  })
  return resArr
}

/*
 * 值 与 文字 转换
 * @param value 匹配所需的值 内容可能是 title 也可能是 value
 * @param list  指定集合匹配使用
 * @param keyWord ['title','value'] 匹配的关键key 数组，第一个：匹配所用的keyWord，第二个是匹配结果的keyWord
 * @return value || null 匹配得到的 value 或者 title，匹配不到则返回 null
 * */
export function handleEnumerationConversion(value, list, keyWord = ['title', 'value']) {
  if (!value || !list) {
    console.trace()
    throw new Error('缺少入参')
  }
  const result = list.filter(ele => ele[keyWord[0]] === value)[0]
  return result ? result[keyWord[1]] : null
}

export function generateTableAreaByAssetTypeCode({keyStr, assetTypeCode, record}){
  if (!assetTypeCode){
    return record[keyStr]
  }
  if (assetTypeCode === store.state.ASSET_TYPE_CODE.EQUIPMENT){
    return '/'
  }else {
    return record[keyStr]
  }
}
export function generateTableAreaByAssetTypeString({keyStr, assetTypeName, record}){
  if (!assetTypeName){
    return record[keyStr]
  }
  if (assetTypeName === store.state.ASSET_TYPE_STRING.EQUIPMENT){
    return '/'
  }else {
    return record[keyStr]
  }
}


export function handleDownloadFile({data,fileName}){
  let blob = new Blob([data])
  let a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function generateAssetStringByCode({ record }) {
  return store.state.ASSET_TYPE_OPTIONS.filter(
      (ele) => String(ele.value) === String(record.assetType)
  )[0].name;
}

export  function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivot = Math.floor((right + left) / 2);
    const newPivot = partition(arr, pivot, left, right);
    quickSort(arr, left, newPivot - 1);
    quickSort(arr, newPivot + 1, right);
  }

  return arr;
}

function partition(arr, pivot, left, right) {
  const pivotValue = arr[pivot];
  let newPivot = left;

  swap(arr, pivot, right);
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, newPivot);
      newPivot += 1;
    }
  }
  swap(arr, right, newPivot);

  return newPivot;
}

export function getTypeKey(list, keyStr) {
  const resArr = [];
  (function getValue(list, keyStr) {
    let res = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].typeKey.includes(keyStr)) {
        res = list[i].children || [];
      } else {
        if (
            list[i].children &&
            Array.isArray(list[i].children) &&
            list[i].children.length
        ) {
          getValue(list[i].children, keyStr);
        }
      }
    }
    resArr.push(res);
    return res;
  })(list, keyStr);
  return resArr.flat();
}