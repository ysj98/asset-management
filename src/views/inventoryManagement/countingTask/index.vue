<!--
 * @Author: LW
 * @Date: 2019-12-20 10:17:52
 * @LastEditTime: 2020-09-09 18:10:27
 * @LastEditors: Please set LastEditors
 * @Description: 盘点任务
 * @FilePath: \asset-management\src\views\inventoryManagement\countingTask\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-r">
        <div class="box">
          <SG-DatePicker label="开始时间" style="width: 200px" pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="nav">
          <a-select
            :maxTagCount="1"
            style="width: 160px; margin-right: 10px"
            mode="multiple"
            placeholder="全部状态"
            :tokenSeparators="[',']"
            @select="taskStatusFn"
            v-model="queryCondition.taskStatus"
          >
            <a-select-option :title="item.name" v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-input-search
            style="width: 170px; margin-right: 10px"
            v-model="queryCondition.taskName"
            placeholder="任务名称"
            :maxLength="50"
            @search="onSearch"
          />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
    <a-spin :spinning="table.loading">
      <overview-number :numList="numList" />
    </a-spin>
    <div>
      <div class="table-layout-fixed table-border">
        <a-table
          size="middle"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{ emptyText: '暂无数据' }"
        >
          <template slot="progress" slot-scope="text, record">
            <div style="padding-right: 10px">
              <a-progress :percent="Number(record.progress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
            <span v-power="ASSET_MANAGEMENT.ASSET_TASK_NEW" v-show="+record.taskStatus === 2" @click="goPage('set', record)" class="btn_click mr15"
              >生成盘点单</span
            >
            <span
              v-power="ASSET_MANAGEMENT.ASSET_TASK_DELETE"
              v-show="+record.taskStatus === 2"
              @click="goPage('cancel', record)"
              class="btn_click mr15"
              >取消任务</span
            >
            <span v-power="ASSET_MANAGEMENT.ASSET_TASK_EDIT" v-show="+record.taskStatus === 3" @click="goPage('edit', record)" class="btn_click"
              >编辑</span
            >
          </template>
        </a-table>
      </div>
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
</template>
<script>
import Cephalosome from '@/components/Cephalosome';
import { utils } from '@/utils/utils';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import noDataTips from '@/components/noDataTips';
import { getNMonthsAgoFirst, getNowMonthDate } from 'utils/formatTime';
import OverviewNumber from 'src/views/common/OverviewNumber';
// 页面跳转
const operationTypes = {
  detail: '/inventoryManagement/countingTask/detail',
  set: '/inventoryManagement/countingTask/newEditor',
  edit: '/inventoryManagement/countingTask/newEditor',
};
let getUuid = (
  (uuid = 1) =>
  () =>
    ++uuid
)();
const queryCondition = {
  taskName: '',
  taskStatus: '',
  pageSize: 10,
  pageNum: 1,
};
const taskStatusData = [
  {
    name: '全部状态',
    value: '',
  },
  {
    name: '已取消',
    value: '0',
  },
  {
    name: '已完成',
    value: '1',
  },
  {
    name: '待启动',
    value: '2',
  },
  {
    name: '进行中',
    value: '3',
  },
];

let columns = [
  {
    title: '任务编号',
    dataIndex: 'taskId',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    width: 150,
  },
  {
    title: '负责人',
    dataIndex: 'chargePersonName',
    width: 100,
  },
  {
    title: '盘点进度',
    dataIndex: 'progress',
    scopedSlots: { customRender: 'progress' },
    width: 200,
  },
  {
    title: '计划执行时间',
    dataIndex: 'beginDateEndDate',
    width: 150,
  },
  {
    title: '实际完成时间',
    dataIndex: 'completeDate',
    width: 100,
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatusName',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 160,
  },
];
export default {
  components: {
    Cephalosome,
    noDataTips,
    OverviewNumber,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      numList: [
        { title: '全部状态', key: 'total', value: 0, fontColor: '#324057' },
        { title: '待启动', key: 'activated', value: 0, bgColor: '#4BD288' },
        { title: '进行中', key: 'ongoing', value: 0, bgColor: '#1890FF' },
        { title: '已完成', key: 'complete', value: 0, bgColor: '#DD81E6' },
        { title: '已取消', key: 'cancel', value: 0, bgColor: '#BBC8D6' },
      ],
      queryCondition: { ...queryCondition },
      taskStatusData,
      defaultValue: [],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
    };
  },
  watch: {
    $route() {
      if (this.$route.path === '/inventoryManagement/countingTask' && this.$route.query.refresh) {
        this.queryCondition.pageNum = 1;
        this.queryCondition.pageSize = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    // 统计查询
    queryCheckTaskStat() {
      let data = {
        taskName: this.queryCondition.taskName,
        taskStatus: this.queryCondition.taskStatus.length > 0 ? this.queryCondition.taskStatus.join(',') : '',
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        beginDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',
        endDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '',
      };
      this.$api.inventoryManagementApi.queryCheckTaskStat(data).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          this.numList = this.numList.map((m) => {
            return { ...m, value: result[m.key] };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 状态发生变化
    taskStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.taskStatus = this.handleMultipleSelectValue(value, this.queryCondition.taskStatus, this.taskStatusData);
      });
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = [''];
      } else {
        let totalIndex = data.indexOf('');
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [''];
          }
        }
      }
      return data;
    },
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    query() {
      let data = {
        taskName: this.queryCondition.taskName,
        taskStatus: this.queryCondition.taskStatus.length > 0 ? this.queryCondition.taskStatus.join(',') : '',
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        beginDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',
        endDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '',
      };
      this.table.loading = true;
      this.$api.inventoryManagementApi.queryCheckTaskPageList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`;
              let arr = [];
              item.chargePersonList.forEach((item) => {
                arr.push(item.userName);
              });
              item.chargePersonName = arr.length === 0 ? '' : arr.join(',');
              item.completeDate = item.completeDate ? item.completeDate : '--';
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || '';
          } else {
            this.$message.error(res.data.message);
          }
          this.queryCheckTaskStat();
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    updateCheckTaskStatusFn(record) {
      let _this = this;
      this.$confirm({
        title: '提示',
        content: '确认要取消任务吗？',
        onOk() {
          let obj = {
            taskId: record.taskId,
            taskStatus: '0',
          };
          let loadingName = _this.SG_Loding('取消中...');
          _this.$api.inventoryManagementApi.updateCheckTaskStatus(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              _this.DE_Loding(loadingName).then(() => {
                _this.$SG_Message.success('取消成功');
                _this.query();
              });
            } else {
              _this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    // 页面跳转
    goPage(type, record) {
      let _this = this;
      if (type === 'cancel') {
        this.updateCheckTaskStatusFn(record);
      } else {
        let querys = JSON.stringify([
          {
            type,
            projectId: record.projectId,
            taskId: record.taskId,
            detail: true,
          },
        ]);
        this.$router.push({ path: operationTypes[type], query: { quersData: querys } });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.countingTask {
  .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
