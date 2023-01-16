<!--
 * @Author: LW
 * @Date: 2019-12-20 10:00:20
 * @LastEditTime : 2020-01-09 13:43:10
 * @LastEditors  : Please set LastEditors
 * @Description: 资产处置一览表
 * @FilePath: \asset-management\src\views\disposalManagement\listDisposal\index.vue
 -->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button icon="export" @click="handleExport" :loading="exportBtnLoading" v-power="ASSET_MANAGEMENT.czyl_zzjgst_dc">导出</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部处置状态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.approvalStatusList">
          <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部处置类型"
            :tokenSeparators="[',']"
            @select="changeStatus"
            v-model="queryCondition.disposeTypeList">
          <a-select-option :title="item.name" v-for="(item, index) in disposeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="assetTypeDataFn"
            v-model="queryCondition.assetTypeList" >
          <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select
              :maxTagCount="1"
              :style="allStyle"
              mode="multiple"
              placeholder="全部处置方式"
              :tokenSeparators="[',']"
              @select="disposeModeDataFn"
              v-model="queryCondition.disposeModeList">
            <a-select-option :title="item.name" v-for="(item, index) in disposeModeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker label="处置日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD"></SG-DatePicker>
          </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="queryFn">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <overview-number :numList="numList" />
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="tableInfo.columns"
        :dataSource="tableInfo.tableData"
        size="middle"
        :pagination="false"
        >
        <div slot="operation"
             slot-scope="text, record"
             class="operation">
          <span @click="detail(record)">详情</span>
        </div>
      </a-table>
      <no-data-tips v-show="tableInfo.tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="tableInfo.location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import OverviewNumber from 'src/views/common/OverviewNumber'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import noDataTips from '@/components/noDataTips'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {utils, debounce} from '@/utils/utils.js'
