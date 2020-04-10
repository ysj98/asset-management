<!--报表管理-资产资产统计分析入口页面-->
<template>
  <div class="asset_analysis">
    <!--查询条件部分-->
    <a-row :gutter="8" class="search_style">
      <a-col :span="6" :offset="1">
        <organ-project v-model="organProjectValue" :isShowBuilding="false"/>
      </a-col>
      <a-col :span="3">
        <a-select
          mode="multiple"
          :maxTagCount="1"
          style="width: 100%"
          v-model="assetType"
          :options="assetTypeOptions"
          placeholder="请选择资产类型"
          @change="selectAssetType"
        />
      </a-col>
      <a-col :span="3">
        <a-select style="width: 100%" :options="useTypeOptions" v-model="useType" placeholder="请选择资产用途"/>
      </a-col>
      <a-col :span="9">
        <province-city-district v-model="provinceCityDistrict"/>
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryData">查询</SG-Button>
      </a-col>
    </a-row>
    <div style="padding: 0 45px 35px;">
      <!--汇总分析图表部分-->
      <chart-part :queryInfo="queryInfo" :key="key"/>
      <!--查询列表部分-->
      <list-part :queryInfo="queryInfo"/>
    </div>
  </div>
</template>

<script>
  import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
  import { queryPlatformDict } from 'src/views/common/commonQueryApi'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import ChartPart from './components/ChartPart'
  import ListPart from './components/ListPart'
  export default {
    name: 'index',
    components: { ListPart, ChartPart, OrganProject, ProvinceCityDistrict },
    data () {
      return {
        key: 0, // 刷新汇总分析组件
        queryInfo: {}, // 查询条件集合,
        useType: '', // 查询条件-资产用途值
        assetType: ['-1'], // 查询条件-资产类型值
        provinceCityDistrict: {}, // 查询条件-省市区
        organProjectValue: {}, // 查询条件-组织机构及项目值
        useTypeOptions: [{ title: '全部用途', key: '' }], // 查询条件-资产用途选项,
        assetTypeOptions: [{ title: '全部资产类型', key: '-1' }], // 查询条件-资产类型选项
      }
    },
    
    created () {
      this.queryUseType()
      this.queryAssetType()
    },

    methods: {
      // 选中资产类型
      selectAssetType (value) {
        if (value.length > 1 && value.includes('-1')) {
          this.assetType = ['-1']
        }
      },

      // 查询数据
      queryData () {
        const {
          assetType, organProjectValue: { organId, projectId }, useType,
          provinceCityDistrict: { province, city, district: region }
        } = this
        if (!organId) { return this.$message.warn('请选择组织机构') }
        let str = assetType.includes('-1') ? '' : assetType.join(',')
        this.queryInfo = { province, city, region, useType, assetType: str, projectId, organId, key: Date.now() }
        this.key = Date.now()
      },
      
      // 查询资产用途数据
      queryUseType () {
        this.$api.basics.queryNodesByRootCode({categoryCode: 60}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let list = (res.data || []).map(m => {
              return { title: m.typeName, key: m.typeCode }
            })
            return this.useTypeOptions = [{ title: '全部资产用途', key: '' }].concat(list)
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产用途接口出错')
        })
      },

      // 查询平台资产类型字典
      queryAssetType () {
        queryPlatformDict('asset_type').then(list =>
          this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}, ...list]
        )
      },
    }
  }
</script>

<style lang='less' scoped>
  .asset_analysis {
    .search_style {
      padding: 20px 20px 20px 30px;
      border-bottom: 1px solid #e8e8e8;
    }
  }
</style>
