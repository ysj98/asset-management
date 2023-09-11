<template>
  <div>
    <!-- 搜索条件 -->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          :loading="exportFlag"
          @click="handleExport"
          icon="import"
          type="primary"
          v-power="ASSET_MANAGEMENT.EQUIPMENTVIEW_ASSET_VIEW_EXPORT"
        >
          导出
        </SG-Button>
        <SG-Button
          @click="openSetTableHeaderPop"
          icon="setting"
          style="margin: 0 10px"
          v-power="ASSET_MANAGEMENT.EQUIPMENTVIEW_ASSET_VIEW_HEADERS_SETTING"
        >
          列表设置
        </SG-Button>
        <SG-Button
          @click="openSetAssetLabelPop"
          type="default"
          :disabled="!selectedRowKeys.length"
          :title="selectedRowKeys.length ? '资产标签' : '请选择资产'"
          v-power="ASSET_MANAGEMENT.EQUIPMENTVIEW_ASSET_VIEW_LABELS_SETTING"
        >
          设备设施资产标签
        </SG-Button>
      </div>
      <div slot="headerForm">
        <a-row :gutter="10">
          <a-col :offset="12" :span="6">
            <tree-select :allowClear="false" @changeTree="changeTree" class="search-item" :multiple="true" :treeCheckable="true" />
          </a-col>
          <a-col :span="6">
            <a-select
              v-model="queryForm.projectIdList"
              :options="projectData"
              :maxTagCount="1"
              :allowClear="true"
              mode="multiple"
              class="search-item"
              placeholder="全部资产项目"
            ></a-select>
          </a-col>
        </a-row>
      </div>
      <div slot="contentForm">
        <a-row :gutter="10">
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              v-model="queryForm.oldSourceModes"
              option-filter-prop="title"
              placeholder="请选择原始来源方式"
              :options="$addTitle(oldSourceOptions)"
              @change="changeOldSource"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="queryForm.statusList"
              :options="statusListOpt"
              :allowClear="true"
              :maxTagCount="1"
              mode="multiple"
              class="search-item"
              placeholder="全部资产状态"
            ></a-select
          ></a-col>
          <a-col :span="4">
            <a-input v-model="queryForm.assetName" class="search-item" placeholder="资产名称/编码"></a-input>
          </a-col>
          <a-col :span="4">
            <a-input v-model="queryForm.originSource" class="search-item" :maxLength="100" placeholder="资产原始来源方"></a-input>
          </a-col>
          <a-col :span="4">
            <EquipmentSelectTree
              v-model="queryForm.equipmentTypes"
              :multiple="true"
              :top-organ-id="queryForm.organIds"
              :maxTagCount="1"
              :allowClear="true"
              class="search-item"
              placeholder="全部资产分类"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="queryForm.labels"
              :options="assetLabelOpt"
              :maxTagCount="1"
              :allowClear="true"
              mode="multiple"
              class="search-item"
              placeholder="全部资产标签"
            ></a-select>
          </a-col>
        </a-row>
        <a-row :gutter="10" style="margin-top: 10px">
          <a-col :span="12">
            <province-city-district class="search-item-address" v-model="provinceCityDistrictValue" @input="handleAddress" />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="queryForm.useTypes"
              :options="amsUseDirectionCom"
              :maxTagCount="1"
              :allowClear="true"
              mode="multiple"
              class="search-item"
              placeholder="全部使用方向"
            ></a-select
          ></a-col>
        </a-row>
        <a-row :gutter="10" style="margin-top: 10px">
          <a-col :span="4"> </a-col>
          <a-col :span="4" :offset="16">
            <a-button @click="doSearch" type="primary">查询</a-button>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!-- 数据汇总 -->
    <div>
      <a-spin :spinning="totalLoadingFlag">
        <overview-number :numList="numList" />
      </a-spin>
    </div>
    <!-- table表格 -->
    <div>
      <!-- size="middle" -->
      <a-table v-bind="tableOptions" :columns="tableOptions.columns" :rowSelection="{ selectedRowKeys, onChange: handleSelectChange }">
        <!-- 操作-->
        <template #action="text, { assetEquipmentId, assetId, organId, equipmentId }">
          <a @click="goDetail({ assetEquipmentId, assetId, organId, equipmentId })">详情</a>
        </template>
      </a-table>
    </div>
    <!-- 间隔 -->
    <div style="height: 100px"></div>
    <!-- 分页 -->
    <SG-FooterPagination v-bind="paginationObj" @change="changePage" />
    <!-- 设置资产标签-->
    <SG-Modal
      v-model="modalList.setAssetLabel.show"
      :title="modalList.setAssetLabel.title"
      okText="保存"
      :maskClosable="false"
      @cancel="doClosePop('setAssetLabel')"
      @ok="setAssetLabelPopSave"
    >
      <div v-if="assetLabelOpt.length">
        <a-checkbox-group v-model="selectedLabel" :options="assetLabelOpt"></a-checkbox-group>
      </div>
      <div v-else>
        <a-empty />
      </div>
    </SG-Modal>
    <!-- 列表表头设置 -->
    <!-- <SG-Modal
      v-model="modalList.setTableHeader.show"
      :title="modalList.setTableHeader.title"
      okText="保存"
      @ok="setTableHeaderPopSave"
      @cancel="doClosePop('setTableHeader')"
    >
      <a-checkbox-group v-model="selectedColumns">
        <a-row :gutter="[5, 10]">
          <a-col :span="4" v-for="item in allColumns" :key="item.value">
            <a-checkbox :value="item.dataIndex || item.key">
              {{ item.title }}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </SG-Modal> -->
    <TableHeaderSettings
      v-if="modalList.setTableHeader.show"
      :funType="funType"
      @cancel="changeListSettingsModal(false)"
      @success="handleTableHeaderSuccess"
    />
  </div>
