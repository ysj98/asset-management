<!--
  任务管理查询详情
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">任务信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">任务名称：{{particularsData.taskName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.reportBillName || '--'}}</a-col>
					<!-- <a-col class="playground-col" :span="8">
						表单名称：
						<a-select
              :disabled="true"
							showSearch
							placeholder="请选择呈报表单"
							style="width: 200px"
							v-model="reportBillId"
							:options="chargePersonOpt"
							:filterOption="filterOption"
						>
						</a-select>
					</a-col> -->
          <a-col class="playground-col" :span="8">计划执行日期：{{particularsData.beginDate ? `${particularsData.beginDate} - ${particularsData.endDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属计划：{{particularsData.reportPlanName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">填报人：{{particularsData.reportByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">审核人：{{particularsData.auditByName || '--'}}</a-col>
					<a-col class="playground-col" :span="8">任务状态：{{particularsData.taskStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">发布人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">发布人：{{particularsData.createTime || '--'}}</a-col>
					<!-- <a-col class="playground-col" :span="8">发布时间：{{particularsData.realBeginDate ? `${particularsData.realBeginDate} - ${particularsData.realEndDate}` : '--'}}</a-col> -->
          <a-col class="playground-col" :span="8">任务类型：{{particularsData.taskTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">附件： <span v-if="files.length === 0">无</span>
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
    <div class="particulars-nav">
      <span class="section-title blue">填报数据信息</span>
      <div class="particulars-obj">
				<div class="form-choice">
					<div style="line-height: 40px;">
						填报结果：
						<a-radio-group name="填报结果" :disabled="true" v-model="particularsData.result">
							<a-radio :value="0">填报</a-radio>
							<a-radio :value="1">不填报</a-radio>
						</a-radio-group>
						<!-- <SG-Button style="float: right;" type="primary" @click="downloadFn">导出</SG-Button> -->
					</div>
					<div style="line-height: 40px;">
						填报说明：{{particularsData.resultRemark}}
					</div>
				</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.totalCount"
            v-model="queryCondition.pageNum"
            @change="taskChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noDataTips from "@/components/noDataTips"
export default {
  components: {noDataTips},
  props: {},
  data () {
    return {
      reportBillId: undefined,
      reportTaskId: '',
			chargePersonOpt: [],
      changeType: '',
      registerId: '',
      particularsData: {},
      files: [],
			columns: [],
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
		// 导出
		downloadFn () {},
		filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 查询全部呈报表单列表
    queryAllReportBill () {
      this.$api.reportManage.queryAllReportBill({}).then(res => {
          if (res.data.code === "0") {
            let result = res.data.data || []
            let arr = []
            result.forEach(item => {
              arr.push({
                value: item.reportBillId,
                label: item.billName
              })
            })
            this.chargePersonOpt = arr
          } else {
            this.$message.error(res.data.message)
          }
      })
    },
    taskChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.queryTaskDetailPage()
    },
    // 填报数据信息
    queryTaskDetailPage () {
      let obj = {
        reportTaskId: this.reportTaskId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.reportManage.queryTaskDetailPage(obj).then(res => {
        if (res.data.code === "0") {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.queryCondition.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询呈报表单字段
    queryReportBillColumn (value) {
      let obj = {
        reportBillId: value,
        reportPlanId: this.reportPlanId
      }
      this.$api.reportManage.queryReportBillColumn(obj).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          let arr = []
          result.forEach(item => {
            arr.push({
              title: item.columnDesc,
              dataIndex: item.columnName,
              scopedSlots: { customRender: item.columnName }
            })
          })
          this.columns = arr
          this.dataSourceReportBill = []
          this.reportBillColumnList = result    // 总的数据
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询详情
    query () {
      let obj = {
        reportTaskId: this.reportTaskId
      }
      this.$api.reportManage.queryTaskInfo(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          this.reportBillId = Number(data.reportBillId)
          this.queryReportBillColumn(this.reportBillId)
          this.queryTaskDetailPage()
          let files = []
          if (data.attachmentList && data.attachmentList.length > 0) {
              data.attachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.queryAllReportBill()
    let arr = JSON.parse(this.$route.query.quersData)
    console.log(arr, '-=-=-=')
    this.reportTaskId = arr[0].reportTaskId
    this.query()
  }
}
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav{
      padding: 42px 126px 20px 70px;
      .particulars-obj {
				padding: 20px 0 20px 40px;
				.form-choice {
					overflow: hidden;
					margin: 10px 0;
					.form-right {
						float: right;
					}
				}
        .playground-row {
          .playground-col {
            // height: 40px;
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
