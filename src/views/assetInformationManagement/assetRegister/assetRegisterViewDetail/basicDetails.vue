 <!--
 * 登记单信息
--> 
<template>
  <div class="basicDetails">
    <div class="newInformation-nav">
      <span class="section-title blue">{{title}}</span>
      <a-row class="playground-row" v-show="type === 'getRegisterOrder'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in basicDetails" :key="index">
          {{item.text}}：{{Detail[item.value] || Detail[item.value] === 0 ? Detail[item.value] : '--'}}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-if="type === 'getBasicByHouse'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in getBasicByHouse" :key="index">
          {{item.text}}：{{getBasicByHouseDetail[item.value] || getBasicByHouseDetail[item.value] === 0 ? getBasicByHouseDetail[item.value] : '--'}}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-if="type === 'getBasicByGround'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in getBasicByGround" :key="index">
          {{item.text}}：{{getBasicByGroundDetail[item.value] || getBasicByGroundDetail[item.value] === 0 ? getBasicByGroundDetail[item.value] : '--'}}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-show="type === 'getValueInformation'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in valueInformation" :key="index">
          {{item.text}}：{{valueInformationDetail[item.value] || valueInformationDetail[item.value] === 0 ? valueInformationDetail[item.value] : '--'}}
        </a-col>
      </a-row>
      <a-row class="playground-row" v-show="type === 'getUseDirection'">
        <a-col class="playground-col" :span="8" v-for="(item, index) in useDirection" :key="index">
          {{item.text}}：{{useDirectionDetail[item.value] || useDirectionDetail[item.value] === 0 ? useDirectionDetail[item.value] : '--'}}
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    registerOrderId: [String, Number],
    assetId: [String, Number],
    valueInformationDetail: {
      type: Object,
      default: () => ({})
    },
    useDirectionDetail: {
      type: Object,
      default: () => ({})
    },
    title: String,
    type: String        // 根据类型展示登记单信息 基础信息 价值信息 使用方向
  },
  data () {
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
        { text: '备注', value: 'remark' }
      ],
      Detail: {},
      getBasicByHouse: [
        { text: '资产ID', value: 'assetId' },
        { text: '资产名称', value: 'assetName' },
        { text: '资产编码', value: 'assetCode' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '资产分类', value: 'objectTypeName' },
        { text: '资产面积(㎡)', value: 'area' },
        { text: '楼栋名称', value: 'buildName' },
        { text: '房间名称', value: 'houseName' },
        { text: '资产位置', value: 'address' },
        { text: '权属类型', value: 'kindOfRightName' },
        { text: '权属情况', value: 'ownershipStatusName' },
        { text: '权证号', value: 'warrantNbr' },
        { text: '装修情况', value: 'decorationSituation' },
        { text: '债权金额(元)', value: 'creditorAmount' },
        { text: '债务金额(元)', value: 'debtAmount' }
      ],
      getBasicByHouseDetail: {},
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
        { text: '债务金额(元)', value: 'debtAmount' }
      ],
      getBasicByGroundDetail: {},
      valueInformation: [
        { text: '资产原值(元)', value: 'originalValue' },
        { text: '使用期限(月)', value: 'validPeriod' },
        { text: '开始使用日期', value: 'startDate' },
        { text: '已使用期限(月)', value: 'usedDate' },
        { text: '累计折旧金额(元)', value: 'depreciationAmount' }
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
        { text: '闲置面积(㎡)', value: 'idleArea' }
      ],
      // useDirectionDetail: {}
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    switch (this.type) {
      case 'getRegisterOrder':
        this.getRegisterOrderById()
        break;
      case 'getBasicByHouse':
        this.getAssetById()
        break;
      case 'getBasicByGround':
        this.getAssetById()
        break;
        break
      default:
        break;
    }
  },
  methods: {
    // 获取登记单信息
    getRegisterOrderById () {
      let obj = {
        registerOrderId: this.registerOrderId     // 资产登记单ID
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.Detail = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取基础信息
    getAssetById () {
      let data = {
        assetId: this.assetId
      }
      this.$api.subsidiary.getAssetById(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          if (this.type === 'getBasicByHouse') {
            this.getBasicByHouseDetail = {...obj}
            for (let key in obj.assetHouse) {
              this.getBasicByHouseDetail[key] = obj.assetHouse[key]
            }
            this.$emit('change', obj.assetHouse)
          } else {
            this.getBasicByGroundDetail = {...obj}
            for (let key in obj.assetLand) {
              this.getBasicByGroundDetail[key] = obj.assetLand[key]
            }
            this.$emit('change', obj.assetLand)
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
  }
}
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