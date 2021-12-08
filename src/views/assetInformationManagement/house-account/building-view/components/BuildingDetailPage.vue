<!--楼栋视图业务-楼栋视图详情页面-->
<template>
  <div class="building_detail">
    <!--<SG-Button icon="rollback" style="position: absolute; top: 10px; right: 30px; z-index: 999" @click="$router.back()">-->
      <!--返回-->
    <!--</SG-Button>-->
    <!--基本信息-->
    <base-info-part v-if="buildId" :buildId="buildId"/>
    <!--资产使用方向-->
    <asset-direct-part v-if="buildId" :buildId="buildId" :organId="organId" :organ-name="organName" />
    <!--其它信息-->
    <!-- 不知道干什么用的，也没调用接口 隐藏掉 -->
    <other-info-part v-if="buildId" :buildId="buildId" style="margin-bottom: 35px"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from './components/OtherInfoPart'
  import AssetDirectPart from './components/AssetDirectPart'
  export default {
    name: 'BuildingDetailPage',
    components: { AssetDirectPart, BaseInfoPart, OtherInfoPart },
    data () {
      return {
        organName:'',
        organId: '', // 组织机构id
        buildId: '' // 房间id
      }
    },

    methods: {},

    created () {
      const { organId, buildId, organName } = this.$route.query
      Object.assign(this, {
        organId, buildId, organName
      })
    }
  }
</script>

<style lang='less' scoped>
  .building_detail {
    position: relative;
    padding: 42px 70px 0;
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 40px;
    }
    & /deep/ .sg-FooterPagination {
      margin-left: 40px;
      width: calc(100% - 40px);
    }
  }
</style>
