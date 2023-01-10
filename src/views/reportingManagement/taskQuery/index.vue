<!--
  任务管理查询
-->
<template>
  <div class="assetsRegistration">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.taskName" placeholder="呈报任务名称/编号" max-Length="30" @search="onSearch" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="onSearch">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select :style="allStyle" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
          <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部呈报表单" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.reportBillId">
          <a-select-option :title="item.name"  v-for="(item, index) in reportBillIdData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <!-- <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部任务类型" :tokenSeparators="[',']"  @select="taskTypeStatus" v-model="queryCondition.taskType">
          <a-select-option :title="item.name" v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select> -->
        <a-select :style="allStyle" placeholder="全部任务类型" v-model="queryCondition.taskType">
          <a-select-option :title="item.name" v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
          <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <!-- <segi-range-picker label="执行日期" :defaultValue="[moment(queryCondition.startCreateDate, 'YYYY-MM-DD'), moment(queryCondition.endCreateDate, 'YYYY-MM-DD')]" @dateChange="onDateChange"></segi-range-picker> -->
          <SG-DatePicker :allowClear="false" label="执行日期" style="width: 200px;"  pickerType="RangePicker" :defaultValue="defaultValue" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
      </div>
    </SG-SearchContainer>
    <a-spin :spinning="loading">
      <overview-number :numList="numList"/>
    </a-spin>
    <div class="table-layout-fixed">
     <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="tableData"
      class="custom-table td-pd10"
      :pagination="false"
      >
      <template slot="reportTaskId" slot-scope="text, record">
        <span class="tab-opt" @click="goPage(record)">{{record.reportTaskId}}</span>
      </template>
    </a-table>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      :location="location"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
    </div>
  </div>
</template>

