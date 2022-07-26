<!--
 * 省-市-区-三级联动组件
 * 外层组件可通过定义在省市区控件上的class[.province_style, .city_style]用 /deep/ 控制布局样式
-->
<template>
  <div class="choose_area">
    <a-row :gutter="8">
      <a-col :span="4">
        <a-select
          @change="handleChangeProvince"
          v-model="province"
          v-bind="properties"
          :options="$addTitle(provinces)"
          class="province_style"
          placeholder="请选择省份"
          :filterOption="filterOption"
          :loading="loading && !provinces.length"
        ></a-select>
      </a-col>
      <a-col :span="4">
        <a-select
          v-model="city"
          v-bind="properties"
          :options="$addTitle(cities)"
          class="city_style"
          placeholder="请选择城市"
          :filterOption="filterOption"
          :loading="loading && !cities.length"
        ></a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "ProvinceCity",
  props: {
    test: {
      type: Object,
      default() {
        return {};
      }
    },
    paramKey: {
      type: String,
      default: ""
    },
    subKey: {
      type: String,
      default: ""
    },
    // 是否可搜索
    showSearch: {
      type: Boolean,
      default: () => true
    },
    // 是否可清除
    allowClear: {
      type: Boolean,
      default: () => true
    },
    // 尺寸大小default large small
    size: {
      type: String,
      default: () => "default"
    }
  },
  data() {
    return {
      isChange: false,
      loading: false, // 加载状态
      province: undefined,
      provinces: [],
      city: undefined,
      cities: [],
      properties: {} // 属性值
    };
  },

  methods: {
    handleChangeProvince() {
      console.log("change");
      this.isChange = true;
    },
    // 搜索过滤选项
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },

    // 查询省市区接口
    queryData(type, parentRegionId) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const api = {
          provinces: "queryProvinceList",
          cities: "queryCityAndAreaList"
        };
        let form = type === "provinces" ? {} : { parentRegionId };
        this.$api.basics[api[type]](form)
          .then(r => {
            this.loading = false;
            let res = r.data;
            if (res && String(res.code) === "0") {
              this[type] = (res.data || []).map(item => {
                return { key: item.regionId, title: item.name };
              });
              resolve();
              return false;
            }
            let errorMsg = res.message || "区域查询失败";
            reject(errorMsg);
            throw errorMsg;
          })
          .catch(err => {
            let errorMsg = err || "区域查询失败";
            this.loading = false;
            this.$message.error(errorMsg);
            reject(errorMsg);
          });
      });
    },
    // 外层控制主动清除
    allClearFn() {
      this.province = undefined;
    },
    handleValidate() {
      let flag = false;
      if (this.province && this.city) {
        flag = true;
      }
      return flag;
    },
    /*
     * @public 供外部调用，返回最终修改的数据
     * */
    sendData() {
      if (this.handleValidate()) {
        const { province, city } = this;
        this.$emit("sendData", { paramKey: province, subKey: city });
      } else {
        // console.log("校验未通过,请选择省市");
        return "请选择省市";
      }
    }
  },

  created() {
    const { allowClear, size, showSearch, subKey, paramKey } = this;
    this.properties = { allowClear, size, showSearch };
    this.queryData("provinces").then(() => {
      this.city = subKey || undefined;
      this.province = paramKey || undefined;
    });
  },
  watch: {
    province: function(province) {
      // 如果没有 paramKey 则说明不需要回显（此时是否清空 city 无所谓），如果有则需要回显，如果有但是 isChange 已经改变 此时也是需要清空 city 的
      if (!this.paramKey || this.isChange) {
        Object.assign(this, {
          city: undefined,
          cities: []
        });
      }
      province && this.queryData("cities", province);
    }
  }
};
</script>

<style lang="less" scoped>
.choose_area {
  .province_style,
  .city_style {
    width: 120px;
  }
}
</style>
