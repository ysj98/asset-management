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
        <suspensionRightBlock @search="handleSearchMap"></suspensionRightBlock>
      </div>
      <!-- 显示弹窗 -->
      <div class="show-map-detail" v-show="showDetailModal">
        <component
          :is="currentTabComponent"
          :detailInfo="detailInfo"
          :organId="organId"
          @close="closeDetailMap"
        ></component>
      </div>
      <div class="list-container" v-show="showDetailListModal">
        <div class="list-container-top">
          <span>资产列表</span>
          <a-icon @click="closeDetailListModal" type="close" />
        </div>
        <div class="list-container-line"></div>
        <div class="list-container-content">
          <a-table v-bind="listTableOptions" :dataSource="listTableDataSourceCom">
            <!-- 资产名称 -->
            <template #resourceName="text,record,index">
              <a @click="handleAssetItemClick(record)">{{record.resourceName}}</a>
            </template>
          </a-table>
          <a-pagination
            v-bind="listPageObj"
            size="small"
            :total="listTableOptions.dataSource.length"
            @change="listTableChangePage" />
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import Tools, {calc, getArrayRepeat, handleEnumerationConversion} from "@/utils/utils"
import suspensionRightBlock from "./component/suspensionRightBlock"
import landMapDetail from "./component/landMapDetail"
import houseMapDetail from "./component/houseMapDetail"
import EquipmentDetail from "@/views/landParameter/assetMap/component/EquipmentDetail";
import YardDetail from "@/views/landParameter/assetMap/component/YardDetail";
import {assetMapResourceTypeOptions, markerMap, detailInfoKey,MAP_ASSET_TYPE_CODE} from './share'
export default {
  name: "AssetMapPage",
  components: {
    suspensionRightBlock,
    landMapDetail,
    houseMapDetail,
    EquipmentDetail,
    YardDetail
  },
  data() {
    return {
      // 右边所属机构 id
      organId:'',
      listPageObj:{
        current:1
      },
      listTableOptions:{
        rowKey: function (record){
          return record.resourceId
        },
        pagination: false,
        scroll:{
          y: 400
        },
        bordered:true,
        dataSource: [],
        columns: [
          {
            title: '序号',
            key: 'index',
            customRender:(text,record,index)=>{
              return ((this.listPageObj.current -1 ) * 10) + (index + 1)
            }
          },
          {
            title: '资产大类',
            customRender:this.generateResourceType,
            key: 'resourceType'
          },
          {
            title: '资产名称',
            key:'resourceName',
            scopedSlots: {
              customRender: 'resourceName'
            }
          }
        ]
      },
      mapDomId: "asset-map-box",
      loading: false, // 全局
      loadingDetail: false, // 详情
      map: null,
      markerStore: [],
      ComplexCustomOverlay: null,
      currentTabComponent: landMapDetail, // 当前弹窗详情
      showDetailModal: false, // 当前是否显示地图详情
      showDetailListModal: false,
      detailInfo: {}, // 土地信息
    }
  },
  computed:{
    listTableDataSourceCom(){
      let idx = (this.listPageObj.current-1) * 10
      return this.listTableOptions.dataSource.slice(idx, idx + 10)
    }
  },
  mounted() {
    this.createBaiduMap()
  },
  methods: {
    listTableChangePage(val){
      this.listPageObj.current = val
    },
    handleAssetItemClick(record){
      let SOURCE = 'list'
      this.handleOpenAssetDetail(record,SOURCE)
    },
    generateResourceType(text,record){
      return  handleEnumerationConversion(record.resourceType, assetMapResourceTypeOptions, ['value', 'name'])
    },
    // 打开 重复点位 列表
    handleOpenAssetList(data){
      this.listPageObj.current = 1
      this.listTableOptions.dataSource = data
      this.showDetailListModal = true
      this.closeDetailMap()
    },
    // 打开 地图标注 详情
    handleOpenAssetDetail(obj,SOURCE) {
      console.log("拿到数据=>", obj)
      let { resourceType } = obj
      const {HOUSE,LAND,YARD,EQUIPMENT}  = MAP_ASSET_TYPE_CODE
      let detailMap = {
        [HOUSE]: houseMapDetail,
        [LAND]: landMapDetail,
        [YARD]: YardDetail,
        [EQUIPMENT]: EquipmentDetail
      }
      this.showDetailModal = true
      if (SOURCE !== 'list'){
        this.closeDetailListModal()
      }
      this.currentTabComponent = detailMap[String(resourceType)]
      this.queryMapDetail(obj)
    },
    // 关闭详情弹窗
    closeDetailMap() {
      this.showDetailModal = false
    },
    closeDetailListModal(){
      this.showDetailListModal = false
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
            this.detailInfo = { ...result[detailInfoKey[String(resourceType)]] }
            // 楼栋信息
            if (String(resourceType) === MAP_ASSET_TYPE_CODE.HOUSE) {
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
            if (String(resourceType) === MAP_ASSET_TYPE_CODE.LAND) {
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
            // 设备设施信息
            if (String(resourceType) === MAP_ASSET_TYPE_CODE.EQUIPMENT) {
              // 修改价值元
              if (this.detailInfo.assetValue) {
                this.detailInfo.assetValue =  Math.floor(calc.divide(Number(this.detailInfo.assetValue), 10000) * 100) / 100
              }
            }
            // 车场信息
            if (String(resourceType) === MAP_ASSET_TYPE_CODE.YARD) {
              // 修改价值元
              if (this.detailInfo.assetValue) {
                this.detailInfo.assetValue =  Math.floor(calc.divide(Number(this.detailInfo.assetValue), 10000) * 100) / 100
              }
              // 修改面积
              if (this.detailInfo.assetArea) {
                this.detailInfo.assetArea = Number(this.detailInfo.assetArea).toFixed(2)
              }
              if (this.detailInfo.placeArea) {
                this.detailInfo.placeArea = Number(this.detailInfo.placeArea || 0).toFixed(2)
              }
              // TODO:车场类型 特殊处理
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
        showDetailListModal: false,
        showDetailModal: false, // 当前是否显示地图详情
        detailInfo: {}, // 土地信息
      })
    },
    // 搜索地图全量
    handleSearchMap(data = {}) {
      console.log("拿到查询参数=>", data)
      if (data){
        this.organId  = data.organId
      }
      this.restMap()
      this.loading = true
      this.$api.land
        .mapData(data)
        .then((res) => {
          if (+res.data.code === 0) {
            let result = res.data.data || []
            result = getArrayRepeat(result,(ele)=>(ele.longitude + ele.latitude))
            this.removeMarker()
            this.createIconMarker(result)
            if(data._periphery){
              this.getBoundary(data._periphery)
            }
          } else {
            this.$message.error(res.data.message || res.data.msg)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getBoundary(address) {
      const _this = this;
      let bdary = new BMap.Boundary();
      //定义中国东南西北端点，作为第一层
      const pNW = { lat: 59.0, lng: 73.0 };
      const pNE = { lat: 59.0, lng: 136.0 };
      const pSE = { lat: 3.0, lng: 136.0 };
      const pSW = { lat: 3.0, lng: 73.0 };
      //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
      let pArray = [];
      pArray.push(pNW);
      pArray.push(pSW);
      pArray.push(pSE);
      pArray.push(pNE);
      pArray.push(pNW);
      if (address === '全国'){
        _this.map.setViewport(pArray)
        return null
      }
      bdary.get(`${address}`, function(rs) {
        console.log('address',address)
        //获取行政区域
        let count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
          alert("未能获取当前输入行政区域");
          return;
        }
        let pointArray = [];
        for (let i = 0; i < count; i++) {
          const ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: "#ff0000",
            fillOpacity: 0.01
          });
          //建立多边形覆盖物
          _this.map.addOverlay(ply); //添加覆盖物
          const path = ply.getPath();
          pointArray = pointArray.concat(path);
          // //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
          pArray = pArray.concat(path);
          pArray.push(pArray[0]);
        }
        // 添加全国 遮罩层
        const plyall = new BMap.Polygon(pArray, {
          strokeOpacity: 0.0000001,
          strokeColor: "#fff",
          strokeWeight: 0.00001,
          fillColor: "#ffffff",
          fillOpacity: 0.5
        }); //建立多边形覆盖物
        _this.map.addOverlay(plyall);
        _this.map.setViewport(pointArray); //调整视野
      });
    },
    // 移除所有标注
    removeMarker() {
      this.map.clearOverlays()
    },
    // 创建标注
    createIconMarker(result = []) {
      let ComplexCustomOverlay = this.ComplexCustomOverlay
      result.forEach((item) => {
        let { resourceName, resourceType, longitude, latitude } = item[0]
        if (longitude && latitude) {
          let myCompOverlay = new ComplexCustomOverlay(
            new BMap.Point(longitude, latitude),
            item
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
        opt = [{ resourceType: "1", resourceName: "" }]
      ) {
        // 是否 有重复 点位 的资源
        this.moreFlag = opt.length && opt.length > 1
        this.allOpt = opt
        this._point = point // 坐标实例
        this.opt = opt[0]
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay()
      ComplexCustomOverlay.prototype.initialize = function(map) {
        let that = this
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
        let tipStr = configOpt.name + this.opt.resourceName
        if(that.moreFlag){
          tipStr = '请点击查看资产列表'
        }
        tipDiv.appendChild(
          document.createTextNode(tipStr)
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
          if (that.moreFlag){
            self.handleOpenAssetList(that.allOpt)
          }else {
            self.handleOpenAssetDetail({ ...that.opt })
          }
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
.list-container{
  max-height: 600px;
  overflow: auto;

  position: absolute;
  right: 470px;
  top: 10px;

  max-width: 400px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 1px 2px 2px 0px rgb(0 0 0 / 14%);
  &-line{
    height: 1px;
    //background-color: #fff;
  }
  &-top{
    height: 32px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 20px;
    //border-bottom: 1px solid #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-content{
    padding: 20px;
    //padding: 15px 0;
    //background-color: #fff;
  }
}
</style>
