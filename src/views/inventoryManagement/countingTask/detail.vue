<!--
 * @Author: LW
 * @Date: 2019-12-27 11:28:17
 * @LastEditTime : 2020-01-14 10:46:53
 * @LastEditors  : Please set LastEditors
 * @Description: 盘点任务详情
 * @FilePath: \asset-management\src\views\inventoryManagement\countingTask\detail.vue
 -->
<template>
  <div class="countingTaskDetail">
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">基本信息</span>
      <div class="countingTaskDetail-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">任务单号：{{particularsData.taskId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">任务名称：{{particularsData.taskName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属计划：{{particularsData.planName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">负责人：{{particularsData.userName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">计划执行时间：{{particularsData.endDate ? `${particularsData.beginDate} - ${particularsData.endDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.taskStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">实际执行时间：{{particularsData.realBeginDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产盘点范围：{{particularsData.checkRange || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        </a-row>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">资产列表 (资产总数：{{inventoryAssetCount || 0}})</span>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          <template slot="progress" slot-scope="text, record">
            <div style="padding-right: 10px;">
              <a-progress :percent="Number(record.progress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span class="btn_click mr15" @click="inventoryDetailsFn(record)">详情</span>
          </template>
          </a-table>
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">盘点报告</span>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="InventoryReportColumns"
            :dataSource="inventoryReportData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="reportName" slot-scope="text, record">
              <span class="btn_click mr15" @click="InventoryReport(record)">{{record.reportName}}</span>
            </template>
            <template slot="operation" slot-scope="text, record">
              <span class="btn_click mr15" @click="InventoryReport(record)">详情</span>
            </template>
          </a-table>
          <no-data-tips v-show="inventoryReportData.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noDataTips from "@/components/noDataTips"
import {utils} from '@/utils/utils.js'
const columns = [
  {
    title: "盘点单号",
    dataIndex: "checkId"
  }, {
    title: "盘点单名称",
    dataIndex: "checkName"
  }, {
    title: "盘点人",
    dataIndex: "userNames"
  }, {
    title: "计划执行时间",
    dataIndex: "beginDateEndDate"
  }, {
    title: "实际完成时间",
    dataIndex: "completeDate"
  }, {
    title: "资产总数",
    dataIndex: "checkCount"
  }, {
    title: "盘点进展",
    dataIndex: "progress",
    scopedSlots: { customRender: "progress" },
    width: 200
  }, {
    title: "状态",
    dataIndex: "checkStatusName"
  }, {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
]
const InventoryReportColumns = [
  {
    title: "报告编号",
    dataIndex: "reportId",
    width: '15%'
  }, {
    title: "报告名称",
    dataIndex: "reportName",
    width: '30%',
    scopedSlots: { customRender: "reportName" }
  }, {
    title: "提交人",
    dataIndex: "createByName",
    width: '15%'
  }, {
    title: "提交时间",
    dataIndex: "createTime",
    width: '15%'
  }, {
    title: "状态",
    dataIndex: "approvalStatusName",
    width: '15%'
  }, {
    title: "操作",
    dataIndex: "operation",
    width: '15%',
    scopedSlots: { customRender: "operation" }
  }
]
export default {
  components: {noDataTips},
  props: {},
  data () {
    return {
      page: '',      // 用来判断盘点计划调转过来的
      inventoryAssetCount: 0,
      taskId: '',
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      columns: [...columns],
      InventoryReportColumns: [...InventoryReportColumns],
      loading: false,
      tableData: [],              // 资产列表表格数据
      inventoryReportData: [],    // 盘点报告表格数据
      location: '',
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: ''
      }
    }
  },
  computed: {
  },
  methods: {
    // 盘点报告详情
    InventoryReport (record) {
      if (this.page === 'plan') {
        this.$router.push({path: '/inventoryPlan/detail/taskDetail/reportDetail', query: {pageType: 'detail', reportId: record.reportId}})
      } else {
        this.$router.push({path: '/inventoryManagement/countingTask/detail/report', query: {pageType: 'detail', reportId: record.reportId}})
      }
    },
    // 详情
    inventoryDetailsFn (record) {
      let querys = JSON.stringify([{
        type: 'detail',
        checkId: record.checkId
      }])
      if (this.page === 'plan') {
        this.$router.push({ path: '/inventoryPlan/detail/taskDetail/implementDetail', query: {quersData: querys} })
      } else {
        this.$router.push({ path: '/inventoryManagement/countingTask/detail/inventoryDetails', query: {quersData: querys} })
      }
    },
    // 查询详情
    query () {
      let obj = {
        taskId: this.taskId
      }
      this.$api.inventoryManagementApi.queryCheckTaskDetail(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          // 获取名称
          if (data.chargePersonList.length > 0) {
            data.chargePersonList.forEach(item => {
              arr.push(item.userName)
            }) 
          }
          data.userName = arr.length > 0 ? arr.join(',') : ''
          this.particularsData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产列表
    queryListByTaskIdFn () {
      this.loading = true
      let obj = {
        taskId: this.taskId
      }
      this.$api.inventoryManagementApi.queryListByTaskId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index
            item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`
            this.inventoryAssetCount = this.inventoryAssetCount + Number(item.checkCount)               // 资产总数
          })
          this.tableData = data
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 盘点报告
    queryByTaskIdFn () {
      this.loading = true
      let obj = {
        taskId: this.taskId
      }
      this.$api.inventoryManagementApi.queryByTaskId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.inventoryReportData = data
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    }
  },
  watch: {
    '$route' () {
      let route = this.$route.query.quersData ? JSON.parse(this.$route.query.quersData) : []
      let detail = route.length === 0 ? false : route[0].detail
      if (this.$route.path === '/inventoryManagement/countingTask/detail' && detail) {
        this.taskId = route.length === 0 ? '' : route[0].taskId
        this.page = route.length === 0 ? '' : route[0].page
        this.query()
        this.queryListByTaskIdFn()
        this.queryByTaskIdFn()
      }
    }
  },
  created () {
  },
  mounted () {
    this.particularsData = JSON.parse(this.$route.query.quersData)
    this.taskId = this.particularsData[0].taskId
    this.page = this.particularsData.length === 0 ? '' : this.particularsData[0].page
    this.query()
    this.queryListByTaskIdFn()
    this.queryByTaskIdFn()
  }
}
</script>
<style lang="less" scoped>
.countingTaskDetail {
  .countingTaskDetail-nav{
      padding: 42px 126px 20px 70px;
      .countingTaskDetail-obj {
        padding: 20px 0 20px 40px;
        .playground-row {
          .playground-col {
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
      .correspondingTask {
        margin:35px 40px 0 40px;
        border: 1px solid #F0F2F5;
      }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
</style>
