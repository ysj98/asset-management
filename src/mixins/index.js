/*
 * @Date: 2019-11-01 09:42:51
 * @Description:
 */
import Cookies from 'js-cookie';
import Utils from '@/utils/utils.js';
export default {
  data() {
    return {
      waitTime: 2000, // 等待多少ms才去显示消息框
      imgStr: window.__configs.hostImg,
      loadingNameS: {}, // loding至少保存2秒
    };
  },
  methods: {
    // 由于全局获取用户id
    getSysUserId() {
      return Cookies.get('aid');
    },
    // 用于获取全局个页面查询参数
    GET_ROUTE_QUERY(key) {
      return this.$store.state.pro.routeQueryData[key] || {};
    },
    // 用于存储全局个页面查询参数
    SET_ROUTE_QUERY(key, data = {}) {
      if (typeof key !== 'string') {
        return;
      }
      this.$store.commit('pro/SET_ROUTE_QUERY', { key, data });
    },
    // 加载中至少显示2秒
    SG_Loding(options = {}) {
      let loadingName = '';
      let time = 67;
      if (Utils.isString(options)) {
        loadingName = this.$SG_Message.loading({ content: options });
      } else {
        loadingName = this.$SG_Message.loading(...options);
      }
      this.loadingNameS[loadingName] = { value: 0 };
      this.loadingNameS[loadingName]['time'] = setInterval(() => {
        this.loadingNameS[loadingName]['value'] += time;
      }, time);
      return loadingName;
    },
    DE_Loding(loadingName) {
      return new Promise((resolve, reject) => {
        let time = 1500;
        // 可以销毁
        if (this.loadingNameS[loadingName]) {
          let v = time - this.loadingNameS[loadingName]['value'];
          if (v < 0) {
            resolve();
            this.$SG_Message.destroy(loadingName);
          } else {
            setTimeout(() => {
              this.$SG_Message.destroy(loadingName);
              resolve();
            }, v);
          }
          clearInterval(this.loadingNameS[loadingName]['time']);
          delete this.loadingNameS[loadingName];
        }
      });
    },
  },
  // 组件销毁
  destroyed() {
    for (let loadingName in this.loadingNameS) {
      this.$SG_Message.destroy(loadingName);
      clearInterval(this.loadingNameS[loadingName]['time']);
      delete this.loadingNameS[loadingName];
    }
  },
};
