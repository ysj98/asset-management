<!--报表管理-房屋资产统计分析入口页面-->
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
          :options="assetTypeOptions"
          v-model="assetType"
          placeholder="请选择资产类型"
        />
      </a-col>
      <a-col :span="9">
        <province-city-district/>
      </a-col>
      <a-col :span="3">
        <a-select
          mode="multiple"
          :maxTagCount="1"
          style="width: 100%"
          :options="assetTypeOptions"
          v-model="assetType"
          placeholder="请选择资产类型"
        />
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary">查询</SG-Button>
      </a-col>
    </a-row>
    <div style="padding: 0 45px 35px;">
      <!--汇总分析图表部分-->
      <chart-part/>
      <!--查询列表部分-->
      <list-part/>
    </div>
  </div>
</template>

<script>
  import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import ListPart from './components/ListPart'
  import ChartPart from './components/ChartPart'
  export default {
    name: 'index',
    components: { ListPart, ChartPart, OrganProject, ProvinceCityDistrict },
    data () {
      return {
        organProjectValue: {}, // 查询条件-组织机构及项目值
        assetType: ['-1'], // 查询条件-资产类型值
        assetTypeOptions: [
          { title: '全部资产状态', key: '-1' }
        ], // 查询条件-资产类型选项
      }
    },

    methods: {}
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
