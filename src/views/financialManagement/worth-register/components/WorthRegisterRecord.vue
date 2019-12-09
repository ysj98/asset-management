<!--价值登记业务页面Tab--价值登记记录组件-->
<template>
  <div class="asset_register_record">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <!--<SG-Button icon="export" @click="handleExport">导出</SG-Button>-->
      </div>
      <div slot="headerForm">
        <a-input placeholder="请输入资产名称或编码" @pressEnter="queryTableData" v-model.trim="assetNameCode" style="width: 171px"/>
        <a-select
          mode="multiple"
          :maxTagCount="2"
          v-model="approvalStatus"
          :options="statusOptions"
          @change="queryTableData"
          placeholder="请选择登记状态"
          style="width: 171px; margin: 0 10px"
        />
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="15">
            <organ-project-type v-model="organProjectType"/>
          </a-col>
          <a-col :span="5">
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
  import NoDataTip from 'src/components/noDataTips'
  import OrganProjectType from '../components/OrganProjectType'
  import DateMethodOrgan from '../components/DateMethodOrgan'
  import SearchContainer from 'src/views/common/SearchContainer'
  export default {
    name: 'WorthRegisterRecord',
    components: { SearchContainer, OrganProjectType, DateMethodOrgan, NoDataTip },
    data () {
      return {
        fold: true, // 查询条件折叠按钮
        assetNameCode: '', // 查询条件-登记名称
        categoryOptions: [], // 查询条件-资产分类选项
        assetCategoryId: undefined, // 查询条件-资产分类id
        organProjectType: {}, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
        dateMethodOrgan: {}, // { assessOrgan, assessDate, confirmDate, assessMethod }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        approvalStatus: undefined, // 查询条件-登记状态
        statusOptions: [
          { title: '全部', key: '-1' }, { title: '待审批', key: '2' },
          { title: '已驳回', key: '3' }, { title: '已审批', key: '4' }, { title: '已取消', key: '5' }
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
            { title: '资源原值(元)', dataIndex: 'originalValue' }, { title: '评估原值(元)', dataIndex: 'assetValuation' },
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
        const {
          assetNameCode, approvalStatus, assetCategoryId,
          organProjectType, organProjectType: { assetType },
          dateMethodOrgan, dateMethodOrgan: { assessmentMethod, assessmentOrgan}
        } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          ...organProjectType, ...dateMethodOrgan,
          pageSize: pageLength, pageNum: pageNo, assetNameCode,
          assetType: (!assetType || assetType.includes('-1')) ? undefined : assetType.join(','),
          assetCategoryId: (!assetCategoryId || assetCategoryId.includes('-1')) ? undefined : assetCategoryId.join(','),
          approvalStatus: (!approvalStatus || approvalStatus.includes('-1')) ? undefined : approvalStatus.join(','),
          assessmentOrgan: (!assessmentOrgan || assessmentOrgan.includes('-1')) ? undefined : assessmentOrgan.join(','),
          assessmentMethod: (!assessmentMethod || assessmentMethod.includes('-1')) ? undefined : assessmentMethod.join(',')
        }
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

      organProjectType: function (val) {
        val && val.organId && this.queryTableData({})
        this.queryCategoryOptions(val)
      },

      dateMethodOrgan: function () {
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
