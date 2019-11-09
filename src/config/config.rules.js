/**
 * 描述：验证规则配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

// 常用正则表达式
export const reg = {
  // 邮箱
  email: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
  // 手机号码
  mobile: /^1[0-9]{10}$/,
  // 匹配8-16位数字和字母密码
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
  // 电话号码
  tel: /\d{3}-\d{8}|\d{4}-\d{7}/,
  // 身份证
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // qq号码
  qq: /[1-9][0-9]{4,}/,
  // ip
  ip:  /\d+\.\d+\.\d+\.\d+/,
  // 中文
  zh: /^[\u4e00-\u9fa5]*$/
}

// 验证规则配置
export default {
  // 用户名验证
  username: [
    { required: true, message: '请输入用户名!' }
  ],
  // 密码验证
  password: [
    { required: true, message: '请输入密码!' }
  ]
}