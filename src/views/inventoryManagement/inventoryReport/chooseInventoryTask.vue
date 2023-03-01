<!--
  选择所属盘点任务弹窗
-->
<template>
  <SG-Modal width="1030px" v-model="show" title="选择盘点任务" class="choose-inventory-task-modal" @ok="handleSubmit" @cancel="handleCancel">
    <div>
      <Cephalosome :rightCol="23" :leftCol="1" class="cephalosome" rowHeight="48px">
        <div slot="col-r">
          <div style="display: inline-block; margin-right: 10px">
            <SG-DatePicker label="开始时间" style="width: 200px" pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
          </div>
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
      </Cephalosome>
      <div class="tab-nav">
        <div class="table-border table-layout-fixed">
          <a-table size="middle" :loading="table.loading" :pagination="false" :columns="table.columns" :dataSource="table.dataSource">
            <template slot="chosenId" slot-scope="text, record">
              <div style="padding-right: 10px">
                <a-radio :checked="record.taskId == chosenTaskId" @click="changeRadio(record)"></a-radio>
              </div>
            </template>
            <template slot="progress" slot-scope="text, record">
              <div style="padding-right: 10px">
                <a-progress :percent="Number(record.progress) || 0" />
              </div>
            </template>
          </a-table>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="table.totalCount"
            :noPageTools="true"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome';
import { utils } from '@/utils/utils';
import moment from 'moment';
import { getNMonthsAgoFirst, getNowMonthDate } from 'utils/formatTime';

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
    title: '选择',
    dataIndex: 'chosenId',
    scopedSlots: { customRender: 'chosenId' },
    width: 60,
  },
  {
    title: '任务编号',
    dataIndex: 'taskId',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    width: 160,
  },
  {
    title: '负责人',
    dataIndex: 'chargePersonName',
    width: 100,
  },
  {
    title: '计划执行时间',
    dataIndex: 'beginDateEndDate',
    width: 160,
  },
  {
    title: '进度',
    dataIndex: 'progress',
    scopedSlots: { customRender: 'progress' },
    width: 120,
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatusName',
    width: 100,
  },
];

export default {
  components: {
    Cephalosome,
  },
  props: {
    organId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      firstCall: true,
      show: false,
      queryCondition: { ...queryCondition },
      taskStatusData,
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
      chosenTaskId: '',
      chosenTaskName: '',
    };
  },
  methods: {
    changeRadio(record) {
      if (!(Number(record.progress) === 100 && Number(record.taskStatus) === 3)) {
        this.$message.info('只能选择进行中且进度为100%的任务！');
        return;
      }
      this.chosenTaskId = record.taskId;
      this.chosenTaskName = record.taskName;
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false;
    },
    // 提交
    handleSubmit() {
      if (!this.chosenTaskId) {
        this.$message.info('请选择所属盘点任务');
        return;
      }
      this.$emit('chosenTaskIdFn', this.chosenTaskId, this.chosenTaskName);
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
    // 外面给回来选中的数据
    redactCheckedDataFn(taskId, taskName) {
      console.log(taskId);
      console.log(taskName);
      this.chosenTaskId = taskId;
      this.chosenTaskName = taskName;
      if (this.firstCall) {
        this.query();
        this.firstCall = false;
      }
    },
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    query() {
      let data = {
        ...this.queryCondition,
        beginDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',
        endDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '',
      };
      if (data.taskStatus.length > 0) {
        data.taskStatus = data.taskStatus.join(',');
      } else {
        data.taskStatus = '';
      }
      this.table.loading = true;
      this.$api.inventoryManagementApi.queryCheckTaskPageList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              // item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || '';
          } else {
            this.$message.error(res.data.message);
          }
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
  },
};
</script>

<style lang="less">
.choose-inventory-task-modal {
  .tab-nav {
    margin-top: 10px;
  }
  .cephalosome {
    margin: 0;
  }
  .sg-footer {
    border-top: none;
  }
}
</style>
