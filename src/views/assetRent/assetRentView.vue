<!--资产出租-资产出租一览表-->
<template>
  <div class="rent_view">
    <!--查询条件-->
    <search-container size="fold" background="white" v-model="toggle">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary" :loading='exportBtnLoading'
           @click="handleExport" v-power="ASSET_MANAGEMENT.ASSET_RENT_VIEW_EXPORT"
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
            <a-select v-model="queryObj.contractStatusList" :options="contractStatusOptions"
              v-bind="selectProperty" placeholder="请选择合同状态"
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
            <a-range-picker @change="changeDate" style="width: 100%" :placeholder="['开始出租日期', '结束出租日期']"/>
          </a-col>
          <a-col :span="4">
            <a-input v-model.trim="queryObj.leaseNameOrId" placeholder="出租单名称/合同编号"/>
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
    name: 'assetRentView',
    components: {noDataTips, SearchContainer, OrganProject},
    data () {
      return {
        toggle: false,
        tableObj: {
          pagination: false,
          scroll: { x: 2400 },
          rowKey: 'leaseDetailId',
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
          startLeaseDateEnd: undefined, // 结束时间,
          startLeaseDateStart: undefined, // 开始时间
          contractStatusList: ['-1'], // 合同状态
          approvalStatusList: ['-1'], // 审批状态
          leaseNameOrId: '', // 出租单名称/合同编号
        }, // 查询条件
        exportBtnLoading: false, // 导出按钮loading
        columns: [
          { title: '出租ID', dataIndex: 'leaseDetailId', fixed: 'left', width: 120 },
          { title: '资产名称', dataIndex: 'assetName', width: 120 },
          { title: '资产编码', dataIndex: 'assetCode', width: 120 },
          { title: '资产类型', dataIndex: 'assetTypeName', width: 120 },
          { title: '资产分类', dataIndex: 'objectTypeName', width: 120 },
          { title: '所属机构', dataIndex: 'organName', width: 180 },
          { title: '资产项目', dataIndex: 'projectName', width: 180 },
          { title: '资产面积(㎡)', dataIndex: 'assetArea' },
          { title: '规格型号', dataIndex: 'specificationTypeName' },
          { title: '出租单ID', dataIndex: 'leaseOrderId' },
          { title: '出租单名称', dataIndex: 'leaseName' },
          { title: '承租人', dataIndex: 'lesseeName', width: 120 },
          { title: '出租面积(㎡)', dataIndex: 'leaseArea' },
          { title: '起租日期', dataIndex: 'startLeaseDate', width: 80 },
          { title: '止租日期', dataIndex: 'endLeaseDate', width: 80 },
          { title: '租金单价', dataIndex: 'rentPrice' },
          { title: '合同编号', dataIndex: 'contractCode', width: 150 },
          { title: '合同状态', dataIndex: 'contractStatusName' },
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
        contractStatusOptions: [
          { title: '全部合同状态', key: '-1' }, { title: '未生效', key: '0' },
          { title: '待执行', key: '1' }, { title: '执行中', key: '2' },
          { title: '已终止', key: '3' }, { title: '已作废', key: '4' }
        ], // 查询条件-合同状态选项
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
        this.queryObj.startLeaseDateStart = dateString[0]
        this.queryObj.startLeaseDateEnd = dateString[1]
      },

      // 根据资产类型查资产分类列表
      queryCategoryOptions () {
        this.objectTypeOptions = [{title: '全部资产分类', key: '-1'}]
        this.queryObj.objectTypeList = ['-1']
        const { organProjectValue: { organId }, queryObj: { assetTypeList } } = this
        if (!organId || !assetTypeList.length || assetTypeList.includes('-1') || assetTypeList.length > 1) { return false }
        queryCategoryList({ assetType: assetTypeList.join(','), organId }).then(list => {
          this.objectTypeOptions = [{title: '全部资产分类', key: '-1'}].concat(list)
        })
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        // 清空资产分类数据
        this.objectTypeOptions = [{title: '全部资产分类', key: '-1'}]
        this.queryObj.objectTypeList = ['-1']
        this.queryObj.assetTypeList = ['-1']
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
        let arr = ['assetTypeList', 'contractStatusList', 'objectTypeList', 'approvalStatusList']
        let temp = {}
        arr.forEach(k =>
          temp[k] = queryObj[k].filter(n => n !== '-1')
        )
        let obj = { organId, projectIdList: projectId || [], ...queryObj, ...temp }
        // 用于导出及查询汇总接口入参
        if (actionType) { return obj }
        this.loading = true
        this.$api.assetRent.queryRentViewPage({
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
          this.$api.assetRent.queryRentViewTotal(obj).then(({data: {data: {totalLeaseArea}, code, msg}}) => {
            this.loading = false
            if (String(code) === '0') {
              let [item] = this.tableData
              let temp = {}
              Object.keys(item).forEach(k => temp[k] = '')
              return this.tableData.push({
                ...temp,
                lesseeName: '出租总面积:',
                leaseArea: totalLeaseArea,
                // leaseDetailId: Date.now()
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
          this.$api.assetRent.exportRentView, '资产出租一览表.xlsx',
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
        }
        this.queryCategoryOptions()
      },
      'queryObj.objectTypeList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.objectTypeList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
        }
      },
      'queryObj.contractStatusList': function (value) {
        if (value.length > 1 && value.includes('-1')) {
          let lastIndex = value.length - 1
          this.queryObj.contractStatusList = value[lastIndex] === '-1' ? ['-1'] : value.filter(m => m !== '-1')
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
  .rent_view {
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
