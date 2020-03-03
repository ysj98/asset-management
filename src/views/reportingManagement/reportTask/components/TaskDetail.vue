<!--呈报任务-任务详情页面-->
<template>
  <div class="task_detail">
    <!--任务信息-->
    <task-info-view/>
    <!--填报数据-->
    <task-table-view/>
    <!--审批记录-->
    <SG-Title title="审批记录"/>
    <SG-TrackStep v-if="stepList.length" :stepList="stepList" style="margin-left: 40px;"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import TaskInfoView from './TaskInfoView'
  import TaskTableView from './TaskTableView'
  export default {
    name: 'TaskDetail',
    components: { TaskInfoView, TaskTableView },
    data () {
      return {
        stepList: [
          { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ] // 审批轨迹
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .task_detail {
    padding: 0 30px 0;
  }
</style>
