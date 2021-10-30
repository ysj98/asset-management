<template>
  <div style="line-height: 45px">
    <Information
      :row-props="{ gutter: 5 }"
      :col-props="{ span: 8 }"
      :basic-info-list="list"
    />
  </div>
</template>
<script>
import Information from "components/Information";
export default {
  name: "BasicInformation",
  components: { Information },
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    },
    assetType() {
      return String(this.$route.query.assetType);
    }
  },
  watch: {
    detailData: {
      deep: true,
      handler: function(newValue) {
        this.list.forEach(ele => {
          ele.value = newValue[ele.keyName];
        });
      },
      immediate: true
    }
  },
  created() {
    const { HOUSE, LAND, YARD, EQUIPMENT } = this.ASSET_TYPE_CODE;
    this.list = [
      {
        keyName: "assetId",
        title: "资产ID",
        value: ""
      },
      {
        keyName: "assetName",
        title: "资产名称",
        value: ""
      },
      {
        keyName: "assetCode",
        title: "资产编码",
        value: ""
      },
      {
        keyName: "assetTypeName",
        title: "资产类型",
        value: ""
      },
      {
        keyName: "objectTypeName",
        title: "资产分类",
        value: ""
      },
      {
        keyName: "area",
        title: "资产面积(㎡)",
        value: ""
      },
      {
        keyName: "buildName",
        title: "楼栋名称",
        value: "",
        assetType: [HOUSE]
      },
      {
        keyName: "landName",
        title: "土地名称",
        value: "",
        assetType: [LAND]
      },
      {
        keyName: "landName",
        title: "车场名称",
        value: "",
        assetType: [YARD]
      },
      {
        keyName: "landName",
        title: "设备设施名称",
        value: "",
        assetType: [EQUIPMENT]
      },
      {
        keyName: "houseName",
        title: "房间名称",
        value: "",
        assetType: [HOUSE]
      },
      {
        keyName: "landCode",
        title: "土地编码",
        value: "",
        assetType: [LAND]
      },
      {
        keyName: "address",
        title: "资产位置",
        value: ""
      },
      {
        keyName: "kindOfRightName",
        title: "权属类型",
        value: ""
      },
      {
        keyName: "ownershipStatusName",
        title: "权属情况",
        value: ""
      },
      {
        keyName: "warrantNbr",
        title: "权证号",
        value: ""
      },
      {
        keyName: "decorationSituation",
        title: "装修情况",
        value: ""
      },
      {
        keyName: "creditorAmount",
        title: "债权金额(元)",
        value: ""
      },
      {
        keyName: "debtAmount",
        title: "债务金额(元)",
        value: ""
      }
    ];
    this.list = this.list.filter(this.handleInfoArr);
  },
  methods: {
    handleInfoArr(ele) {
      if (ele.assetType && ele.assetType.length) {
        return ele.assetType.includes(this.assetType);
      } else {
        return true;
      }
    }
  }
};
</script>
