<!--报表管理-有证房屋资产统计表页面-->
<template>
  <div class="house_asset">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="10">
        <SG-Button icon="import" :loading="exportBtnLoading" @click="handleExport" v-power="ASSET_MANAGEMENT.TM_HA_EXPORT"> 导出 </SG-Button>
        <SG-Button class="ml20" @click="changeListSettingsModal(true)" v-power="ASSET_MANAGEMENT.TM_HA_HEADERS_SETTING">列表设置</SG-Button>
      </a-col>
      <a-col :span="12">
        <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple" />
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData({ type: 'sum' })">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-total custom-scroll td-pd10" ref="table" />
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px" />
    <div class="h100"></div>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })" />
    <TableHeaderSettings
      v-if="listSettingFlag"
      :funType="funType"
      width="1200px"
      @cancel="changeListSettingsModal(false)"
      @success="handleTableHeaderSuccess"
    />
  </div>
</template>

<script>
import NoDataTip from 'src/components/noDataTips';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import OrganProject from 'src/views/common/OrganProjectBuilding';
import { exportDataAsExcel } from 'src/views/common/commonQueryApi';
import { handleTableScrollHeight, handleTableHeaderScrollHeight, initTableColumns } from '@/utils/share.js';
import TableHeaderSettings from '@/components/TableHeaderSettings';
import Utils from '@/utils/utils.js';
const totalKeyArr = [
  'ownBuildNumber',
  'ownHouseNumber',
  'ownUsedBuildNumber',
  'ownUsedHouseNumber',
  'otherBuildNumber',
  'otherHouseNumber',
  'otherUsedBuildNumber',
  'otherUsedHouseNumber',
];
const detailColumns = [
  { title: '资产项目名称', dataIndex: 'projectName', width: 300, fixed: 'left' },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
    width: 300,
    customRender(text, { projectCode }) {
      // 特殊处理 合计 行的值
      return Utils.isString(projectCode) ? projectCode : '';
    },
  },
  { title: '管理机构', dataIndex: 'organName', width: 300 },
  { title: '本单位有产权楼栋数量', dataIndex: 'ownBuildNumber', width: 180 },
  { title: '本单位有产权房屋数量', dataIndex: 'ownHouseNumber', width: 180 },
  { title: '本单位有使用权楼栋数量', dataIndex: 'ownUsedBuildNumber', width: 180 },
  { title: '本单位有使用权房屋数量', dataIndex: 'ownUsedHouseNumber', width: 180 },
  { title: '其他单位有产权楼栋数量', dataIndex: 'otherBuildNumber', width: 180 },
  { title: '其他单位有产权房屋数量', dataIndex: 'otherHouseNumber', width: 180 },
  { title: '其他单位有使用权楼栋数量', dataIndex: 'otherUsedBuildNumber', width: 180 },
  { title: '其他单位有使用权房屋数量', dataIndex: 'otherUsedHouseNumber', width: 180 },
];

