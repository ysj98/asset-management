<!--报表管理-有证面积不匹对核查报表-->
<template>
  <div class="credentialsCheck">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="8" :offset="4">
        <!-- 组织机构和资产项目下拉框 mode="multiple"(多选) -->
        <organ-project v-model="organProjectValue" :isShowBuilding="false" />
      </a-col>
      <a-col :span="4">
        <!-- 资产类型 -->
        <a-select
          :maxTagCount="1"
          style="width: 100%"
          @change="assetTypeChange"
          :options="$addTitle(assetTypeOptions)"
          v-model="queryObj.assetType"
          placeholder="请选择资产类型"
        />
      </a-col>
      <a-col :span="4">
        <!-- 资产名称/编码 -->
        <a-input v-model.trim="queryObj.assetNameOrCode" style="width: 100%" placeholder="资产名称或编码" />
      </a-col>
      <a-col :span="4" class="tr">
        <SG-Button type="primary" @click="queryTableData()">查询</SG-Button>
        <SG-Button class="ml10" type="secondary" @click="reset">重置</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" bordered class="myTable" :scroll="{ x: 'calc(100px + 70%)', y: 500 }" />
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData(pageNo, pageLength)" />
  </div>
</template>

<script>
import { queryAssetTypeList } from 'src/views/common/commonQueryApi';
import OrganProject from 'src/views/common/OrganProjectBuilding';
import { tableColumns, ownershipStatus } from './tableColumns.js';
const queryObj = {
  assetType: '-1', // 查询条件-资产类型值,多选
  assetNameOrCode: '', //  查询条件-资产名称或编码
};
export default {
  name: 'credentialsCheck',
  components: { OrganProject },
  data() {
    return {
      assetTypeOptions: [{ title: '全部资产类型', key: '-1' }], // 查询条件-资产类型选项，平台字典
      organProjectValue: {}, // 查询条件-组织机构及项目值
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
      queryObj: {
        assetType: '-1', // 查询条件-资产类型值,多选
        assetNameOrCode: '', //  查询条件-资产名称或编码
      },
      tableObj: {
        pagination: false,
        rowKey: 'id',
        loading: false,
        dataSource: [],
        columns: tableColumns,
      },
    };
  },

  watch: {
    organProjectValue: {
      handler: function () {
        this.queryTableData();
      },
      deep: true,
    },
  },
  mounted() {
    this.queryAssetType();
  },
  methods: {
    assetTypeChange(value) {
      let lastIndex = value.length - 1;
      this.queryObj.assetType = value[lastIndex] === '-1' ? ['-1'] : value.filter((m) => m !== '-1');
    },
    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then((list) => {
        this.assetTypeOptions = [{ title: '全部资产类型', key: '-1' }].concat(list);
      });
    },
    reset() {
      this.queryObj = { ...queryObj };
      this.paginationObj.pageNo = 1;
      this.paginationObj.pageLength = 10;
      this.paginationObj.totalCount = 0;
      this.queryTableData();
    },
    // 查询列表数据
    queryTableData(pageNo = 1, pageLength = 10) {
      const {
        organProjectValue: { organId, projectId },
      } = this;
      let form = { organId, projectId: projectId || '', ...this.queryObj, pageSize: pageLength, pageNum: pageNo };
      if (!organId) {
        return this.$message.warn('请选择组织机构');
      }
      this.tableObj.loading = true;
      this.$api.tableManage
        .checkShipArea({
          ...form,
          assetType: form.assetType === '-1' ? '' : form.assetType,
        })
        .then((r) => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            if (data || data.length) {
              this.tableObj.dataSource = data.map((item) => {
                return {
                  ...item,
                  ownershipStatus: ownershipStatus[item.ownershipStatus] || '无',
                };
              });
            }
            Object.assign(this.paginationObj, { totalCount: count, pageNo, pageLength });
          }
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || '查询接口出错');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.credentialsCheck {
  .myTable {
    padding-bottom: 68px;
  }
}
</style>
