<!--价值登记页面--资产价值登记详情页面--审批轨迹及审批意见组件-->
<template>
  <div class="approval_style">
    <!--审批轨迹-->
    <SG-Title title="审批轨迹" />
    <div style="margin-left: 40px">
      <SG-TrackStep v-stepstyleplus v-if="stepList.length" :stepList="stepList" class="title_div" />
      <div v-else style="text-align: center">暂无数据</div>
    </div>
    <!--审批意见-->
    <div v-if="type == 'approval' && !fromBpmApprove">
      <SG-Title title="审批意见" />
      <div style="margin-left: 40px">
        <span style="float: left">审核意见：</span>
        <div style="margin-left: 60px">
          <a-textarea :value="advice" @change="onChange" placeholder="请输入审批意见" :rows="4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApprovalFlowPart',
  props: ['type', 'advice', 'stepList', 'fromBpmApprove'],
  data() {
    return {};
  },

  methods: {
    onChange(event) {
      console.log('value', event.target.value);
      this.$emit('update:advice', event.target.value);
    },
  },
};
</script>

<style lang="less" scoped>
.approval_style {
}
</style>
