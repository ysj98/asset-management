<!--
 * @Date: 2019-11-05 10:55:52
 * @Author: chen han
 * @Description: 楼盘字典首页
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" type="card" :tabBarGutter="10">
        <a-tab-pane tab="楼栋信息" key="building">
          <buildingInfo />
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
export default {
  components: {
    buildingInfo,
    houseInfo
  },
  data () {
    return {
      showKey: 'building'
    }
  },
  methods: {
    tabChange (v) {
      console.log(v)
    }
  }
}
</script>
<style lang="less" scoped>
  .buildingDict-page{
    position: relative;
    padding-bottom: 60px;
  }
</style>
