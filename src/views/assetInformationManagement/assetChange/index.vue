<template>
  <div class="wrapper">
    <div class="custom-tabs">
      <a-tabs @change="callback" type="card" :tabBarGutter="10">
        <a-tab-pane tab="资产变动登记" key="1">资产变动登记</a-tab-pane>
        <a-tab-pane tab="资产变动一览表" key="2">资产变动一览表</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    callback(key) {
      console.log(key);
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
</style>
 