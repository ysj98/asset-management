<template>
  <div>
    <!-- 搜索区域-->
    <search-container type="" :value="false">
      <div slot="headerBtns">
        <SG-Button :loading="exportFlag" @click="handleExport" icon="import" type="primary"
          v-power="ASSET_MANAGEMENT.EQUIPMENTVIEW_PROJECT_VIEW_EXPORT">
          导出
        </SG-Button>
      </div>
      <div slot="headerForm">
        <div class="headerForm">
          <tree-select :allowClear="false" @changeTree="changeTree" class="search-item" :showSearch="true"
            :multiple="true" :treeCheckable="true" />
          <a-select v-model="queryForm.projectIdList" :options="projectData" :maxTagCount="1" :allowClear="true"
            mode="multiple" class="search-item" placeholder="全部资产项目"></a-select>
          <a-checkbox v-model="isCurrentOrgan"> 仅当前机构资产项目 </a-checkbox>
          <a-button @click="doSearch" type="primary">查询</a-button>
        </div>
      </div>
    </search-container>
    <div>
      <a-spin :spinning="totalLoadingFlag">
        <overview-number :numList="numList" />
      </a-spin>
    </div>
    <!-- 表格 -->
    <div>
      <a-table v-bind="tableOptions">
        <!-- 操作-->
        <template #action="text, record">
          <a @click="goDetail(record)">详情</a>
        </template>
      </a-table>
    </div>
    <!-- 分页控件-->
    <SG-FooterPagination v-bind="paginationObj" @change="changePage" />
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import OverviewNumber from '@/views/common/OverviewNumber';
import { handleTableScrollHeight } from 'utils/share';
import { handleDownloadFile } from 'utils/utils';
import { ASSET_MANAGEMENT } from '@/config/config.power';
const detailColumns = [
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: 250,
    fixed: 'left',
  },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
    width: 250,
  },
  {
    title: '接管机构',
    dataIndex: 'organName',
    width: 250,
  },
  {
    title: '来源方式',
    dataIndex: 'sourceTypeName',
    width: 150,
  },
  {
    title: '来源方式说明',
    dataIndex: 'souceChannelType',
    width: 150,
  },
  {
    title: '接管时间',
    dataIndex: 'takeOverDate',
    width: 250,
  },
  {
    title: '资产数量',
    dataIndex: 'assetCount',
    width: 150,
  },
  {
    title: '运营',
    dataIndex: 'operationCount',
    width: 150,
  },
  {
    title: '闲置',
    dataIndex: 'idleCount',
    width: 150,
  },
  {
    title: '自用',
    dataIndex: 'selfCount',
    width: 150,
  },
  {
    title: '其他',
    dataIndex: 'otherCount',
    width: 150,
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValue',
    width: 150,
  },
  {
    title: '最新估值(元)',
    dataIndex: 'marketValue',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: {
      customRender: 'action',
    },
    width: 100,
  },
];
export default {
  name: 'equipmentViewProjectview',
  components: {
    SearchContainer,
    TreeSelect,
    OverviewNumber,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      exportFlag: false,
      totalLoadingFlag: false,
      isCurrentOrgan: false,
      projectData: [],
      tableOptions: {
        rowKey: 'projectId',
        loading: false,
        scroll: { x: '100%' },
        pagination: false,
        columns: detailColumns,
        dataSource: [],
      },
      paginationObj: {
        pageLength: 10,
        pageNo: 1,
        totalCount: 0,
        location: 'fixed',
      },
      queryForm: {
        organId: '',
        projectIdList: [],
        current: 0,
      },
      numList: [
        {
          title: '资产数量',
          key: 'assetCount',
          value: 0,
          fontColor: '#324057',
          isAble: 'Y',
        },
        {
          title: '运营',
          key: 'operationCount',
          value: 0,
          bgColor: '#4BD288',
          code: '1001',
          isAble: 'Y',
        },
        {
          title: '闲置',
          key: 'idleCount',
          value: 0,
          bgColor: '#1890FF',
          code: '1002',
          isAble: 'Y',
        },
        {
          title: '自用',
          key: 'selfCount',
          value: 0,
          bgColor: '#DD81E6',
          code: '1003',
          isAble: 'Y',
        },
        {
          title: '其他',
          key: 'otherCount',
          value: 0,
          bgColor: '#BBC8D6',
          code: '1005',
          isAble: 'Y',
        },
        {
          title: '资产原值(元)',
          key: 'originalValue',
          value: 0,
          bgColor: '#FD7474',
          isAble: 'Y',
        },
        {
          title: '最新价值(元)',
          key: 'marketValue',
          value: 0,
          bgColor: '#808080',
          isAble: 'Y',
        },
      ],
    };
  },
  methods: {
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.queryForm.organId.split(',')[0] }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.numList.forEach((e) => {
              if (item.code == e.code) {
                e.bgColor = item.color;
                e.isAble = item.isAble;
                e.title = item.alias || item.statusName;
              }
            });
            // 同步修改表头的字段名称
            this.tableOptions.columns.forEach((m, i) => {
              let isTransferOperationArea = item.code == 1001 && m.dataIndex === 'operationCount';
              let isIdleArea = item.code == 1002 && m.dataIndex === 'idleCount';
              let isSelfUserArea = item.code == 1003 && m.dataIndex === 'selfCount';
              let isOccupationArea = item.code == 1004 && m.dataIndex === 'occupationArea';
              let isOthernArea = item.code == 1005 && m.dataIndex === 'otherCount';
              let flag = isTransferOperationArea || isIdleArea || isSelfUserArea || isOccupationArea || isOthernArea;
              if (flag) {
                m.title = item.alias || item.statusName;
                if (item.isAble === 'N') {
                  this.tableOptions.columns.splice(i, 1);
                }
              }
            });
          });
          this.numList = this.numList.filter((i) => {
            return i.isAble === 'Y';
          });
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
    handleQueryTableOptions() {
      return {
        ...this.queryForm,
        current: Number(this.isCurrentOrgan),
      };
    },
    // 导出
    handleExport() {
      const columnList = [],
        nameList = [];
      this.tableOptions.columns
        .filter((ele) => ele.dataIndex)
        .forEach((ele) => {
          columnList.push(ele.dataIndex || ele.key);
          nameList.push(ele.title);
        });
      const req = {
        ...this.handleQueryTableOptions(),
        columnList,
        nameList,
      };
      console.log({ req });
      this.exportFlag = true;
      this.$api.equipmentview
        .exportExcelProject(req)
        .then(async ({ data }) => {
          const { err } = await handleDownloadFile({
            data,
            fileName: '设备设施资产项目列表.xls',
          });
          if (err) {
            this.$message.error(err);
          } else {
            this.$message.success('导出成功');
          }
        })
        .finally(() => {
          this.exportFlag = false;
        });
    },
    // 打开详情页
    goDetail({ projectId }) {
      const queryParams = {
        projectId,
        organId: this.queryForm.organId.split(',')[0]
      };
      this.$router.push({
        path: '/equipmentprojectview/detail',
        query: queryParams,
      });
    },
    changePage({ pageNo, pageLength }) {
      this.paginationObj.pageNo = pageNo;
      this.paginationObj.pageLength = pageLength;
      this.queryTableDataAndTotal(true);
    },
    doSearch() {
      this.paginationObj.pageNum = 1;
      this.queryTableDataAndTotal();
    },
    // 获取资产项目并清空 双向绑定数据
    getObjectKeyValueByOrganIdFn({ organId }) {
      let req = {
        organIds: organId.toString(),
      };
      this.$api.assets.getObjectKeyValueByOrganId(req).then((res) => {
        if (Number(res.data.code) === 0) {
          this.queryForm.projectIdList = [];
          let data = res.data.data;
          this.projectData = (data || []).map((item) => {
            return {
              name: item.projectName,
              value: item.projectId,
              title: item.projectName,
              label: item.projectName,
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    queryTableDataAndTotal(notRequiredTotalFlag) {
      const options = this.handleQueryTableOptions();
      this.queryTableData(options);
      if (!notRequiredTotalFlag) {
        this.queryTotal(options);
      }
    },
    // 获取 tableData
    queryTableData(options) {
      const { pageLength, pageNo } = this.paginationObj;
      const req = { ...options, pageNum: pageNo, pageSize: pageLength, organIds: options.organId.toString() };
      delete req.organId;
      this.tableOptions.loading = true;
      this.$api.equipmentview.viewProject(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          console.log({ data });
          this.paginationObj.totalCount = data.count;
          this.tableOptions.dataSource = data.data || [];
        } else {
          this.$message.error(message);
        }
        this.tableOptions.loading = false;
      });
    },
    queryTotal(options) {
      const req = { ...options, organIds: options.organId.toString() };
      delete req.organId;
      this.totalLoadingFlag = true;
      this.$api.equipmentview.equipmentStatistics(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          this.numList.forEach((ele) => {
            ele.value = Number(data[ele.key] || 0);
          });
          this.totalLoadingFlag = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    changeTree(organId) {
      this.queryForm.organId = organId;
      this.getObjectKeyValueByOrganIdFn({ organId });
      this.queryTableDataAndTotal();
      this.useForConfig();
    },
  },
  created() {
    handleTableScrollHeight(this.tableOptions.scroll);
  },
};
</script>

<style scoped>
.search-item {
  width: 200px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
