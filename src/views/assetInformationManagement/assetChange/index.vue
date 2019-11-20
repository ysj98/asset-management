<!--
  资产变动
-->
<template>
  <div class="assetChange">
    <div class="custom-tabs">
      <a-tabs @change="callback" type="card" :tabBarGutter="10">
        <a-tab-pane tab="资产变动登记" key="1">
          <assets-registration></assets-registration>
        </a-tab-pane>
        <a-tab-pane tab="资产变动一览表" key="2">
          <schedule-changes></schedule-changes>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import AssetsRegistration from './assetsRegistration'
import ScheduleChanges from './scheduleChanges'
export default {
  components: {AssetsRegistration, ScheduleChanges},
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
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf(from.path) === -1) {
      let o = {
        key: from.path,
        data: {}
      }
      this.$store.commit('pro/SET_ROUTE_QUERY', o)
    }
    next()
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
</style>
 