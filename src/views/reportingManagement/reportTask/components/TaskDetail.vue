<!--呈报任务-任务详情页面-->
<template>
  <div class="task_detail">
    <!--任务信息-->
    <task-info-view :taskId="taskId"/>
    <!--填报数据-->
    <task-table-view :taskId="taskId"/>
    <!--审批记录-->
    <SG-Title title="审批记录"/>
    <SG-TrackStep :stepList="stepList" style="margin-left: 40px;"/>
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
        taskId: '', // 任务Id
        stepList: [
          { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ] // 审批轨迹
      }
    },

    methods: {},
    
    created () {
      const { query: { taskId } } = this.$route
      this.taskId = taskId
    }
  }
</script>

<style lang='less' scoped>
  .task_detail {
    padding: 0 30px 0;
  }
</style>
