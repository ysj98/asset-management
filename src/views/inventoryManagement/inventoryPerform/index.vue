<!--
 * @Author: LW
 * @Date: 2019-12-20 10:19:43
 * @LastEditTime : 2020-01-06 15:32:24
 * @LastEditors  : Please set LastEditors
 * @Description: 盘点执行
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-r">
        <div class="box">
          <SG-DatePicker label="盘点日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="nav">
          <a-select style="width: 160px; margin-right: 10px;" placeholder="全部状态" :tokenSeparators="[',']" v-model="queryCondition.checkStatus">
            <a-select-option v-for="(item, index) in checkStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.checkName" placeholder="盘点单名称" maxlength="60" @search="onSearch" />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
    <div>
      <div class="table-layout-fixed table-border">
        <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="progress" slot-scope="text, record">
            <div style="padding-right: 10px;">
                <a-progress :percent="Number(record.progress) || 0" />
              </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
            <span v-power="ASSET_MANAGEMENT.ASSET_EXECUTE_NEW" v-show="+record.checkStatus === 2 || +record.checkStatus === 0" @click="goPage('set', record)" class="btn_click">登记盘点结果</span>
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
import Cephalosome from '@/components/Cephalosome'
import { utils } from "@/utils/utils"
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import noDataTips from "@/components/noDataTips"
import {getNMonthsAgoFirst, getNowMonthDate} from 'utils/formatTime'
// 页面跳转
const operationTypes = {
  detail: "/inventoryManagement/inventoryPerform/detail",
  set: "/inventoryManagement/inventoryPerform/register"
}
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  checkName: '',
  checkStatus: '',
  pageSize: 10,
  pageNum: 1
}
const checkStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '进行中',
    value: '2'
  },
  {
    name: '已完成',
    value: '1'
  }
]
let columns = [
  {
    title: "盘点单号",
    dataIndex: "checkId",
    width: 150
  },
  {
    title: "盘点单名称",
    dataIndex: "checkName",
    width: 120
  },
  {
    title: "盘点人",
    dataIndex: "userNames",
    width: 100
  },
  {
    title: "盘点进度",
    dataIndex: "progress",
    scopedSlots: { customRender: "progress" },
    width: 200
  },
  {
    title: "计划执行时间",
    dataIndex: "beginDateEndDate",
    width: 150
  },
  {
    title: "实际完成时间",
    dataIndex: "completeDate",
    width: 100
  },
    {
    title: "状态",
    dataIndex: "checkStatusName",
    width: 100
  },
  {
    title: "盘点资产总数",
    dataIndex: "checkCount",
    width: 100
  },
    {
    title: "盘盈",
    dataIndex: "successCount",
    width: 100
  },
  {
    title: "盘亏",
    dataIndex: "failCount",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 150
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
      checkStatusData,
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
      if (this.$route.path === '/inventoryManagement/inventoryPerform' && this.$route.query.refresh) {
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
      this.$api.inventoryManagementApi.assetCheckInstList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`
              return {
                key: getUuid(),
                ...item
              }
            })
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
      let querys = JSON.stringify([{
        type,
        checkId: record.checkId
      }])
      this.$router.push({ path: operationTypes[type], query: {quersData: querys} });
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
