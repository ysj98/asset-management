<!--
 * @Description:
 * @Date: 2020-02-26 12:45:49
 * @LastEditTime: 2022-12-15 11:43:39
 -->
<!--
呈报记录页面
-->
<template>
  <div>
    <div class="pb70">
      <SearchContainer v-model="toggle" :contentStyle="{ paddingTop: toggle ? '16px' : 0 }">
        <div slot="headerBtns">
          <!-- <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button> -->
        </div>
        <div slot="headerForm" style="text-align: left; float: right">
          <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle"></treeSelect>
          <!-- 资产项目 -->
          <a-select
            showSearch
            placeholder="请选择资产项目"
            v-model="queryCondition.projectId"
            optionFilterProp="children"
            :style="allStyle"
            :options="$addTitle(projectIdOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 全部呈报表单 -->
          <a-select
            showSearch
            placeholder="请选择呈报表单"
            v-model="queryCondition.billType"
            optionFilterProp="children"
            @change="billTypeSelect"
            mode="multiple"
            :maxTagCount="1"
            :style="allStyle"
            :options="$addTitle(billTypeOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 资产名称或编码 -->
          <a-input :maxLength="30" placeholder="资产(卡片)名称/编码" v-model="queryCondition.objName" :style="allStyle" />
        </div>
        <div slot="contentForm" class="search-content-box">
          <div class="search-from-box">
            <!-- 全部资产类型 -->
            <a-select
              showSearch
              placeholder="请选择资产类型"
              v-model="queryCondition.assetType"
              optionFilterProp="children"
              @change="assetTypeSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(assetTypeOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部呈报方式-->
            <a-select
              showSearch
              placeholder="请选择呈报方式"
              v-model="queryCondition.taskType"
              @change="taskTypeSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(taskTypeOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <div class="box">
              <SG-DatePicker
                :allowClear="false"
                label="填报日期"
                style="width: 200px; text-align: left"
                pickerType="RangePicker"
                :defaultValue="defaultValue"
                v-model="defaultValue"
                format="YYYY-MM-DD"
              ></SG-DatePicker>
            </div>
            <!-- 全部数据状态 -->
            <a-select
              showSearch
              placeholder="请选择附属配套状态"
              v-model="queryCondition.taskStatus"
              optionFilterProp="children"
              :style="allWidth"
              :options="$addTitle(taskStatusOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
          </div>
          <div class="two-row-box">
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <!-- <SG-Button @click="restQuery">清除</SG-Button> -->
          </div>
        </div>
      </SearchContainer>
      <div>
        <a-table
          class="custom-table td-pd10 overflowX"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{ emptyText: '暂无数据' }"
        >
          <template slot="reportRecordId" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{ text }}</span>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="absolute"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import noDataTips from '@/components/noDataTips';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import segiIcon from '@/components/segiIcon.vue';
