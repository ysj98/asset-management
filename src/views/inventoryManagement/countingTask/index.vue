<!--
 * @Author: LW
 * @Date: 2019-12-20 10:17:52
 * @LastEditTime : 2019-12-30 11:29:36
 * @LastEditors  : Please set LastEditors
 * @Description: 盘点任务
 * @FilePath: \asset-management\src\views\inventoryManagement\countingTask\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-r">
        <div class="box">
          <SG-DatePicker label="开始时间" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="nav">
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="taskStatusFn"  v-model="queryCondition.taskStatus">
            <a-select-option v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.taskName" placeholder="任务名称" maxlength="50" @search="onSearch" />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
    <div>
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
      >
        <template slot="checkRate" slot-scope="text, record">
          <div style="padding-right: 10px;">
              <a-progress :percent="Number(record.checkRate) || 0" />
            </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          <span v-show="+record.taskStatus === 2" @click="goPage('set', record)" class="btn_click mr15">生成盘点单</span>
          <span v-show="+record.taskStatus === 2" @click="goPage('cancel', record)" class="btn_click mr15">取消任务</span>
          <span v-show="+record.taskStatus === 3" @click="goPage('edit', record)" class="btn_click">编辑</span>
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
</template>
 <script>
import Cephalosome from '@/components/Cephalosome'
import { utils } from "@/utils/utils"
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import noDataTips from "@/components/noDataTips"
import {getNMonthsAgoFirst, getNowMonthDate} from 'utils/formatTime'
// 页面跳转
const operationTypes = {
  detail: '/inventoryManagement/countingTask/detail',
  set: '/inventoryManagement/countingTask/newEditor',
  edit: '/inventoryManagement/countingTask/newEditor'
}
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  taskName: '',
  taskStatus: '',
  pageSize: 10,
  pageNum: 1
}
const taskStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '已取消',
    value: '0'
  },
  {
    name: '已完成',
    value: '1'
  },
  {
    name: '待启动',
    value: '2'
  },
  {
    name: '进行中',
    value: '3'
  }
]

let columns = [
  {
    title: "任务编号",
    dataIndex: "taskId",
    width: 150
  },
  {
    title: "任务名称",
    dataIndex: "taskName",
    width: 120
  },
  {
    title: "负责人",
    dataIndex: "chargePersonName",
    width: 100
  },
  {
    title: "盘点进度",
    dataIndex: "checkRate",
    scopedSlots: { customRender: "checkRate" },
    width: 200
  },
  {
    title: "计划执行时间",
    dataIndex: "beginDateEndDate",
    width: 100
  },
  {
    title: "实际完成时间",
    dataIndex: "completeDate",
    width: 100
  },
  {
    title: "任务状态",
    dataIndex: "taskStatusName",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 180
  }
];
export default {
  components: {
    Cephalosome,
    noDataTips
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      queryCondition: {...queryCondition},
      taskStatusData,
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/countingTask' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    // 状态发生变化
    taskStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.taskStatus = this.handleMultipleSelectValue(value, this.queryCondition.taskStatus, this.taskStatusData)
      })
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = ['']
      } else {
        let totalIndex = data.indexOf('')
        if (totalIndex > -1) {
          data.splice(totalIndex, 1)
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['']
          }
        }
      }
      return data
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    query() {
      let data = {
        ...this.queryCondition,
        beginDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',
        endDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : ''
      }
      this.table.loading = true;
      this.$api.inventoryManagementApi.queryCheckTaskPageList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || "";
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
    // 页面跳转
    goPage(type, record) {
      let query = {
        type,
        projectId: record.projectId
      };
      this.$router.push({ path: operationTypes[type], query });
    }
  }
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
