<!--
 * @Author: LW
 * @Date: 2019-12-27 11:28:17
 * @LastEditTime : 2019-12-27 14:29:15
 * @LastEditors  : Please set LastEditors
 * @Description: 任务管理详情
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
          <a-col class="playground-col" :span="8">负责人：{{particularsData.chargePersonList || '--'}}</a-col>
          <a-col class="playground-col" :span="8">计划执行时间：{{particularsData.changeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.changeDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">实际执行时间：{{particularsData.deliveryCompany || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产盘点范围：{{particularsData.checkRange || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        </a-row>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">资产列表</span>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          <template slot="tranProgress" slot-scope="text, record">
            <div style="padding-right: 10px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span class="btn_click mr15">详情</span>
          </template>
          </a-table>
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
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    title: "配套资源总数",
    dataIndex: "taskId"
  },  {
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
    width: '40%'
  }, {
    title: "提交人",
    dataIndex: "createBy",
    width: '15%'
  }, {
    title: "提交时间",
    dataIndex: "createTime",
    width: '15%'
  }, {
    title: "状态",
    dataIndex: "approvalStatusName",
    width: '15%'
  }
]
export default {
  components: {},
  props: {},
  data () {
    return {
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      columns: [...columns],
      InventoryReportColumns: [...InventoryReportColumns],
      loading: false,
      tableData: [],
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
    // 查询详情
    query () {
      let obj = {
        changeOrderId: this.changeOrderId
      }
      this.$api.assets.getChangeDetail(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产列表
    getChangeDetailPageFn () {
      this.loading = true
      let obj = {
        changeOrderId: this.changeOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.assets.getChangeDetailPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
            item.newOriginalValue = item.originalValue
            item.changeProjectId = item.changeProjectName
          })
          this.tableData = data
          this.queryCondition.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
  },
  created () {
  },
  mounted () {
    // this.particularsData = JSON.parse(this.$route.query.record)
    // this.changeOrderId = this.particularsData[0].changeOrderId
    // this.changeType = this.particularsData[0].changeType
    this.query()
    this.getChangeDetailPageFn()
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
            height: 40px;
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
