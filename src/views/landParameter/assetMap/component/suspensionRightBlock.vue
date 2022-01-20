<!--
 * @Date: 2020-09-04 11:11:45
 * @Description: 右侧悬浮框
 * @Author: chh
-->
<template>
  <div class="suspensionRightBlock-page">
    <!-- 导航显示 -->
    <div class="nav-top pointer" @click="handleSwitch">
      <span>{{ showMenuStr }}</span>
      <span class="fr">
        <a-icon :type="iconType" />
      </span>
    </div>
    <!-- 搜索条件块 -->
    <div class="map-search-box" v-show="toggle">
      <div class="search-title">
        <span>查询条件</span>
        <span class="fr pointer" @click="handleSwitch"
          ><a-icon type="close"
        /></span>
      </div>
      <!-- 查询主体 -->
      <div class="search-content">
        <div class="serach-condition-input">
          <organTreeSelect @changeTree="changeTree" style="width: 100%" />
        </div>
        <!-- 类型 -->
        <div class="search-item">
          <div class="search-item-label">类型:</div>
          <div class="search-item-content">
            <SG-CheckboxGroup
              :value="assetTypes"
              @change="checkboxGroupChnage"
            >
              <span
                class="search-checkbox"
                v-for="item in assetTypeListOpt"
                :key="item.value"
                ><SG-Checkbox :value="item.value" :key="item.value">{{
                  item.label
                }}</SG-Checkbox></span
              >
            </SG-CheckboxGroup>
          </div>
        </div>
        <!-- 省份 -->
        <div class="search-item">
          <div class="search-item-label">省份:</div>
          <div class="search-item-content">
            <span
              class="search-item-province ellipsis pointer"
              :class="queryCondition.province === item.value && 'active'"
              v-for="item in provinceOpt"
              @click="handleSelectAdress('province', item)"
              :key="item.key"
              :title="item.label"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
        <!-- 城市 -->
        <div class="search-item">
          <div class="search-item-label">城市:</div>
          <div class="search-item-content">
            <span
              class="search-item-province ellipsis pointer"
              :class="queryCondition.city === item.value && 'active'"
              v-for="item in cityOpt"
              @click="handleSelectAdress('city', item)"
              :key="item.key"
              :title="item.label"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
        <!-- 表格 -->
        <div>
          <a-spin :spinning="loading">
            <a-table class="table-boxs" bordered v-bind="table"> </a-table>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Tools, {calc, getFormat} from "@/utils/utils"
