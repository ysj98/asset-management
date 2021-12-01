<template>
  <div>
    <a-tabs type="card" @change="changeType">
      <a-tab-pane key="1" tab="土地">
        Content of Tab Pane 1
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  /*
   * 资产转运营参数
   * */
  name: "assetOperatingParameters",
  data() {
    return {
      arr: [
        {
          component: null
        }
      ]
    };
  },
  methods: {
    changeType() {}
  }
};
</script>

<style scoped></style>
