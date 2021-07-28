<!--
 * 省-市-区-三级联动组件
 * 外层组件可通过定义在省市区控件上的class[.province_style, .city_style]用 /deep/ 控制布局样式
-->
<template>
  <div class="choose_area">
    <a-row :gutter="8">
      <a-col :span="8">
        <a-select
          :disabled="!isValid"
          v-model="province"
          v-bind="properties"
          :options="$addTitle(provinces)"
          class="province_style"
          placeholder="请选择省份"
          :filterOption="filterOption"
          :loading="loading && !provinces.length"
        ></a-select>
      </a-col>
      <a-col :span="8">
        <a-select
          :disabled="!isValid"
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
    isValid: {
      type: Number,
      default: 0
    },
    // 支持v-model,向外传递一个对象 { province, city }
    valueObj: {
      type: Object,
      default: () => ({})
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
      loading: false, // 加载状态
      province: undefined,
      provinces: [],
      city: undefined,
      cities: [],
      properties: {} // 属性值
    };
  },

  methods: {
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
            return false;
          }
          throw res.message || "区域查询失败";
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err || "区域查询失败");
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
        console.log("province, city", province, city);
        this.$emit("sendData", { paramKey: province, subKey: city });
      } else {
        // console.log("校验未通过,请选择省市");
        return "请选择省市";
      }
    }
  },

  created() {
    console.log("created阶段");
    const { allowClear, size, showSearch, valueObj, subKey, paramKey } = this;
    this.properties = { allowClear, size, showSearch };

    this.city = subKey;
    this.province = paramKey;
    Object.assign(this, { ...valueObj });
    this.queryData("provinces");
  },
  watch: {
    province: function(province) {
      Object.assign(this, {
        city: undefined,
        cities: []
      });
      province && this.queryData("cities", province);
    }
  }
};
</script>

<style lang="less" scoped>
.choose_area {
  .province_style,
  .city_style {
    width: 100%;
  }
}
</style>
