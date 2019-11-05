<!-- 楼盘字典 -->
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
