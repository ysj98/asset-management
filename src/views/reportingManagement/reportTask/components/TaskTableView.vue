<!--呈报任务-填报/详情页面-展示填报数据part-->
<template>
  <div class="table_view">
    <SG-Title title="填报数据"/>
    <div style="margin-left: 40px">
      <a-row>
        <a-col :span="8">
          <span style="margin-right: 12px; color: #282D5B">填报结果:</span>
          <a-radio-group :value="String(taskInfo.result)" disabled>
            <a-radio value="1">填报</a-radio>
            <a-radio value="0">不填报</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="13">
          <span style="margin-right: 12px; color: #282D5B">填报说明:</span>
          <span style="color: #49505E">{{taskInfo.resultRemark || '--'}}</span>
        </a-col>
        <!--二期开发-->
        <!--<a-col :span="3" style="text-align: right" v-if="tableObj.dataSource.length">-->
          <!--<SG-Button icon="export" :loading="exportBtnLoading" style="margin-left: 10px" @click="handleExport">导出</SG-Button>-->
        <!--</a-col>-->
      </a-row>
      <!--列表部分-->
      <a-table v-bind="tableObj" class="custom-table td-pd10"/>
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px; color: rgba(0, 0, 0, 0.45)">暂无数据</div>
      <SG-FooterPagination
        v-bind="paginationObj"
        v-if="tableObj.dataSource.length"
        @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskTableView',
    props: ['taskId', 'taskInfo'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: true },
          pagination: false,
          columns: []
        },
        optionsObj: {}, // 下拉选的集合
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 }
      }
    },

    mounted () {
      this.queryColumns()
    },

    methods: {
      // 导出
      handleExport () {
        return this.$message.info('暂不支持')
      },

      // 查询表单字段,作为Table columns
      queryColumns () {
        this.tableObj.loading = true
        const {reportPlanId} = this.taskInfo
        if (!reportPlanId) { return false }
        this.$api.reportManage.queryReportBillColumn({reportPlanId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let optionsObj = {}
            this.tableObj.columns = (res.data || []).map((m, i) => {
              const { columnDesc, columnName, optVal, columnType } = m
              if (columnType === 4) {
                optionsObj[columnName] = (optVal || '').split(',').map(item => {
                  let t = item.split('-')
                  return { key: t[0], title: t[1] }
                })
              }
              let item = { title: columnDesc, dataIndex: columnName }
              return i === 1 ? { ...item, fixed: 'left', width: 120 } : item
            })
            this.optionsObj = optionsObj
            return this.queryTableData({})
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询表单数据出错')
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const { taskId, optionsObj } = this
        let form = { reportTaskId: taskId, pageSize: pageLength, pageNum: pageNo }
        this.tableObj.loading = true
        this.$api.reportManage.queryTaskDetailPage(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            const len = Object.keys(optionsObj).length
            this.tableObj.dataSource = (data || []).map((m, i) => {
              // 存在下拉选时
              if (len) {
                let list = Object.keys(optionsObj)
                list.forEach(v => {
                  m[v] = optionsObj[v].filter(f => f.key === m[v])[0]['title']
                })
              }
              return {...m, key: i}
            })
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询填报数据出错')
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .table_view {
    .custom-table {
      margin-top: 15px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
