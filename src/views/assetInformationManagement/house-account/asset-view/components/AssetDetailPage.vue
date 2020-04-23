
<!--资产视图业务-资产视图详情页面-->
<template>
  <div class="asset_view">
    <!--<SG-Button icon="rollback" style="position: absolute; top: 10px; right: 30px; z-index: 999" @click="$router.back()">-->
      <!--返回-->
    <!--</SG-Button>-->
    <!--基础信息部分-->
    <base-info-part v-if="assetHouseId" :assetHouseId="assetHouseId" @updataTransfer="updataTransfer"/>
    <!--其它信息部分-->
    <other-info-part v-if="assetHouseId" :assetHouseId="assetHouseId" :assetId="assetId" :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from "./components/OtherInfoPart"
  export default {
    name: 'AssetViewPage',
    components: { OtherInfoPart, BaseInfoPart },
    data () {
      return {
        assetHouseId: '', // 房屋Id
        assetId: '', // 资产Id
        transferOperationArea: '', // 转运营面积
        transferOperationTime: '', // 转运营时间
      }
    },

    methods: {
      updataTransfer (obj) {
        Object.assign(this, obj)
      }
    },
    
    created () {
      const { query: { houseId, assetId } } = this.$route
      this.assetHouseId = houseId
      this.assetId = assetId
    }
  }
</script>

<style lang='less' scoped>
  .asset_view {
    position: relative;
    padding: 42px 70px 0;
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 45px;
      .ant-col-8, .ant-col-24, .ant-col-12, .ant-col-16{
        margin: 15px 0;
      }
    }
  }
</style>
