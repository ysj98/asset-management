/**
 * 描述：全局配置文件，生产环境使用根目录的配置文件
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

const localhost = {
  local: "http://192.168.1.7:8088/", // 开发
  beta: "https://betapic.uhomecp.com/", // beta
  uhomecp: "http://www.uhomecp.com/", // 线上
};
let configs = {
  hostImg: localhost.beta, // 默认此处写在beta资源url，方便调试
  hostImg1: localhost.beta,
  hostPrime: "", //  开发与生产环境切换
  CookieDomain: "",
  unifyContext: "",
};
// 如果可以
if (process.env.NODE_ENV === "production") {
  configs = window.__configs; // 在config.js中设置的
  // 由于本项目在不同生产环境，有时正确的文件域名为hostImg 有时为hostImg1，容易出现问题
  // 故在config.js中新增了一个配置项fastdfsHostImg，若配置项已经配置了，首先取该配置项，若没有配置，则取hostImg1
  if (configs.fastdfsHostImg) {
    configs.hostImg = configs.fastdfsHostImg || configs.hostImg1;
  }
}
export default Object.assign({}, configs);
