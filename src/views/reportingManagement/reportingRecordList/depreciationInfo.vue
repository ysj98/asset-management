<!--
 * @Description: 资产折旧信息
 * @Date: 2020-03-06 11:27:16
 * @LastEditTime: 2022-12-15 14:17:59
 -->
<template>
  <div class="assetsRegistration">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button v-if="$power.has(ASSET_MANAGEMENT.ASSET_DEPRECIATION_EXPORT)" @click="openExport" type="primary"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.taskName" placeholder="资产卡片名称/编码" :maxLength="30" @search="onSearch" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="onSearch">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select :style="allStyle" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
          <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部呈报方式" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.taskType">
          <a-select-option :title="item.name" v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType">
          <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-month-picker v-model="month"  placeholder="所属月份" />
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状数据状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
          <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker :allowClear="false" :defaultValue="defaultValue" label="填报日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
      </div>
    </SG-SearchContainer>
    <!-- <div class="table-layout-fixed"> -->
     <a-table
      :loading="loading"
      :scroll="{ x: 2500, y: scrollHeight }"
      :columns="columns"
      :dataSource="tableData"
      class="custom-table td-pd10"
      :pagination="false"
      >
      <template slot="reportRecordId" slot-scope="text, record">
        <span class="tab-opt" @click="goPage(record)">{{record.reportRecordId}}</span>
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
    <!-- </div> -->
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {getNowMonthDate, getNMonthsAgoFirst} from 'utils/formatTime'
import noDataTips from '@/components/noDataTips'
import segiIcon from '@/components/segiIcon.vue'
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已完成',
    value: '4'
  }
]
const columns = [
  {
    title: '呈报编号',
    dataIndex: 'reportRecordId',
    scopedSlots: { customRender: "reportRecordId" },
  },
  {
    title: '资产卡片名称',
    dataIndex: 'cardName'
  },
  {
    title: '资产卡片编码',
    dataIndex: 'cardCode'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
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
    title: '折旧月份',
    dataIndex: 'deprecitionMonth'
  },
  {
    title: '本次折旧金额(元)',
    dataIndex: 'deprecitionAmount'
  },
  {
    title: '外部ID',
    dataIndex: 'objId'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
    {
    title: '填报人',
    dataIndex: 'reportByName'
  },
  {
    title: '填报日期',
    dataIndex: 'realBeginDate'
  },
  {
    title: '审核人',
    dataIndex: 'auditByName'
  },
  {
    title: '呈报方式',
    dataIndex: 'taskTypeName'
  },
  {
    title: '数据状态',
    dataIndex: 'taskStatusName'
  }
]
export default {
  components: {TreeSelect, noDataTips, segiIcon},
  props: {},
  data () {
    return {
      scrollHeight: 320,
      toggle: false,
      ASSET_MANAGEMENT,
      isChild: false,
      loading: false,
      noPageTools: false,
      location: 'fixed',
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
        organId: '',                 // 组织机构id
        assetType: '',
        taskType: ''
      },
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
      month: null,
      assetTypeData: [],
      count: '',
      taskTypeData: [
        {
          name: '全部呈报方式',
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
        {
          name: '数据接口',
          value: '3'
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
    // 详情
    goPage (record) {
      let query = {
        type: 'detail',
        reportRecordId: record.reportRecordId,
        reportTaskId: record.reportTaskId
      }
      this.$router.push({ path: '/reportingList/details', query})
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 全部呈报方式
    changeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.taskType = this.handleMultipleSelectValue(value, this.queryCondition.taskType, this.taskTypeData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
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
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
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
        organId: this.queryCondition.organId,
        projectId: this.queryCondition.projectId,
        objName: this.queryCondition.taskName,
        beginDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),
        endDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),
        taskStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',                // 审批状态 1未完成 2待审批 3已驳回 4已完成
        taskType: this.queryCondition.taskType.length > 0 ? this.queryCondition.taskType.join(',') : '',                  // 1临时 2固定 3数据
        month: this.month ? `${moment(this.month).format('YYYY-MM')}-01` : '',                     // 月份
        // month: '',
        assetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
      }
      console.log(obj, '-=-=-=-=')
      this.$api.reportManage.queryAssetDeprecitionPageList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data || []
          this.loading = false
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.objId = item.objId || item.objectId || '-'
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
    },
    // 导出
    openExport () {
      let loadingName = this.SG_Loding('导出中...')
      let obj = {
        organId: this.queryCondition.organId,
        projectId: this.queryCondition.projectId,
        objName: this.queryCondition.taskName,
        beginDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),
        endDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),
        taskStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',                // 审批状态 1未完成 2待审批 3已驳回 4已完成
        taskType: this.queryCondition.taskType.length > 0 ? this.queryCondition.taskType.join(',') : '',                  // 1临时 2固定 3数据
        month: this.month ? `${moment(this.month).format('YYYY-MM')}-01` : '',                     // 月份
        assetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',
      }
      this.$api.reportManage.exportAssetDeprecitionList(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产折旧信息.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.DE_Loding(loadingName).then(() => {})
      }).catch(err => {
        this.DE_Loding(loadingName).then(() => {})
      })
    },
  },
  watch: {
    toggle (val) {
      this.scrollHeight = val ? 450 : 320
    },
    '$route' () {
      if (this.$route.path === '/reportingList' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    // 资产类型
    this.platformDictFn('asset_type')
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
