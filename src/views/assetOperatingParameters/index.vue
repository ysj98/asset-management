<template>
  <div class="container">
    <a-tabs v-model="currentKey" type="card">
      <a-tab-pane v-for="item in tabList" :key="item.keyStr" :tab="item.name">
        <TabContent :assetType="currentKey" :type="item.keyStr" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getDefaultKey } from "utils/utils";
import store from "store";
import TabContent from "@/views/assetOperatingParameters/TabContent";
export default {
  /*
   * 资产转运营参数
   * */
  name: "assetOperatingParameters",
  components: {
    TabContent,
  },
  data() {
    return {
      currentKey: "",
      // TODO: 权限编写
      tabList: [
        {
          auth: "",
          name: store.state.ASSET_TYPE_STRING.HOUSE,
          keyStr: store.state.ASSET_TYPE_CODE.HOUSE,
        },
        {
          auth: "",
          name: store.state.ASSET_TYPE_STRING.LAND,
          keyStr: store.state.ASSET_TYPE_CODE.LAND,
        },
        {
          auth: "",
          name: store.state.ASSET_TYPE_STRING.YARD,
          keyStr: store.state.ASSET_TYPE_CODE.YARD,
        },
        {
          auth: "",
          name: store.state.ASSET_TYPE_STRING.EQUIPMENT,
          keyStr: store.state.ASSET_TYPE_CODE.EQUIPMENT,
        },
      ],
    };
  },
  methods: {},
  created() {
    this.currentKey = getDefaultKey(this.tabList);
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
