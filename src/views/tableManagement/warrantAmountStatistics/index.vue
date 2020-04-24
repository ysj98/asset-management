<!--报表管理-权证数量统计表页面-->
<template>
  <div class="warranty_amount">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="10">
        <SG-Button icon="import" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
      </a-col>
      <a-col :span="12">
        <organ-project v-model="organProjectValue" :isShowBuilding="false"/>
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10" bordered/>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
  export default {
    name: 'index',
    components: { OrganProject, NoDataTip },
    data () {
      return {
        exportBtnLoading: false, // 导出按钮loading
        organProjectValue: {}, // 查询条件-组织机构及项目值
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        tableObj: {
          pagination: false,
          rowKey: 'projectCode',
          loading: false,
          dataSource: [],
          columns: [
            { title: '资产项目名称', dataIndex: 'projectName' },
            { title: '资产项目编码', dataIndex: 'projectCode' },
            { title: '管理机构', dataIndex: 'organName' },
            { title: '产权证', children: [
              { title: '总数', dataIndex: 'totalNumber' },
              { title: '本企业', dataIndex: 'ownNumber' },
              { title: '其他企业', dataIndex: 'otherNumber' }
            ] },
            { title: '使用权证', children: [
              { title: '总数', dataIndex: 'usedTotalNumber' },
              { title: '本企业', dataIndex: 'ownUsedNumber' },
              { title: '其他企业', dataIndex: 'otherUsedNumber' }
              ] }
          ]
        },
      }
    },

    watch: {
      organProjectValue: {
        handler: function () {
          this.queryTableData({})
        },
        deep: true
      }
    },

    methods: {
      // 导出
      handleExport () {
        const {organProjectValue: {organId, projectId}} = this
        this.exportBtnLoading = true
        exportDataAsExcel({organId, projectId}, this.$api.tableManage.exportWarrantStatistics, '权证数量统计表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const {organProjectValue: {organId, projectId}} = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        this.$api.tableManage.queryWarrantStatistics({organId, projectId, pageSize: pageLength, pageNum: pageNo}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const {count, data} = res.data
            this.tableObj.dataSource = data || []
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .warranty_amount {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
  }
</style>
