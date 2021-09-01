<!--
 * @Date: 2020-09-02 14:28:28
 * @Description: 资产地图
 * @Author: chh
-->
<template>
  <a-spin :spinning="loading">
    <div class="assetMap-page">
      <!-- 地图容器 -->
      <div class="asset-map-box" :id="mapDomId"></div>
      <!-- 搜索弹窗 -->
      <div class="suspensionRightBlock">
        <suspensionRightBlock @search="handleSearchMap" @selectCity="selectCity"></suspensionRightBlock>
      </div>
      <!-- 显示弹窗 -->
      <div class="show-map-detail" v-show="showDetailModal">
        <component
          :is="currentTabComponent"
          :detailInfo="detailInfo"
          @close="closeDetailMap"
        ></component>
      </div>
    </div>
  </a-spin>
</template>
<script>
import Tools, {calc} from "@/utils/utils"
import suspensionRightBlock from "./component/suspensionRightBlock"
import mapLandIcon from "./images/map_land.png"
import mapHouseIcon from "./images/map_house.png"
import mapLandTipIcon from "./images/map_land_tip.png"
import mapHouseTipIcon from "./images/map_house_tip.png"
import landMapDetail from "./component/landMapDetail"
import houseMapDetail from "./component/houseMapDetail"
var markerMap = {
  "1": {
    name: "楼栋: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapHouseIcon,
    tipIcon: mapHouseTipIcon,
  },
  "2": {
    name: "土地: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapLandIcon,
    tipIcon: mapLandTipIcon,
  },
}
export default {
  name: "AssetMapPage",
  components: {
    suspensionRightBlock,
    landMapDetail,
    houseMapDetail,
  },
  data() {
    return {
      mapDomId: "asset-map-box",
      loading: false, // 全局
      loadingDetail: false, // 详情
      map: null,
      markerStore: [],
      ComplexCustomOverlay: null,
      currentTabComponent: "landMapDetail", // 当前弹窗详情
      showDetailModal: false, // 当前是否显示地图详情
      detailInfo: {}, // 土地信息
    }
  },
  mounted() {
    this.createBaiduMap()
  },
  methods: {
    // 点击地图标注
    handleClickMap(obj) {
      console.log("拿到数据=>", obj)
      let { resourceType } = obj
      let detailMap = {
        "1": "houseMapDetail",
        "2": "landMapDetail",
      }
      this.showDetailModal = true
      this.currentTabComponent = detailMap[String(resourceType)]
      this.queryMapDetail(obj)
    },
    // 关闭详情弹窗
    closeDetailMap(type) {
      this.showDetailModal = false
    },
    // 请求地图详情
    queryMapDetail(obj) {
      let { resourceId, resourceType } = obj
      let data = { resourceId, resourceType }
      this.loadingDetail = true
      this.$api.land
        .mapDetail(data)
        .then((res) => {
          if (+res.data.code === 0) {
            let result = res.data.data || {}
            // 楼栋信息
            if (String(resourceType) === "1") {
              this.detailInfo = { ...result.buildInfo }
              // 修改价值元
              if (this.detailInfo.assetValue) {
                this.detailInfo.assetValue =  Math.floor(calc.divide(Number(this.detailInfo.assetValue), 10000) * 100) / 100
              }
              // 修改面积
              if (this.detailInfo.assetArea) {
                this.detailInfo.assetArea = Number(this.detailInfo.assetArea).toFixed(2)
              }
              if (this.detailInfo.builtArea) {
                this.detailInfo.builtArea = Number(this.detailInfo.builtArea).toFixed(2)
              }
            }
            // 土地信息
            if (String(resourceType) === "2") {
              this.detailInfo = { ...result.landInfo }
              // 修改价值元
              if (this.detailInfo.originalValue) {
                this.detailInfo.originalValue = Math.floor(calc.divide(Number(this.detailInfo.originalValue), 10000) * 100) / 100
              }
              // 修改价值元
              if (this.detailInfo.marketValue) {
                this.detailInfo.marketValue = Math.floor(calc.divide(Number(this.detailInfo.marketValue), 10000) * 100) / 100
              }
              // 修改面积
              if (this.detailInfo.landArea) {
                this.detailInfo.landArea = Number(this.detailInfo.landArea).toFixed(2)
              }
            }
          } else {
            this.$message.error(res.data.message || res.data.msg)
          }
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
    restMap() {
      Object.assign(this, {
        showDetailModal: false, // 当前是否显示地图详情
        detailInfo: {}, // 土地信息
      })
    },
    // 搜索地图全量
    handleSearchMap(data = {}) {
      console.log("拿到查询参数=>", data)
      this.restMap()
      this.loading = true
      this.$api.land
        .mapData(data)
        .then((res) => {
          if (+res.data.code === 0) {
            let result = res.data.data || []
            this.removeMarker()
            this.createIconMarker(result)
          } else {
            this.$message.error(res.data.message || res.data.msg)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 选择城市地图对应放大
    selectCity(value) {
      let city = value
      this.map.centerAndZoom(city,11)
    },
    // 移除所有标注
    removeMarker() {
      this.map.clearOverlays()
    },
    // 创建标注
    createIconMarker(result = []) {
      let ComplexCustomOverlay = this.ComplexCustomOverlay
      result.forEach((item) => {
        let { resourceName, resourceType, longitude, latitude } = item
        if (longitude && latitude) {
          let myCompOverlay = new ComplexCustomOverlay(
            new BMap.Point(longitude, latitude),
            { ...item }
          )
          this.map.addOverlay(myCompOverlay)
        }
      })
    },
    // 创建实例
    createBaiduMap() {
      var self = this
      var { mapDomId } = this
      // 百度地图API功能
      // TODO:修改缩放比列限制
      var map = new BMap.Map(mapDomId, { minZoom: 5, maxZoom: 20 })
      this.map = map
      map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
      var point = new BMap.Point(107.4, 33.42)
      map.centerAndZoom(point, 5)
      // 复杂的自定义覆盖物
      function ComplexCustomOverlay(
        point,
        opt = { resourceType: "1", resourceName: "" }
      ) {
        this._point = point // 坐标实例
        this.opt = opt
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay()
      ComplexCustomOverlay.prototype.initialize = function(map) {
        console.log("初始化进来=>", this)
        this._map = map
        // 拿取全局配置
        var configOpt = markerMap[this.opt.resourceType]
        // 创建父元素
        var div = (this._div = document.createElement("div"))
        var style = {
          position: "absolute",
          zIndex: "-1",
          width: "28px",
          height: "35px",
          cursor: "pointer",
        }
        for (let key in style) div.style[key] = style[key]

        // 创建图片容器
        var img = document.createElement("img")
        var imgStyle = {
          width: "100%",
          height: "100%",
          backgroundSize: "100% 100%",
        }
        for (let key in imgStyle) img.style[key] = imgStyle[key]
        img.src = configOpt.markerIcon
        div.appendChild(img)

        // 创建提示容器
        var tipDiv = document.createElement("div")
        var tipDivStyle = {
          display: "none",
          position: "absolute",
          zIndex: "1",
          top: "-32px",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          backgroundColor: configOpt.backgroundColor,
          boxShadow: configOpt.boxShadow,
          color: configOpt.color,
          border: configOpt.border,
          borderRadius: "15px",
          padding: "5px 15px",
        }
        for (let key in tipDivStyle) tipDiv.style[key] = tipDivStyle[key]
        tipDiv.appendChild(
          document.createTextNode(configOpt.name + this.opt.resourceName)
        )
        // 创建箭头
        var arrow = document.createElement("span")
        var arrowStyle = {
          position: "absolute",
          border: "10px solid",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "-17px",
          borderColor: "rgba(0,0,0,0.6) transparent transparent transparent",
        }
        for (let key in arrowStyle) arrow.style[key] = arrowStyle[key]
        tipDiv.appendChild(arrow)
        div.appendChild(tipDiv)
        var that = this
        div.onmouseover = function() {
          // this这里的this是指dom
          this.style.zIndex = Tools.getUuid()
          tipDiv.style.display = "block"
        }
        div.onmouseout = function() {
          tipDiv.style.display = "none"
        }
        div.onclick = function() {
          console.log("点击数据")
          self.handleClickMap({ ...that.opt })
          return false
        }
        map.getPanes().labelPane.appendChild(div)

        return div
      }
      ComplexCustomOverlay.prototype.draw = function() {
        var map = this._map
        var pixel = map.pointToOverlayPixel(this._point)
        this._div.style.left = pixel.x + "px"
        this._div.style.top = pixel.y - 30 + "px"
      }
      this.ComplexCustomOverlay = ComplexCustomOverlay
    },
  },
}
</script>
<style lang="less" scoped>
.assetMap-page {
  position: relative;
  height: calc(100vh - 40px);
  .asset-map-box {
    height: 100%;
  }
}
.suspensionRightBlock {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
.show-map-detail {
  position: absolute;
  top: 12px;
  left: 12px;
}
</style>
