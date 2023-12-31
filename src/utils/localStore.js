/**
 * 数据使用localstore存储
 * 存储本地缓存需要数据
 */
export const ls = {
  //本地存数据，days 有效时间（天）
  setItem: function (key, value, days) {
    let Days = days || 1000; //有效时间默认7天
    let exp = new Date();
    let expires = exp.getTime() + Days * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        expires,
      })
    );
  },
  getItem: function (key) {
    let o = JSON.parse(localStorage.getItem(key));

    if (o !== null && Date.now() < o.expires) {
      return o.value;
    } else {
      return null;
    }
  },
  removeItem: function (key) {
    localStorage.removeItem(key);
  },
};

export const localStore = {
  getToken: () => {
    return ls.getItem('TOKEN');
  },
  setToken: (v) => {
    return ls.setItem('TOKEN', v);
  },
  delToken: () => {
    return ls.removeItem('TOKEN');
  },
};

export default localStore;
