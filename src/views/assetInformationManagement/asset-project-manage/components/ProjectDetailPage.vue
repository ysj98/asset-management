<!--资产项目管理业务-资产项目管理详情页面-->
<template>
  <div class="asset_project_detail" v-if="projectId">
    <!--基础信息部分-->
    <base-info-part :projectId="projectId"/>
    <!--接收记录部分-->
    <receive-record-part :projectId="projectId"/>
    <!--资产概况、权属概况、审批轨迹及转运营物业部分-->
    <other-info-part :projectId="projectId"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import ReceiveRecordPart from './components/ReceiveRecordPart'
  import OtherInfoPart from './components/OtherInfoPart'
  export default {
    name: 'ProjectDetailPage',
    components: { OtherInfoPart, ReceiveRecordPart, BaseInfoPart },
    data () {
     return {
       projectId: '' // 资产项目Id
     }
    },
    
    methods: {
      // 获取资产项目详情
    },

    created () {
      // 获取projectId
      const { projectId } = this.$route.query
      projectId && (this.projectId = projectId)
    }
  }
</script>

<style lang='less' scoped>
  .asset_project_detail {
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 40px;
      /*margin-top: 20px;*/
    }
  }
</style>
