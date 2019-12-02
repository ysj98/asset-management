<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产价值清单"/>
    <div style="margin-bottom: 16px; overflow: hidden">
      <div style="float: right">
        <span v-if="type == 'add' || type == 'edit'">
          <SG-Button icon="plus" type="primary" ghost @click="handleAdd" style="margin-right: 10px">添加资产</SG-Button>
          <SG-Button icon="import" type="primary" ghost @click="handleExport" :loading="exportBtnLoading">批量导入</SG-Button>
          <SG-Button icon="delete" type="primary" ghost @click="handleDelete" style="margin: 0 10px">删除</SG-Button>
        </span>
        <SG-Button icon="export" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >导出</SG-Button>
      </div>
      <div style="line-height: 32px">
        <span>{{`${type == 'add' || type == 'edit' ? "已选" : ""}资产总数:`}}</span>
        <span style="font-weight: bold">{{selectedRowKeys.length}}</span>
      </div>
    </div>
    <a-table
      v-bind="tableObj"
      class="custom-table td-pd10 table-border"
    >
      <template slot="assessmentValue" slot-scope="text, record">
        <a-input v-if="(type == 'add' || type == 'edit') && record.assetObjectId !== '合计'" v-model="record.assessmentValue" style="width: 120px"/>
        <span v-else>{{text}}</span>
      </template>
    </a-table>
    <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
    <!-- 选择资产 -->
    <AssetBundlePopover ref="assetModal" v-if="type == 'add' || type == 'edit'" :organId="organId" queryType="2"/>
  </div>
</template>

<script>
  import AssetBundlePopover from 'src/views/common/assetBundlePopover'
  export default {
    name: 'WorthListPart',
    components: { AssetBundlePopover },
    props: ['type', 'initAssetList'],
    data () {
      return {
        organId: '',
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          rowKey: 'assetObjectId',
          scroll: { x: true },
          columns: [
            { title: '编号', dataIndex: 'assetObjectId', fixed: true },
            { title: '资产名称', dataIndex: 'assetName', fixed: true },
            { title: '资产编码', dataIndex: 'assetCode' },
            { title: '所属机构', dataIndex: 'organName' },
            { title: '所属资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产分类', dataIndex: 'assetObjectTypeName' },
            { title: '资源原值(元)', dataIndex: 'originalValue' },
            { title: '评估原值(元)', dataIndex: 'assetValuation' },
            { title: '原值评估基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '上次评估方法', dataIndex: 'lastAssessmentMethodName' },
            { title: '上次评估值', dataIndex: 'lastAssessmentValue' },
            { title: '本次评估方法', dataIndex: 'assessmentMethodName' },
            { title: '本次估值(元)', dataIndex: 'assessmentValue', scopedSlots: { customRender: 'assessmentValue' } },
            { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '上浮比', dataIndex: 'upRate' },
          ]
        },
        // selectedRows: [], // Table选中的行数据
        selectedRowKeys: [], // Table选中的key数据
        exportBtnLoading: false // 导出按钮loading
      }
    },

    methods: {
      // 计算最后一行求和数据
      calcSum (data) {
        // let sum = data.reduce((accumulator, currentValue) => {
        //   return accumulator + Number(currentValue.totalArea || 0)
        // }, 0)
        this.tableObj.dataSource = data
      },

      // 批量删除资产
      handleDelete () {
        const {selectedRowKeys, tableObj: {dataSource}} = this
        let data = dataSource.filter(m => m.assetObjectId !== '合计' && !selectedRowKeys.includes(m.assetObjectId))
        this.calcSum(data)
      },

      // 添加资产
      handleAdd () {
        this.$refs.assetModal.show = true
      },
      
      // 导出
      handleExport () {},

      // Table rowSelection
      rowSelection() {
        return {
          selections: true,
          onChange: (selectedRowKeys, selectedRows) => {
            // this.selectedRows = selectedRows
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => {
            return {
              style: {
                display: record.assetObjectId === '合计' ? 'none' : 'block',
              }
            }
          }
        }
      }
    },
    
    created () {
      const { type } = this
      if (type === 'add' || type === 'edit') {
        // 允许多选
        this.tableObj.rowSelection = this.rowSelection()
      }
      // this.tableObj.dataSource = this.initAssetList
      this.tableObj.dataSource = [
        {assetObjectId: 10, assetName: '老王', assessmentValue: 11},
        {assetObjectId: 15, assetName: '老王', assessmentValue: 1},
        {assetObjectId: 111, assetName: '老王', assessmentValue: 51},
        {assetObjectId: 120, assetName: '老王', assessmentValue: 0},
        {assetObjectId: 1119, assetName: '老王', assessmentValue: 121},
        {assetObjectId: '合计', assetName: '--', originalValue: 123456}
      ]
    },
    
    watch: {
      'tableObj.dataSource': {
        handler: function () {
          debugger
        },
        deep: true
      }
    }
  }
</script>

<style lang='less' scoped>
  .worth_list {
    .custom-table {
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
  }
</style>
