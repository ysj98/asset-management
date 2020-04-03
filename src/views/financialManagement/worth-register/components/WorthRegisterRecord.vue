<!--价值登记业务页面Tab--价值登记记录组件-->
<template>
  <div class="asset_register_record">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="export" @click="handleExport" :loading="exportBtnLoading">导出</SG-Button>
      </div>
      <div slot="headerForm">
        <tree-select @changeTree="changeTree" style="width: 180px"/>
        <a-input placeholder="请输入资产名称或编码" @pressEnter="queryTableData" v-model.trim="assetNameCode" style="width: 180px; margin: 0 10px"/>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="4">
            <a-select
              v-bind="properties"
              :options="projectOptions"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              v-model="organProjectType.projectId"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              placeholder="请选择资产类型"
              :options="assetTypeOptions"
              :filterOption="filterOption"
              v-model="organProjectType.assetType"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              @change="queryTableData"
              v-model="assetCategoryId"
              :options="categoryOptions"
              placeholder="请选择资产分类"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              v-model="approvalStatus"
              :options="statusOptions"
              @change="queryTableData"
              placeholder="请选择登记状态"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              :options="methodOptions"
              class="assess_method_style"
              placeholder="请选择评估方法"
              :filterOption="filterOption"
              v-model="assessmentMethod"
            />
          </a-col>
          <a-col :span="4" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row style="margin-top: 14px">
          <a-col :span="24">
            <date-method-organ v-model="dateMethodOrgan" :organId="organProjectType.organId"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10"/>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import NoDataTip from 'src/components/noDataTips'
  import TreeSelect from 'src/views/common/treeSelect'
  import DateMethodOrgan from '../components/DateMethodOrgan'
  import SearchContainer from 'src/views/common/SearchContainer'
  import {queryCategoryList, queryProjectListByOrganId, filterOption, queryAssetTypeList, queryAssetMethodList, exportDataAsExcel} from 'src/views/common/commonQueryApi'
  export default {
    name: 'WorthRegisterRecord',
    components: { SearchContainer, TreeSelect, DateMethodOrgan, NoDataTip },
    data () {
      return {
        fold: true, // 查询条件折叠按钮
        exportBtnLoading: false, // 导出按钮
        assetNameCode: '', // 查询条件-登记名称
        categoryOptions: [], // 查询条件-资产分类选项
        assetCategoryId: undefined, // 查询条件-资产分类id
        organProjectType: {
          organId: '',
          organName: '',
          projectId: undefined,
          assetType: undefined
        }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
        dateMethodOrgan: {
          beginDate: moment().add(-180, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD') // 默认查询最近半年的提交数据
        }, // { assessOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate, assessMethod }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        approvalStatus: undefined, // 查询条件-登记状态
        projectOptions: [], // 资产项目选项
        assetTypeOptions: [], // 资产类型选项
        assessmentMethod: undefined, // 评估方法
        methodOptions: [], // 评估方法选项
        statusOptions: [
          { title: '全部', key: '-1' }, { title: '待审批', key: '2' },
          { title: '已驳回', key: '3' }, { title: '已审批', key: '1' }, { title: '已取消', key: '4' }
        ], // 查询条件-状态选项
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 2000 },
          pagination: false,
          rowKey: 'relId',
          columns: [
            { title: '价值编号', dataIndex: 'relId', fixed: 'left', width: 120 },
            { title: '资产编码', dataIndex: 'assetCode', fixed: 'left', width: 180 },
            { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: 200 },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '所属机构', dataIndex: 'organName' }, { title: '资产项目', dataIndex: 'projectName' },
            { title: '资产原值(元)', dataIndex: 'originalValue' }, { title: '评估原值(元)', dataIndex: 'assetValuation' },
            { title: '市场值(元)', dataIndex: 'marketValue' },
            { title: '原值评估值基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '上次评估方法', dataIndex: 'lastAssessmentMethodName' },
            { title: '上次评估值', dataIndex: 'lastAssessmentValue' },
            { title: '本次评估方法', dataIndex: 'assessmentMethodName' },
            { title: '本次估值(元)', dataIndex: 'assessmentValue' }, { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' }, { title: '上浮比', dataIndex: 'upRate' },
            { title: '提交人', dataIndex: 'createByName' },
            { title: '状态', dataIndex: 'approvalStatusName', fixed: 'right', width: 120 }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        properties: { allowClear: true, showSearch: true, maxTagCount: 1, style: "width: 100%" } // 查询表单控件公共属性
      }
    },

    methods: {
      // 下拉搜索筛选
      filterOption,

      // 获取选择的组织机构
      changeTree (organId, organName) {
        Object.assign(this.organProjectType, {
          projectId: undefined,
          organName, organId
        })
        this.projectOptions = [] // 清空
        this.queryProjectByOrganId(organId)
        organId && this.queryTableData({})
        this.queryCategoryOptions()
      },

      // 根据organId查询资产项目
      queryProjectByOrganId (organId) {
        organId && queryProjectListByOrganId(organId).then(list =>
          list ? this.projectOptions = list : this.$message.error('查询资产项目失败')
        )
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        queryAssetTypeList().then(list => {
          list ? this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list) : this.$message.error('查询楼栋失败')
        })
      },

      // 查询评估方法--平台字典
      queryAssetMethod () {
        queryAssetMethodList().then(list => {
          list ? this.methodOptions = [{title: '全部评估方法', key: '-1'}].concat(list) : this.$message.error('查询评估方法失败')
        })
      },

      // 导出
      handleExport () {
        this.exportBtnLoading = true
        let data = this.queryTableData({type: 'export'})
        exportDataAsExcel(data, this.$api.tableManage.exportRecordExcel, '价值登记记录列表.xlsx', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {
          assetNameCode, approvalStatus, assetCategoryId,
          organProjectType, organProjectType: { assetType },
          dateMethodOrgan, assessmentMethod, dateMethodOrgan: { assessmentOrgan}
        } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        let form = {
          ...organProjectType, ...dateMethodOrgan,
          pageSize: pageLength, pageNum: pageNo, assetNameCode,
          assetType: (!assetType || assetType.includes('-1')) ? undefined : assetType.join(','),
          assetCategoryId: (!assetCategoryId || assetCategoryId.includes('-1')) ? undefined : assetCategoryId.join(','),
          approvalStatus: (!approvalStatus || approvalStatus.includes('-1')) ? undefined : approvalStatus.join(','),
          assessmentOrgan: (!assessmentOrgan || assessmentOrgan.includes('-1')) ? undefined : assessmentOrgan.join(','),
          assessmentMethod: (!assessmentMethod || assessmentMethod.includes('-1')) ? undefined : assessmentMethod.join(',')
        }
        if (type === 'export') { return form }
        this.tableObj.loading = true
        this.$api.worthRegister.queryRecordList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询价值登记记录接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询价值登记记录接口出错')
        })
      },

      // 根据资产类型查资产分类列表
      queryCategoryOptions () {
        this.categoryOptions = []
        const { organId, assetType } = this.organProjectType
        if (!organId || !assetType || !assetType.length) { return false }
        let assetVal = assetType.includes('-1') ? '' : assetType.join(',')
        queryCategoryList({ assetType: assetVal, organId }).then(list => {
          list ? this.categoryOptions = [{title: '全部资产分类', key: '-1'}].concat(list) : this.$message.error('查询资产分类失败')
        })
      }
    },

    created () {
      this.queryAssetType()
      this.queryAssetMethod()
    },

    watch: {
      // 全选与其他选项互斥处理
      approvalStatus: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.approvalStatus = ['-1']
        }
      },

      // 长度不能超过30字符
      assetNameCode: function (val, pre) {
        if (val && val.length > 40) {
          this.$message.warn("登记名称不能超40个字符")
          this.assetNameCode = pre
        }
      },

      dateMethodOrgan: function () {
        this.queryTableData({})
      },

      'organProjectType.projectId': function () {
        this.queryTableData({})
      },

      'organProjectType.assetType': function (assetType) {
        if (assetType && assetType.length !== 1 && assetType.includes('-1')) {
          this.organProjectType.assetType = ['-1']
        }
        this.queryTableData({})
        this.queryCategoryOptions()
      },

      assessmentMethod: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.assessmentMethod = ['-1']
        }
        this.queryTableData({})
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_register_record {
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
