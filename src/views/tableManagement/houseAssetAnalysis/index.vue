<!--报表管理-资产资产统计分析入口页面-->
<template>
  <div class="asset_analysis">
    <!--查询条件部分-->
    <div :gutter="8" class="search_style">
      <organ-project v-model="organProjectValue" :isShowBuilding="false" :showSearch="true" mode="multiple" />
      <a-select
        mode="multiple"
        :maxTagCount="1"
        style="width: 100%"
        v-model="objectType"
        @change="objectTypeChange"
        placeholder="请选择资产分类"
        :options="$addTitle(objectTypeOptions)"
      />
      <ProvinceCityDistrict v-model="provinceCityDistrict" />
      <div>
        <SG-Button type="primary" @click="queryData">查询</SG-Button>
        <SG-Button class="ml10" type="secondary" @click="reset">重置</SG-Button>
      </div>
    </div>
    <div style="padding: 0 45px 35px">
      <SG-Button class="mt20" type="primary" @click="searchDetail">查看明细</SG-Button>
      <!--汇总分析图表部分-->
      <chart-part :queryInfo="queryInfo" :titleList="titleList" />
      <!--查询列表部分-->
      <list-part :queryInfo="queryInfo" :titleList="titleList" />
    </div>
    <asset-detail ref="assetDetail" :queryInfo="queryInfo"></asset-detail>
  </div>
</template>

<script>
import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict';
import { queryCategoryList } from 'src/views/common/commonQueryApi';
import OrganProject from 'src/views/common/OrganProjectBuilding';
import ChartPart from './components/ChartPart';
import ListPart from './components/ListPart';
import AssetDetail from './components/AssetDetail';
export default {
  name: 'index',
  components: { ListPart, ChartPart, OrganProject, ProvinceCityDistrict, AssetDetail },
  data() {
    return {
      key: 0, // 刷新汇总分析组件
      queryInfo: {}, // 查询条件集合,
      objectType: [], // 查询条件-资产分类
      provinceCityDistrict: {}, // 查询条件-省市区
      organProjectValue: {}, // 查询条件-组织机构及项目值
      objectTypeOptions: [{ title: '全部分类', key: '' }], // 查询条件-资产分类选项
      titleList: [],
    };
  },

  watch: {
    provinceCityDistrict: {
      handler: function () {
        this.queryData();
      },
      deep: true,
    },

    organProjectValue: {
      handler: function (obj) {
        this.queryData();
        obj.organId && this.queryObjectTypeByOrganId(obj.organId);
        obj.organId && this.getTitle(obj.organId);
      },
      deep: true,
    },
  },

  methods: {
    searchDetail() {
      this.$refs.assetDetail.show = true;
    },
    // 资产类型全选与其他选项互斥处理
    objectTypeChange(value) {
      this.objectType = value[value.length - 1] === 'all' ? ['all'] : value.filter((m) => m !== 'all');
      this.queryData();
    },
    //获取自定义表头
    getTitle(val) {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: val }).then((res) => {
        if (res.data.code == 0) {
          this.titleList = res.data.data;
        }
      });
    },
    reset() {
      this.objectType = [];
      this.provinceCityDistrict = {
        province: undefined,
        city: undefined,
        district: undefined,
      };
      this.queryData();
    },
    // 查询数据
    queryData() {
      const {
        organProjectValue: { organId, projectId },
        objectType,
        provinceCityDistrict: { province, city, district: region },
      } = this;
      if (!organId) {
        return this.$message.warn('请选择组织机构');
      }
      this.queryInfo = {
        projectIds: projectId || undefined,
        organId,
        key: Date.now(),
        province,
        city,
        region,
        objectTypeIdList: objectType.includes('all') ? [] : objectType,
      };
      this.key = Date.now();
    },

    // 根据organId查询资产分类数据
    queryObjectTypeByOrganId(organId) {
      queryCategoryList({ assetType: '1', organId })
        .then((list) => {
          this.objectTypeOptions = [{ title: '全部资产分类', key: 'all' }].concat(list);
        })
        .catch((err) => {
          this.$message.error(err || '查询资产分类接口出错');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.asset_analysis {
  .search_style {
    width: 100%;
    padding: 20px 20px 20px 30px;
    border-bottom: 1px solid #e8e8e8;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 200px;
    grid-column-gap: 20px;
  }
}
</style>
