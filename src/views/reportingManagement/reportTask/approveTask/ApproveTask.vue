<!--呈报任务-审核的任务--审核任务页面-->
<template>
  <div class="approve_task">
    <!--详情信息-->
    <task-detail />
    <!--审批意见，后期开发-->
    <div v-if="sp">
      <SG-Title title="审批意见" style="margin-left: 30px" />
      <div style="margin: 0 30px 25px 70px">
        <a-textarea placeholder="请输入审批意见" v-model="sp" :rows="4" style="resize: none" />
      </div>
    </div>
    <!--底部审批操作按钮组-->
    <form-footer location="fixed">
      <SG-Button type="primary" @click="handleBtnAction(true)" :loading="btnLoading" style="margin-right: 20px">审批通过</SG-Button>
      <SG-Button @click="handleBtnAction(false)" :loading="btnLoading"><span style="color: #e4393c">驳回</span></SG-Button>
    </form-footer>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter';
import TaskDetail from '../components/TaskDetail';
export default {
  name: 'ApproveTask',
  components: { TaskDetail, FormFooter },
  data() {
    return {
      sp: '', // 审批意见,
      taskId: '', // 任务Id
      btnLoading: false, // 按钮loading
    };
  },

  methods: {
    // 处理驳回、通过
    handleBtnAction(bool) {
      let form = {
        reportTaskId: this.taskId,
        auditResult: bool ? 'Y' : 'N',
      };
      // 二期开发
      // const { sp } = this
      // if (!bool && sp) {
      //   form.sp = sp
      //   form.auditResult='N'
      // } else if (!bool && !sp) {
      //   return this.$message.warn('请输入审批意见')
      // }
      this.btnLoading = true;
      this.$api.reportManage
        .auditTask(form)
        .then((r) => {
          this.btnLoading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            this.$message.success(`${bool ? '审批' : '驳回'}成功`);
            // 跳回列表路由
            return this.$router.push({ name: '呈报任务', params: { refresh: true } });
          }
          throw res.message;
        })
        .catch((err) => {
          this.btnLoading = false;
          this.$message.error(err || `${bool ? '审批' : '驳回'}失败`);
        });
    },
  },

  created() {
    const {
      query: { taskId },
    } = this.$route;
    this.taskId = taskId;
  },

  watch: {
    sp: function (val) {
      if (val && val.length > 200) {
        this.$message.warn('不能超过200字');
        this.sp = val.slice(0, 200);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
