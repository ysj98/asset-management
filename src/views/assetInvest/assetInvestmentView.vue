<!--资产投资-资产投资一览表-->
<template>
  <div class="investment_view">
    <!--查询条件-->
    <search-container size="fold" background="white" v-model="toggle">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary" :loading='exportBtnLoading'
          @click="handleExport" v-power="ASSET_MANAGEMENT.ASSET_INVEST_VIEW_EXPORT"
        >导出</SG-Button>
      </div>
      <div slot="headerForm" style="margin-right: 32px">
        <a-row :gutter="8">
          <a-col :span="9" :offset="2">
            <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.assetTypeList" :options="assetTypeOptions"
              v-bind="selectProperty" placeholder="请选择资产类型"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.investStatusList" :options="investStatusOptions"
              v-bind="selectProperty" placeholder="请选择投资状态"
            />
          </a-col>
          <a-col :span="3">
            <a-input v-model.trim="queryObj.assetNameOrCode" placeholder="资产名称或编码"/>
          </a-col>
          <a-col :span="2">
            <SG-Button type="primary" @click="queryTableData">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
      <div slot="contentForm" style="margin-top: 18px">
        <a-row :gutter="8">
          <a-col :span="4">
            <a-select v-model="queryObj.objectTypeList" :options="objectTypeOptions"
              v-bind="selectProperty" placeholder="请选择资产分类"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.approvalStatusList" :options="approveStatusOptions"
              v-bind="selectProperty" placeholder="请选择审批状态"
            />
          </a-col>
          <a-col :span="7">
            <a-range-picker @change="changeDate" style="width: 100%" :placeholder="['开始投资日期', '结束投资日期']"/>
          </a-col>
          <a-col :span="4">
            <a-input v-model.trim="queryObj.investNameOrId" placeholder="投资单名称/编号"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--表格-->
    <a-table :loading="loading" :columns="columns" :dataSource="tableData" v-bind="tableObj"/>
    <SG-FooterPagination v-if="tableData.length" :totalCount="pageTotalCount" :pageNo="pageNo" @change="changePage" location="fixed"/>
    <!--缺省图-->
    <no-data-tips v-else/>
  </div>
</template>

