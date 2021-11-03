<!--
 * @Date: 2019-11-09 17:27:17
 * @Description: 资产分类设置
-->
<template>
  <div class="assetClassSet-page">
    <div class="custom-tabs">
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="房屋" key="house">
          <listModel type="house"/>
        </a-tab-pane>
        <a-tab-pane tab="土地" key="land">
          <listModel type="land"/>
        </a-tab-pane>
        <a-tab-pane tab="设备设施" key="facilityAndEquipment">
          <EquipmentCategory />
        </a-tab-pane>
        <a-tab-pane tab="车场" key="carPark">
          <listModel type="carPark"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { SET_DEPRECIATION_METHOD, SET_EQUIPMENT_CODE_SUB } from '@/store/types/platformDictTypes'
import listModel from "./listModel"
import EquipmentCategory from './child/EquipmentCategory/index'
export default {
  components: {
    listModel,
    EquipmentCategory
  },
  data () {
    return {
      showKey: 'facilityAndEquipment',
    }
  },
  created () {
    this.$store.dispatch('platformDict/getPlatformDict',{
      code: 'DEPRECIATION_METHOD',
      type: SET_DEPRECIATION_METHOD
    })
    this.$store.dispatch('platformDict/getPlatformDict',{
      code: 'EQUIPMENT_CODE_SUB',
      type: SET_EQUIPMENT_CODE_SUB
    })
  },
  methods: {
    tabChange (v) {
      this.showKey = v
    }
  }
}
</script>
<style lang="less" scoped>
  .assetClassSet-page{
    position: relative;
    .custom-tabs{
      height: 100%;
    }
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
</style>
