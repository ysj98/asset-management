<!--呈报任务-我填报的任务--填报、重填任务页面-->
<template>
  <div class="edit_task">
    <!--任务信息-->
    <task-info-view ref="taskInfo" :taskId="taskId" @transferData="transferData"/>
    <!--填报数据部分-->
    <task-table-edit ref="taskTable" v-if="taskInfo.reportBillId" :taskId="taskId" type="edit" :taskInfo="taskInfo"/>
    <!--底部审批操作按钮组-->
    <form-footer location="fixed">
      <SG-Button @click="handleSubmit('draft')" :loading="submitBtnLoading" style="margin-right: 8px">暂存草稿</SG-Button>
      <SG-Button type="primary" @click="handleSubmit('')" :loading="submitBtnLoading">提交审批</SG-Button>
    </form-footer>
  </div>
</template>

<script>
  import FormFooter from '@/components/FormFooter.vue'
  import TaskInfoView from '../components/TaskInfoView'
  import TaskTableEdit from '../components/TaskTableEdit'
  export default {
    name: 'EditTask',
    components: { TaskTableEdit, TaskInfoView, FormFooter },
    data () {
      return {
        taskId: '', // 任务Id
        action: '', // 填报 tb 与重新填报 cxtb 类型
        submitBtnLoading: false, // 提交按钮loading
        taskInfo: {
          result: '', // 填报结果
          resultRemark: '', // 填报说明
          reportPlanId: '', // 计划ID，用于填报数据列表查询
          reportBillId: '', // 表单Id,用于填报数据模板导出
          organId: '', // 用于填报数据中资产名或资产卡片查询
          projectId: '', // 项目Id,用于填报数据中资产名或资产卡片查询
        }
      }
    },

    methods: {
      // 传递填报说明及填报结果数据
      transferData (data) {
        this.taskInfo = data
      },

      // 提交
      handleSubmit (type) {
        // 获取填报数据
        new Promise(resolve => {
          this.$refs['taskTable'].handleSubmit(resolve)
        }).then(data => {
          const { taskInfo, taskId, action } = this
          // 获取任务信息数据
          let { detailData: { attachmentList, ...others } } = this.$refs['taskInfo']
          const { result, resultRemark, detailList } = data
          let form = {
            action,
            reportTaskId: taskId,
            isSubmit: type ? 'Y' : 'N',
            attachment: attachmentList, detailList,
            reportTask: { result, resultRemark, ...taskInfo, ...others }
          }
          this.submitBtnLoading = true
          this.$api.reportManage.saveTaskOrDetail(form).then(r => {
            this.submitBtnLoading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              this.$message.success(`${type ? '暂存草稿' : '提交审批'}成功`)
              // 跳回列表路由
              return this.$router.push({ name: '呈报任务', params: { refresh: true } })
            }
            throw res.message
          }).catch(err => {
            this.submitBtnLoading = false
            this.$message.error(err || `${type ? '暂存草稿' : '提交审批'}失败`)
          })
        })
      }
    },

    created () {
      const { query: { taskId, action } } = this.$route
      this.taskId = taskId
      this.action = action
    }
  }
</script>

<style lang='less' scoped>
  .edit_task {
    padding: 0 40px;
    margin-bottom: 80px;
  }
</style>
