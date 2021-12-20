/**
 * 描述：全局配置文件，生产环境使用根目录的配置文件
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

let conf = {
  local: 'http://192.168.1.7:8088', // 开发
  gamma: 'https://gammapic.uhomecp.com', // 测试
  uhomecp: 'http://pic.uhomecp.com' // 线上
}
let configs = {
  hostImg: conf.local,
  hostPrime: '', //  开发与生产环境切换
  CookieDomain: '',
  unifyContext: ''
}
// 如果可以
if (process.env.NODE_ENV === 'production') {
  configs = window.__configs // 在config.js中设置的
}
export default Object.assign({}, configs)
