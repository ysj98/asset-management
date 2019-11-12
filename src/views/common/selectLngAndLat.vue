<!--
 * @Date: 2019-11-12 09:36:55
 * @Author: chen han
 * @Description: 从百度地图上选择经纬度
 -->
<template>
  <SG-Modal
    @cancel="hideModal"
    :title="title"
    v-model="visible"
    width="880px"
    @ok="handleSave"
    :maskClosable="false"
    :noPadding="true"
  >
    <div class="select-box">
      <div class="map-search-box">
        <input class="searchMap-in" v-model="searchValue" placeholder="请输入地点检索" type="text">
        <span class="searchMap-btn pointer" @click="search"><a-icon type="search" /></span>
      </div>
      <div class="map-box" ref="map-container" id="map-container"></div>
    </div>
  </SG-Modal>    
</template>
<script>
export default {
  props: {
    title: {
      default: '选择地址'
    }
  },
  data () {
    return {
      visible: false,
      location: {
        lng: '',
        lat: ''
      },
      map: {},
      ac: {},
      isInit: false,
      searchValue: ''
    }
  },
  watch: {
    visible (nv) {
      if (nv && !this.isInit) {
        this.$nextTick(() => {
          this.init()
        })
      }
      if (!nv) {
        this.resetData()
      }
    }
  },
  methods: {
    // 初始化地图
    init () {
      if (!BMap) {
        return
      }
      this.map = new BMap.Map('map-container')
      this.map.centerAndZoom(new BMap.Point(113.275, 23.117), 10)
      // 地图缩放控件
      // const topLeftControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})
      // 城市选择控件
      const cityListControl = new BMap.CityListControl({anchor: BMAP_ANCHOR_TOP_RIGHT})
      // 比例尺控件
      // const topLeftNavigation = new BMap.NavigationControl()
      // this.map.addControl(topLeftControl)
      // this.map.addControl(topLeftNavigation)
      this.map.addControl(cityListControl)
      const _this = this
      // 鼠标缩放
      setTimeout(function () {
        _this.map.setZoom(11)
      }, 2000) // 2秒后放大到11级
      this.map.enableScrollWheelZoom(true)
      // 点击获取经纬度
      this.map.addEventListener('click', (e) => {
        _this.location.lng = parseFloat(e.point.lng).toFixed(3)
        _this.location.lat = parseFloat(e.point.lat).toFixed(3)
        console.log('gggg', _this.location)
        // 移除上一次标注
        if (_this.upMarker) {
          _this.map.removeOverlay(_this.upMarker)
        }
        // 新增标注
        var point = new BMap.Point(_this.location.lng, _this.location.lat);
        var marker = new BMap.Marker(point);        // 创建标注
        _this.upMarker = marker
        _this.map.addOverlay(marker);
      })
    },
    // 搜索位置
    search () {
      let result = this.searchValue
      if (!BMap) {
        return
      }
      if(result.length ==0){
          return false
      }
      var local = new BMap.LocalSearch(this.map, {
          renderOptions:{map: this.map}
      });
      local.search(result);
    },
    resetData () {
      this.location = {
        lng: '',
        lat: ''
      }
      this.searchValue = ''
      if (this.upMarker) {
        this.map.removeOverlay(this.upMarker)
      }
    },
    handleSave () {
      this.$emit('change', {...this.location})
    },
    hideModal () {
      console.log('取消')
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .select-box{
    position: relative;
    margin: 30px;
    height: 485px;
    .map-box{
      width: 100%;
      height: 100%;
    }
    .map-search-box{
      position: absolute;
      display: flex;
      width: 425px;
      height: 38px;
      left: 20px;
      top: 20px;
      z-index: 1;
      box-shadow:0px 2px 4px 0px rgba(0, 0, 0, 0.3);
      border-radius:4px;
      .searchMap-in{
        background: #fff;
        flex: 1;
        outline: none;
        border: none;
        padding-left: 19px;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
      }
      .searchMap-btn{
        flex: 0 0 57px;
        height: auto;
        background: #1890FF;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
        text-align: center;
        line-height: 38px;
        color: #fff;
        font-size: 18px;
      }
    }
  }
</style>
