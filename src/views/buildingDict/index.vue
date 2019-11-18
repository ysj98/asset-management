<!--
 * @Date: 2019-11-05 10:55:52
 * @Author: chen han
 * @Description: 楼盘字典首页
 -->
<template>
  <div class="buildingDict-page">
    <i class="copy-left" v-show="showKey==='building'"></i>
    <i class="copy-right" v-show="showKey==='building'"></i>
    <div class="custom-tabs">
      <!-- 公司 -->
      <div class="top-select">
        <topOrganByUser v-if="showKey==='building'" @change="organIdChange" :formStyle="allWidth" v-model="organId" :hasAll="false" :selectFirst="true"/>
      </div>
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
import topOrganByUser from '@/views/common/topOrganByUser'
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
    let query = this.GET_ROUTE_QUERY(this.$route.path)
    if (Object.keys(query).length > 0) {
      if (query.showKey === 'house') {
        this.showKey = 'house'
      }
    }
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
    .copy-left, .copy-right{
      content: '';
      position: absolute;
      width: 34px;
      height: 1px;
      background: #fff;
      top: 61px;
    }
    .copy-left{
      left: 0;
    }
    .copy-right{
      right: 0;
    }
  }
  .top-select{
  position: absolute;
  right: 30px;
  top: 13px;
}
</style>
