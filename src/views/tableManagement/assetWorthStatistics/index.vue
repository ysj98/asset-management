<!--报表管理-资产价值统计表页面-->
<template>
  <div class="asset_worth">
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
      </div>
      <div slot="headerForm" style="margin-right: 8px">
        <a-row :gutter="8" style="width: 100%">
          <a-col :span="12" :offset="4">
            <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple"/>
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              @change="assetTypeChange"
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
        <a-row :gutter="8" style="width: 100%">
          <a-col :span="4" :offset="queryObj.queryType !== '0' ? 0 : 3">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              @change="statusChange"
              :options="statusOptions"
              v-model="queryObj.status"
              placeholder="请选择资产状态"
            />
          </a-col>
          <a-col :span="3">
            <a-select v-model="queryObj.queryType" style="width: 100%" placeholder="请选择统计方式" :options="queryTypeOptions"/>
          </a-col>
          <a-col :span="3">
            <a-select v-model="queryObj.startTime" style="width: 100%" placeholder="请选择开始时间" :options="startTimeOptions"/>
          </a-col>
          <a-col :span="3" v-if="queryObj.queryType !== '0'">
            <a-select v-model="queryObj.endTime" style="width: 100%" placeholder="请选择结束时间" :options="endTimeOptions"/>
          </a-col>
          <a-col :span="3">
            <a-input v-model.trim="queryObj.assetName" style="width: 100%" placeholder="资产名称或编码"/>
          </a-col>
          <a-col :span="6" style="text-align: center; height: 32px; padding-top: 7px">
            <a-radio-group v-model="queryObj.dimension" @change="generateSortFunc">
              <a-radio value="1">按资产项目统计</a-radio>
              <a-radio value="2">按资产统计</a-radio>
            </a-radio-group>
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
    <a-table v-bind="tableObj" class="custom-table td-pd10" bordered/>
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
          dimension: '1', // 查询条件-统计维度
          queryType: '3', // 查询条件-统计类型值
          objectType: '', // 查询条件-资产分类值
          endTime: undefined, // 查询条件-结束时间,
          startTime: undefined, // 查询条件-开始时间
          assetName: '', //  查询条件-资产名称或编码
          status: ['-1'], // 查询条件-资产状态值,多选
          assetType: ['-1'] // 查询条件-资产类型值,多选
        },
        endTimeOptions: [], // 查询条件-统计结束时间选项
        startTimeOptions: [], // 查询条件-统计开始时间选项
        statusOptions: [
          { title: '全部资产状态', key: '-1' }, { title: '待入库', key: '0' }, { title: '正常', key: '1' },
          { title: '报废', key: '2' }, { title: '转让', key: '3' },
          { title: '报损', key: '4' }, { title: '已出库', key: '5' }, { title: '已取消', key: '6' }, { name: '入库中', value: '7' }
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
          { title: '所属机构', dataIndex: 'organName', fixed: 'left', width: 220 },
          { title: '资产项目', dataIndex: 'projectName', fixed: 'left', width: 300 },
          { title: '资产原值(元)', dataIndex: 'originalValue' }, { title: '首次成本法估值(元)', dataIndex: 'assetValuation' },
          { title: '首次市场法估值(元)', dataIndex: 'firstMarketValue' }, { title: '最新估值(元)', dataIndex: 'marketValue' }
        ], // 列头不变部分,按资产项目统计维度
        columnsByAsset: [
          { title: '资产编号', dataIndex: 'assetCode' }, { title: '资产名称', dataIndex: 'assetName', width: 180 },
          { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'objectTypeName' }, { title: '资产状态', dataIndex: 'statusName' }
        ], // 按资产统计维度时动态展示
        tableObj: {
          pagination: false,
          // rowKey: 'assetId',
          loading: false,
          initColumns: [],
          dataSource: [],
          scroll: { x: 1500 },
          columns: []
        },
        numList: [
          {title: '资产总数', key: 'assetCount', value: 0, fontColor: '#324057'},
          {title: '资产原值(元)', key: 'originalValue', value: 0, bgColor: '#4BD288'},
          {title: '首次成本法估值(元)', key: 'assetValuation', value: 0, bgColor: '#1890FF'},
          {title: '首次市场法估值(元)', key: 'firstMarketValue', value: 0, bgColor: '#DD81E6'},
          {title: '最新估值(元)', key: 'marketValue', value: 0, bgColor: '#FD7474'}
        ], // 概览数据，title 标题，value 数值，color 背景色
        isLoad: false, // 组织机构树是否加载完成,仅自动查询初始化数据的标志
        sortFunc: (a, b) => a['organName'].localeCompare(b['organName']) // 排序算法函数
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
      
      // 根据统计方式和统计维度生成列
      generateColumns ({queryType, startTime, endTime, dimension}, data) {
        const { columnsByAsset, fixedColumns, sortFunc } = this
        let dataSource = data.map((m, key) => {
          let temp = {}
          let arr = m.dynamicData || []
          arr.forEach((n, i) => temp[`date_${i}`] = n)
          return { ...m, ...temp, key}
        }).sort(sortFunc)
        let fixedColumnsCopy = [...fixedColumns]
        let arr = []
        if (queryType === '0') {
          // 按月统计时，最大年份跨度1年
          for (let i = 0; i < 12; i++) {
            arr.push({title: `${startTime}-${i + 1}月`, dataIndex: `date_${i}`})
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
        dimension === '2' && fixedColumnsCopy.splice(2, 0, ...columnsByAsset)
        // 计算需要合并的单元格起始位置及数量
        let temp = {}
        dataSource.forEach((m, index) => {
          let { organName, projectName } = m
          if (!temp[organName]) {
            temp[organName] = 0
            temp[`${organName}_start`] = index
          }
          temp[organName] += 1
          if (dimension === '2') {
            let name = `${organName}_${projectName}`
            if (!temp[name]) {
              temp[name] = 0
              temp[`${name}_start`] = index
            }
            temp[name] += 1
          }
        })
        let columns = fixedColumnsCopy.map(c => {
          let { dataIndex } = c
          if (dataIndex === 'organName' || (dimension === '2' && dataIndex === 'projectName')) {
            return {
              ...c, customRender: (text, row, i) => {
              let keyName = dataIndex === 'projectName' ? `${row.organName}_${row.projectName}` : `${row.organName}`
              return {
                children: text,
                attrs: { rowSpan: temp[`${keyName}_start`] === i ? temp[keyName] : 0 }
              }
            }
          }
          } else {
            return c
          }
        }).concat(arr)
        Object.assign(this.tableObj, {
          columns,
          dataSource,
          scroll: { x: columns.length * 160 }
        })
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
          ...others, organId, projectIdList: projectId || [], pageSize: pageLength, pageNum: pageNo,
          assetType: assetType.includes('-1') ? '' : assetType.join(','),
          status: status.includes('-1') ? '' : status.join(',')
        }
        if (type === 'export') { return form }
        this.tableObj.loading = true
        this.$api.tableManage.getAssetValue(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            // 生成新的columns
            this.generateColumns(others, data || [])
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
        for (let i = 0; i < len; i++) {
          arr.push({ title: String(startYear + i), key: String(startYear + i) })
        }
        this.endTimeOptions = arr
        if (startYear + len - 1 < Number(endTime) || startYear > Number(endTime) || !endTime) {
          this.queryObj.endTime = arr[0]['key']
        }
      },

      // 导出
      handleExport () {
        let data= this.queryTableData({type: 'export'})
        exportDataAsExcel(data, this.$api.tableManage.exportAssetValue, '资产价值统计表.xls', this)
      },

      // 全选与其他选项互斥处理
      statusChange (value) {
        let lastIndex = value.length - 1
        this.queryObj.status = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
      },

      assetTypeChange (value) {
        let lastIndex = value.length - 1
        this.queryObj.assetType = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
        this.queryCategoryOptions()
      },

      // 按统计维度生成排序算法
      generateSortFunc ({target: value}) {
        // 字符串排序利用API referenceStr.localeCompare(compareString[, locales[, options]])
        // 详见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
        // 没有对(a[columns[0]['dataIndex']]值的有无做判断，要保证有值，即使是''
        this.sortFunc = (a, b) => {
          // 第一维度
          if (value === '1') {
            return a['organName'].localeCompare(b['organName'])
          }
          if (a['organName'].localeCompare(b['organName']) === 0) {
            return a['projectName'].localeCompare(b['projectName'])
          } else {
            return a['organName'].localeCompare(b['organName'])
          }
        }
      }
    },

    created () {
      this.queryAssetType()
      // 初始化Table列头
      let{ fixedColumns } = this
      this.tableObj.columns = fixedColumns
      // 获取开始年份
      let currentYear = new Date().getFullYear() - 1 // 默认当前年份-1
      let arr = []
      for (let i = 0; i <= 15; i++) {
        arr.push({ title: String(currentYear + i -10), key: String(currentYear + i - 10) })
      }
      this.startTimeOptions = [...arr]
      Object.assign(this.queryObj, {
        startTime: String(currentYear),
        endTime: String(currentYear + 1) // 默认当前年份
      })
      this.generateEndTimeOption()
    },

    watch: {
      organProjectValue: {
        handler: function (val, pre) {
          val.organId !== pre.organId && this.queryCategoryOptions()
          !this.isLoad && this.queryTableData({type: 'search'})
          this.isLoad = true
        },
        deep: true
      },
      
      'queryObj.queryType': function () {
        this.generateEndTimeOption()
      },
      
      'queryObj.startTime': function () {
        this.generateEndTimeOption()
      },

      'queryObj.assetName': function (val) {
        if (val.length > 40) {
          this.queryObj.assetName = val.slice(0, 40)
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
        .ant-table-thead th {
          white-space: nowrap;
        }
        .ant-table-tbody tr td {
          padding-left: 6px !important;
        }
      }
    }
  }
</style>
