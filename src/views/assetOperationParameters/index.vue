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
import { ASSET_MANAGEMENT } from "@/config/config.power";
import store from "store";
import TabContent from "@/views/assetOperatingParameters/TabContent";
export default {
  /*
   * 资产转运营参数
   * */
  name: "assetOperationParameters",
  components: {
    TabContent,
  },
  data() {
    return {
      currentKey: "",
      tabList: [
        {
          auth: ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_TAB_HOUSE,
          name: store.state.ASSET_TYPE_STRING.HOUSE,
          keyStr: store.state.ASSET_TYPE_CODE.HOUSE,
        },
        {
          auth: ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_TAB_LAND,
          name: store.state.ASSET_TYPE_STRING.LAND,
          keyStr: store.state.ASSET_TYPE_CODE.LAND,
        },
        {
          auth: ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_TAB_YARD,
          name: store.state.ASSET_TYPE_STRING.YARD,
          keyStr: store.state.ASSET_TYPE_CODE.YARD,
        },
        {
          auth: ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_TAB_EQUIPMENT,
          name: store.state.ASSET_TYPE_STRING.EQUIPMENT,
          keyStr: store.state.ASSET_TYPE_CODE.EQUIPMENT,
        },
      ],
    };
  },
  methods: {},
  created() {
    this.tabList = this.tabList.filter(ele=>{
      return this.$power.has(ele.auth)
    })
    this.tabList.length && (this.currentKey = this.tabList[0].keyStr)
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
