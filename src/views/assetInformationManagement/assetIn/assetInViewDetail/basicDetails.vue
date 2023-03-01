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
      <div v-if="type === 'getRegisterOrder'" style="margin: 0px 0 0 40px">
        <span style="color: #282d5b; float: left">附件:</span>
        <UploadFile show v-if="files.length" v-model="files" />
        <span v-else style="margin-left: 9px; color: #49505e">--</span>
      </div>
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
    storeId: [String, Number],
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
      files: [],
      basicDetails: [
        { text: '入库单名称', value: 'storeName' },
        { text: '入库单编号', value: 'storeCode' },
        { text: '入库单状态', value: 'statusName' },
        { text: '所属机构', value: 'organName' },
        { text: '资产项目', value: 'projectName' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '关联资产登记单', value: 'assetRegisterName' },
        { text: '创建人', value: 'createUserName' },
        { text: '创建日期', value: 'createDate' },
        { text: '备注', value: 'remark' },
      ],
      Detail: {},
      getBasicDetail: {},
      getBasicByGround: [
        { text: '资产ID', value: 'assetId' },
        { text: '资产名称', value: 'assetName' },
        { text: '资产编码', value: 'assetCode' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '资产分类', value: 'objectTypeName' },
        { text: '资产面积(㎡)', value: 'landArea' },
        { text: '土地名称', value: 'landName' },
        { text: '土地编号', value: 'landCode' },
        { text: '资产位置', value: 'address' },
        { text: '权属类型', value: 'kindOfRightName' },
        { text: '权属情况', value: 'ownershipStatusName' },
        { text: '权证号', value: 'warrantNbr' },
        { text: '债权金额(元)', value: 'creditorAmount' },
        { text: '债务金额(元)', value: 'debtAmount' },
      ],
      getBasicByGroundDetail: {},
      valueInformation: [
        { text: '资产原值(元)', value: 'originalValue' },
        { text: '使用期限(月)', value: 'validPeriod' },
        { text: '开始使用日期', value: 'startDate' },
        { text: '已使用期限(月)', value: 'usedDate' },
        { text: '累计折旧金额(元)', value: 'depreciationAmount' },
      ],
      // valueInformationDetail: {},
      useDirection: [
        { text: '转物业日期', value: 'transferTime' },
        { text: '转物业面积(㎡)', value: 'transferArea' },
        { text: '转运营日期', value: 'transferOperationTime' },
        { text: '运营面积(㎡)', value: 'transferOperationArea' },
        { text: '自用面积(㎡)', value: 'selfUserArea' },
        { text: '占用面积(㎡)', value: 'occupationArea' },
        { text: '其他面积(㎡)', value: 'otherArea' },
        { text: '闲置面积(㎡)', value: 'idleArea' },
      ],
      // useDirectionDetail: {}
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
        return ele.assetType.includes(this.assetType);
      } else {
        return true;
      }
    },
    // 获取登记单信息
    getRegisterOrderById() {
      let obj = {
        storeId: this.storeId, // 资产登记单ID
      };
      this.$api.assets.queryAssetStoreDetail(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let files = [];
          if (data.attachmentList && data.attachmentList.length > 0) {
            data.attachmentList.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName,
              });
            });
          }
          this.files = files;
          this.Detail = data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取基础信息
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
