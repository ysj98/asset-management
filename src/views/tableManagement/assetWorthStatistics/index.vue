<!--报表管理-资产价值统计表页面-->
<template>
  <div class="asset_worth">
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
      </div>
      <div slot="headerForm" style="margin-right: 8px">
        <a-row :gutter="8">
          <a-col :span="8" :offset="8">
            <organ-project v-model="organProjectValue" :isShowBuilding="false"/>
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              :options="assetTypeOptions"
              v-model="queryObj.assetType"
              placeholder="请选择资产类型"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.objectType" style="width: 100%" placeholder="请选择资产分类" :options="objectTypeOptions"/>
          </a-col>
        </a-row>
      </div>
      <div slot="contentForm" style="margin-top: 15px">
        <a-row :gutter="8">
          <a-col :span="5" :offset="queryObj.queryType !== '0' ? 3 : 6">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              :options="statusOptions"
              v-model="queryObj.status"
              placeholder="请选择资产状态"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.queryType" style="width: 100%" placeholder="请选择统计方式" :options="queryTypeOptions"/>
          </a-col>
          <a-col :span="3">
            <a-select v-model="queryObj.startTime" style="width: 100%" placeholder="请选择开始时间" :options="startTimeOptions"/>
          </a-col>
          <a-col :span="3" v-if="queryObj.queryType !== '0'">
            <a-select v-model="queryObj.endTime" style="width: 100%" placeholder="请选择结束时间" :options="endTimeOptions"/>
          </a-col>
          <a-col :span="4">
            <a-input v-model.trim="queryObj.assetName" style="width: 100%" placeholder="请输入资产名称或编码"/>
          </a-col>
          <a-col :span="2">
            <SG-Button type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="projectName" slot-scope="text, record">
        <router-link :to="{ path: '/houseStandingBook/assetViewDetail', query: { houseId: record.assetHouseId, assetId: record.assetId } }">详情</router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import { queryCategoryList, queryAssetTypeList, exportDataAsExcel } from 'src/views/common/commonQueryApi'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import NoDataTip from 'src/components/noDataTips'
  import moment from 'moment'
  export default {
    name: 'index',
    components: { OverviewNumber, SearchContainer, OrganProject, NoDataTip },
    data () {
      return {
        fold: true,
        queryObj: {
          queryType: '0', // 查询条件-统计类型值
          objectType: '', // 查询条件-资产分类值
          status: ['-1'], // 查询条件-资产状态值,多选
          assetType: ['-1'], // 查询条件-资产类型值,多选
          startTime: String(new Date().getFullYear()), // 查询条件-开始时间
          endTime: undefined, // 查询条件-结束时间
        },
        endTimeOptions: [], // 查询条件-统计结束时间选项
        startTimeOptions: [], // 查询条件-统计开始时间选项
        statusOptions: [
          { title: '全部资产状态', key: '-1' }, { title: '未生效', key: '61' }, { title: '已取消', key: '40' },
          { title: '正常', key: '1' }, { title: '报废', key: '1222' }, { title: '转让', key: '450' },
          { title: '报损', key: '22' }, { title: '已清理', key: '14' }
        ], // 查询条件-资产状态选项
        objectTypeOptions: [{ title: '全部资产分类', key: '' }], // 查询条件-资产分类选项,主数据字典
        assetTypeOptions: [{ title: '全部资产类型', key: '-1' }], // 查询条件-资产类型选项，平台字典
        queryTypeOptions: [
          { title: '按月统计', key: '0' }, { title: '按季度统计', key: '1' },
          { title: '按半年统计', key: '2' }, { title: '按年统计', key: '3' }
        ], // 查询条件-统计类型选项
        organProjectValue: {}, // 查询条件-组织机构及项目值
        exportBtnLoading: false, // 导出button loading标志
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        fixedColumns: [
          { title: '资产编号', dataIndex: 'assetCode', scopedSlots: { customRender: 'assetCode' } },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'objectTypeName' },
          { title: '所属机构', dataIndex: 'organName' }, { title: '资产项目', dataIndex: 'projectName' },
          { title: '资产原值(元)', dataIndex: 'originalValue' }, { title: '评估原值(元)', dataIndex: 'assetValuation' },
          { title: '首次市场估值(元)', dataIndex: 'firstMarketValue' }, { title: '最新估值(元)', dataIndex: 'marketValue' }
        ], // 列头不变部分
        tableObj: {
          pagination: false,
          rowKey: 'assetId',
          loading: false,
          initColumns: [],
          dataSource: [],
          scroll: { x: true },
          columns: []
        },
        numList: [
          {title: '资产总数', key: 'assetCount', value: 0, fontColor: '#324057'},
          {title: '资产原值(元)', key: 'originalValue', value: 0, bgColor: '#4BD288'},
          {title: '首次评估原值(元)', key: 'assetValuation', value: 0, bgColor: '#1890FF'},
          {title: '首次评估市值(元)', key: 'firstMarketValue', value: 0, bgColor: '#DD81E6'},
          {title: '最新价值(元)', key: 'marketValue', value: 0, bgColor: '#FD7474'}
        ], // 概览数据，title 标题，value 数值，color 背景色
      }
    },

    methods: {
      moment,

      // 查询资产类型--平台字典
      queryAssetType () {
        queryAssetTypeList().then(list => {
          this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list)
        })
      },

      // 根据资产类型查资产分类列表
      queryCategoryOptions () {
        this.objectTypeOptions = []
        const { organProjectValue: {organId}, queryObj: {assetType} } = this
        if (!organId || !assetType.length) { return false }
        let assetVal = assetType.includes('-1') ? '' : assetType.join(',')
        queryCategoryList({ assetType: assetVal, organId }).then(list => {
          this.objectTypeOptions = [{title: '全部资产分类', key: ''}].concat(list)
        })
      },
      
      // 根据统计方式生成列
      generateColumns ({queryType, startTime, endTime}) {
        let arr = []
        if (queryType === '0') {
          // 按月统计时，最大年份跨度1年
          for (let i = 1; i < 13; i++) {
            arr.push({title: `${startTime}-${i}月`, dataIndex: `date_${i}`})
          }
        } else {
          let len = Number(endTime) - Number(startTime) + 1
          let startYear = Number(startTime)
          for (let i = 0; i < len; i++) {
            if (queryType === '1') {
              // 按季度统计时，最大年份跨度2年
              // 为方便dataSource取值，保证dataIndex顺序排列
              let index = i * 4
              let temp = [
                {title: `${startYear + i}-1季度`, dataIndex: `date_${index}`},
                {title: `${startYear + i}-2季度`, dataIndex: `date_${index + 1}`},
                {title: `${startYear + i}-3季度`, dataIndex: `date_${index + 2}`},
                {title: `${startYear + i}-4季度`, dataIndex: `date_${index + 3}`}
              ]
              arr = arr.concat(temp)
            } else if (queryType === '2') {
              // 选择按半年统计时，最大年份跨度3年
              let index = i * 2
              let temp = [
                {title: `${startYear + i}-上半年`, dataIndex: `date_${index}`},
                {title: `${startYear + i}-下半年`, dataIndex: `date_${index + 1}`}
              ]
              arr = arr.concat(temp)
            } else if (queryType === '3') {
              // 选择按年统计时，最大年份跨度5年
              arr.push({title: `${startYear + i}年`, dataIndex: `date_${i}`})
            }
          }
        }
        this.tableObj.columns = this.fixedColumns.concat(arr)
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const { organProjectValue: { organId, projectId }, queryObj: { status, assetType, ...others} } = this
        if (!organId) { return this.$message.warn('请选择组织机构') }
        if (others.queryType !== '0' && !others.endTime) {
          return this.$message.warn('请选择统计结束时间')
        } else if (others.queryType === '0') {
          others.endTime = others.startTime
        }
        let form = {
          ...others, organId, projectId, pageSize: pageLength, pageNum: pageNo,
          assetType: assetType.includes('-1') ? '' : assetType.join(','),
          status: status.includes('-1') ? '' : status.join(',')
        }
        if (type === 'export') { return form }
        // 生成新的columns
        this.generateColumns(others)
        this.tableObj.loading = true
        this.$api.tableManage.getAssetValue(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = (data || []).map(m => {
              let temp = {}
              let arr = m.dynamicData || []
              arr.forEach((n, i) => temp[`date_${i}`] = n)
              return { ...m, ...temp}
            })
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
        // 查询统计数据
        if (type === 'search') { this.queryStatisticsInfo(form) }
      },

      // 查询统计数据
      queryStatisticsInfo (form) {
        this.overviewNumSpinning = true
        this.$api.tableManage.getAssetValueCount(form).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return res.data ? this.numList = this.numList.map(m => {
              return { ...m, value: res.data[m.key] }
            }) : false
          }
          throw res.message
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询统计出错')
        })
      },
      
      // 生成结束时间选项
      generateEndTimeOption () {
        const { queryObj: {queryType, startTime, endTime} } = this
        if (queryType === '0') { return this.queryObj.endTime = undefined }
        let startYear = Number(startTime)
        let obj = {
          1: 2,  // 按季度统计时，最大年份跨度2年
          2: 3, // 选择2按半年统计时，最大年份跨度3年
          3: 5 // 选择3按年统计时，最大年份跨度5年
        }
        let arr = []
        let len = obj[queryType]
        this.endTimeOptions = []
        if (startYear + len - 1 < Number(endTime) || startYear > Number(endTime)) {
          this.queryObj.endTime = undefined
        }
        for (let i = 0; i < len; i++) {
          arr.push({ title: String(startYear + i), key: String(startYear + i) })
        }
        this.endTimeOptions = arr
      },

      // 导出
      handleExport () {
        let data= this.queryTableData({type: 'export'})
        exportDataAsExcel(data, this.$api.tableManage.exportAssetValue, '资产价值统计表.xls', this)
      }
    },

    created () {
      // 初始化Table列头
      let{ fixedColumns } = this
      this.tableObj.columns = fixedColumns
      // 获取当前年份
      let currentYear = new Date().getFullYear()
      let arr = []
      for (let i = 0; i <= 20; i++) {
        arr.push({ title: String(currentYear + i -10), key: String(currentYear + i - 10) })
      }
      this.startTimeOptions = [...arr]
    },

    watch: {
      organProjectValue: function (val, pre) {
        val.organId !== pre.organId && this.queryCategoryOptions()
      },

      // 全选与其他选项互斥处理
      'queryObj.status': function (val) {
        if (val.length > 1 && val.includes('-1')) {
          this.queryObj.status = ['-1']
        }
      },

      'queryObj.assetType': function (val) {
        if (val.length > 1 && val.includes('-1')) {
          this.queryObj.assetType = ['-1']
        }
        this.queryCategoryOptions()
      },
      
      'queryObj.queryType': function () {
        this.generateEndTimeOption()
      },
      
      'queryObj.startTime': function () {
        this.generateEndTimeOption()
      },

      assetName: function (val) {
        if (val.length > 40) {
          this.assetName = val.slice(0, 40)
          return this.$message.warn('最大支持40个字符')
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_worth {
    .custom-table {
      padding: 8px 0 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th, td {
          white-space: nowrap;
        }
      }
    }
  }
</style>
