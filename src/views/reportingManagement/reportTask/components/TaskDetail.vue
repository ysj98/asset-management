<!--呈报任务-任务详情页面-->
<template>
  <div class="task_detail">
    <!--任务信息-->
    <task-info-view :taskId="taskId" @transferData="transferData"/>
    <!--填报数据-->
    <task-table-view v-if="taskInfo.reportPlanId || taskInfo.reportBillId" :taskId="taskId" :taskInfo="taskInfo"/>
    <!--审批记录,后期开发-->
    <div v-if="stepList.length">
      <SG-Title title="审批记录"/>
      <SG-TrackStep :stepList="stepList" style="margin-left: 40px;"/>
    </div>
  </div>
</template>

<script>
  // import moment from 'moment'
  import TaskInfoView from './TaskInfoView'
  import TaskTableView from './TaskTableView'
  export default {
    name: 'TaskDetail',
    components: { TaskInfoView, TaskTableView },
    data () {
      return {
        taskId: '', // 任务Id
        stepList: [
          // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ], // 审批轨迹
        taskInfo: {
          result: '', // 填报结果
          resultRemark: '', // 填报说明
          reportPlanId: '', // 计划ID，用于填报数据列表查询
          reportBillId: '' // 表单Id,用于填报数据模板导出
        }
      }
    },

    methods: {
      // 传递填报说明及填报结果数据
      transferData (data) {
        this.taskInfo = data
      }
    },
    
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