<script>
import SegiRangePicker from '@/components/SegiRangePicker'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {getNowMonthDate, getNMonthsAgoFirst} from 'utils/formatTime'
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '未完成',
    value: '1'
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已驳回',
    value: '3'
  },
  {
    name: '已完成',
    value: '4'
  }
]
const columns = [
  {
    title: '任务编号',
    dataIndex: 'reportTaskId',
    scopedSlots: { customRender: "reportTaskId" },
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName'
  },
  {
    title: '呈报表单',
    dataIndex: 'reportBillName'
  },
  {
    title: '任务类型',
    dataIndex: 'taskTypeName'
  },
  {
    title: '计划执行日期',
    dataIndex: 'createTimeEndDate'
  },
  {
    title: '填报人',
    dataIndex: 'reportByName'
  },
  {
    title: '审核人',
    dataIndex: 'auditByName'
  },
  {
    title: '实际填报日期',
    dataIndex: 'realBeginDate'
  },
    {
    title: '数据量',
    dataIndex: 'reportNum'
  },
    {
    title: '任务状态',
    dataIndex: 'taskStatusName'
  }
]
export default {
  components: {TreeSelect, SegiRangePicker, noDataTips, OverviewNumber},
  props: {},
  data () {
    return {
      numList: [
				{title: '全部', key: 'total', value: 0, fontColor: '#324057'}, {title: '未完成', key: 'undone', value: 0, bgColor: '#4BD288'},
				{title: '待审批', key: 'pendingApproval', value: 0, bgColor: '#1890FF'}, {title: '已驳回', key: 'rejected', value: 0, bgColor: '#DD81E6'},
				{title: '已完成', key: 'done', value: 0, bgColor: '#FD7474'}
			], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      toggle: false,
      // scrollHeight: {y: 0},
      ASSET_MANAGEMENT,
      isChild: false,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      approvalStatusData: [...approvalStatusData],
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {
        reportTask: '',
        approvalStatus: '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        pageNum: 1,                // 当前页
        pageSize: 10,               // 每页显示记录数
        projectId: '',              // 资产项目Id
        organId:1,                 // 组织机构id
        reportBillId: '',            // 备注：变动类型id(多个用，分割)
        startCreateDate: getNMonthsAgoFirst(2),       // 备注：开始创建日期
        endCreateDate: getNowMonthDate(),         // 备注：结束创建日期
        taskType: ''
      },
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
      count: '',
      reportBillIdData: [],
      taskTypeData: [
        {
          name: '全部任务类型',
          value: ''
        },
        {
          name: '临时任务',
          value: '1'
        },
        {
          name: '固定任务',
          value: '2'
        },
      ],
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    moment,
    // 统计查询
    getTaskStat () {
      let data = {
        action: 'jg',            //
        beginDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),  // 开始时间
        endDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),      // 结束时间
        organId: this.queryCondition.organId,
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        projectId: this.queryCondition.projectId,            // 资产项目Id
        reportBillIdSplice: this.queryCondition.reportBillId.length > 0 ? this.queryCondition.reportBillId.join(',') : '',                                    // 表单id
        reportPlanId: '',                                    // 计划id
        reportTaskId: '',                                    // 任务id
        searchText: '',                                      // 编码
        taskStatusSplice: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        // taskType: this.queryCondition.taskType.length > 0 ? this.queryCondition.taskType.join(',') : ''
        taskType: this.queryCondition.taskType,
        taskName: this.queryCondition.taskName
      }
      this.$api.reportManage.queryTaskStatistics(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          this.numList = this.numList.map(m => {
            return { ...m, value: result[m.key] }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 详情
    goPage (record) {
      this.$router.push({ path: '/taskQuery/details', query: {quersData: JSON.stringify([record])}})
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 起止日期发生变化
    // onDateChange (val) {
    //   this.queryCondition.startCreateDate = val[0]
    //   this.queryCondition.endCreateDate = val[1]
    // },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 表单状态编号
    changeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.reportBillId = this.handleMultipleSelectValue(value, this.queryCondition.reportBillId, this.reportBillIdData)
      })
    },
    // 任务类型
    taskTypeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.taskType = this.handleMultipleSelectValue(value, this.queryCondition.taskType, this.taskTypeData)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
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
    // 选择组织机构
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.query()
      this.getObjectKeyValueByOrganIdFn()
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectData = [{name: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.currentOrgan = e.target.checked
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
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
                name: item.billName
              })
            })
            this.reportBillIdData = [{ name: '全部呈报表单', value: ''}, ...arr]
          } else {
            this.$message.error(res.data.message);
          }
      })
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        action: 'jg',            //
        beginDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),  // 开始时间
        endDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),      // 结束时间
        organId: this.queryCondition.organId,
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        projectId: this.queryCondition.projectId,            // 资产项目Id
        reportBillIdSplice: this.queryCondition.reportBillId.length > 0 ? this.queryCondition.reportBillId.join(',') : '',                                    // 表单id
        reportPlanId: '',                                    // 计划id
        reportTaskId: '',                                    // 任务id
        searchText: '',                                      // 编码
        taskStatusSplice: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        // taskType: this.queryCondition.taskType.length > 0 ? this.queryCondition.taskType.join(',') : ''
        taskType: this.queryCondition.taskType,
        taskName: this.queryCondition.taskName
      }
      this.$api.reportManage.queryTaskPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.loading = false
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.createTimeEndDate = `${item.createTime} - ${item.endDate}`
              // item.realBeginDateRealEndDate = `${item.realBeginDate} - ${item.realEndDate}`
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
      this.getTaskStat()
    }
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/assetChange' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    this.queryAllReportBill()
  }
}
</script>
<style lang="less" scoped>
.assetsRegistration {
  .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .custom-table {
    padding-bottom: 60px;
  }
  .formCon {
    display: flex;
    width: 100%;
    justify-content:flex-end;
    flex-wrap: wrap;
    > * {
      margin-right:10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
  .tab-opt {
    padding-right: 10px;
    color: #0084FF;
    cursor: pointer;
  }
}
</style>
