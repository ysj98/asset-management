const path = require('path')
const os = require('os');
// 获取本机ip
const getIPAdress = () => {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.netmask === '255.255.255.0') {
              return alias.address;
          }
      }
  }
}

const localhost = getIPAdress()
const target = 'http://192.168.1.11:10080'
const mock = 'http://192.168.1.10:9090/mock/5dbfda7704a31c60dc1862a1'
const proxyURL = [
  '/uhomecp-sso/',
  '/uhome-portal/',
  '/basic-data-api/',
  '/uhomecp-app/',
  '/common-api',
  '/uis/'
]
/**
 * Proxy 类，用于构建需要代理的数据对接
 */
class Proxy {
  constructor () {
    this.data = {}
  }
  /**
   * 添加代理数据
   * @param {*} urls 路径列表
   * @param {*} localhost 本机地址
   * @param {*} target 代理远程地址
   */
  addUrls (urls, localhost, target) {
    urls.forEach(el => {
      this.data[el] = {
        target,
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': localhost
        },
        withCredentials: true,
        headers: {
          Referer: target
        }
      }
    })
  }
}
// 实例化 Proxy 类
const proxy = new Proxy()
// 添加代理数据，如需代理多个地址，继续调用实例的 addUrls 方法即可
proxy.addUrls(proxyURL, localhost, target)
proxy.addUrls(['/ams'], localhost, mock)
// 配置
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: '/asset-management/',
  // build后文件名
  outputDir: 'asset-management',
  // 引用的静态文件
  assetsDir:'./static',
  filenameHashing: true,
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    proxy: proxy.data
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'font-size-base' : '12px',
          'primary-color': '#0084FF'
        },
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/less/var.less'),
      ]
    }
  },
  configureWebpack: () => {
    let config = {
      resolve : {
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': path.resolve('src'),
          'src': path.resolve(__dirname, './src'),
          'components': path.resolve(__dirname, './src/components'),
          'store': path.resolve(__dirname, './src/store'),
          'api': path.resolve(__dirname, './src/api'),
          'utils': path.resolve(__dirname, './src/utils')
        }
      }
    }
    // if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
    //   config.externals = {
    //     'ant-design-vue': 'ant-design-vue',
    //     'axios': 'axios',
    //     'moment': 'moment',
    //     'moment/locale/zh-cn': 'moment/locale/zh-cn'
    //   }
    // }
    return config
  }
}
