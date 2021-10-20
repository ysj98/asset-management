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
        <a-checkbox v-if="showKey==='building'" :checked="Boolean(isCurrent)" @change="changeChecked" style="margin-top: 7px;margin-right: 10px;">
          仅当前机构下楼栋
        </a-checkbox>
        <treeSelect
          v-if="showKey==='building'"
          @changeTree="organIdChange"
          :typeFilter="typeFilter"
          placeholder='请选择组织机构'
          :allowClear="false"
          :style="allWidth"
        ></treeSelect>
      </div>
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="楼栋信息" key="building">
          <buildingInfo :isCurrent="isCurrent" :organId="organId"/>
        </a-tab-pane>
        <a-tab-pane tab="房间信息" key="house">
          <houseInfo />
        </a-tab-pane>
        <a-tab-pane tab="土地信息" key="land">
          <landInfo />
        </a-tab-pane>
        <a-tab-pane tab="车场信息" key="park">
           <parkInfo />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import buildingInfo from './buildingInfo'
import houseInfo from './houseInfo'
import landInfo from './land/landInfo'
import parkInfo from './park/ParkInfo'
import TreeSelect from '../common/treeSelect'
import { typeFilter } from './buildingDictConfig'
const allWidth = {width: '185px'}
export default {
  components: {
    parkInfo,
    landInfo,
    houseInfo,
    TreeSelect,
    buildingInfo,
  },
  data () {
    return {
      typeFilter,
      isCurrent: 0, // 查询条件-是否仅当前机构
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
  // beforeRouteLeave (to, from, next) {
  //   if (to.path.indexOf(from.path) === -1) {
  //     let o = {
  //       key: from.path,
  //       data: {}
  //     }
  //     this.$store.commit('pro/SET_ROUTE_QUERY', o)
  //   }
  //   next()
  // },
  methods: {
    // 处理是否选中仅当前机构
    changeChecked (e) {
      this.isCurrent = Number(e.target.checked)
    },
    tabChange (v) {
      console.log(v)
      this.showKey = v
    },
    organIdChange (value) {
      this.organId = value
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
