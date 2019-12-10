<!--价值登记页面--资产价值登记详情页面--审批轨迹及审批意见组件-->
<template>
  <div class="approval_style">
    <!--审批轨迹-->
    <SG-Title title="审批轨迹"/>
    <div style="margin-left: 40px">
      <SG-TrackStep v-if="stepList.length" :stepList="stepList" class="title_div"/>
      <div v-else style="text-align: center">暂无数据</div>
    </div>
    <!--审批意见-->
    <div v-if="type == 'approval'">
      <SG-Title title="审批意见"/>
      <div style="margin-left: 40px">
        <span style="float: left">审核意见：</span>
        <div style="margin-left: 60px">
          <a-textarea v-model="advice" placeholder="请输入审批意见" :rows="4"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ApprovalFlowPart',
    props: ['type'],
    data () {
      return {
        advice: '', // 审批意见
        stepList: [
          // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ] // 审批轨迹
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .approval_style {}
</style>
