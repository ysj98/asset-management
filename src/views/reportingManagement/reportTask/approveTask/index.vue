<!--呈报任务-我审批的任务列表页面-->
<template>
  <div class="approve_task">
    <!--搜索条件-->
    <a-row :gutter="8" style="margin: 10px 0 10px 26px">
      <a-col :span="5">
        <SG-Button icon="export" :loading="exportBtnLoading" @click="handleExport">导出</SG-Button>
      </a-col>
      <a-col :span="5" class="custom_date">
        <span class="prefix_style" style="width: 69px">执行日期</span>
        <a-range-picker
          @change="getExecuteDate"
          class="date_picker_style"
          format="YYYY-MM-DD"
          :defaultValue="[moment().add(-60, 'days'), moment()]"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          v-bind="properties"
          v-model="reportBillId"
          :options="billList"
          placeholder="呈报表单"
          @change="queryTableData"
          :filterOption="filterOption"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          v-bind="properties"
          v-model="taskStatus"
          :options="typeOptions"
          placeholder="任务类型"
          @change="queryTableData"
          :filterOption="filterOption"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          v-bind="properties"
          v-model="taskType"
          :options="statusOptions"
          placeholder="任务状态"
          @change="queryTableData"
          :filterOption="filterOption"
        />
      </a-col>
      <a-col :span="3">
        <a-input placeholder="呈报任务名称/编号" @pressEnter="queryTableData" v-model.trim="searchText"/>
      </a-col>
      <a-col :span="2" style="text-align: left">
        <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="reportTaskId" slot-scope="text, record">
        <router-link
          class="action_text"
          :to="{path: '/reportTask/taskDetail', query: {taskId: record.reportTaskId}}"
        >{{text}}</router-link>
      </span>
      <span slot="action" slot-scope="text, record">
        <router-link
          class="action_text"
          :to="{path: '/reportTask/approveTask', query: {taskId: record.reportTaskId}}"
        >审核</router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength, type: 'page' })"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import NoDataTip from 'src/components/noDataTips'
  export default {
    name: 'index',
    props: ['refreshKey', 'billList'],
    components: { NoDataTip },
    data () {
      return {
        fold: true, // 查询条件折叠按钮
        beginDate: '', // 查询条件-执行开始日期
        endDate: '', // 查询条件-执行结束日期
        taskType: 'all', // 查询条件-任务类型
        taskStatus: 'all', // 查询条件-任务状态
        reportBillId: 'all', // 查询条件-表单id
        typeOptions: [
          { title: '全部任务类型', key: 'all' }, { title: '固定任务', key: '2' }, { title: '临时任务', key: '1' }
        ], // 查询条件-任务类型选项
        statusOptions: [
          { title: '全部任务状态', key: 'all' }, { title: '未完成', key: '1' }, { title: '待审核', key: '2' },
          { title: '已驳回', key: '3' },{ title: '已完成', key: '4' }
        ], // 查询条件-任务状态选项
        searchText: '', // 查询条件-任务名称或编码
        exportBtnLoading: false, // 导出按钮loading
        tableObj: {
          dataSource: [
            { reportTaskId: 123,organName: '隔离区1' },
            { reportTaskId: 23,organName: '隔离区2' }
          ],
          loading: false,
          scroll: { x: 1600 },
          pagination: false,
          rowKey: 'reportTaskId',
          columns: [
            { title: '任务编号', dataIndex: 'reportTaskId', fixed: 'left', scopedSlots: { customRender: 'reportTaskId' }, width: 150  },
            { title: '所属机构', dataIndex: 'organName'}, { title: '资产项目', dataIndex: 'projectName' }, { title: '任务名称', dataIndex: 'taskName' },
            { title: '呈报表单', dataIndex: 'reportBillName' }, { title: '任务类型', dataIndex: 'taskTypeName' },
            { title: '计划执行日期', dataIndex: 'beginDate' }, { title: '填报人', dataIndex: 'reportByName' },
            { title: '审核人', dataIndex: 'auditByName' }, { title: '实际填报日期', dataIndex: 'completeDate' },
            { title: '数据量', dataIndex: 'reportNum' }, { title: '审核状态', dataIndex: 'taskStatusName', fixed: 'right', width: 100 },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 80 }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        properties: { mode: 'multiple', allowClear: true, showSearch: true, maxTagCount: 1, style: 'width: 100%' } // 查询表单控件公共属性
      }
    },

    mounted () {
      this.queryTableData({})
    },

    methods: {
      moment,

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const { beginDate, endDate, taskType, taskStatus, reportBillId, searchText } = this
        let form = {
          action: 'sh', // 默认值
          searchText, pageSize: pageLength, pageNum: pageNo,
          beginDate: beginDate || moment().add(-60, 'days').format('YYYY-MM-DD'),
          endDate: endDate || moment().format('YYYY-MM-DD'), // 默认最近60天数据
          taskType: (!taskType || taskType.includes('all')) ? undefined : taskType.join(','),
          taskStatus: (!taskStatus || taskStatus.includes('all')) ? undefined : taskStatus.join(','),
          reportBillId: (!reportBillId || reportBillId.includes('all')) ? undefined : reportBillId.join(',')
        }
        this.tableObj.loading = true
        this.$api.reportManage.queryTaskPage(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            return Object.assign(this.paginationObj, { totalCount: count, pageNo, pageLength })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询列表数据出错')
        })
      },

      // 获取日期
      getExecuteDate (date, dateStrings) {
        let confirmDate = dateStrings.length ? {
          beginDate: dateStrings[0], endDate: dateStrings[1]
        } : {}
        Object.assign(this, confirmDate)
        this.queryTableData({})
      },

      // Select 组件查询过滤
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },

      // 导出
      handleExport () {
        return this.$message.info('暂不支持')
      }
    },

    watch: {
      // 全选与其他选项互斥处理
      taskStatus: function (val) {
        if (val && val.length !== 1 && val.includes('all')) {
          this.taskStatus = ['all']
          this.queryTableData({})
        }
      },

      reportBillId: function (val) {
        if (val && val.length !== 1 && val.includes('all')) {
          this.reportBillId = ['all']
          this.queryTableData({})
        }
      },

      taskType: function (val) {
        if (val && val.length !== 1 && val.includes('all')) {
          this.taskType = ['all']
          this.queryTableData({})
        }
      },

      // 长度不能超过30字符
      searchText: function (val, pre) {
        if (val && val.length > 30) {
          this.$message.warn("不能超30个字符")
          this.searchText = pre
        }
      },

      // 刷新页面
      refreshKey: function (key, preKey) {
        const { paginationObj: { pageNo, pageLength }} = this
        key !== preKey && this.queryTableData ({pageNo, pageLength})
      }
    }
  }
</script>

<style lang='less' scoped>
  .approve_task {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