export default {
  name: 'index',
  components: { OrganProject, NoDataTip, TableHeaderSettings },
  data() {
    return {
      ASSET_MANAGEMENT, // 权限对象
      listSettingFlag: false,
      funType: 13,
      exportBtnLoading: false, // 导出按钮loading
      organProjectValue: {}, // 查询条件-组织机构及项目值
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
      tableObj: {
        pagination: false,
        rowKey: 'projectCode',
        loading: false,
        dataSource: [],
        scroll: { x: '100%', y: 540 },
        columns: [],
      },
      dataSum: {}, // 所有数据合计
    };
  },

  watch: {
    organProjectValue: function () {
      this.queryTableData({ type: 'sum' });
    },
  },

  methods: {
    handleNumber(dataSource) {
      dataSource.forEach((ele) => {
        Object.keys(ele).forEach((keyStr) => {
          if (totalKeyArr.includes(keyStr)) {
            if (!isNaN(Number(ele[keyStr]))) {
              ele[keyStr] = Number(ele[keyStr]).toLocaleString();
            }
          }
        });
      });
    },
    handleTableHeaderSuccess() {
      this.changeListSettingsModal(false);
      initTableColumns({ columns: this.tableObj.columns, detailColumns, funType: this.funType });
    },
    changeListSettingsModal(flag) {
      this.listSettingFlag = flag;
    },
    // 导出
    handleExport() {
      const {
        organProjectValue: { organId, projectId },
      } = this;
      this.exportBtnLoading = true;
      exportDataAsExcel(
        { organId, projectIds: projectId || undefined },
        this.$api.tableManage.exportWarrantHouse,
        '有证房屋资产统计表.xls',
        this
      ).then(() => {
        this.exportBtnLoading = false;
      });
    },

    // 查询列表数据
    queryTableData({ pageNo = 1, pageLength = 10, type }) {
      const {
        organProjectValue: { organId, projectId },
        dataSum,
      } = this;
      if (!organId) {
        return this.$message.warn('请选择组织机构');
      }
      this.tableObj.loading = true;
      let form = { organId, projectIds: projectId || undefined };
      let queryTablePromise = this.$api.tableManage
        .queryWarrantHouse({
          ...form,
          pageSize: pageLength,
          pageNum: pageNo,
        })
        .then((r) => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            if (!data || !data.length) {
              return (this.tableObj.dataSource = []);
            }
            // 前端计算汇总
            let keys = ['ownHouseNumber', 'ownUsedHouseNumber', 'otherHouseNumber', 'otherUsedHouseNumber'];
            // 后端返回汇总
            let totalKeys = [
              {
                useKey: 'ownBuildNumber',
                dataKey: 'ownBuildNumberTotal',
              },
              {
                useKey: 'ownUsedBuildNumber',
                dataKey: 'ownUsedBuildNumberTotal',
              },
              {
                useKey: 'otherBuildNumber',
                dataKey: 'otherBuildNumberTotal',
              },
              {
                useKey: 'otherUsedBuildNumber',
                dataKey: 'otherUsedBuildNumberTotal',
              },
            ];
            let sumInfo = {};
            totalKeys.forEach((ele) => {
              sumInfo[ele.useKey] = data[0][ele.dataKey];
            });
            let dataSource = data
              .map((m) => {
                keys.forEach((key) => {
                  !sumInfo[key] && (sumInfo[key] = 0);
                  sumInfo[key] += m[key] ? Number(m[key]) : 0;
                });
                return m;
              })
              .concat({ ...sumInfo, projectCode: Date.now() + Math.random(), projectName: '当前页-合计' });
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });

            this.tableObj.dataSource = type === 'sum' ? dataSource : dataSource.concat(dataSum);
            this.handleNumber(this.tableObj.dataSource);
            return this.tableObj.dataSource;
          }
          throw res.message;
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || '查询接口出错');
          return false;
        });
      if (type === 'sum') {
        Promise.all([queryTablePromise, this.queryDataSum(form)]).then(([dataSource, dataSum]) => {
          dataSource && (this.tableObj.dataSource = dataSource.concat(dataSum));
          this.handleNumber(this.tableObj.dataSource);
        });
      }
    },

    // 查询当前条件下所有数据的合计信息
    queryDataSum(form) {
      let obj = { projectCode: Date.now() + Math.random(), projectName: '所有页-合计' };
      return this.$api.tableManage
        .queryHouseAssetSumInfo(form)
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            return (this.dataSum = { ...res.data, ...obj });
          }
          throw res.message;
        })
        .catch((err) => {
          this.$message.error(err || '查询所有页合计出错');
          return (this.dataSum = obj);
        });
    },
  },
  created() {
    //handleTableScrollHeight(this.tableObj.scroll, 350)
    initTableColumns({ columns: this.tableObj.columns, detailColumns, funType: this.funType });
  },
  mounted() {
    handleTableHeaderScrollHeight(this.$refs.table.$el);
  },
};
</script>

<style lang="less" scoped>
.house_asset {
  .custom-table {
    padding-bottom: 55px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th,
      td {
        white-space: nowrap;
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
    bottom: 52px;
    background: #fff;
  }
}
</style>
