<!--
  任务管理查询
-->
<template>
  <div class="assetsRegistration">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.taskName" placeholder="呈报任务名称/编号" maxlength="30" @search="onSearch" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="query">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select :style="allStyle" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
          <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部呈报表单" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.reportBillId">
          <a-select-option v-for="(item, index) in reportBillIdData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部任务类型" :tokenSeparators="[',']"  @select="taskTypeStatus" v-model="queryCondition.taskType">
          <a-select-option v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
          <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <segi-range-picker label="执行日期" :defaultValue="[moment(queryCondition.startCreateDate, 'YYYY-MM-DD'), moment(queryCondition.endCreateDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>
        </div>
      </div>
    </SG-SearchContainer>
    <div class="table-layout-fixed">
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
import {getCurrentDate, getThreeMonthsAgoDate} from 'utils/formatTime'
import noDataTips from '@/components/noDataTips'
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '草稿',
    value: '0'
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
    name: '已审批',
    value: '1'
  },
  {
    name: '已取消',
    value: '4'
  }
]
const columns = [
  {
    title: '任务编号',
    dataIndex: 'planCode'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '资产项目',
    dataIndex: 'projectIdName'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName'
  },
  {
    title: '呈报表单1111',
    dataIndex: 'assetChangeCount'
  },
  {
    title: '任务类型',
    dataIndex: 'taskType'
  },
  {
    title: '计划执行日期',
    dataIndex: 'realBeginDate-realEndDate'
  },
  {
    title: '填报人',
    dataIndex: 'changeDate'
  },
  {
    title: '审核人',
    dataIndex: 'approvalStatusName'
  },
  {
    title: '实际填报日期',
    dataIndex: 'approvalStatusName1'
  },
    {
    title: '数据量',
    dataIndex: 'approvalStatusName2'
  },
    {
    title: '任务状态',
    dataIndex: 'taskStatus'
  }
]
export default {
  components: {TreeSelect, SegiRangePicker, noDataTips},
  props: {},
  data () {
    return {
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
        startCreateDate: getThreeMonthsAgoDate(),       // 备注：开始创建日期
        endCreateDate: getCurrentDate()         // 备注：结束创建日期
      },
      // defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      count: '',
      reportBillIdData: [
        {
          name: '全部呈报表单',
          value: ''
        }
      ],
      taskTypeData: [
        {
          name: '全部任务类型',
          value: '' 
        }
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
    onDateChange (val) {
      this.queryCondition.startCreateDate = val[0]
      this.queryCondition.endCreateDate = val[1]
    },
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
    // 查询
    query () {
      this.loading = true
      let obj = {
        action: 'jg',            // 
        beginDate: this.queryCondition.startCreateDate,  // 开始时间
        endDate: this.queryCondition.endCreateDate,      // 结束时间
        organId: this.queryCondition.organId,
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        projectId: this.queryCondition.projectId,            // 资产项目Id
        reportBillId: this.queryCondition.reportBillId.length > 0 ? this.queryCondition.reportBillId.join(',') : '',                                    // 表单id
        reportPlanId: '',                                    // 计划id
        reportTaskId: '',                                    // 任务id
        searchText: '',                                      // 编码
        taskStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        taskType: this.queryCondition.taskType.length > 0 ? this.queryCondition.taskType.join(',') : ''
      }
      this.$api.assets.getChangePage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.loading = false
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
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
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
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
}
</style>