import { utils } from '@/utils/utils';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { getNowMonthDate, getNMonthsAgoFirst } from 'utils/formatTime';
import SegiRangePicker from '@/components/SegiRangePicker';
import moment from 'moment';
let getUuid = (
  (uuid = 1) =>
  () =>
    ++uuid
)();
// 页面跳转
const operationTypes = {
  detail: '/reportingRecord/details',
};
const allStyle = {
  width: '170px',
  'margin-right': '10px',
  // "margin-top": "14px"
};
const allWidth = {
  width: '170px',
  'margin-right': '10px',
  'margin-top': '14px',
  height: '32px',
  overflow: 'hidden',
};
const queryCondition = {
  organId: '',
  projectId: '',
  billType: [''], // 呈报表单类型
  objName: '', // 资产名称或编码
  taskType: [''], // 呈报方式
  taskStatus: '', // 状态
  assetType: [''], // 资产类型(多选)
  pageNum: 1,
  pageSize: 10,
};
const projectIdOpt = [{ label: '全部资产项目', value: '' }];
const taskTypeOpt = [
  { label: '全部呈报方式', value: '' },
  { label: '临时任务', value: '1' },
  { label: '固定任务', value: '2' },
  { label: '数据接口', value: '3' },
];
const billTypeOpt = [
  { label: '全部呈报表单', value: '' },
  { label: '资产运营信息', value: '1' },
  { label: '资产收入信息', value: '2' },
  { label: '资产费用信息', value: '3' },
  { label: '资产折旧信息', value: '4' },
];
const assetTypeOpt = [{ label: '全部资产类型', value: '' }];
const taskStatusOpt = [
  { label: '全部数据状态', value: '' },
  { label: '待审批', value: '2' },
  { label: '已审批', value: '4' },
];
let columns = [
  {
    title: '呈报编号',
    dataIndex: 'reportRecordId',
    scopedSlots: { customRender: 'reportRecordId' },
    width: 100,
  },
  {
    title: '资产/卡片名称',
    dataIndex: 'objName',
    width: 120,
  },
  {
    title: '资产/卡片编码',
    dataIndex: 'objCode',
    width: 120,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '所属机构',
    dataIndex: 'organName',

    width: 100,
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    width: 100,
  },
  {
    title: '呈报表单',
    dataIndex: 'reportBillName',
    width: 100,
  },
  {
    title: '呈报方式',
    dataIndex: 'taskTypeName',
    width: 120,
  },
  {
    title: '填报日期',
    dataIndex: 'realBeginDate',
    width: 120,
  },
  {
    title: '填报人',
    dataIndex: 'reportByName',
    width: 120,
  },
  {
    title: '审核人',
    dataIndex: 'auditByName',
    width: 100,
  },
  {
    title: '数据状态',
    dataIndex: 'taskStatusName',
    width: 150,
  },
];
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon,
    SegiRangePicker,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      moment,
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
      toggle: true,
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      projectIdOpt,
      taskTypeOpt,
      billTypeOpt,
      assetTypeOpt,
      taskStatusOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
    };
  },
  created() {
    this.platformDictFn('asset_type');
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        flag: '0',
      };
      // 呈报表单参数改变
      data.billType = utils.deepClone(data.billType).join(',');
      data.assetType = utils.deepClone(data.assetType).join(',');
      data.taskType = utils.deepClone(data.taskType).join(',');
      if (this.defaultValue && this.defaultValue[0]) {
        data.beginDate = moment(this.defaultValue[0]).format('YYYY-MM-DD');
        data.endDate = moment(this.defaultValue[1]).format('YYYY-MM-DD');
      }
      delete data.startCreateDate;
      delete data.endCreateDate;
      this.table.loading = true;
      this.$api.reportManage.queryReportRecordPageList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map((item) => {
            return {
              label: item.projectName,
              value: item.projectId,
            };
          });
          this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...result];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 起止日期发生变化
    onDateChange(val) {
      this.queryCondition.startCreateDate = val[0];
      this.queryCondition.endCreateDate = val[1];
    },
    billTypeSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.billType = this.handleMultipleSelectValue(value, this.queryCondition.billType, this.billTypeOpt);
      });
    },
    assetTypeSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeOpt);
      });
    },
    taskTypeSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.taskType = this.handleMultipleSelectValue(value, this.queryCondition.taskType, this.taskTypeOpt);
      });
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = '';
      this.getObjectKeyValueByOrganIdFn();
      this.searchQuery();
    },
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf('') !== -1;
      let len = data.length;
      // 如果点击全选或者取消全选
      if (data[len - 1] === '' || len === 0) {
        return (data = ['']);
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === dataOptions.length - 1) {
        return (data = ['']);
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(''), 1);
      }
      return data;
    },
    // 导出
    openExport() {},
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 重置查询条件
    restQuery() {
      this.queryCondition.projectId = '';
      this.queryCondition.billType = [''];
      this.queryCondition.objName = '';
      this.queryCondition.taskType = [''];
      this.queryCondition.taskStatus = '';
      this.queryCondition.assetType = [''];
      this.defaultValue = [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())];
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          let arr = result.map((item) => ({ label: item.name, ...item }));
          // 资产类型
          if (code === 'asset_type') {
            this.assetTypeOpt = [...utils.deepClone(assetTypeOpt), ...arr];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    goPage(type, record) {
      let query = {
        type,
      };
      if (['detail', 'edit'].includes(type)) {
        query.reportRecordId = record.reportRecordId;
        query.reportTaskId = record.reportTaskId;
        query.billType = record.reportBillId || '';
      }
      this.$router.push({ path: operationTypes[type], query });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  margin-top: 14px;
}
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
.overflowX {
  overflow-x: auto !important;
}
</style>
