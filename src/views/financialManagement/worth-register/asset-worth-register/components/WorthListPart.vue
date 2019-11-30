<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产价值清单"/>
    <div style="margin-bottom: 16px; overflow: hidden">
      <div style="float: right">
        <SG-Button icon="import" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >批量导入</SG-Button>
        <SG-Button icon="export" style="margin: 0 10px" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >批量导出</SG-Button>
        <SG-Button icon="delete" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >删除</SG-Button>
      </div>
    </div>
    <a-table
      v-bind="tableObj"
      :rowSelection="rowSelection"
      class="custom-table td-pd10 table-border"
    />
    <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
    <!-- 选择资产 -->
    <AssetBundlePopover ref="assetModal" :organId="organId" queryType="2"></AssetBundlePopover>
  </div>
</template>

<script>
  import AssetBundlePopover from 'src/views/common/assetBundlePopover'
  export default {
    name: 'WorthListPart',
    components: { AssetBundlePopover },
    data () {
      return {
        organId: '',
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          rowKey: 'projectId',
          scroll: { x: true },
          columns: [
            { title: '编号', dataIndex: 'assetObjectId' },
            { title: '资产名称', dataIndex: 'assetName' },
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
            { title: '本次估值(元)', dataIndex: 'assessmentValue' },
            { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '上浮比', dataIndex: 'upRate' },
          ]
        },
        selectedRowKeys: [], // Table选中的值
        exportBtnLoading: false, // 导出按钮loading
      }
    },

    methods: {
      // 导出
      handleExport () {
        this.$refs.assetModal.show = true
      },
      
      // 选中
      selectChange () {}
    },

    computed: {
      // Table rowSelection
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              // disabled: record.name === 'Disabled User', // Column configuration not to be checked
              // name: record.name,
              style: {
                display: record.assetName === '合计' ? 'none' : 'block'
              }
            }
          })
        }
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
