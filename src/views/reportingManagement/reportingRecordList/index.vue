<!--
 * @Description: 呈报记录一览表
 * @Date: 2020-03-05 16:50:14
 * @LastEditTime: 2020-03-06 11:35:54
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="资产运营信息" key="operate">
          <operateInfo/>
        </a-tab-pane>
        <a-tab-pane tab="资产收入信息" key="income">
          <incomeInfo />
        </a-tab-pane>
        <a-tab-pane tab="资产费用信息" key="cost">
          <costInfo />
        </a-tab-pane>
        <a-tab-pane tab="资产折旧信息" key="depreciation">
          <depreciationInfo />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import operateInfo from './operateInfo'
import incomeInfo from './incomeInfo'
import costInfo from './costInfo'
import depreciationInfo from './depreciationInfo'
export default {
  components: {
    operateInfo,
    incomeInfo,
    costInfo,
    depreciationInfo
  },
  data () {
    return {
      showKey: 'operate',
    }
  },
  created () {
    // let query = this.GET_ROUTE_QUERY(this.$route.path)
    // if (Object.keys(query).length > 0) {
    //   if (query.showKey === 'house') {
    //     this.showKey = 'house'
    //   }
    // }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf(from.path) === -1) {
      let o = {
        key: from.path,
        data: {}
      }
      // this.$store.commit('pro/SET_ROUTE_QUERY', o)
    }
    next()
  },
  methods: {
    tabChange (v) {
      console.log(v)
      this.showKey = v
    },
  }
}
</script>
<style lang="less" scoped>
  .buildingDict-page{
    position: relative;
  }
</style>