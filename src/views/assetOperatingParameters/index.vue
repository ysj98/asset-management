<template>
  <div class="container">
    <a-tabs v-model="currentKey" type="card">
      <a-tab-pane v-for="item in tabList" :key="item.keyStr" :tab="item.name">
        <TabContent :type='item.keyStr' />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getDefaultKey } from "utils/utils";
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
          name: "房屋",
          keyStr: "1",
        },
        {
          auth: "",
          name: "土地",
          keyStr: "2",
        },
        {
          auth: "",
          name: "车场",
          keyStr: "3",
        },
        {
          auth: "",
          name: "设备设施",
          keyStr: "4",
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