<script>
  import noDataTips from '@/components/noDataTips'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import { queryCategoryList, queryAssetTypeList, exportDataAsExcel } from 'src/views/common/commonQueryApi'
  export default {
    name: 'assetInvestmentView',
    components: {noDataTips, SearchContainer, OrganProject},
    data () {
      return {
        toggle: false,
        tableObj: {
          pagination: false,
          scroll: { x: 2400 },
          rowKey: 'investDetailId',
          class: 'custom-table td-pd10'
        },
        selectProperty: {
          maxTagCount: 1,
          mode: 'multiple',
          style: 'width: 100%'
        }, // Select 共有属性
        ASSET_MANAGEMENT, // 权限对象
        organProjectValue: {}, // 查询条件-组织机构及项目值
        queryObj: {
          objectTypeList: ['-1'], // 资产分类
          assetNameOrCode: '', // 资产名称或编码
          assetTypeList: ['-1'], // 资产类型值,多选
          startInvestDateEnd: undefined, // 结束时间,
          startInvestDateStart: undefined, // 开始时间
          investStatusList: ['-1'], // 投资状态
          approvalStatusList: ['-1'], // 审批状态
          investNameOrId: '', // 投资单名称/投资编号
        }, // 查询条件
        exportBtnLoading: false, // 导出按钮loading
        columns: [
          { title: '投资ID', dataIndex: 'investDetailId', fixed: 'left', width: 120 },
          { title: '资产名称', dataIndex: 'assetName', width: 120 },
          { title: '资产编码', dataIndex: 'assetCode', width: 120 },
          { title: '资产类型', dataIndex: 'assetTypeName', width: 120 },
          { title: '资产分类', dataIndex: 'objectTypeName', width: 120 },
          { title: '所属机构', dataIndex: 'organName', width: 180 },
          { title: '资产项目', dataIndex: 'projectName', width: 180 },
          { title: '资产面积(㎡)', dataIndex: 'assetArea' },
          { title: '规格型号', dataIndex: 'specificationTypeName' },
          { title: '投资单ID', dataIndex: 'investOrderId' },
          { title: '投资单名称', dataIndex: 'investName', width: 120  },
          { title: '投资项目', dataIndex: 'investProject', width: 120 },
          { title: '投资面积(㎡)', dataIndex: 'investArea' },
          { title: '起投日期', dataIndex: 'startInvestDate', width: 80 },
          { title: '止投日期', dataIndex: 'endInvestDate', width: 80 },
          { title: '投资编号', dataIndex: 'investCode', width: 150 },
          { title: '投资状态', dataIndex: 'investStatusName' },
          { title: '签订日期', dataIndex: 'signingDate', width: 100 },
          { title: '审批状态', dataIndex: 'approvalStatusName', fixed: 'right', width: 60 }
        ], // Table columns
        loading: false, // Table loading
        tableData: [], // Table DataSource
        pageNo: 1, // 分页器第N页
        pageTotalCount: 0, // 分页器总条数
        isLoad: false, // 组织机构树是否加载完成,仅自动查询初始化数据的标志
        objectTypeOptions: [{ title: '全部资产分类', key: '-1' }], // 查询条件-资产分类选项,主数据字典
        assetTypeOptions: [{ title: '全部资产类型', key: '-1' }], // 查询条件-资产类型选项，平台字典
        investStatusOptions: [
          { title: '全部投资状态', key: '-1' }, { title: '未生效', key: '0' },
          { title: '待执行', key: '1' }, { title: '执行中', key: '2' },
          { title: '已终止', key: '3' }, { title: '已作废', key: '4' }
        ], // 查询条件-投资状态选项
        approveStatusOptions: [
          { title: '全部审批状态', key: '-1' }, { title: '草稿', key: '0' },
          { title: '待审批', key: '2' }, { title: '已驳回', key: '3' },
          { title: '已审批', key: '1' }, { title: '已取消', key: '4' }
        ], // 查询条件-审核状态选项
      }
    },

    mounted () {
      this.queryAssetType()
    },

    methods: {
      // 处理接管时间
      changeDate (date, dateString) {
        this.queryObj.startInvestDateStart = dateString[0]
        this.queryObj.startInvestDateEnd = dateString[1]
      },

      // 根据资产类型查资产分类列表
      queryCategoryOptions () {
        this.objectTypeOptions = []
        const { organProjectValue: { organId }, queryObj: { assetTypeList } } = this
        if (!organId || !assetTypeList.length) { return false }
        let assetVal = assetTypeList.includes('-1') ? '' : assetTypeList.join(',')
        queryCategoryList({ assetType: assetVal, organId }).then(list => {
          this.objectTypeOptions = [{title: '全部资产分类', key: '-1'}].concat(list)
        })
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        // 清空资产分类数据
        this.objectTypeOptions = []
        queryAssetTypeList().then(list => {
          this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list)
        })
      },

      // 改变分页时
      changePage ({ pageNo, pageLength }) {
        this.queryTableData({ pageNum: pageNo, pageSize: pageLength })
      },

      // 查询数据源
      queryTableData ({ pageNum = 1, pageSize = 10, actionType }) {
        const { organProjectValue: { organId, projectId }, queryObj } = this
        // 过滤掉 -1
        let arr = ['assetTypeList', 'investStatusList', 'objectTypeList', 'approvalStatusList']
        arr.forEach(k =>
          queryObj[k] = queryObj[k].filter(n => n !== '-1')
        )
        let obj = { organId, projectIdList: projectId || [], ...queryObj }
        // 用于导出及查询汇总接口入参
        if (actionType) { return obj }
        this.loading = true
        this.$api.assetInvest.queryInvestViewPage({
          pageNum, pageSize, ...obj
        }).then(({data: {data: {data, count}, code, msg}}) => {
          this.loading = false
          if (String(code) === '0') {
            Object.assign(this, {
              pageNo: pageNum,
              tableData: data || [],
              pageTotalCount: Number(count)
            })
            return this.queryTotalInfo(obj)
          }
          throw msg
        }).catch(err =>
          this.$message.error(err || '查询列表数据错误')
        ).finally(() =>
          this.loading = false
        )
      },

      // 查询汇总
      queryTotalInfo (obj) {
        if (this.tableData.length) {
          this.loading = true
          this.$api.assetInvest.queryInvestViewTotal(obj).then(({data: {data: {totalInvestArea}, code, msg}}) => {
            this.loading = false
            if (String(code) === '0') {
              let [item] = this.tableData
              let temp = {}
              Object.keys(item).forEach(k => temp[k] = '')
              return this.tableData.push({
                ...temp,
                investProject: '投资总面积:',
                investArea: totalInvestArea,
                // investDetailId: Date.now()
              })
            }
            throw msg
          }).catch(err =>
            this.$message.error(err || '查询列表汇总数据错误')
          ).finally(() =>
            this.loading = false
          )
        }
      },

      // 导出
      handleExport () {
        if (!this.tableData.length) { return this.$message.info('暂无导出数据') }
        this.exportBtnLoading = true
        exportDataAsExcel(
          this.queryTableData({actionType: 'export'}),
          this.$api.assetInvest.exportInvestView, '资产投资一览表.xlsx',
          this
        ).then(() =>
          this.exportBtnLoading = false
        )
      },
    },

    watch: {
      organProjectValue: {
        handler: function (val, pre) {
          val.organId !== pre.organId && this.queryCategoryOptions()
          !this.isLoad && this.queryTableData({})
          this.isLoad = true
        },
        deep: true
      },

      'queryObj.assetNameOrCode': function (val) {
        if (val.length > 30) {
          this.queryObj.assetName = val.slice(0, 30)
          return this.$message.warn('最大支持30个字符')
        }
      },

      // 全选与其他选项互斥处理
      'queryObj.assetTypeList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.assetTypeList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
          this.queryCategoryOptions()
        }
      },
      'queryObj.objectTypeList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.objectTypeList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
        }
      },
      'queryObj.investStatusList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.investStatusList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
        }
      },
      'queryObj.approvalStatusList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.approvalStatusList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
        }
      }
    }
}
</script>

<style lang="less" scoped>
  .investment_view {
    .custom-table {
      margin-bottom: 55px;
      & /deep/ .ant-table {
        th {
          white-space: nowrap;
        }
        tr:last-child {
          font-weight: bold;
        }
      }
    }
  }
</style>
