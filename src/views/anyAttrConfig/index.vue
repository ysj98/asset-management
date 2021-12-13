<template>
  <div>13212313</div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>

</style>
<!--
 * @Date: 2019-11-05 10:55:52
 * @Author: chen han
 * @Description: 楼盘字典首页
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <div class="top-select">
      </div>
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane tab="土地" key="land">
          <Land />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { ASSET_MANAGEMENT } from "@/config/config.power";
import Land from './land/index.vue'
const allWidth = {width: '185px'}
export default {
  components: {
    Land
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      isCurrent: 0, // 查询条件-是否仅当前机构
      showKey: 'land',
      allWidth,
      organId: ''
    }
  },
  created () {
    this.init()
  },
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
    init(){
      const arr = [
        {
          keyStr:'land'
        }
      ]
      for (let i = 0;i<arr.length;i++){
        if (this.$power.has(arr[i].auth)){
          this.showKey  = arr[i].keyStr
          break;
        }
      }
    }
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