</template>

<script>
import { ASSET_MANAGEMENT } from '@/config/config.power';
import provinceCityDistrict from '@/views/common/ProvinceCityDistrict';
import SearchContainer from '@/views/common/SearchContainer';
import OverviewNumber from '@/views/common/OverviewNumber';
import TreeSelect from '@/views/common/treeSelect';
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
import { SET_AMS_USE_DIRECTION } from '@/store/types/platformDictTypes';
import { handleTableScrollHeight, initTableColumns } from '@/utils/share';
import { handleDownloadFile } from 'utils/utils';
import TableHeaderSettings from 'src/components/TableHeaderSettings';
import { queryOldSourceType } from '@/views/common/commonQueryApi';

const detailColumns = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 200,
    fixed: 'left',
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 200,
  },
  {
    title: '资产分类',
    dataIndex: 'equipmentTypeName',
    width: 120,
  },
  {
    title: '权属单位',
    dataIndex: 'organName',
    width: 200,
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    title: '规格型号',
    dataIndex: 'equipmentModel',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 300,
  },
  {
    title: '使用方向',
    dataIndex: 'useType',
    width: 120,
  },
  {
    title: '设备厂家',
    dataIndex: 'factory',
    width: 120,
  },
  {
    title: '出厂日期',
    dataIndex: 'dateOfProduction',
    width: 200,
  },
  {
    title: '报废日期',
    dataIndex: 'scrapDate',
    width: 200,
  },
  {
    title: '接管日期',
    dataIndex: 'startDate',
    width: 200,
  },
  {
    title: '财务卡片编码',
    dataIndex: 'financialCode',
    width: 200,
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValue',
    width: 120,
  },
  {
    title: '最新估值(元)',
    dataIndex: 'assetValuation',
    width: 120,
  },
  {
    title: '资产状态',
    dataIndex: 'statusName',
    width: 120,
  },
  {
    title: '资产标签',
    dataIndex: 'label',
    width: 120,
  },
  {
    title: '资产原始来源方',
    dataIndex: 'originSource',
    width: 120,
  },
  {
    title: '原始来源方式',
    dataIndex: 'oldSourceModeName',
    width: 120,
  },
];
const requiredColumn = [
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
  },
];
const allColumns = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 200,
    fixed: 'left',
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 200,
  },
  {
    title: '资产分类',
    dataIndex: 'equipmentTypeName',
    width: 120,
  },
  {
    title: '权属单位',
    dataIndex: 'organName',
    width: 200,
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    title: '规格型号',
    dataIndex: 'equipmentModel',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 300,
  },
  {
    title: '使用方向',
    dataIndex: 'useType',
    width: 120,
  },
  {
    title: '设备厂家',
    dataIndex: 'factory',
    width: 120,
  },
  {
    title: '出厂日期',
    dataIndex: 'dateOfProduction',
    width: 200,
  },
  {
    title: '报废日期',
    dataIndex: 'scrapDate',
    width: 200,
  },
  {
    title: '接管日期',
    dataIndex: 'startDate',
    width: 200,
  },
  {
    title: '财务卡片编码',
    dataIndex: 'financialCode',
    width: 200,
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValue',
    width: 120,
  },
  {
    title: '最新估值(元)',
    dataIndex: 'assetValuation',
    width: 120,
  },
  {
    title: '资产状态',
    dataIndex: 'statusName',
    width: 120,
  },
  {
    title: '资产标签',
    dataIndex: 'label',
    width: 120,
  },
  {
    title: '资产原始来源方',
    dataIndex: 'originSource',
    width: 120,
  },
  {
    title: '原始来源方式',
    dataIndex: 'oldSourceModeName',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  name: 'equipmentviewAssetView',
  components: {
    SearchContainer,
    provinceCityDistrict,
    OverviewNumber,
    TreeSelect,
    EquipmentSelectTree,
    TableHeaderSettings,
  },
  data() {
    return {
      oldSourceOptions: [],
      funType: 15,
      ASSET_MANAGEMENT,
      exportFlag: false,
      allColumns,
      selectedColumns: [],
      modalList: {
        setAssetLabel: {
          show: false,
          title: '资产标签设置',
        },
        setTableHeader: {
          show: false,
          title: '列表表头设置',
        },
      },
      selectedLabel: [],
      assetLabelOpt: [],
      totalLoadingFlag: false,
      statusListOpt: [
        { title: '未生效', key: '0' },
        { title: '正常', key: '1' },
        { title: '报废', key: '2' },
        { title: '转让', key: '3' },
        { title: '报损', key: '4' },
        { title: '已清理', key: '5' },
        { title: '已取消', key: '6' },
        { title: '入库中', key: '7' },
      ],
      projectData: [],
      paginationObj: {
        pageLength: 10,
        pageNo: 1,
        totalCount: 0,
        location: 'fixed',
      },
      provinceCityDistrictValue: {},
      fold: true,
      queryForm: {
        organIds: '',
        assetName: '',
        province: '',
        city: '',
        region: '',
        labels: [],
        projectIdList: [],
        useTypes: [],
        statusList: [],
        equipmentTypes: [],
        originSource: '',
        oldSourceModes: ['all'],
      },
      numList: [
        { title: '资产数量', key: 'total', value: 0, fontColor: '#324057', code: '1000', isAble: 'Y' },
        {
          title: '运营',
          key: 'operate',
          value: 0,
          bgColor: '#4BD288',
          code: '1001',
          isAble: 'Y',
        },
        {
          title: '闲置',
          key: 'idle',
          value: 0,
          bgColor: '#1890FF',
          code: '1002',
          isAble: 'Y',
        },
        {
          title: '自用',
          key: 'self',
          value: 0,
          bgColor: '#DD81E6',
          code: '1003',
          isAble: 'Y',
        },
        {
          title: '其他',
          key: 'other',
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
      selectedRowKeys: [],
      tableOptions: {
        loading: false,
        columns: allColumns,
        dataSource: [],
        pagination: false,
        rowKey: 'assetEquipmentId',
        // y: "max-content"
        scroll: { x: 3000, y: 600 },
      },
    };
  },
  watch: {
    'tableOptions.columns'(val) {
      this.tableOptions.scroll.x = val.length * 150;
      console.log(val);
    },
  },
  computed: {
    amsUseDirectionCom() {
      return this.$store.state.platformDict.AMS_USE_DIRECTION.map((ele) => {
        return {
          title: ele.name,
          value: ele.value,
          label: ele.name,
        };
      });
    },
  },
  methods: {
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
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
              let isTransferOperationArea = item.code == 1001 && m.dataIndex === 'transferOperationArea';
              let isIdleArea = item.code == 1002 && m.dataIndex === 'idleArea';
              let isSelfUserArea = item.code == 1003 && m.dataIndex === 'selfUserArea';
              let isOccupationArea = item.code == 1004 && m.dataIndex === 'occupationArea';
              let isOthernArea = item.code == 1005 && m.dataIndex === 'otherArea';
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
    // 原始来源方式
    changeOldSource(value) {
      let lastIndex = value.length - 1;
      this.oldSourceModes = value[lastIndex] === 'all' ? ['all'] : value.filter((m) => m !== 'all');
    },
    // 根据原始查询来源方式
    async getOldSourceOptions() {
      this.oldSourceOptions = [];
      this.oldSourceModes = ['all'];
      queryOldSourceType(this).then((list) => {
        return (this.oldSourceOptions = [{ key: 'all', title: '全部原始来源方式' }].concat(list));
      });
    },
    handleTableHeaderSuccess() {
      this.changeListSettingsModal(false);
      initTableColumns({ columns: this.tableOptions.columns, detailColumns, requiredColumn, funType: this.funType });
    },
    changeListSettingsModal(val) {
      this.modalList.setTableHeader.show = val;
    },
    // 导出
    handleExport() {
      const otherReq = this.handleQueryTableOptions();
      const req = {
        ...otherReq,
        display: this.tableOptions.columns.filter((ele) => ele.dataIndex).map((ele) => ele.dataIndex),
      };
      this.exportFlag = true;
      this.$api.equipmentview
        .exportExcel(req)
        .then(async ({ data }) => {
          console.log('data', data);
          const { err } = await handleDownloadFile({
            data,
            fileName: '设备设施资产视图列表.xls',
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
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    // 列表设置弹窗 保存
    setTableHeaderPopSave() {
      console.log('this.selectedColumns', this.selectedColumns);
      this.tableOptions.columns = this.allColumns.filter((ele) => {
        const keyStr = ele.dataIndex || ele.key;
        return this.selectedColumns.includes(keyStr);
      });
      this.$message.success('操作成功');
      this.doClosePop('setTableHeader');
    },
    // 资产标签弹窗 保存
    setAssetLabelPopSave() {
      const req = {
        labelCode: this.selectedLabel.join(','),
        assetEquipmentIds: this.selectedRowKeys.join(','),
      };
      console.log({ req });
      this.$api.equipmentview.updateLabel(req).then(({ data: { code, message } }) => {
        if (code === '0') {
          this.$message.success('操作成功');
          this.modalList.setAssetLabel.show = false;
          this.queryTableDataAndTotal(true);
        } else {
          this.$message.error(message);
        }
      });
    },
    // 打开 列表设置弹窗
    openSetTableHeaderPop() {
      this.selectedColumns = this.tableOptions.columns.map((ele) => {
        return ele.dataIndex || ele.key;
      });
      this.modalList.setTableHeader.show = true;
    },
    // 打开 资产标签弹窗
    openSetAssetLabelPop() {
      this.selectedLabel = [];
      this.modalList.setAssetLabel.show = true;
    },
    // 获取 资产标签
    getAssetLabel({ organId }) {
      let data = {
        code: 'ASSET_EQUIPMENT_LABEL',
        organId: organId.split(',')[0],
      };
      this.$api.assets
        .organDict(data)
        .then((res) => {
          let { data, code } = res.data;
          if (!data) this.assetLabelOpt = [];
          if (code === '0') {
            this.assetLabelOpt = data.map((item) => {
              return { label: item.name, value: item.value };
            });
            // this.assetLabelSelect = this.assetLabelOpt.length > 0 ? [{ label: '全部资产标签', value: '' }, ...this.assetLabelOpt] : [];
          }
        })
        .catch((err) => {
          this.$message.error(err || '当前组织机构下无资产标签');
        });
    },
    // 打开详情页
    goDetail({ assetEquipmentId, assetId, organId, equipmentId }) {
      const queryParams = {
        assetEquipmentId,
        assetId,
        organId,
        equipmentId,
      };
      console.log({ queryParams });
      this.$router.push({
        path: '/equipmentview/detail',
        query: queryParams,
      });
    },
    // 地址级联 处理搜索入参
    handleAddress({ province, city, district }) {
      this.queryForm.province = province || '';
      this.queryForm.city = city || '';
      this.queryForm.region = district || '';
    },
    doSearch() {
      this.paginationObj.pageNo = 1;
      this.queryTableDataAndTotal();
    },
    // 获取资产项目并清空 双向绑定数据
    getObjectKeyValueByOrganIdFn({ organId }) {
      let req = {
        organIds: organId,
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
    changeTree(organId) {
      this.queryForm.organIds = organId;
      this.getObjectKeyValueByOrganIdFn({ organId });
      this.queryTableDataAndTotal();
      this.getAssetLabel({ organId });
      this.useForConfig();
    },
    // 获取 tableData
    queryTableData(options) {
      this.tableOptions.loading = true;
      this.$api.equipmentview.getPage(options).then(
        ({
          data: {
            code,
            message,
            data: { data, count },
          },
        }) => {
          if (code === '0') {
            console.log({ data });
            this.paginationObj.totalCount = count;
            this.tableOptions.dataSource = data || [];
            this.tableOptions.loading = false;
            this.selectedRowKeys = [];
          } else {
            this.$message.error(message);
          }
        }
      );
    },
    queryTotal(options) {
      this.totalLoadingFlag = true;
      this.$api.equipmentview.getTotal(options).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          console.log({ data });
          this.numList.forEach((ele) => {
            ele.value = Number(data[ele.key] || 0).toLocaleString();
          });
          this.totalLoadingFlag = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    handleQueryTableOptions() {
      const { pageNo, pageLength } = this.paginationObj;
      var obj = {
        ...this.queryForm,
        pageNum: pageNo,
        pageSize: pageLength,
      };
      obj.oldSourceModes = obj.oldSourceModes.includes('all') ? [] : obj.oldSourceModes;
      return obj;
    },
    queryTableDataAndTotal(notRequiredTotalFlag) {
      const options = this.handleQueryTableOptions();
      this.queryTableData(options);
      if (!notRequiredTotalFlag) {
        this.queryTotal(options);
      }
    },
    // 分页时间
    changePage({ pageNo, pageLength }) {
      this.paginationObj.pageNo = pageNo;
      this.paginationObj.pageLength = pageLength;
      this.queryTableDataAndTotal(true);
    },
    // 处理选中表格数据
    handleSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  created() {
    handleTableScrollHeight(this.tableOptions.scroll);
    initTableColumns({ columns: this.tableOptions.columns, detailColumns, requiredColumn, funType: this.funType });
  },
  mounted() {
    this.getOldSourceOptions();

    this.$store.dispatch('platformDict/getPlatformDict', {
      code: 'AMS_USE_DIRECTION',
      type: SET_AMS_USE_DIRECTION,
    });
  },
};
</script>

<style scoped>
.contentForm {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.search-item {
  width: 100%;
  min-width: 150px;
  /* margin-right: 10px;
  margin-bottom: 10px; */
}
.search-item-address {
  width: 660px;
  /* margin-right: 10px;
  margin-bottom: 10px; */
}
</style>
<style lang="less" scoped>
/deep/.ant-table-fixed {
  td {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  tr:hover {
    td {
      white-space: normal;
      overflow: auto;
      text-overflow: clip;
    }
  }
}
</style>
