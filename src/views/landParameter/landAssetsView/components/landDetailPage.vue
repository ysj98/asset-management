<!--资产视图业务-资产视图详情页面-->
<template>
  <div class="asset_view">
    <!--基础信息部分-->
    <base-info-part ref="baseInfoPart" v-if="assetLandId" :assetLandId="assetLandId" @updateTransfer="updateTransfer" />
    <!--其它信息部分-->
    <other-info-part v-if="assetLandId" :assetLandId="assetLandId" :assetId="assetId"
      :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime" />
  </div>
</template>

<script>
import BaseInfoPart from './components/BaseInfoPart';
import OtherInfoPart from './components/OtherInfoPart';
export default {
  name: 'AssetViewPage',
  components: { OtherInfoPart, BaseInfoPart },
  data() {
    return {
      assetHouseId: '', // 房屋Id
      assetId: '', // 资产Id
      transferOperationArea: '', // 转运营面积
      transferOperationTime: '', // 转运营时间
    };
  },

  methods: {
    // 兄弟组件间数据通信
    updateTransfer(obj) {
      Object.assign(this, obj);
    },
  },

  created() {
    const {
      query: { assetLandId, assetId },
    } = this.$route;
    this.assetLandId = assetLandId;
    this.assetId = assetId;
  },
};
</script>

<style lang="less" scoped>
.asset_view {
  position: relative;
  padding: 42px 70px 0;

  /*抽离子组件的公共样式*/
  & /deep/ .title_div {
    margin-left: 45px;

    .ant-col-8,
    .ant-col-24,
    .ant-col-12,
    .ant-col-16 {
      margin: 15px 0;
    }
  }
}
</style>
