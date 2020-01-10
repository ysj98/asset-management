<!--
 * @Date: 2019-12-31 10:39:02
 * @Description: 处置登记 详情
 -->
<template>
  <div class="countingTaskDetail">
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">基本信息</span>
      <div class="countingTaskDetail-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">处置单编号：{{particularsData.disposeRegisterOrderId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产处置名称：{{particularsData.disposeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属组织机构：{{particularsData.organName || '--'}}</a-col>
          <!-- <a-col class="playground-col" :span="8">所属处置计划：{{particularsData.disposePlanName || '--'}}</a-col> -->
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">处置类型：{{particularsData.disposeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">处置方式：{{particularsData.disposeModeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">处置时间：{{particularsData.disposeDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">处置成本(元)：{{conditionalJudgment.includes(particularsData.disposeCost) ? '--' : particularsData.disposeCost}}</a-col>
          <a-col class="playground-col" :span="8">处置收入(元)：{{conditionalJudgment.includes(particularsData.disposeReceive) ? '--' : particularsData.disposeReceive}}</a-col>
          <a-col class="playground-col" :span="8">资产接收人：{{particularsData.assetReceiver || '--'}}</a-col>
          <a-col class="playground-col" :span="8">提交人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">提交时间：{{particularsData.submitDate || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置原因：{{particularsData.disposeReason || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :class="{'files-style': files.length > 0}" :span="24">附件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile
                v-model="files"
                type="all"
                :show="true"
              />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">资产处置清单 (资产总数：{{queryCondition.count || 0}})</span>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columnsData"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <!-- 处置成本 -->
            <template slot="disposeCost">
              <span>处置成本(元)</span>
            </template>
            <template slot="disposeCost" slot-scope="text, record">
              <span>{{record.disposeCost}}</span>
            </template>
            <!-- 处置收入 -->
            <template slot="disposeReceive">
              <span>处置收入(元)</span>
            </template>
            <template slot="disposeReceive" slot-scope="text, record">
              <span>{{record.disposeReceive}}</span>
            </template>
          </a-table>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.count"
            :location="location"
            :noPageTools="noPageTools"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <span class="section-title blue">收付款计划</span>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="receivingColumnsData"
            :dataSource="inventoryReportData"
            class="custom-table td-pd10"
            :pagination="false"
            >
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
import {columns, receivingData, conditionalJudgment} from './beat.js'
export default {
  components: {noDataTips},
  props: {},
  data () {
    return {
      conditionalJudgment,
      detailData: '',
      inventoryAssetCount: 0,
      taskId: '',
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      columnsData: [],
      receivingColumnsData: [],
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
    // 资产列表分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.getRegisterDetailListPage()
    },
    // 查询详情
    query () {
      let obj = {
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getDisposeRegisterById(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName
              })
            })
          }
          this.files = files
          this.particularsData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产清单列表
    getRegisterDetailListPage () {
      this.loading = true
      let obj = {
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getRegisterDetailListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
            item.assetCategoryName = item.objectTypeName
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
    // 收付款计划
    getreceivecostPlanList () {
      this.loading = true
      let obj = {
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getreceivecostPlanList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index,
            item.indexKey = index + 1
            item.feeSubject = item.feeSubjectName
            item.receivecostType = item.receivecostTypeName
            item.payee = item.payee ? item.payee : '--'
            item.payer = item.payer ? item.payer : '--'
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
  created () {
    // 详情表头没有操作
    let arr = utils.deepClone(columns)
    this.columnsData = arr.splice(0, arr.length - 1)
    let list = utils.deepClone(receivingData)
    this.receivingColumnsData = list.splice(0, list.length - 1)
  },
  mounted () {
    this.detailData = this.$route.query
    this.organId = this.detailData.organId
    this.disposeRegisterOrderId = this.detailData.disposeRegisterOrderId
    this.query()
    this.getRegisterDetailListPage()
    this.getreceivecostPlanList()
  }
}
</script>
<style lang="less" scoped>
.countingTaskDetail {
  .countingTaskDetail-nav{
      padding: 42px 126px 0px 70px;
      .countingTaskDetail-obj {
        padding: 20px 0 0px 40px;
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

