<!--
 * @Date: 2019-12-25 14:54:33
 * @Description: 执行记录 table
 -->
<template>
  <div class="table-layout-fixed detail-table">
    <a-table
      class="custom-table td-pd10"
      :loading="table.loading"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
    >
    <template slot="taskId" slot-scope="text, record">
           <span class="nav_name" @click="goToTask(record)">{{text}}</span>
        </template>
    </a-table>
    <no-data-tips class="noTipStyle" v-show="table.dataSource.length === 0"></no-data-tips>
    <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        :noPageTools="true"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
  </div>
</template>
<script>
 import noDataTips from '@/components/noDataTips'
 let getUuid = ((uuid = 1) => () => ++uuid)()
let columns = [
  {
    title: "编号",
    dataIndex: "order",
    width: "7%"
  },
  {
    title: "任务编号",
    dataIndex: "taskId",
    width: "15%",
    scopedSlots: { customRender: "taskId" },
  },
  {
    title: "任务名称",
    dataIndex: "taskName",
    width: "20%"
  },
  {
    title: "负责人",
    dataIndex: "chargePersonNameList",
    width: "25%"
  },
  {
    title: "计划执行时间",
    dataIndex: "beginDateendDate",
    width: "20%"
  },
  {
    title: "实际执行时间",
    dataIndex: "realBeginDaterealEndDate",
    width: "20%"
  },
  {
    title: "任务状态",
    dataIndex: "taskStatusName",
    width: "13%"
  }
]
let queryCondition = {
  pageSize: 10,
  pageNum: 1
}
export default {
  components: {
    noDataTips
  },
  data () {
    return {
      queryCondition: {...queryCondition},
      planId: '',
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    }
  },
  created () {
    this.planId = this.$route.query.planId || ''
    this.query()
  },
  methods: {
   query () {
      let data = {
        ...queryCondition,
        planId: this.planId
      }
      return this.$api.building.getImplementRecord(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.data || []
          this.table.dataSource = result.map((item, i) => {
            if (item.beginDate && item.endDate) {
              item.beginDateendDate = item.beginDate + '至' + item.endDate
            } else {
              item.beginDateendDate = '--'
            }
            item.realBeginDate = item.realBeginDate || '--'
            item.realEndDate = item.realEndDate ? ('至' + item.realEndDate) : ''
            if (item.realBeginDate && !item.realEndDate) {
              item.realEndDate = '至--'
            }
            item.realBeginDaterealEndDate = item.realBeginDate + item.realEndDate
            item.chargePersonNameList = item.chargePersonList.map(v => v.userName).join(',')
            return {...item, key: getUuid(), order: i + 1}
          })
          this.table.totalCount = res.data.data.count
        }
      })
    },
    goToTask (record) {
      let o = {taskId: record.taskId, detail: true}
      this.$router.push({ path: '/inventoryManagement/countingTask/detail', query: {quersData: JSON.stringify([o])}});
    },
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
  }
}
</script>
<style lang="less" scoped>
  .detail-table {
  position: relative;
  padding-bottom: 50px;
  border: 1px solid rgba(238, 242, 245, 1);
  border-top: none;
}
.noTipStyle{
    padding: 10px 0;
   }
</style>