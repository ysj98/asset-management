<!--房屋资产统计分析 - 资产分类统计明细-->
<template>
  <div class="house_asset">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="10">
        <SG-Button icon="import" :loading="exportBtnLoading" @click="handleExport" v-power="ASSET_MANAGEMENT.TM_HA_EXPORT"> 导出 </SG-Button>
      </a-col>
      <a-col :span="12">
        <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple" />
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData({ type: 'sum' })">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" size="middle" />
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px" />
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })" />
  </div>
</template>

<script>
import NoDataTip from 'src/components/noDataTips';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import OrganProject from 'src/views/common/OrganProjectBuilding';
import { exportDataAsExcel } from 'src/views/common/commonQueryApi';
export default {
  name: 'index',
  components: { OrganProject, NoDataTip },
  data() {
    return {
      ASSET_MANAGEMENT, // 权限对象
      exportBtnLoading: false, // 导出按钮loading
      organProjectValue: {}, // 查询条件-组织机构及项目值
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
      tableObj: {
        pagination: false,
        rowKey: 'projectCode',
        loading: false,
        dataSource: [],
        scroll: { x: 800, y: 500 },
        columns: [
          // { title: '资产项目名称', dataIndex: 'projectName', width: 320, fixed: 'left', customRender: (text) => {
          //   return {
          //     children: text,
          //     attrs: (text === '当前页-合计' || text === '所有页-合计') ? {colSpan: 3} : {}
          //   }
          // } },
          // { title: '资产项目编码', dataIndex: 'projectCode', width: 150, customRender: (text, row) => {
          //   return {
          //     children: text,
          //     attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
          //   }
          // } },
          // { title: '管理机构', dataIndex: 'organName', width: 180, customRender: (text, row) => {
          //   return {
          //     children: text,
          //     attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
          //   }
          // } },
          { title: '分类ID', dataIndex: 'ownBuildNumber' },
          { title: '资产分类名称', dataIndex: 'ownHouseNumber' },
          { title: '面积（㎡）', dataIndex: 'ownUsedBuildNumber' },
          { title: '占比（%）', dataIndex: 'ownUsedHouseNumber' },
        ],
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
            return (this.tableObj.dataSource = type === 'sum' ? dataSource : dataSource.concat(dataSum));
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
</style>
