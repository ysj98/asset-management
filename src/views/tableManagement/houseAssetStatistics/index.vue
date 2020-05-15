<!--报表管理-有证房屋资产统计表页面-->
<template>
  <div class="house_asset">
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
    <a-table v-bind="tableObj" class="custom-table td-pd10"/>
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
          scroll: { x: 2200 },
          columns: [
            { title: '资产项目名称', dataIndex: 'projectName', width: 150, fixed: 'left', customRender: (text) => {
              return {
                children: text,
                attrs: (text === '当前页-合计' || text === '所有页-合计') ? {colSpan: 3} : {}
              }
            } },
            { title: '资产项目编码', dataIndex: 'projectCode', width: 150, customRender: (text, row) => {
              return {
                children: text,
                attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
              }
            } },
            { title: '管理机构', dataIndex: 'organName', width: 180, customRender: (text, row) => {
              return {
                children: text,
                attrs: (row.projectName === '当前页-合计' || row.projectName === '所有页-合计') ? { colSpan: 0 } : {}
              }
            } },
            { title: '本单位有产权楼栋数量', dataIndex: 'ownBuildNumber', width: 180 },
            { title: '本单位有产权房屋数量', dataIndex: 'ownHouseNumber', width: 180 },
            { title: '本单位有使用权楼栋数量', dataIndex: 'ownUsedBuildNumber', width: 180 },
            { title: '本单位有使用权房屋数量', dataIndex: 'ownUsedHouseNumber', width: 180 },
            { title: '其他单位有产权楼栋数量', dataIndex: 'otherBuildNumber', width: 180 },
            { title: '其他单位有产权房屋数量', dataIndex: 'otherHouseNumber', width: 180 },
            { title: '其他单位有使用权楼栋数量', dataIndex: 'otherUsedBuildNumber', width: 180 },
            { title: '其他单位有使用权房屋数量', dataIndex: 'otherUsedHouseNumber', width: 180 },
          ]
        },
        dataSum: {} // 所有数据合计
      }
    },

    watch: {
      organProjectValue: function () {
        this.queryTableData({type: 'sum'})
      }
    },

    methods: {
      // 导出
      handleExport () {
        const {organProjectValue: {organId, projectId}} = this
        this.exportBtnLoading = true
        exportDataAsExcel({organId, projectIds: projectId || undefined}, this.$api.tableManage.exportWarrantHouse, '有证房屋资产统计表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {organProjectValue: {organId, projectId}, dataSum} = this
        if (!organId) { return this.$message.warn('请选择组织机构') }
        this.tableObj.loading = true
        let form = {organId, projectIds: projectId || undefined}
        let queryTablePromise = this.$api.tableManage.queryWarrantHouse({
          ...form, pageSize: pageLength, pageNum: pageNo
        }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const {count, data} = res.data
            if (!data || !data.length) {
              return this.tableObj.dataSource = []
            }
            let keys = [
              'ownBuildNumber',
              'ownHouseNumber',
              'ownUsedBuildNumber',
              'ownUsedHouseNumber',
              'otherBuildNumber',
              'otherHouseNumber',
              'otherUsedBuildNumber',
              'otherUsedHouseNumber'
            ]
            let sumInfo = {}
            let dataSource = data.map(m => {
              keys.forEach(key => {
                !sumInfo[key] && (sumInfo[key] = 0)
                sumInfo[key] += (m[key] ? Number(m[key]) : 0)
              })
              return m
            }).concat({...sumInfo, projectCode: Date.now() + Math.random(), projectName: '当前页-合计'})
            Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
            return this.tableObj.dataSource = (type === 'sum') ? dataSource : dataSource.concat(dataSum)
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
          return false
        })
        if (type === 'sum') {
          Promise.all([queryTablePromise, this.queryDataSum(form)]).then(([dataSource, dataSum]) => {
            dataSource && (this.tableObj.dataSource = dataSource.concat(dataSum))
          })
        }
      },

      // 查询当前条件下所有数据的合计信息
      queryDataSum (form) {
        let obj = {projectCode: Date.now() + Math.random(), projectName: '所有页-合计'}
        return this.$api.tableManage.queryHouseAssetSumInfo(form).then(r => {
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
  .house_asset {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      /*& /deep/ .ant-table {*/
        /*.ant-table-thead th, td {*/
          /*white-space: nowrap;*/
        /*}*/
      /*}*/
      & /deep/ .ant-table {
        tr:last-child, tr:nth-last-child(2) {
          font-weight: bold !important;
        }
      }
    }
  }
</style>