import {getCurrentDate, getMonthsAgoDate} from '@/utils/formatTime'
import {exportDataAsExcel} from 'src/views/common/commonQueryApi'
const allWidth = {width: '170px', 'margin-right': '10px', flex: 1, 'display': 'inline-block'}
const dateWidth = {width: '300px', 'margin-right': '10px', flex: 1, 'display': 'inline-block'}
const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '处置数量',
    dataIndex: 'dispNum'
  },
  {
    title: '处置面积(㎡)',
    dataIndex: 'dispArea'
  },
  {
    title: '处置收入(元)',
    dataIndex: 'disposeReceive'
  },
  {
    title: '处置成本(元)',
    dataIndex: 'disposeCost'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const queryCondition =  {
    organId: '',   // 组织机构id
    approvalStatusList: [''],  // 处置状态 0草稿 2待审批、已驳回3、已审批1 已取消4
    disposeTypeList: [''],   // 处置类型
    assetTypeList: [''],   // 资产类型
    disposeDateStart: '',       // 处置日期开始日期
    disposeDateEnd: '',    // 处置日期结束日期
    disposeModeList: [''],  // 处置方式
    pageNum: 1,     // 当前页
    pageSize: 10    // 每页显示记录数
  }
const approvalStatusData = [
  {
    name: '全部处置状态',
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
export default {
  components: {SearchContainer, TreeSelect, segiIcon, noDataTips, OverviewNumber},
  props: {},
  data () {
    return {
      dateWidth,
      // scrollHeight: {y: 0},
      loading: false,
      noPageTools: false,
      allStyle: allWidth,
      toggle: true,
      ASSET_MANAGEMENT,
      tableInfo: {
        location: 'absolute',
        columns,
        tableData: []
      },
      organName: '',
      organId: '',
      approvalStatusData: [...approvalStatusData],
      queryCondition: {...queryCondition},
      count: '',
      disposeTypeData: [],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: ''
        }
      ],
      disposeModeData: [],
      alterationDate: [],
      exportBtnLoading: false, // 导出按钮loading
      numList: [
        {title: '资产数量(个)', key: 'assetCount', value: 0, fontColor: '#324057'},
        {title: '处置面积(㎡)', key: 'area', value: 0, bgColor: '#4BD288'},
        {title: '处置收入(元)', key: 'transferOperationArea', value: 0, bgColor: '#1890FF'},
        {title: '处置成本(元)', key: 'idleArea', value: 0, bgColor: '#DD81E6'}
      ],  // 概览数字数据, title 标题，value 数值，bgColor 背景色
      queryInfo: {}
    }
  },
  computed: {
  },
  methods: {
    // 导出
    handleExport () {
      this.exportBtnLoading = true
      let data = this.query('export')
      exportDataAsExcel(data, this.$api.disposalManagement.getDisposeOrganExport, '资产处置一览表组织机构视图.xlsx', this).then(() => {
        this.exportBtnLoading = false
      })
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.query()
      this.getDisposeOrganStatistics()
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'AMS_DISPOSE_TYPE') {
            this.disposeTypeData = [{name: '全部处置类型', value: ''}, ...data]
          } else if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 机构字典表
    organDict () {
      this.$api.assets.organDict({code: 'AMS_DISPOSE_MODE'}).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.disposeModeData = [{name: '全部处置方式', value: ''}, ...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类
    assetClassifyDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, this.assetClassifyData)
      })
    },
    // 处置方式
    disposeModeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.disposeModeList = this.handleMultipleSelectValue(value, this.queryCondition.disposeModeList, this.disposeModeData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypeList = this.handleMultipleSelectValue(value, this.queryCondition.assetTypeList, this.assetTypeData)
      })
    },
    // 处置类型变化
    changeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.disposeTypeList = this.handleMultipleSelectValue(value, this.queryCondition.disposeTypeList, this.disposeTypeData)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatusList, this.approvalStatusData)
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      // this.alterationDate = [moment(getMonthsAgoDate(12), 'YYYY-MM-DD'), moment(getCurrentDate(), 'YYYY-MM-DD')]
      this.alterationDate = []
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.query()
      this.getDisposeOrganStatistics()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    judgmentMethodFn (val) {
      if (val === '') {
        return []
      } else if (val.length > 0 && val[0] !== '') {
        return val
      } else if (val.length === 1 && val[0] === '') {
        return []
      } else {
        return val
      }
    },
    // 点击查询
    queryFn () {
      this.query('')
      this.getDisposeOrganStatistics()
    },
    // 查询
    query (type) {
      let obj = {
        pageNum: this.queryCondition.pageNum,              // 当前页
        pageSize: this.queryCondition.pageSize,            // 每页显示记录数
        organId: Number(this.queryCondition.organId),      // 组织机构id
        approvalStatusList: this.judgmentMethodFn(this.queryCondition.approvalStatusList),        // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        disposeDateStart: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '',   // 处置日期,开始
        disposeDateEnd: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '',     // 处置日期,结束
        assetTypeList: this.judgmentMethodFn(this.queryCondition.assetTypeList),                  //类型：String  可有字段  资产类型Id
        disposeModeList: this.judgmentMethodFn(this.queryCondition.disposeModeList),              // 处置方式
        disposeTypeList: this.judgmentMethodFn(this.queryCondition.disposeTypeList)               // 处置类型(多选)
      }
      this.queryInfo = Object.assign({}, obj)
      delete this.queryInfo.pageNum
      delete this.queryInfo.pageSize
      if (type === 'export') { return obj }
      if (type === 'statis') {
        delete obj.pageNum
        delete obj.pageSize
        return obj
      }
      this.loading = true
      this.$api.disposalManagement.getDisposeOrganListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
            })
            this.tableInfo.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableInfo.tableData = []
            this.count = 0
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 查询概况
    getDisposeOrganStatistics () {
      this.numList[0].value = 0
      this.numList[1].value = 0
      this.numList[2].value = 0
      this.numList[3].value = 0
      // let params = {
      //   organId: Number(this.queryCondition.organId),      // 组织机构id
      //   approvalStatusList: this.judgmentMethodFn(this.queryCondition.approvalStatusList),        // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
      //   disposeDateStart: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '',   // 处置日期,开始
      //   disposeDateEnd: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '',     // 处置日期,结束
      //   assetTypeList: this.judgmentMethodFn(this.queryCondition.assetTypeList),                  //类型：String  可有字段  资产类型Id
      //   disposeModeList: this.judgmentMethodFn(this.queryCondition.disposeModeList),              // 处置方式
      //   disposeTypeList: this.judgmentMethodFn(this.queryCondition.disposeTypeList)
      // }
      let params = this.query('statis')
      this.$api.disposalManagement.getDisposeOrganStatistics(params).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.numList[0].value = data.dispNum ? data.dispNum : 0
          this.numList[1].value = data.dispArea ? data.dispArea : 0
          this.numList[2].value = data.disposeReceive ? data.disposeReceive : 0
          this.numList[3].value = data.disposeCost ? data.disposeCost : 0
        } else {
          this.$message.error(res.data.message)
        }
      }, res => {
        this.$message.error(res.data.message)
      })
    },
    // 查看详情
    detail (data) {
      let params = Object.assign({}, this.queryInfo)
      params.organId = data.organId
      params = JSON.stringify(params)
      this.$router.push({
        path: '/disposalManagement/listDisposal/detail',
        query: { queryInfo: params }
      })
    }
  },
  created () {
  },
  mounted () {
    // 获取处置类型
    this.platformDictFn('AMS_DISPOSE_TYPE')
    // 资产类型
    this.platformDictFn('asset_type')
    // 处置方式 机构字典表
    this.organDict()
  }
}
</script>
<style lang="less" scoped>
.scheduleChanges {
  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    padding-bottom: 60px;
  }
}
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
    .ant-select, .sg-datePicker.box {
      margin-top: 14px;
      .combobox {
        width: 170px;
      }
    }
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
.operation {
  text-decoration: underline;
  color: #6D7585;
  cursor: pointer;
  &:hover {
    color: #0084FF;
  }
}
</style>

