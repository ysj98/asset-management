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
    </a-table>
    <no-data-tips class="noTipStyle" v-show="table.dataSource.length === 0"></no-data-tips>
    <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
  </div>
</template>
<script>
 import noDataTips from '@/components/noDataTips'
let columns = [
  {
    title: "编号",
    dataIndex: "order",
    width: "7%"
  },
  {
    title: "任务编号",
    dataIndex: "taskName",
    width: "15%"
  },
  {
    title: "任务名称",
    dataIndex: "checkRange",
    width: "20%"
  },
  {
    title: "负责人",
    dataIndex: "chargePersonList",
    width: "30%"
  },
  {
    title: "计划执行时间",
    dataIndex: "deadline",
    width: "20%"
  },
  {
    title: "实际执行时间",
    dataIndex: "deadlinee",
    width: "20%"
  },
  {
    title: "任务状态",
    dataIndex: "operation",
    width: "8%"
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
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    }
  },
  methods: {
    query () {},
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