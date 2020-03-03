<!--呈报任务-填报/详情页面-展示填报数据part-->
<template>
  <div class="table_view">
    <SG-Title title="填报数据"/>
    <div style="margin-left: 40px">
      <a-row>
        <a-col :span="8">
          <span style="margin-right: 12px; color: #282D5B">填报结果:</span>
          <a-radio-group :value="result" disabled>
            <a-radio value="1">填报</a-radio>
            <a-radio value="0">不填报</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="13">
          <span style="margin-right: 12px; color: #282D5B">填报说明:</span>
          <span style="color: #49505E">{{des || '--'}}</span>
        </a-col>
        <a-col :span="3" style="text-align: right">
          <SG-Button icon="export" :loading="exportBtnLoading" style="margin-left: 10px" @click="handleExport">导出</SG-Button>
        </a-col>
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
    data () {
      return {
        result: '1', // 填报结果
        des: '12月份资产呈报数据',
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 2000 },
          pagination: false,
          rowKey: 'relId',
          columns: [
            { title: '价值编号', dataIndex: 'relId', fixed: 'left', width: 120 },
            { title: '资产编码', dataIndex: 'assetCode', fixed: 'left', width: 180 },
            { title: '本次估值(元)', dataIndex: 'assessmentValue' }, { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' }, { title: '上浮比', dataIndex: 'upRate' },
            { title: '提交人', dataIndex: 'createByName' },
            { title: '状态', dataIndex: 'approvalStatusName', fixed: 'right', width: 120 }
          ]
        },
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 }
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
        const { assetNameCode } = this
        this.tableObj.loading = true
        let form = {
          pageSize: pageLength, pageNum: pageNo, assetNameCode
        }
        this.$api.worthRegister.queryRecordList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message || '查询填报数据出错'
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
