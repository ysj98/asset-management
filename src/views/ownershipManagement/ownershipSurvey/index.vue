<!--
 * @Date: 2019-11-26 16:35:53
 * @Author: chen han
 * @Description: 权属管理->权属概况
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="资产项目权属" key="assetProject">
          <assetProjectOwnership/>
        </a-tab-pane>
        <a-tab-pane tab="资产权属" key="asset">
          <assetOwnership />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import assetOwnership from './assetOwnership.vue'
import assetProjectOwnership from './assetProjectOwnership.vue'
const allWidth = {width: '185px'}
export default {
  components: {
    assetOwnership,
    assetProjectOwnership
  },
  data () {
    return {
      showKey: 'assetProject',
      allWidth,
      organId: ''
    }
  },
  created () {
    let query = this.GET_ROUTE_QUERY(this.$route.path)
    if (Object.keys(query).length > 0) {
      if (query.showKey) {
        this.showKey = query.showKey
      }
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
  methods: {
    tabChange (v) {
      console.log(v)
      this.showKey = v
    },
    organIdChange () {
    },
  }
}
</script>
<style lang="less" scoped>
  .buildingDict-page{
    position: relative;
  }
  .top-select{
  position: absolute;
  right: 30px;
  top: 13px;
}
</style>
