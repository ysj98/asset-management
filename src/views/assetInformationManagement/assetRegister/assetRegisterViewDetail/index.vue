<!--
  资产登记一览表--详情
-->
<template>
  <div class="assetRegisterViewDetail">
    <basicDetails title="登记单信息" type="getRegisterOrder" :registerOrderId="registerOrderId"></basicDetails>
    <basicDetails title="基础信息" type="getBasicByHouse" @change="getValueAndUseDirection" v-if="+assetType === 1" :assetId="assetId"></basicDetails>
    <basicDetails title="基础信息" type="getBasicByGround" @change="getValueAndUseDirection" v-if="+assetType === 4" :assetId="assetId"></basicDetails>
    <basicDetails title="价值信息" type="getValueInformation" v-if="showvalueAndUseDirection" :valueInformationDetail="valueAndUseDirection"></basicDetails>
    <basicDetails title="使用方向" type="getUseDirection" v-if="showvalueAndUseDirection" :useDirectionDetail="valueAndUseDirection"></basicDetails>
    <tableList type="necessaryCaaessories" title="附属配套" :registerOrderId="registerOrderId" :assetId="assetId"></tableList>
    <tableList type="correlativeCharges" title="相关费用" :registerOrderId="registerOrderId" :assetId="assetId"></tableList>
  </div>
</template>

<script>
import basicDetails from './basicDetails'
import tableList from './tableList'

export default {
  components: {basicDetails, tableList},
  data () {
    return {
      registerOrderId: '',
      assetType: '',
      assetId: '',
      showvalueAndUseDirection: false,
      valueAndUseDirection: {}
    }
  },
  created () {
    this.registerOrderId = this.$route.query.registerOrderId
    this.assetType = this.$route.query.assetType
    this.assetId = this.$route.query.assetId
  },
  methods: {
    getValueAndUseDirection (val) {
      this.valueAndUseDirection = val
      this.showvalueAndUseDirection = true
    }
  }
}
</script>

<style lang="less" scoped>
.assetRegisterViewDetail {
  padding: 42px 126px 20px 70px;
}
</style>
