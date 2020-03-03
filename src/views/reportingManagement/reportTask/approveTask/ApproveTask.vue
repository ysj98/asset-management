<!--呈报任务-审核的任务--审核任务页面-->
<template>
  <div class="approve_task">
    <!--详情信息-->
    <task-detail/>
    <!--审批意见-->
    <SG-Title title="审批意见" style="margin-left: 30px"/>
    <div style="margin: 0 30px 25px 70px">
      <a-textarea placeholder="请输入审批意见" v-model="sp" :rows="4" style="resize: none"/>
    </div>
    <div style="border-top: 1px solid #d9d9d9; text-align: center; padding: 20px">
      <SG-Button type="primary" @click="handleBtnAction(true)" style="margin-right: 20px">审批通过</SG-Button>
      <SG-Button @click="handleBtnAction(false)"><span style="color: #e4393c">驳回</span></SG-Button>
    </div>
  </div>
</template>

<script>
  import TaskDetail from '../components/TaskDetail'
  export default {
    name: 'ApproveTask',
    components: { TaskDetail },
    data () {
      return {
        sp: '' // 审批意见
      }
    },

    methods: {
      // 处理驳回、通过
      handleBtnAction (bool) {
        // const { sp } = this
        // if (bool || sp) {
        //   debugger
        // } else {
        //   this.$message.warn('请输入审批意见')
        // }
      }
    },

    watch: {
      sp: function (val) {
        if (val && val.length > 200) {
          this.$message.warn('不能超过200字')
          this.sp = val.slice(0, 200)
        }
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
