<!--
 * @Author: LW
 * @Date: 2019-12-27 11:37:37
 * @LastEditTime : 2019-12-27 17:57:39
 * @LastEditors  : Please set LastEditors
 * @Description: 任务新增编辑
 * @FilePath: \asset-management\src\views\inventoryManagement\countingTask\newEditor.vue
 -->
<template>
  <div class="countingTaskNewEditor">
    <div class="countingTaskNewEditor-nav">
      <span class="section-title blue">任务基础信息</span>
      <div class="countingTaskNewEditor-obj">
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
    <div class="countingTaskNewEditor-nav">
      <span class="section-title blue">盘点单列表</span>
      <div class="countingTaskNewEditor-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          <template slot="operation" slot-scope="text, record">
            <span class="btn_click mr15">详情</span>
          </template>
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
    title: "编号",
    dataIndex: "checkId"
  }, {
    title: "盘点单名称",
    dataIndex: "checkName"
  }, {
    title: "盘点人",
    dataIndex: "userNames"
  }, {
    title: "开始时间",
    dataIndex: "beginDateEndDate"
  }, {
    title: "结束时间",
    dataIndex: "completeDate"
  }, {
    title: "资产总数",
    dataIndex: "checkCount"
  }, {
    title: "配套资源总数",
    dataIndex: "taskId"
  }, {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
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
      this.$api.assets.getChangeNewEditor(obj).then(res => {
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
    getChangeNewEditorPageFn () {
      this.loading = true
      let obj = {
        changeOrderId: this.changeOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.assets.getChangeNewEditorPage(obj).then(res => {
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
    this.getChangeNewEditorPageFn()
  }
}
</script>
<style lang="less" scoped>
.countingTaskNewEditor {
  .countingTaskNewEditor-nav{
      padding: 42px 126px 20px 70px;
      .countingTaskNewEditor-obj {
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
