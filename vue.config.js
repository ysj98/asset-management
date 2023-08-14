const os = require('os');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const openInEditor = require('launch-editor-middleware');
const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.VUE_APP_IS_DEBUG === 'true';
require('events').EventEmitter.defaultMaxListeners = 0;
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
};

const localhost = getIPAdress();
console.log('IP', localhost);
const target = 'http://beta.uhomecp.com/';
// const target = 'http://192.168.1.38:8080';
const proxyURL = [
  '/uhomecp-sso/',
  '/uhome-portal/',
  '/basic-data-api/',
  '/basic-data-batch-api',
  '/uhomecp-app/',
  '/common-api',
  '/car-parking',
  '/uis/',
  '/ams/',
  '/esm/',
  '/charging-api/',
  '/datacachesvr-api-netty/',
  '/car-parking-api/',
  '/car-batch/',
  '/equipment-openapi/',
  '/scheme/',
  '/group1/',
  '/uhomecp-resource/',
  '/eip-bpm-runtime/',
  '/eip-portal/',
  '/uhomecp-sso/',
];
/**
 * Proxy 类，用于构建需要代理的数据对接
 */
class Proxy {
  constructor() {
    this.data = {};
  }
  /**
   * 添加代理数据
   * @param {*} urls 路径列表
   * @param {*} localhost 本机地址
   * @param {*} target 代理远程地址
   */
  addUrls(urls, localhost, target) {
    urls.forEach((el) => {
      this.data[el] = {
        target,
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': localhost,
        },
        withCredentials: true,
        headers: {
          Referer: target,
        },
      };
    });
  }
}
// 实例化 Proxy 类
const proxy = new Proxy();
proxy.addUrls(proxyURL, localhost, target);
// proxy.addUrls(['/basic-data-api'], localhost, 'http://192.168.3.27:8080')
// proxy.addUrls(['/ams'], localhost, 'http://192.168.3.12:8081');
// proxy.addUrls(['/basic-data-batch-api'], localhost, 'http://192.168.3.31:8080')

// 配置
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: './',
  // build后文件名
  outputDir: 'asset-management',
  // 引用的静态文件
  assetsDir: './static',
  filenameHashing: true,
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    setup(app) {
      app.use('/__open-in-editor', openInEditor('intellij-idea-ultimate-edition'));
    },
    proxy: {
      ...proxy.data,
      // '/ams/': {
      //   target: 'http://192.168.30.82:8081/',
      //   changeOrigin: true,
      //   cookieDomainRewrite: {
      //     '*': localhost
      //   },
      //   withCredentials: true,
      //   headers: {
      //     Referer: target
      //   }
      // },
    },
    host: localhost,
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'font-size-base': '12px',
          'primary-color': '#0084FF',
        },
        javascriptEnabled: true,
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/var.less')],
    },
  },
  configureWebpack: (config) => {
    if (isProd) {
      // 配置不打包的资源，需指定 cdn 加载
      config.externals = {
        // 'ant-design-vue': 'antd',
        axios: 'axios',
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        moment: 'moment',
      };
      // 压缩文件
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true, // 去除debugger
              drop_console: false, // 去除console
            },
          },
          sourceMap: false,
          parallel: true,
        })
      );
      config.plugins.push(new TerserPlugin({ terserOptions: { compress: { drop_console: false } } }));
    }
    if (isDebug) {
      config.devtool = 'source-map';
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('src', path.join(__dirname, 'src'))
      .set('assets', path.join(__dirname, 'src/assets'))
      .set('components', path.join(__dirname, 'src/components'))
      .set('store', path.join(__dirname, 'src/store'))
      .set('api', path.join(__dirname, 'src/api'))
      .set('utils', path.join(__dirname, 'src/utils'));
  },
};
