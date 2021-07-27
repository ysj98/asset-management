<!--
  呈报表单详情
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">计划名称：{{particularsData.planName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">计划编码：{{particularsData.planCode || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">计划执行日期：{{particularsData.effDate ? `${particularsData.effDate} - ${particularsData.expDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
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
      <span class="section-title blue">呈报表单设置</span>
      <div class="particulars-obj">
				<div class="form-choice">
					<div class="form-right">
						<a-select
                    :disabled="true"
										showSearch
										placeholder="请选择呈报表单"
										style="width: 200px"
										v-model="reportBillId"
										:options="$addTitle(chargePersonOpt)"
										:filterOption="filterOption"
									>
									</a-select>
						</div>
						</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="dataSourceReportBill"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template v-for="(item, index) in columns" :slot="item.dataIndex" slot-scope="text, record, index">
              <div v-if="item.dataIndex === 'ieldNames'"></div>
              <a-checkbox v-else disabled :checked="record[item.dataIndex]" @change="checkboxFn(record, index, item.dataIndex)"></a-checkbox>
            </template>
          </a-table>
        </div>
      </div>
    </div>
		<div class="particulars-nav">
      <span class="section-title blue">任务执行设置</span>
      <div class="particulars-obj">
				<a-row class="playground-row">
          <a-col class="playground-col" :span="6">实施频次：{{particularsData.exePreName || '--'}}</a-col>
					<a-col class="playground-col" :span="6">任务开始时间：{{particularsData.taskStartTime || '--'}}</a-col>
					<a-col class="playground-col" :span="6">任务执行期限：{{`${particularsData.deadline} 天` || '--'}}</a-col>
					<a-col class="playground-col" :span="6">提前生成任务时间：{{`${particularsData.preNum}  ${+particularsData.preUnit == 1 ? '天' : '小时'}` || '--'}}</a-col>
				</a-row>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="previewColumns"
            :dataSource="taskExecution"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
          <no-data-tips v-show="taskExecution.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="task.pageSize"
            :totalCount="task.totalCount"
            v-model="task.pageNum"
            @change="taskChange"
          />
        </div>
      </div>
    </div>
		<div class="particulars-nav">
      <span class="section-title blue">执行记录</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="executiveColumns"
            :dataSource="executiveLogging "
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
          <no-data-tips v-show="executiveLogging.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.totalCount"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const previewColumns = [
  {
    title: "编号",
    dataIndex: "projectId"
  },
  {
    title: "资产项目",
    dataIndex: "projectName"
  },
  {
    title: "填报人",
    dataIndex: "informant"
  },
  {
    title: "审核人",
    dataIndex: "auditor"
  }
]
const executiveColumns = [
  {
    title: "任务编号",
    dataIndex: "planCode"
  },
  {
    title: "任务名称",
    dataIndex: "taskName"
  },
  {
    title: "资产项目",
    dataIndex: "projectName"
  },
  {
    title: "填报人",
    dataIndex: "reportByName"
  },
  {
    title: "审核人",
    dataIndex: "auditByName"
  },
  {
    title: "任务生成时间",
    dataIndex: "updateTime"
  },
   {
    title: "任务执行期限",
    dataIndex: "beginDateCompleteDate"
  },
  {
    title: "实际执行时间",
    dataIndex: "realBeginDateRealEndDate"
  },
  {
    title: "任务状态",
    dataIndex: "taskStatusName"
  },

]
let preUnitOpt = {
  '1': '天',
  '2': '时'
}
let dayOpt = {
  '1': '天'
}
let exePreData = {
    '1': '单次',
    '2': '每天',
    '3': '每周',
    '4': '每月',
    '5': '每季度',
    '6': '每半年',
    '7': '每年'
}

let onweek = {
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日'
  }

// 每月
let oneMonth = {
  '1': '每月'
}

// 每季度
let oneQuarter = {
    '1': '每季度第1个月',
    '2': '每季度第2个月',
    '3': '每季度第3个月',
  }
// 每半年
let halfYear = {
    '1': '每半年第1个月',
    '2': '每半年第2个月',
    '3': '每半年第3个月',
    '4': '每半年第4个月',
    '5': '每半年第5个月',
    '6': '每半年第6个月',
  }
// 每年
let oneHasYear = {
    '1': '每年第1个月',
    '2': '每年第2个月',
    '3': '每年第3个月',
    '4': '每年第4个月',
    '5': '每年第5个月',
    '6': '每年第6个月',
    '7': '每年第7个月',
    '8': '每年第8个月',
    '9': '每年第9个月',
    '10': '每年第10个月',
    '11': '每年第11个月',
    '12': '每年第12个月',
  }
import noDataTips from "@/components/noDataTips"
export default {
  components: {noDataTips},
  props: {},
  data () {
    return {
      preUnitOpt,
      oneHasYear,
      onweek,
      oneQuarter,
      halfYear,
      oneMonth,
      exePreData,
      dayOpt,
			chargePersonOpt: [],
      changeType: '',
      registerId: '',
      particularsData: {},
      files: [],
			columns: [],
      previewColumns: previewColumns,
      executiveColumns: executiveColumns,
      loading: false,
      dataSourceReportBill: [],
      reportBillId: undefined,
      taskExecution: [],
      executiveLogging: [],
      location: '',
      noPageTools: false,
      task: {
        pageSize: 10,
        pageNum: 1,
        count: ''
      },
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
		filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    taskChange (data) {
      this.task.pageNum = data.pageNo
      this.task.pageSize = data.pageLength
      this.queryReportTaskTempPageListFn()
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.taskList()
    },
    // 执行纪录页表
    taskList () {
      let obj = {
        action: 'jg',
        beginDate: '',                                      // 开始时间
        endDate: '',                                        // 结束时间
        organId: this.queryCondition.organId,
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        projectId: '',                                       // 资产项目Id
        reportBillId: '',                                    // 表单id
        reportPlanId: this.reportPlanId,                                    // 计划id
        reportTaskId: '',                                    // 任务id
        searchText: '',                                      // 编码
        taskStatus: '',                                      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        taskType: ''
      }
      this.$api.reportManage.queryTaskPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || []
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.beginDateCompleteDate = `${item.beginDate} - ${item.completeDate}`
              item.realBeginDateRealEndDate = `${item.realBeginDate} - ${item.realEndDate}`
            })
            this.executiveLogging = data
            this.queryCondition.totalCount = res.data.data.count || ''
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
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
            this.chargePersonOpt = [...arr]
          } else {
            this.$message.error(res.data.message);
          }
      })
    },
    // 查询任务列表
    queryReportTaskTempPageListFn () {
      let obj = {
        reportPlanId: this.reportPlanId,
        pageNum: this.task.pageNum,
        pageSize: this.task.pageSize
      }
      this.$api.reportManage.queryReportTaskTempPageList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data || []
          console.log(data, '-=-=-=-=-=')
          data.forEach((item, index) => {
            item.key = index
            item.indexs = index
            item.informant = ''          // 填报人
            item.auditor = ''             // 审核人
            item.informantName = []
            item.auditorName = []
            item.userList.forEach(v => {
              // 1 填报人  2 审核人
              if (+v.type === 1) {
                item.informantName.push(v.userName)
              } else if (+v.type === 2) {
                item.auditorName.push(v.userName)
              }
            })
            item.informant = item.informantName.join(',')
            item.auditor = item.auditorName.join(',')
          })
          this.taskExecution = data
          this.task.totalCount = res.data.data.count
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
          let columnNeed = {}  // 是否必填 0-非必填 1-必填
          let columnDisplay = {}  // Number  必有字段  备注：是否展示 0-非展示 1-展示
          result.forEach(item => {
            arr.push({
              title: item.columnDesc,
              dataIndex: item.columnName,
              scopedSlots: { customRender: item.columnName }
            })
            columnNeed[item.columnName] = !!item.columnNeed
            columnDisplay[item.columnName] = !!item.columnDisplay
          })
          this.columns = [{title: '字段名称', dataIndex: 'ieldNames'}, ...arr]
          // this.dataSourceReportBill = [{ieldNames: '必填字段', key: '0',  ...columnNeed}, {ieldNames: '展示字段', key: '1', ... columnDisplay}]
          let arrData = [{ieldNames: '必填字段', key: '0',  ...columnNeed}, {ieldNames: '展示字段', key: '1', ... columnDisplay}]
            this.formData.forEach(vv => {
              arrData[0][vv.columnName] = !!vv.columnNeed
              arrData[1][vv.columnName] = !!vv.columnDisplay
            })
            this.dataSourceReportBill = arrData
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 频次变化
    exePreSelectChange (e) {
      switch (e){
        case '1':
          this.particularsData.taskStartTime = this.particularsData.exePreName
          break;
        case '2':
					this.particularsData.taskStartTime = this.particularsData.exePreName
          break;
        case '3':
          this.particularsData.taskStartTime = `${this.particularsData.exePreName}${this.onweek[this.particularsData.beginDay]}`
          break;
        case '4':
          this.particularsData.taskStartTime = `${this.particularsData.exePreName}${this.particularsData.beginDay}日`
          break;
        case '5':
           this.particularsData.taskStartTime = `${this.oneQuarter[this.particularsData.beginMonth]}${this.particularsData.beginDay}日`
					break;
			  case '6':
          this.particularsData.taskStartTime = `${this.halfYear[this.particularsData.beginMonth]}${this.particularsData.beginDay}日`
					break;
				case '7':
          this.particularsData.taskStartTime = `${this.oneHasYear[this.particularsData.beginMonth]}${this.particularsData.beginDay}日`
          break;
      }
    },
    // 查询详情
    query () {
      let obj = {
        reportPlanId: this.reportPlanId
      }
      this.$api.reportManage.queryReportPlanDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          console.log(res)
          let data = res.data.data
          // this.particularsData.taskStartTime = `{}`
          this.particularsData = data
          this.exePreSelectChange(String(data.exePre))
          this.formData = data.reportBillColumnList   // 编辑给回来的表单
          this.reportBillId = Number(this.particularsData.reportBillId)
          this.queryReportBillColumn(this.particularsData.reportBillId)
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
    this.reportPlanId = arr[0].reportPlanId
    this.query()
    this.queryReportTaskTempPageListFn()
    this.taskList()
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
