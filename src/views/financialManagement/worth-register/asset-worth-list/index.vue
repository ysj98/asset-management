<!--价值登记页面--资产价值一览表Tab页面-->
<template>
  <div class="asset_worth_list">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <!--<SG-Button icon="export" @click="handleExport">导出</SG-Button>-->
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="21">
            <organ-project-type v-model="organProjectType"/>
          </a-col>
          <a-col :span="3" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row :gutter="8" style="margin-top: 14px">
          <a-col :span="7">
            <a-select
              mode="multiple"
              :maxTagCount="2"
              style="width: 100%"
              @change="queryTableData"
              v-model="assetCategoryId"
              :options="categoryOptions"
              placeholder="请选择资产分类"
            />
          </a-col>
          <a-col :span="7">
            <a-input placeholder="请输入资产名称或编码" @pressEnter="queryTableData" v-model.trim="assetNameCode"/>
          </a-col>
          <a-col :span="7">
            <a-date-picker @change="changeDate" style="width: 100%" placeholder="请选择评估基准日期"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <template slot="action" slot-scope="text, record">
        <span v-if="record.projectName !== '合计：'" class="action_text" @click="viewTrendAction(true, record)">趋势图</span>
      </template>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--查看趋势图-->
    <SG-Modal title="资产估值趋势图" :footer="null" v-model="isShowTrend" @cancel="viewTrendAction(false)">
      <trend-chart-part :key="assetId" :assetId="assetId" :originalValue="originalValue"/>
    </SG-Modal>
  </div>
</template>

<script>
  import TrendChartPart from './component/TrendChartPart'
  import NoDataTip from 'src/components/noDataTips'
  import OrganProjectType from '../components/OrganProjectType'
  import SearchContainer from 'src/views/common/SearchContainer'
  export default {
    name: 'index',
    components: { SearchContainer, OrganProjectType, NoDataTip, TrendChartPart },
    data () {
      return {
        assetId: '', // 资产ID
        fold: true, // 查询条件折叠按钮
        isShowTrend: false, // 显示趋势图Modal
        assetNameCode: '', // 查询条件-登记名称
        assessmenBaseDate: null, // 查询条件-日期
        originalValue: 0, // 资产原值,趋势图中展示
        categoryOptions: [], // 查询条件-资产分类选项
        assetCategoryId: undefined, // 查询条件-资产分类id
        organProjectType: {}, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 2000 },
          pagination: false,
          rowKey: 'assetId',
          columns: [
            { title: '资产编号', dataIndex: 'assetCode', fixed: 'left', width: 180 },
            { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: 200 },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产分类', dataIndex: 'assetCategoryName' },
            { title: '所属机构', dataIndex: 'organName' },
            { title: '资产项目', dataIndex: 'projectName' },
            { title: '资源原值(元)', dataIndex: 'originalValue' },
            { title: '评估原值(元)', dataIndex: 'assetValuation' },
            { title: '市场值(元)', dataIndex: 'marketValue' },
            { title: '原值评估值基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '最新估值(元)', dataIndex: 'assessmentValue' },
            { title: '评估方法', dataIndex: 'assessmentMethodName' },
            { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '操作', dataIndex: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 120 }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' }
      }
    },

    methods: {
      // 导出
      handleExport () {
        return this.$message.info('暂不支持')
        // if (!this.tableObj.dataSource.length) {
        //   return this.$message.info('无可导出数据')
        // }
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const { assetNameCode, assetCategoryId, organProjectType, organProjectType: { assetType }, assessmenBaseDate } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          assetNameCode, pageSize: pageLength, pageNum: pageNo, assessmenBaseDate, ...organProjectType,
          assetType: (!assetType || assetType.includes('-1')) ? undefined : assetType.join(','),
          assetCategoryId: (!assetCategoryId || assetCategoryId.includes('-1')) ? undefined : assetCategoryId.join(','),
        }
        this.$api.worthRegister.queryAssetValuePageList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,  pageNo, pageLength
            })
            return this.querySumInfo(form)
          }
          throw res.message || '资产价值一览表接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '资产价值一览表接口出错')
        })
      },

      // 处理登记日期
      changeDate (date, dateString) {
        this.assessmenBaseDate = dateString
        this.queryTableData({})
      },

      // 查看趋势图
      viewTrendAction (bool, record) {
        this.isShowTrend = bool
        if (bool) {
          this.assetId = record.assetId
          this.originalValue = record.originalValue
        }
      },
      
      // 查询Table汇总
      querySumInfo (form) {
        const { tableObj: { dataSource } } = this
        this.$api.worthRegister.queryPageListSum(form).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            this.tableObj.dataSource = dataSource.length ? dataSource.concat({
              assetId: '-1111', projectName: '合计：', ...(res.data || {})
            }) : []
            return false
          }
          throw res.message || '查询汇总接口出错'
        }).catch(err => {
          this.$message.error(err || '查询汇总接口出错')
        })
      },

      // 根据资产类型查资产分类列表
      queryCategoryOptions (organProjectType) {
        this.objectType = undefined
        this.categoryOptions = []
        const { organId, assetType } = organProjectType
        if (!organId || !assetType || !assetType.length) { return false }
        let assetVal = assetType.includes('-1') ? '' : assetType.join(',')
        this.$api.assets.getList({ assetType: assetVal, organId }).then(res => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data
            let list = data.map( m => ({
              title: m.professionName,
              key: m.professionCode
            }))
            list.unshift({ title: '全部资产', key: '-1' })
            this.categoryOptions = list
            return false
          }
          throw res.message || '查询资产分类失败'
        }).catch(err => {
          this.$message.error(err || '查询资产分类失败')
        })
      }
    },

    watch: {
      // 全选与其他选项互斥处理
      assetCategoryId: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.assetCategoryId = ['-1']
        }
      },

      // 长度不能超过30字符
      assetNameCode: function (val, pre) {
        if (val && val.length > 40) {
          this.$message.warn("登记名称不能超40个字符")
          this.assetNameCode = pre
        }
      },

      organProjectType: function (val) {
        val && val.organId && this.queryTableData({})
        this.queryCategoryOptions(val)
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_worth_list {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
    .action_text {
      color: #0084FF;
      cursor: pointer;
      margin-right: 12px;
      white-space: nowrap;
    }
  }
</style>
