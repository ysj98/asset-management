<template>
  <div class="asset-land-list">
    <div v-for="item in list" :key="item.id" class="item-block">
      <div class="list-item">
        <span class="title-name">
          {{
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name
          }}
        </span>
        <span class="color-block" :style="{ backgroundColor: item.color }">
        </span>
        <span class="title-flag">
          {{ "绘制状态" }}
        </span>
        <div @click="handleDraw(item)">
          <SG-Icon
            style="cursor: pointer"
            color="#666"
            size="15px"
            type="icon-edit"
          ></SG-Icon>
        </div>
        <SimpleAssetLandInfo class="info-layer" :asset-land-info="mockData" />
      </div>
    </div>
  </div>
</template>

<script>
import SimpleAssetLandInfo from "@/views/mapDrawLand/components/SimpleAssetLandInfo";
export default {
  /*
   * 资产列表
   * */
  name: "AssetLandList",
  components: {
    SimpleAssetLandInfo,
  },
  data() {
    return {
      mockData: {},
      list: [
        {
          name: "地块",
          color: "#f00",
          assetId: 1,
        },
        {
          name: "地块",
          color: "blue",
          assetId: 2,
        },
        {
          name: "地块",
          color: "black",
          assetId: 3,
        },
      ],
    };
  },
  methods: {
    handleDraw(item) {
      this.$emit("handleDraw",item);
    },
  },
};
</script>

<style lang="less" scoped>
.asset-land-list {
  background: #ffffff;
  box-shadow: 0 10px 40px 0 rgba(73, 80, 94, 0.3);
  border-radius: 8px;
  padding: 12px 0;
  max-width: 300px;
  min-width: 220px;
  .item-block {
    .list-item {
      padding: 0 16px;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;

      display: flex;
      align-items: center;

      position: relative;
      .info-layer {
        display: none;
        position: absolute;
        z-index: 3;
        top: 36px;
        left: 156px;
      }
      &:hover {
        background: #e6f7ff;
      }
      .color-block {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .title-flag {
        font-size: 13px;
        color: #959dab;
        margin: 0 8px;
      }
      .title-name {
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          & ~ .info-layer {
            display: block;
          }
        }
      }
    }
  }
}
::v-deep .ant-popover-inner-content {
  padding: 0;
}
</style>
