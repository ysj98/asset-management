<!--
  房屋台账
-->
<template>
  <div class="assetChange">
    <div class="custom-tabs">
      <a-tabs @change="callback" type="card" :tabBarGutter="10">
        <a-tab-pane tab="资产项目视图" key="1">
          <asset-project-view-list></asset-project-view-list>
        </a-tab-pane>
        <a-tab-pane tab="楼栋视图" key="2">
          <!---->
        </a-tab-pane>
        <a-tab-pane tab="资产视图" key="3">
          <!---->
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import assetProjectViewList from './assetProjectViewList'
export default {
  components: {assetProjectViewList},
  props: {},
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    callback(key) {
      console.log(key)
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
 