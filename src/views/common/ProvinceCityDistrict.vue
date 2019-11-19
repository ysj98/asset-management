<!--
 * 省-市-区-三级联动组件
 * 外层组件可通过定义在省市区控件上的class[.province_style, .city_style, .district_style]用 /deep/ 控制布局样式
-->
<template>
  <div class="choose_area">
    <a-row :gutter="8">
      <a-col :span="8">
        <a-select
          v-model="province"
          v-bind="properties"
          class="province_style"
          placeholder="请选择省份"
          :loading="loading && !provinces.length"
        >
          <a-select-option v-for="provinceValue in provinces" :key="provinceValue">{{provinceValue}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
        <a-select
          v-model="city"
          v-bind="properties"
          class="city_style"
          placeholder="请选择城市"
          :loading="loading && !cities.length"
        >
          <a-select-option v-for="cityValue in cities" :key="cityValue">{{cityValue}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
        <a-select
          v-model="district"
          v-bind="properties"
          class="district_style"
          placeholder="请选择地区"
          :loading="loading && !districts.length"
        >
          <a-select-option v-for="districtValue in districts" :key="districtValue">{{districtValue}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'ProvinceCityDistrict',
    props: {
      // 支持v-model,向外传递一个对象 { province, city, district }
      value: {
        type: Object,
        default: () => ({})
      },
      // 是否可搜索
      showSearch: {
        type: Boolean,
        default: () => false
      },
      // 是否可清除
      allowClear: {
        type: Boolean,
        default: () => true
      },
      // 尺寸大小default large small
      size: {
        type: String,
        default: () => 'default'
      }
    },
    data () {
      return {
        loading: false, // 加载状态
        province: undefined,
        provinces: [],
        city: undefined,
        cities: [],
        district: undefined,
        districts: [],
        timeoutId: 0,
        properties: {} // 属性值
      }
    },

    methods: {
      // 查询省市区接口
      queryData (type, parentRegionId) {
        this.loading = true
        const api = {
          province: 'queryProvinceList',
          cities: 'queryCityAndAreaList',
          districts: 'queryCityAndAreaList'
        }
        let form = type === 'province' ? {} : { parentRegionId }
        clearTimeout(this.timeoutId)
        let _this = this
        _this.timeoutId = setTimeout(() => {
          _this.$api.basics[api[type]](form).then(r => {
            _this.loading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              _this[type] = (res.data || []).map(item => {
                return { value: item.regionId, name: item.name }
              })
              return false
            }
            throw res.message || '区域查询失败'
          }).catch(err => {
            _this.loading = false
            _this.$message.error(err || '区域查询失败')
          })
        })
      }
    },
    
    created () {
      const { allowClear, size, showSearch, value } = this
      this.properties = { allowClear, size, showSearch }
      Object.assign(this, { ...value })
      this.queryData('province')
    },
    watch: {
      province: function (province) {
        Object.assign(this, {
          city: undefined,
          district: undefined
        })
        this.$emit('input', { province, city: undefined, district: undefined })
        this.queryData('cities', province)
      },

      city: function (city) {
        const {province} = this
        this.district = undefined
        this.$emit('input', { province, city, district: undefined })
        this.queryData('districts', city)
      },

      district: function (district) {
        const {province, city} = this
        this.$emit('input', { province, city, district })
      }
    }
  }
</script>

<style lang='less' scoped>
  .choose_area {
    .province_style, .city_style, .district_style {
      width: 100%;
    }
  }
</style>
