<!--
 * @Description: 呈报记录一览表
 * @Date: 2020-03-05 16:50:14
 * @LastEditTime: 2020-03-05 17:24:04
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="楼栋信息" key="building">
          <buildingInfo :organId="organId"/>
        </a-tab-pane>
        <a-tab-pane tab="房间信息" key="house">
          <houseInfo />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import buildingInfo from './buildingInfo'
import houseInfo from './houseInfo'
const allWidth = {width: '185px'}
export default {
  components: {
    buildingInfo,
    houseInfo,
    topOrganByUser
  },
  data () {
    return {
      showKey: 'building',
      allWidth,
      organId: ''
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