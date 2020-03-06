<!--呈报任务-我填报的任务--填报、重填任务页面-->
<template>
  <div class="edit_task">
    <!--任务信息-->
    <task-info-view :taskId="taskId" @transferData="transferData"/>
    <!--填报数据部分-->
    <task-table-edit v-if="taskInfo.reportBillId" :taskId="taskId" type="edit" :taskInfo="taskInfo"/>
  </div>
</template>

<script>
  import TaskInfoView from '../components/TaskInfoView'
  import TaskTableEdit from '../components/TaskTableEdit'
  export default {
    name: 'EditTask',
    components: {TaskTableEdit, TaskInfoView},
    data () {
      return {
        taskId: '', // 任务Id
        taskInfo: {
          result: '', // 填报结果
          resultRemark: '', // 填报说明
          reportPlanId: '', // 计划ID，用于填报数据列表查询
          reportBillId: '', // 表单Id,用于填报数据模板导出
          projectId: '', // 项目Id,用于填报数据中资产名或资产卡片查询
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
  .edit_task {
    padding: 0 40px;
  }
</style>
