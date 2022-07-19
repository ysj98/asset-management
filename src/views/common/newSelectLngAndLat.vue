<!--
 * @Date: 2019-11-12 09:36:55
 * @Author: chen han
 * @Description: 从百度地图上选择经纬度
 -->
<template>
  <SG-Modal
    class="sg-map-nav"
    @cancel="hideModal"
    :centered="true"
    title="选择地址"
    v-model="visible"
    width="880px"
    @ok="handleSave"
    :maskClosable="false"
  >
    <div class="select-box">
      <div class="map-search-box">
        <input class="searchMap-in" id="suggestId" placeholder="请输入地点检索" type="text">
        <div id="searchResultPanel" style="position: absolute;border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
        <span class="searchMap-btn pointer" @click="search"><a-icon type="search" /></span>
      </div>
      <div :style="mapClass" ref="map-container" id="map-container"></div>
    </div>
    <slot></slot>
  </SG-Modal> 
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
export default {
  name: 'selectLngAndLat',
  props: {
    oneSearchValue: {
      default: ''
    },
    addressData: {
      default: ''
    },
    // 初始化位置
    point: {
      default: () => ({})
    },
    mapClass: {
      type: Object,
      default: () => ({width: '100%', height: '100%'})
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
      myValue: '',
      isInit: false,
      searchValue: '',
      address: '',
      keyUuid: getUuid(),
      oneShow: true,
      streetStreetNumber: ''
    }
  },
  watch: {
    visible (nv) {
      this.streetStreetNumber = this.addressData
      if (nv && !this.isInit) {
        this.$nextTick(() => {
          // this.map.removeEventListener('click', e)
          this.map = null
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
      if (!window.BMap) {
        return
      }
      this.map = {}
      this.map = new BMap.Map('map-container')
      const cityListControl = new BMap.CityListControl({anchor: BMAP_ANCHOR_TOP_RIGHT})
      // this.map.addControl(cityListControl)
      var geolocation = new BMap.Geolocation();
      // 初始化位置
      if (this.point.lng) {
        this.map.centerAndZoom(new BMap.Point(this.point.lng, this.point.lat), 15)
        this.setPoint(this.point.lng, this.point.lat, 'initOne')
        this.location.lng = this.point.lng
        this.location.lat = this.point.lat
      }
      const _this = this
      // 鼠标缩放
      setTimeout(function () {
        _this.map.setZoom(15)
      }, 1000) // 2秒后放大到11级
      this.map.enableScrollWheelZoom(true)
      // 点击获取经纬度
      this.map.addEventListener('click', (e) => {
        this.location.lng = e.point.lng
        this.location.lat = e.point.lat
        this.setPoint(this.location.lng, this.location.lat)
      })
      let ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
          'input': 'suggestId'
          , "location": this.map
        })
      ac.addEventListener("onhighlight", (e) => {  //鼠标放在下拉列表上的事件
      var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        
        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        document.getElementById('searchResultPanel').innerHTML = str;
      });
      var myValue;
      ac.addEventListener("onconfirm", (e) => {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue; 
        setPlace()
      });
      function setPlace(){
        _this.map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
          var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
          _this.map.centerAndZoom(pp, 18);
          var markerP = new BMap.Marker(pp)
          _this.map.addOverlay(markerP);               // 添加标注
          _this.address = local.xf[0].address
          _this.location.lng = pp.lng
          _this.location.lat = pp.lat
          // _this.streetStreetNumber = 
          _this.$emit('addressFn', _this.address, _this.location, 'zero', myValue)
        }
        var local = new BMap.LocalSearch(_this.map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
       if (!this.point.lng) {
        this.oneShow = false
        document.getElementById('suggestId').value = this.oneSearchValue
        ac.setInputValue(this.oneSearchValue)
        this.search()
      }
    },
    // 新增和移除标注
    setPoint (lng, lat, str) {
      let _this = this
      // 移除上一次标注
      if (this.upMarker) {
        this.map.removeOverlay(this.upMarker)
      }
      // 新增标注
      var point = new BMap.Point(lng, lat);
      var marker = new BMap.Marker(point);        // 创建标注
      var geoc = new BMap.Geocoder()
      this.upMarker = marker
      this.map.addOverlay(marker);
      // 获取详细地址信息
      geoc.getLocation(marker.point, function (rs) {
        if (str !== 'initOne') {
          _this.address = rs.address            // 具体的位置
          _this.streetStreetNumber = `${rs.addressComponents.street}${rs.addressComponents.streetNumber}`
          _this.$emit('addressFn', _this.address, {..._this.location}, 'zero', _this.address) 
        }
      })
    },
    // 搜索位置
    search () {
      this.searchValue = document.getElementById('suggestId').value
      let result = this.searchValue
      if (!window.BMap) {
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
    // 重置数据
    resetData () {
      this.location = {
        lng: '',
        lat: ''
      }
      // this.address = ''
      this.searchValue = ''
      document.getElementById('suggestId').value = ''
      if (this.upMarker) {
        this.map.removeOverlay(this.upMarker)
      }
    },
    // 确定
    handleSave () {
      if (!this.location.lng) {
        this.$message.warning('请选择地址!')
        return
      }
      // console.log(this.streetStreetNumber, {...this.location})
      this.$emit('addressFn', this.streetStreetNumber, {...this.location})
      this.visible = false
    },
    // 取消
    hideModal () {
      this.$emit('cancel')
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .select-box{
    position: relative;
    height: 388px;
    #map-container{
      height: 100% !important;
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

<style lang="less">
.tangram-suggestion-main {
  // left: 210px !important;
  z-index: 9999 !important;
}
.sg-map-nav {
  .sg-scrollbar__wrap {
    min-height: 570px;
  }
  .ant-modal-footer{
    position: relative;
    &::before{
      content: "";
      position: absolute;
      left: 20px;
      right: 20px;
      top: 0;
      border-bottom: 1px solid #dce1e6;
      height: 1px;
      color: #dce1e6;
    }
  }
}
</style>"
