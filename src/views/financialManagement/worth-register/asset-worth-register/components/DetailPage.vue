<!--价值登记页面--资产价值登记详情页面-->
<template>
  <div class="detail_page">
    <!--基础信息-->
    <base-info-part/>
    <!--资产价值清单-->
    <worth-list-part/>
    <!--审批轨迹及审批意见-->
    <approval-flow-part/>
  </div>
</template>

<script>
  import BaseInfoPart from './BaseInfoPart'
  import WorthListPart from './WorthListPart'
  import ApprovalFlowPart from './ApprovalFlowPart'
  export default {
    name: 'DetailPage',
    components: { ApprovalFlowPart, WorthListPart, BaseInfoPart },
    data () {
      return {}
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .detail_page {
    padding-left: 70px;
  }
</style>
