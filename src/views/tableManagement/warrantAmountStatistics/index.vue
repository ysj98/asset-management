<!--报表管理-权证数量统计表页面-->
<template>
  <div class="warranty_amount">
    <!--查询调件-->
    <a-row :gutter="8" style="width: 100%; padding: 20px 20px 20px 30px">
      <a-col :span="10">
        <SG-Button icon="import" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
      </a-col>
      <a-col :span="12">
        <organ-project v-model="organProjectValue" :isShowBuilding="false" mode="multiple"/>
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData({type: 'sum'})">查询</SG-Button>
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
            { title: '资产项目名称', dataIndex: 'projectName', customRender: (text) => {
              return {
                children: text,
                attrs: (text === '当前页-合计' || text === '所有页-合计') ? { colSpan: 3 } : {}
              }
            } },
            { title: '资产项目编码', dataIndex: 'projectCode', customRender: (text, row) => {
                return {
                  children: text,
                  attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
                }
            } },
            { title: '管理机构', dataIndex: 'organName', customRender: (text, row) => {
                return {
                  children: text,
                  attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
                }
            } },
            { title: '产权证', children: [
              { title: '总数', dataIndex: 'totalNumber' },
              { title: '本单位', dataIndex: 'ownNumber' },
              { title: '其他单位', dataIndex: 'otherNumber' }
            ] },
            { title: '使用权证', children: [
              { title: '总数', dataIndex: 'usedTotalNumber' },
              { title: '本单位', dataIndex: 'ownUsedNumber' },
              { title: '其他单位', dataIndex: 'otherUsedNumber' }
              ] }
          ]
        },
        dataSum: {} // 所有数据合计
      }
    },

    watch: {
      organProjectValue: {
        handler: function () {
          this.queryTableData({type: 'sum'})
        },
        deep: true
      }
    },

    methods: {
      // 导出
      handleExport () {
        const {organProjectValue: {organId, projectId}} = this
        this.exportBtnLoading = true
        exportDataAsExcel({organId, projectIds: projectId || undefined}, this.$api.tableManage.exportWarrantStatistics, '权证数量统计表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {organProjectValue: {organId, projectId}, dataSum} = this
        if (!organId) { return this.$message.warn('请选择组织机构') }
        this.tableObj.loading = true
        let form = {organId, projectIds: projectId || undefined}
        let queryTablePromise = this.$api.tableManage.queryWarrantStatistics({
          ...form, pageSize: pageLength, pageNum: pageNo
        }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const {count, data} = res.data
            if (!data || !data.length) {
              this.tableObj.dataSource = []
              return false
            }
            let keys = ['totalNumber', 'ownNumber', 'otherNumber', 'usedTotalNumber', 'ownUsedNumber', 'otherUsedNumber']
            let sumInfo = {}
            let dataSource = data.map(m => {
              keys.forEach(key => {
                !sumInfo[key] && (sumInfo[key] = 0)
                sumInfo[key] += (m[key] ? Number(m[key]) : 0)
              })
              return m
            }).concat({...sumInfo, projectCode: Date.now() + Math.random(), projectName: '当前页-合计'})
            Object.assign(this.paginationObj, { totalCount: count, pageNo, pageLength })
            return this.tableObj.dataSource = (type === 'sum') ? dataSource : dataSource.concat(dataSum)
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
          return false
        })
        if (type === 'sum') {
          Promise.all([queryTablePromise, this.queryDataSum(form)]).then(([dataSource, dataSumInfo]) => {
            dataSource && (this.tableObj.dataSource = dataSource.concat(dataSumInfo))
          })
        }
      },
      
      // 查询当前条件下所有数据的合计信息
      queryDataSum (form) {
        let obj = {projectCode: Date.now() + Math.random(), projectName: '所有页-合计'}
        return this.$api.tableManage.queryWarrantSumInfo(form).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.dataSum = { ...res.data, ...obj }
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询所有页合计出错')
          return this.dataSum = obj
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
          text-align: center;
        }
        td {
          text-align: center;
        }
        tr:last-child, tr:nth-last-child(2) {
          font-weight: bold !important;
        }
      }
    }
  }
</style>