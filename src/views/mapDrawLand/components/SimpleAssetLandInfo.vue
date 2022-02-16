<template>
  <div class="simple-asset-land-info">
    <div v-if="assetNameShow" class="land-name">
      {{ allData.assetName }}
    </div>
    <div class="wrapper">
      <Information
        style="width: 96%"
        :row-props="{ gutter: 5 }"
        :col-props="{ span: 24 }"
        :basic-info-list="informationList"
      />
    </div>
  </div>
</template>

<script>
import { allBaseFields } from "@/views/mapDrawLand/share";
import Information from "components/Information";
export default {
  name: "SimpleAssetLandInfo",
  components: {
    Information,
  },
  props: {
    assetNameShow: {
      type: Boolean,
      default: true,
    },
    assetId: {
      type: [String, Number],
      required: true,
    },
    popupDataSource: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      assetAttrDtos: [],
      informationList: [],
      allData: {},
    };
  },
  methods: {
    getLandBusinessDetail() {
      const req = {
        assetId: this.assetId,
        // 固定写死2
        resourceType: 2,
      };
      this.$api.drawMap.landBusinessDetail(req).then(
        ({
          data: {
            code,
            message,
            data: { landInfo },
          },
        }) => {
          if (code === "0") {
            this.init(landInfo || {});
          } else {
            this.$message.error(message);
          }
        }
      );
    },

    /*
     * 基础属性名称
     * @param type 0基础字段 1业务字段
     * */
    getKeyName(str, type) {
      let data = [];
      if (type === 0) {
        data = allBaseFields;
      }
      if (type === 1) {
        data = [];
      }
      const item = data.find((ele) => ele.title === str);
      if (item) {
        return item.key;
      } else {
        console.error("根据基础属性名称 匹配基础字段出错");
        return "";
      }
    },
    getValueByAssetAttrDtos({ str }) {
      const res = this.assetAttrDtos.find((ele) => ele.attrName === str);
      if (res) {
        return res.attrValue;
      } else {
        console.warn("当前资产未匹配到业务属性信息");
        return "";
      }
    },
    init(data) {
      this.allData = data;
      this.assetAttrDtos = data.assetAttrDtos || {};
      const baseRes = this.popupDataSource
        .filter((ele) => ele.fieldFlag === 0)
        .map((ele) => {
          const keyName = this.getKeyName(ele.fieldName, 0);
          return {
            title: ele.fieldAliasName || ele.fieldName,
            value: this.allData[keyName],
            sort: ele.fieldSort,
          };
        });
      const otherRes = this.popupDataSource
        .filter((ele) => ele.fieldFlag === 1)
        .map((ele) => {
          return {
            title: ele.fieldAliasName || ele.fieldName,
            value: this.getValueByAssetAttrDtos({ str: ele.fieldName }),
            sort: ele.fieldSort,
          };
        });
      this.informationList = [...baseRes, ...otherRes].sort(
        (x, y) => x.sort - y.sort
      );
    },
  },
  mounted() {
    console.log("assetId", this.assetId);
    this.getLandBusinessDetail();
  },
};
</script>

<style lang="less" scoped>
.simple-asset-land-info {
  padding: 14px 12px;
  min-width: 180px;
  line-height: 26px;
  word-wrap: break-word;
  min-height: 190px;
}
.wrapper {
  width: 100%;
  max-height: 300px;
  overflow: auto;
}
.land-name {
  font-size: 12px;
  color: #49505e;
  font-weight: bold;
}
.title-left {
  font-size: 12px;
  color: #959dab;
}
.title-left::after {
  content: ":";
  color: #959dab;
}
.content-right {
  color: #49505e;
  font-size: 12px;
}
</style>
