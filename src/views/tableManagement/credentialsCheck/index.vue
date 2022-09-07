<!--报表管理-有证面积不匹对核查报表-->
<template>
  <div class="credentialsCheck">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="10" :offset="4">
        <!-- 组织机构和资产项目下拉框 -->
        <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple" />
      </a-col>
      <a-col :span="4">
        <!-- 资产类型 -->
        <a-select :maxTagCount="1" style="width: 100%" @change="assetTypeChange" :options="$addTitle(assetTypeOptions)" v-model="queryObj.assetType" placeholder="请选择资产类型" />
      </a-col>
      <a-col :span="4">
        <!-- 资产名称/编码 -->
        <a-input v-model.trim="queryObj.assetNameOrCode" style="width: 100%" placeholder="资产名称或编码" />
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData()">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10" bordered :scroll="{ x: '100%', y: 500 }" />
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px" />
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData(pageNo, pageLength)" />
  </div>
</template>

<script>
import { queryAssetTypeList } from 'src/views/common/commonQueryApi';
import NoDataTip from 'src/components/noDataTips';
import OrganProject from 'src/views/common/OrganProjectBuilding';
import { tableColumns, ownershipStatus } from './tableColumns.js';
export default {
  name: 'credentialsCheck',
  components: { OrganProject, NoDataTip },
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
      this.queryObj.assetType = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1');
    },
    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then(list => {
        this.assetTypeOptions = [{ title: '全部资产类型', key: '-1' }].concat(list);
      });
    },

    // 查询列表数据
    queryTableData(pageNo = 1, pageLength = 10) {
      const {
        organProjectValue: { organId, projectId },
      } = this;
      let form = { organId, projectIds: projectId || '', ...this.queryObj, pageSize: pageLength, pageNum: pageNo };
      if (!organId) {
        return this.$message.warn('请选择组织机构');
      }
      this.tableObj.loading = true;
      this.$api.tableManage
        .checkShipArea({
          ...form,
          assetType : form.assetType === '-1' ? '' : form.assetType
        })
        .then(r => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            if (!data || !data.length) {
              this.tableObj.dataSource = data.map((item)=>{
                return {
                  ...item,
                  ownershipStatus: ownershipStatus[ownershipStatus] || '无'
                }
              });
            }
            Object.assign(this.paginationObj, { totalCount: count, pageNo, pageLength });
          }
        })
        .catch(err => {
          this.tableObj.loading = false;
          this.$message.error(err || '查询接口出错');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.credentialsCheck {
  .custom-table {
    padding-bottom: 55px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table-fixed-header .ant-table-scroll .ant-table-header {
      height: auto;
    }
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
        text-align: center;
      }
      td {
        text-align: center;
      }
      tr:last-child,
      tr:nth-last-child(2) {
        font-weight: bold !important;
      }
    }
  }
}
/deep/.ant-table-tbody {
  tr:nth-last-child(1) {
    position: sticky;
    bottom: 0px;
    background: #fff;
  }
  tr:nth-last-child(2) {
    position: sticky;
    bottom: 40px;
    background: #fff;
  }
}
</style>
