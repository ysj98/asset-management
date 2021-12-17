<template>
  <div class="simple-asset-land-info">
    <div class="land-name">
      {{ "XXX土地" }}
    </div>
    <div>
      <span class="title-left">资产项目</span>
      <span class="content-right">
        {{
          "这是一个超级长名字的i先昂吗这是一个超级长名字的i先昂吗这是一个超级长名字的i先昂吗"
        }}
      </span>
    </div>
    <div>
      <span class="title-left">资产编码</span>
      <span class="content-right">
        {{ "dsdg-sdg-sdgsdg-sdg-sdg-sd-g-sdg-sdg--sdg-sdg-sdg" }}
      </span>
    </div>
    <div>
      <span class="title-left">宗地号</span>
      <span class="content-right">
        {{ 12345678901234 }}
      </span>
    </div>
    <div>
      <span class="title-left">土地面积</span>
      <span class="content-right"> {{ `${"1000000"}m²` }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleAssetLandInfo",
  props: {
    assetLandInfo: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.simple-asset-land-info {
  padding: 14px 12px;
  max-width: 200px;
  min-width: 180px;
  background: #ffffff;
  box-shadow: 0 10px 40px 0 rgba(73, 80, 94, 0.3);
  border-radius: 8px;
  line-height: 26px;
  word-wrap: break-word;
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
