<!--价值登记业务页面Tab--价值登记记录组件-->
<template>
  <div class="asset_register_record">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="export" @click="handleExport">导出</SG-Button>
      </div>
      <div slot="headerForm">
        <a-input placeholder="请输入资产名称或编码" v-model="registerName" style="width: 171px"/>
        <a-select
          mode="multiple"
          :maxTagCount="2"
          v-model="registerStatus"
          :options="statusOptions"
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
              v-model="registerStatus"
              :options="statusOptions"
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
            <date-method-organ v-model="dateMethodOrgan"/>
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
        registerName: '', // 查询条件-登记名称
        organProjectType: {}, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
        dateMethodOrgan: {}, // { assessOrgan, assessDate, confirmDate, assessMethod }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        registerStatus: undefined, // 查询条件-登记状态
        statusOptions: [
          { title: '全部', key: '-1' }, { title: '待审批', key: '2' },
          { title: '已驳回', key: '3' }, { title: '已审批', key: '4' }, { title: '已取消', key: '5' }
        ], // 查询条件-状态选项
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: true },
          pagination: false,
          rowKey: 'relId',
          columns: [
            { title: '价值编号', dataIndex: 'relId' }, { title: '资产编号', dataIndex: 'assetCode' },
            { title: '资产名称', dataIndex: 'assetName' }, { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '所属机构', dataIndex: 'organName' }, { title: '资产项目', dataIndex: 'projectName' },
            { title: '资源原值(元)', dataIndex: 'originalValue' }, { title: '评估原值(元)', dataIndex: 'assetValuation' },
            { title: '市场值(元)', dataIndex: 'marketValue', align: 'right' },
            { title: '原值评估值基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '上次评估方法', dataIndex: 'lastAssessmentMethodName' },
            { title: '本次评估方法', dataIndex: 'assessmentMethodName' },
            { title: '本次估值(元)', key: 'assessmentValue' }, { title: '评估机构', key: 'assessmentOrganName' },
            { title: '评估基准日', key: 'assessmenBaseDate' }, { title: '上浮比', key: 'upRate' },
            { title: '提交人', key: 'createByName' },{ title: '状态', key: 'approvalStatusName' }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' }
      }
    },

    methods: {
      // 导出
      handleExport () {},

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {}
    },

    watch: {
      // 全选与其他选项互斥处理
      registerStatus: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.registerStatus = ['-1']
        }
      },

      // 全选与其他选项互斥处理
      // sourceTypeList: function (val) {
      //   if (val && val.length !== 1 && val.includes('allType')) {
      //     this.sourceTypeList = ['allType']
      //   }
      // },

      // 长度不能超过30字符
      registerName: function (val, pre) {
        if (val && val.length > 40) {
          this.$message.warn("登记名称不能超40个字符")
          this.registerName = pre
        }
      },

      organProjectType: function (val) {
        val && val.organId && this.queryTableData({})
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_register_record {
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table-thead th, .ant-table td {
      white-space: nowrap;
    }
    & /deep/ .ant-table-body {
      &::-webkit-scrollbar {
        height: 8px !important;
      }
    }
  }
</style>
