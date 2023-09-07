<!--
  资产登记一览表--详情
-->
<template>
  <div class="assetRegisterViewDetail">
    <float-anchor :anchorList="anchorList" />
    <div>
      <basicDetails title="登记单信息" id="getRegisterOrder" type="getRegisterOrder" :registerOrderId="registerOrderId"></basicDetails>
      <basicDetails title="基础信息" id="getBasicCom" type="getBasicCom" @change="getValueAndUseDirection" :assetId="assetId"></basicDetails>
      <basicDetails
        title="价值信息"
        id="getValueInformation"
        type="getValueInformation"
        v-if="showvalueAndUseDirection"
        :valueInformationDetail="valueAndUseDirection"
      ></basicDetails>
      <basicDetails
        title="使用方向"
        id="getUseDirection"
        type="getUseDirection"
        v-if="showvalueAndUseDirection"
        :useDirectionDetail="valueAndUseDirection"
        :assetId="assetId"
      ></basicDetails>
      <tableList
        title="附属配套"
        id="necessaryCaaessories"
        type="necessaryCaaessories"
        :registerOrderId="registerOrderId"
        :assetId="assetId"
      ></tableList>
      <tableList title="相关费用" id="correlativeCharges" type="correlativeCharges" :registerOrderId="registerOrderId" :assetId="assetId"></tableList>
    </div>
  </div>
</template>

<script>
import basicDetails from './basicDetails';
import tableList from './tableList';
import FloatAnchor from '@/views/common/FloatAnchor';

export default {
  components: { basicDetails, tableList, FloatAnchor },
  data() {
    return {
      registerOrderId: '',
      assetType: '',
      assetId: '',
      showvalueAndUseDirection: false,
      valueAndUseDirection: {},
      anchorList: [
        { title: '登记单信息', id: 'getRegisterOrder' },
        { title: '基础信息', id: 'getBasicCom' },
        { title: '价值信息', id: 'getValueInformation' },
        { title: '使用方向', id: 'getUseDirection' },
        { title: '附属配套', id: 'necessaryCaaessories' },
        { title: '相关费用', id: 'correlativeCharges' },
      ],
    };
  },
  created() {
    this.registerOrderId = this.$route.query.registerOrderId;
    this.assetType = this.$route.query.assetType;
    this.assetId = this.$route.query.assetId;
  },
  methods: {
    getValueAndUseDirection(val) {
      this.valueAndUseDirection = val;
      this.showvalueAndUseDirection = true;
    },
  },
};
</script>

<style lang="less" scoped>
.assetRegisterViewDetail {
  padding: 42px 0px 20px 0px;
}
</style>
