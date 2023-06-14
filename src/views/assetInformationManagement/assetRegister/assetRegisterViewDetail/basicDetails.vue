<!--
 * 登记单信息
-->
<template>
  <div class="basicDetails">
    <div class="newInformation-nav">
      <span class="section-title blue">{{ title }}</span>
      <a-row class="playground-row" v-show="type === 'getRegisterOrder'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in basicDetails" :key="index">
          {{ item.text }}：{{ Detail[item.value] || Detail[item.value] === 0 ? Detail[item.value] : '--' }}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-if="type === 'getBasicCom'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in getBasicCom" :key="index">
          {{ item.text }}：{{ getBasicDetail[item.value] || getBasicDetail[item.value] === 0 ? getBasicDetail[item.value] : '--' }}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-show="type === 'getValueInformation'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in valueInformation" :key="index">
          {{ item.text }}：{{
            valueInformationDetail[item.value] || valueInformationDetail[item.value] === 0 ? valueInformationDetail[item.value] : '--'
          }}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-show="type === 'getUseDirection'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in useDirectionCom" :key="index">
          {{ item.text }}：{{ useDirectionDetail[item.value] || useDirectionDetail[item.value] === 0 ? useDirectionDetail[item.value] : '--' }}
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { handleAssetTypeField } from '@/views/assetInformationManagement/assetRegister/common/share';

export default {
  components: {},
  props: {
    registerOrderId: [String, Number],
    assetId: [String, Number],
    valueInformationDetail: {
      type: Object,
      default: () => ({}),
    },
    useDirectionDetail: {
      type: Object,
      default: () => ({}),
    },
    title: String,
    type: String, // 根据类型展示登记单信息 基础信息 价值信息 使用方向
  },
  data() {
    return {
      basicDetails: [
        { text: '登记单编号', value: 'registerOrderId' },
        { text: '登记单名称', value: 'registerOrderName' },
        { text: '所属机构', value: 'organName' },
        { text: '资产项目名称', value: 'projectName' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '状态', value: 'approvalStatusName' },
        { text: '创建人', value: 'createByName' },
        { text: '创建日期', value: 'createTime' },
        { text: '核实人', value: 'verifierByName' },
        { text: '核实日期', value: 'verifierTime' },
        { text: '入库单编号', value: 'storeCode' },
        { text: '入库日期', value: 'storageTime' },
        { text: '入库人', value: 'storageByName' },
        { text: '备注', value: 'remark' },
      ],
      Detail: {},
      getBasicDetail: {},
      valueInformation: [
        { text: '资产原值(元)', value: 'originalValue' },
        { text: '使用期限(月)', value: 'validPeriod' },
        { text: '开始使用日期', value: 'startDate' },
        { text: '已使用期限(月)', value: 'usedDate' },
        { text: '累计折旧金额(元)', value: 'depreciationAmount' },
      ],
    };
  },
  computed: {
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    },
    assetType() {
      return String(this.$route.query.assetType);
    },
    useDirectionCom() {
      const { HOUSE, LAND, YARD, EQUIPMENT } = this.ASSET_TYPE_CODE;
      const info = [
        { text: '转物业日期', value: 'transferTime' },
        { text: '使用方向', value: 'useDirectionName', assetType: [EQUIPMENT] },
        { text: '转物业面积(㎡)', value: 'transferArea', assetType: [HOUSE, LAND, YARD] },
        { text: '转运营日期', value: 'transferOperationTime', assetType: [HOUSE, LAND, YARD] },
        { text: '运营面积(㎡)', value: 'transferOperationArea', assetType: [HOUSE, LAND, YARD] },
        { text: '自用面积(㎡)', value: 'selfUserArea', assetType: [HOUSE, LAND, YARD] },
        { text: '占用面积(㎡)', value: 'occupationArea', assetType: [HOUSE, LAND, YARD] },
        { text: '其他面积(㎡)', value: 'otherArea', assetType: [HOUSE, LAND, YARD] },
        { text: '闲置面积(㎡)', value: 'idleArea', assetType: [HOUSE, LAND, YARD] },
      ];
      return info.filter(this.handleInfoArr);
    },
    getBasicCom() {
      const { HOUSE, LAND, YARD, EQUIPMENT } = this.ASSET_TYPE_CODE;
      const info = [
        { text: '资产ID', value: 'assetId' },
        { text: '资产名称', value: 'assetName' },
        { text: '资产编码', value: 'assetCode' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '资产分类', value: 'objectTypeName' },
        { text: '资产面积(㎡)', value: 'area', assetType: [HOUSE] },
        { text: '资产面积(㎡)', value: 'landArea', assetType: [LAND] },

        { text: '楼栋名称', value: 'buildName', assetType: [HOUSE] },
        { text: '房间名称', value: 'houseName', assetType: [HOUSE] },
        { text: '土地名称', value: 'landName', assetType: [LAND] },
        { text: '车场名称', value: 'carParkName', assetType: [YARD] },
        { text: '设备设施名称', value: 'equipmentName', assetType: [EQUIPMENT] },

        { text: '土地编号', value: 'landCode', assetType: [LAND] },
        { text: '资产位置', value: 'address' },
        { text: '权属类型', value: 'kindOfRightName' },
        { text: '权属情况', value: 'ownershipStatusName' },
        { text: '权证号', value: 'warrantNbr' },
        { text: '装修情况', value: 'decorationSituation', assetType: [HOUSE] },
        { text: '债权金额(元)', value: 'creditorAmount' },
        { text: '债务金额(元)', value: 'debtAmount' },
        { text: '是否缴纳土地出让金', value: 'isLandSell', assetType: [HOUSE,LAND] },
      ];
      return info.filter(this.handleInfoArr);
    },
  },
  created() {},
  mounted() {
    switch (this.type) {
      case 'getRegisterOrder':
        this.getRegisterOrderById();
        break;
      case 'getBasicCom':
        this.getAssetById();
        break;
      default:
        break;
    }
  },
  methods: {
    /*
     * 根据 assetType 数据 过滤
     * assetType 没有元素时意味着 所有资产类型 都显示，如果存在数据则根据 当前资产类型 判断是否显示
     * */
    handleInfoArr(ele) {
      if (ele.assetType && ele.assetType.length) {
        return ele.assetType.includes(String(this.assetType));
      } else {
        return true;
      }
    },
    // 获取登记单信息
    getRegisterOrderById() {
      let obj = {
        registerOrderId: this.registerOrderId, // 资产登记单ID
      };
      this.$api.assets.getRegisterOrderById(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.Detail = data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取基础信息
    getAssetById() {
      let data = {
        assetId: this.assetId,
      };
      this.$api.subsidiary.getAssetById(data).then((res) => {
        if (res.data.code === '0') {
          let obj = res.data.data || {};
          if (this.type === 'getBasicCom') {
            const ASSET_TYPE_DETAIL = handleAssetTypeField(this.assetType, 'detail');
            const resData = obj[ASSET_TYPE_DETAIL];
            this.getBasicDetail = { ...obj };
            for (let key in resData) {
              this.getBasicDetail[key] = resData[key];
            }
            this.$emit('change', resData || {});
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.basicDetails {
  margin-bottom: 30px;
  .playground-row {
    padding: 20px 0 20px 40px;
    .playground-col {
      line-height: 40px;
      font-size: 12px;
    }
  }
}
</style>
