<!--
 * @Description: 呈报记录一览表
 * @Date: 2020-03-05 16:50:14
 * @LastEditTime: 2020-03-09 11:42:45
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane v-if="$power.has(ASSET_MANAGEMENT.ASSET_REPORT_OPERATE)" tab="资产运营信息" key="operate">
          <operateInfo/>
        </a-tab-pane>
        <a-tab-pane v-if="$power.has(ASSET_MANAGEMENT.ASSET_REPORT_INCOME)" tab="资产收入信息" key="income">
          <incomeInfo />
        </a-tab-pane>
        <a-tab-pane v-if="$power.has(ASSET_MANAGEMENT.ASSET_REPORT_COST)" tab="资产费用信息" key="cost">
          <costInfo />
        </a-tab-pane>
        <a-tab-pane v-if="$power.has(ASSET_MANAGEMENT.ASSET_REPORT_DEPRECIA)" tab="资产折旧信息" key="depreciation">
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
import {ASSET_MANAGEMENT} from '@/config/config.power'
export default {
  components: {
    operateInfo,
    incomeInfo,
    costInfo,
    depreciationInfo,
  },
  data () {
    return {
      showKey: 'operate',
      ASSET_MANAGEMENT,
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