import organTreeSelect from "./organTreeSelect"
import {
  columns,
  arrkeys,
  getColumns,
  getDataIndexs,
} from "../lib/dict.js"
let provinceOptFrist = {
  label: "全国",
  value: "",
  key: Tools.getUuid(),
}
let cityOptFrist = { label: "全省", value: "", key: Tools.getUuid() }
export default {
  name: "suspensionRightBlock",
  components: {
    organTreeSelect,
  },
  data() {
    return {
      currentProvince: '',
      toggle: true,
      // menus: ["海文花园", "广东省", "深圳市"],
      assetTypeListOpt: [], // 请求资产类型
      provinceOpt: [{ ...provinceOptFrist }], // 省份
      cityOpt: [{ ...cityOptFrist }],
      loading: false,
      // 表格数据
      table: {
        columns,
        dataSource: [],
        pagination: false,
      },
      // 查询参数
      queryCondition: {
        province: "",
        city: "",
        organId: "",
        organName: "",
      },
      assetTypes: [],
      // 路由查询参数
      routeQueryStore: {},
    }
  },
  computed: {
    iconType() {
      return this.toggle ? "up" : "down"
    },
    // 显示菜单
    showMenuStr() {
      return this.menus.join(" > ")
    },
    menus() {
      let provinceLabel = this.provinceOpt.find(
        (item) => item.value === this.queryCondition.province
      )
      let cityLabel = this.cityOpt.find(
        (item) => item.value === this.queryCondition.city
      )
      console.log("provinceLabel", provinceLabel, cityLabel)
      return [
        this.queryCondition.organName,
        provinceLabel && provinceLabel.label,
        cityLabel && cityLabel.label,
      ]
    },
  },
  created() {
    this.platformDict("asset_type")
    this.queryProvinceList()
  },
  methods: {
    /*
    * 省市 code 转成 label
    * 301 => 北京
    * */
    codeToLabel(type, code) {
      let res = null
      if (type === 'province') {
        res = this.provinceOpt.find(
          (item) => item.value === code
        )
      }
      if (type === 'city') {
        res = this.cityOpt.find(
          (item) => item.value === code
        )
      }
      return res && res.label
    },
    // 获取默认位置
    async getDefaultLocation(organId){
      let { data: { data } } = await this.$api.paramsConfig.queryParamsConfigDetail({
        // 参考 serviceTypeAll.js 文件
        serviceType: 1001,
        organId,
      })
      let defaultProvince = {
        label: this.codeToLabel('province',data.paramKey),
        value: data.paramKey
      }
      await this.handleSelectAdress('province',defaultProvince,true)
      let defaultCity = {
        label:  this.codeToLabel('city',data.subKey,true),
        value: data.subKey
      }
      await this.handleSelectAdress('city',defaultCity)
      console.log('responseData', data)
    },
    query() {
      let data = {
        ...this.queryCondition,
        assetTypes: this.assetTypes.join(","),
      }
      this.$emit("search", data)
      // this.loading = true
      this.$api.land
        .overview(data)
        .then((res) => {
          if (+res.data.code === 0) {
            let result = res.data.data || {}
            // 数据中面积、价值添加分位符
            let resultArr = Object.values(result)
            resultArr.forEach(item => {
              item['assetArea'] = getFormat(item['assetArea'], 2)
              item['assetValue'] = getFormat(item['assetValue'], 2)
            })
            let keysArr = getDataIndexs(this.assetTypes)
            let dataSource = arrkeys.map((item) => {
              let key = item[1]
              let o = { key: Tools.getUuid(), name: item[0] }

              keysArr.forEach((dataIndex) => {
                // 如果是面积
                if (key === "assetArea") {
                  result[dataIndex][key] = Number(result[dataIndex][key])
                    ? Number(result[dataIndex][key]).toFixed(2)
                    : result[dataIndex][key]
                }
                // 如果是价值
                if (key === "assetValue") {
                  result[dataIndex][key] = Number(result[dataIndex][key])
                    ? Math.floor(calc.divide(Number(result[dataIndex][key]), 10000) * 100) / 100
                    : result[dataIndex][key]
                }
                o[dataIndex] = result[dataIndex][key]
              })
              return o
            })
            this.table.dataSource = dataSource
            console.log("得到表格数据=>", this.table.dataSource)
          } else {
            this.$message.error(res.data.message || res.data.msg)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 拼接处导航栏
    // 选择省市区
    async handleSelectAdress(type, item, transferFlag) {

      let payload  = {
        ...this.queryCondition,
        assetTypes: this.assetTypes.join(",")
      }
      let { label, value } = item
      console.log("选择省市区", type, item)
      if (type === "province") {
        let flag = this.queryCondition.province === value
        if (flag) {
          return
        }
        Object.assign(this.queryCondition, {
          province: value,
          city: "",
        })
        this.cityOpt = [{...cityOptFrist}]
        if (label !== '全国'){
          this.currentProvince = label
          await this.queryCityAndAreaList(value, type)
        }
        if (!transferFlag){
          payload._periphery = label
          this.$emit('search', payload)
        }
      }
      if (type === "city") {
        let address = label
        let flag = this.queryCondition.city === value
        if (flag) {
          return
        }
        this.queryCondition.city = value
        if ( label === '全省' ){
          address = this.currentProvince
        }
        payload._periphery = address
        this.$emit('search', payload)
      }
      this.query()
    },
    // 地址选项开关
    handleSwitch() {
      this.toggle = !this.toggle
    },
    // 多选框改变
    checkboxGroupChnage(checkedValues) {
      console.log('checkedValues',checkedValues)
      if (checkedValues && checkedValues.length === 0){
        this.$message.warn('至少保留一种业态')
        return null
      }
      console.log("checked = ", checkedValues)
      this.assetTypes = checkedValues
      this.table.columns = getColumns(checkedValues)
      this.query()
    },
    // 获取选择的组织机构
    async changeTree(organId, organName) {
      Object.assign(this.queryCondition, {
        organName,
        organId,
      })
      console.log("没有进来吗=>", organId, organName)
      await this.getDefaultLocation(organId)
      await this.query()
    },
    // 平台字典
    platformDict(code) {
      this.$api.assets.platformDict({ code }).then((res) => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          let arr = result.map((item) => ({
            label: item.name,
            ...item,
            key: Tools.getUuid(),
          }))
          // 资产类型
          if (code === "asset_type") {
            this.assetTypeListOpt = arr
            this.assetTypes = arr.map((item) => {
              return item.value
            })
            this.table.columns = getColumns(this.assetTypes)
          }
        }
      })
    },
    // 请求省
    queryProvinceList() {
      return this.$api.basics.queryProvinceList().then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data || []
          this.provinceOpt = data.map((item) => {
            return {
              label: item.name,
              value: item.regionId,
              key: Tools.getUuid(),
            }
          })
          this.provinceOpt.unshift({ ...provinceOptFrist })
        }
      })
    },
    // 请求市区
    async queryCityAndAreaList(parentRegionId, type) {
      return new Promise(resolve => {
        console.log('args',...arguments)
        this.$api.basics.queryCityAndAreaList({ parentRegionId }).then((res) => {
          if (res.data.code === "0") {
            let data = res.data.data || []
            let result = data.map((item) => {
              return { label: item.name, value: item.regionId }
            })
            // 市
            if (type === "province") {
              this.cityOpt = result
              this.cityOpt.unshift({ ...cityOptFrist })
            }
          }
          resolve()
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.suspensionRightBlock-page {
  width: 450px;
}
.nav-top {
  background-color: #fff;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;

  box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.14);
}
.map-search-box {
  margin-top: 5px;
  background-color: #fff;
  box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  overflow: hidden;
  .search-title {
    height: 32px;
    line-height: 32px;
    padding: 0px 15px;
    border-bottom: 1px solid #dadada;
  }
  .search-content {
    padding: 10px 15px;
    // min-height: 400px;
    max-height: calc(100vh - 127px);
    overflow-y: auto;
  }
  .search-checkbox {
    //width: 90px;
    display: inline-block;
  }
  .search-item-province {
    width: 62px;
    display: inline-block;
    font-size: 14px;
    color: #6d7585;
    line-height: 26px;
    margin-right: 10px;
    &:hover,
    &.active {
      color: #0084ff;
    }
  }
  .search-item {
    display: grid;
    grid-template-columns: 50px auto;
    grid-template-rows: auto;
    margin-top: 13px;
    .search-item-label {
      font-size: 15px;
      font-weight: bold;
      color: #6d7585;
    }
  }
  /deep/ .ant-select-selection {
    border: 1px solid #dce1e6;
    border-radius: 16px;
  }
  /deep/ .sg-checkbox-group .ant-checkbox-wrapper {
    font-size: 14px;
  }
  /deep/ .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active {
    box-shadow: 0 0 0 1px rgba(151, 151, 151, 0.1);
  }
  /deep/ .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection {
    box-shadow: 0 0 0 1px rgba(151, 151, 151, 0.1);
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
