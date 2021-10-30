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
          <EquipmentKind />
        </a-tab-pane>
        <a-tab-pane tab="车场" key="carPark">
          <listModel type="carPark"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import listModel from "./listModel"
import EquipmentKind from './child/EquipmentKind/index'
export default {
  components: {
    listModel,
    EquipmentKind
  },
  data () {
    return {
      showKey: 'facilityAndEquipment',
    }
  },
  created () {
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
