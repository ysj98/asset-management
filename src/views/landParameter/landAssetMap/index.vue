<template>
  <div class="land-asset-map">
    <div class="top-block">
      <div class="progress-block left-block">
        <span class="text" style="line-height: 32px">透明度</span>
        <a-progress
          @click="handleProgress"
          type="line"
          class="progress"
          :percent="progress"
          :strokeWidt="20"
          status="normal"
        />
      </div>
      <TreeSelect
        class="left-block tree-select"
        @changeTree="changeTree"
        placeholder="全部领用部门"
      />
      <SG-Select
        class="left-block"
        v-model="layerSchemeId"
        placeholder="请选择方案"
        @change="changeMethod"
      >
        <SG-Option
          v-for="item in methodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></SG-Option>
      </SG-Select>
      <div @click="handleToggleFullscreen" class="full-icon-block">
        <a-icon type="fullscreen" />
      </div>
    </div>
    <div ref="mapWrapperRef" class="middle-content">
      <div
        ref="closeBtn"
        @click="handleToggleFullscreen"
        class="default-close-btn"
      >
        <a-icon type="fullscreen-exit" />
      </div>
      <div v-if="!mapFlag" class="place">初始化地图失败,缺少必要数据</div>
      <div v-else id="leaflet-map"></div>
    </div>
    <div class="bottom-show">
      <!--      <button @click="autoChange">开启自动轮播</button>-->
      <!--      <button @click="autoChange">关闭自动轮播</button>-->
      <!--      <button @click="changeStyle">改变透明度</button>-->
      <div
        class="item"
        v-for="item in operationModeList"
        :key="item.modeOperId"
      >
        <span class="color-block" :style="{ backgroundColor: item.color }">
        </span>
        <div class="text">
          <div style="margin-bottom: 5px">{{ item.operName }}</div>
          <div>{{ `${item.landArea}m²` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
 * todo:提醒页面,未选择方案
 * */

import Vue from "vue";
import LandDetailPopup from "@/views/landParameter/landAssetMap/LandDetailPopup";
import {
  arrayToObj,
  generatePathStyle,
  initMap,
  jumpMapLand,
} from "@/views/mapDrawLand/share";
import TreeSelect from "src/views/common/treeSelect";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import SimpleAssetLandInfo from "@/views/mapDrawLand/components/SimpleAssetLandInfo";

export default {
  /*
   * 土地资产地图预览
   * TODO:全屏/关闭全屏 图标
   * */
  name: "landAssetMap",
  components: {
    TreeSelect,
  },
  data() {
    return {
      progress: 30,
      assetList: [],
      cycleArr: [],
      timer: null,
      idx: 0,
      assetIds: [],
      mapLayers: {},
      mapFlag: false,
      currentAssetInfo: {},
      mapInstance: null,
      polygonLayer: null,
      organId: "",
      methodOptions: [],
      layerSchemeId: "",
      operationModeList: [],
      mapEle: null,
      pathStyle: {},
    };
  },
  methods: {
    handleProgress(e) {
      let allWidth = e.target.offsetWidth;
      if (e.target.className === "ant-progress-bg") {
        allWidth = e.target.parentNode.offsetWidth;
      }
      this.progress = Math.ceil((e.offsetX / allWidth) * 100);
      if (this.mapFlag) {
        this.changeStyle({ fillOpacity: e.offsetX / allWidth });
      }
    },
    changeStyle({ fillOpacity = 0.3 }) {
      this.pathStyle = {
        fillOpacity: fillOpacity,
      };
      this.initAssetLayers(this.assetList);
    },
    // TODO: 无相应 5s后开始自动切换
    initSleepEvent() {
      document.addEventListener("mousemove", () => {
        clearTimeout(timer);
        this.sleep = false;
        const timer = setTimeout(() => {
          this.sleep = true;
        }, 5000);
      });
    },
    closeAutoChange() {
      clearInterval(this.timer);
    },
    async autoChange(flag = true) {
      if (!Object.keys(this.mapLayers).length) {
        console.warn("没有涂层数据");
        return null;
      }
      this.closeAutoChange();
      this.idx = 0;
      if (!flag) {
        return null;
      }
      this.timer = setInterval(() => {
        if (this.idx === Object.keys(this.mapLayers).length) {
          this.idx = 0;
        }
        const layer = this.mapLayers[this.cycleArr[this.idx]];
        const latlng = layer.getCenter();
        this.generateDetailPop({
          layer,
          assetId: this.cycleArr[this.idx],
          latlng,
        });
        console.log("layer.toGeoJSON()", layer.toGeoJSON());
        // const data = layer.toGeoJSON();
        //
        // // TODO:自动切换 "高亮" 对应图块
        // // layer.remove();
        // data.properties.style.fillOpacity = 0.9;
        // this.mapLayers[this.cycleArr[this.idx]] =
        //   this.createLayersFromJson(data);
        // this.createLayersFromJson(layer.toGeoJSON())

        this.idx++;
      }, 2000);
    },
    handleToggleFullscreen() {
      if (!this.mapFlag) {
        this.$SG_Message.error("地图未初始化");
        return null;
      }
      this.toggleFullscreen();
    },
    toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else this.$refs.mapWrapperRef.requestFullscreen();
    },

    initAssetLayers(assetList) {
      this.cycleArr = assetList
        .filter((ele) => ele.layerSchemeDetailVo)
        .map((ele) => ele.assetId);
      this.mapLayers = {};
      this.polygonLayer.clearLayers();
      const geoJsonData = assetList
        .filter((ele) => ele.layerSchemeDetailVo)
        .map((ele) => {
          return {
            assetId: ele.assetId,
            layerDetailId: ele.layerSchemeDetailVo.layerDetailId,
            type: "Feature",
            properties: {
              style: {
                color: ele.modeColour,
              },
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                arrayToObj(ele.layerSchemeDetailVo.coordinateList, 1),
              ],
            },
          };
        });
      this.createLayersFromJson(geoJsonData);
    },
    getDetailDialog({ assetId }, popup) {
      if (!assetId || !popup) {
        console.error("错误");
        return null;
      }
      let Profile = Vue.extend(LandDetailPopup);
      const popupInstance = new Profile({
        propsData: { mapInstance: this.mapInstance },
      }).$mount("#landDetailPopup");
      const req = {
        assetId: assetId,
        // 固定写死2
        resourceType: 2,
      };
      this.$api.drawMap.landBusinessDetail(req).then(
        ({
          data: {
            code,
            data: { landInfo },
            message,
          },
        }) => {
          if (code === "0") {
            console.log(landInfo);
            const data = {
              ...landInfo,
            };
            // 创建构造器
            // 创建 Profile 实例，并挂载到一个元素上。
            console.log("popupInstance", popupInstance);
            popupInstance.init(data);
          } else {
            this.$SG_Message.error(message);
          }
        }
      );
    },
    getDialog({ assetId }) {
      const popupData = this.assetList.filter(
        (ele) => ele.assetId === assetId
      )[0];
      let Profile = Vue.extend(SimpleAssetLandInfo);
      new Profile({ propsData: { assetLandInfo: popupData } }).$mount(
        "#simple-popup"
      );
    },
    generateSimplePop({ layer, latlng, assetId }) {
      const popup = Leaflet.popup({
        className: "custom-popup",
        minWidth: 199,
        maxHeight: 550,
      })
        .setLatLng(latlng)
        .setContent('<div id="simple-popup"></div>')
        .openOn(layer);
      this.mapInstance.openPopup(popup);
      this.$nextTick(() => {
        this.getDialog({ assetId: assetId });
      });
      return popup;
    },
    generateDetailPop({ layer, latlng, assetId }) {
      jumpMapLand(layer, this.mapInstance);
      const popup = Leaflet.popup({
        className: "custom-popup",
        closeButton: false,
        minWidth: 459,
        maxWidth: 500,
        maxHeight: 540,
      })
        .setLatLng(latlng)
        .setContent('<div id="landDetailPopup"></div>')
        .openOn(layer);
      this.mapInstance.openPopup(popup);
      this.$nextTick(() => {
        this.getDetailDialog({ assetId: assetId }, popup);
      });
      return popup;
    },
    initLayerData(layer, { layerDetailId, assetId }) {
      layer._layerDetailId = layerDetailId;
      layer._assetId = assetId;
    },
    initLayer(feature, layer) {
      this.initLayerData(layer, {
        assetId: feature.assetId,
        layerDetailId: feature.layerDetailId,
      });
      layer.on("click", (e) => {
        layer._detailPopup_ = this.generateDetailPop({
          layer,
          latlng: e.latlng,
          assetId: e.target._assetId,
        });
      });
      layer.on("mouseover", (e) => {
        if (layer._detailPopup_) {
          return null;
        }
        layer._popup_ = this.generateSimplePop({
          layer,
          latlng: layer.getBounds().getCenter(),
          assetId: e.target._assetId,
        });
      });
      layer.on("mouseout", () => {
        this.mapInstance.closePopup(layer._popup_);
        layer._detailPopup_ = null;
        layer._popup_ = null;
      });
      layer.addTo(this.polygonLayer);
      this.polygonLayer.addTo(this.mapInstance);
      this.mapLayers = Object.assign({}, this.mapLayers, {
        [feature.assetId]: layer,
      });
    },
    async getLandUseStatistics({ assetList }) {
      const req = {
        assetIdList: assetList.map((ele) => ele.assetId),
      };
      const {
        data: { code, message, data },
      } = await this.$api.drawMap.landUseStatistics(req);
      if (code === "0") {
        this.operationModeList = data;
      } else {
        this.$SG_Message.error(message);
      }
    },
    createLayersFromJson(data) {
      const _this = this;
      return Leaflet.geoJSON(data, {
        style: function (feature) {
          return generatePathStyle(
            {
              color: feature.properties.style.color,
            },
            _this.pathStyle
          );
        },
        onEachFeature: _this.initLayer,
      });
    },
    changeTree(organId) {
      this.organId = organId;
      this.layerSchemeId = "";
      this.getMethodOptions();
    },
    async getMethodOptions() {
      const req = {
        pageSize: 99999,
        pageNum: 1,
        organId: this.organId,
      };
      const {
        data: {
          data: { data },
          code,
          message,
        },
      } = await this.$api.drawMap.queryLayerPageList(req);
      if (code === "0") {
        this.methodOptions = (data || []).map((ele) => {
          return {
            ...ele,
            value: ele.layerId,
            label: ele.schemeName,
            title: ele.schemeName,
          };
        });
      } else {
        this.$SG_Message.error(message);
      }
    },
    initStore() {
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
        this.polygonLayer = null;
        this.cycleArr = [];
      }
      this.mapLayers = {};
    },
    changeMethod(value) {
      this.initStore();
      const res = this.methodOptions.filter((e) => e.value === value)[0];
      if (res) {
        const { organId, layerPath, width, height } = res;
        if (organId && layerPath && width && height) {
          this.mapFlag = true;
          this.$nextTick(() => {
            const temp = layerPath.split("/");
            const options = {
              id: "leaflet-map",
              imageWidth: width,
              imgHeight: height,
              layerPath: temp[temp.length - 1],
              mapInstanceKeyName: "mapInstance",
            };
            initMap.call(this, options);
            this.getAssetList();
            this.organIdByMethod = organId;
          });
        } else {
          this.mapFlag = false;
          console.warn("初始化地图失败,缺少必要数据");
        }
      } else {
        this.$SG_Message.error("系统出错,请刷新后重试");
      }
    },

    async getAssetList() {
      const req = {
        layerSchemeId: this.layerSchemeId,
        assetNameOrCode: this.assetNameOrCode,
        projectIdList: this.currentAssetProject,
        organId: this.organId,
      };
      const {
        data: { data, code, message },
      } = await this.$api.drawMap.queryAssetOpMode(req);
      if (code === "0") {
        this.initAssetLayers(data);
        this.assetList = data;
        this.getLandUseStatistics({ assetList: data });
      } else {
        this.$SG_Message.error(message);
      }
    },
    initFullEvent() {
      const onChange = () => {
        this.$refs.closeBtn.className = document.fullscreenElement
          ? "full-screen-close"
          : "default-close-btn";

        if (document.fullscreenElement) {
          this.autoChange();
        } else {
          this.closeAutoChange();
        }
      };
      document.addEventListener("fullscreenchange", onChange);
    },
  },
  mounted() {
    this.initFullEvent();
  },
};
</script>

<style scoped lang="less">
.land-asset-map {
  height: 100%;
  position: relative;
  background: transparent;
  .bottom-show {
    border-top: 1px solid #edf0f4;
    overflow: auto;
    padding: 20px 60px 10px;
    height: 68px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .item {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: baseline;

      .color-block {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .text {
        line-height: 16px;
        font-size: 12px;
        color: #6d7585;
        text-align: left;
      }
    }
  }
  .middle-content {
    width: 100%;
    height: calc(100% - 70px);
    position: relative;
    .default-close-btn {
      display: none;
    }
    .full-screen-close {
      position: absolute;
      right: 34px;
      top: 20px;
      border-radius: 50%;
      background-color: #fff;
      height: 32px;
      width: 32px;
      text-align: center;
      line-height: 32px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);

      z-index: 999;
    }
    #leaflet-map {
      height: 100%;
      width: 100%;
      background-color: #ffffff;
      .custom-popup {
        width: 400px;
      }
    }
  }
  .top-block {
    display: flex;
    position: absolute;
    top: 16px;
    right: 30px;
    z-index: 999;
    height: 38px;
    .progress-block {
      height: 32px;
      width: 250px;
      border-radius: 16px;
      background-color: #fff;
      padding: 0 16px;
      border: 1px solid #d9d9d9;
      .text {
        width: 40px;
        display: inline-block;
      }
      .progress {
        margin-left: 10px;
        display: inline-block;
        width: 160px;
      }
    }
    .full-icon-block {
      border-radius: 50%;
      background-color: #fff;
      height: 32px;
      width: 32px;
      text-align: center;
      line-height: 32px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    }
    .tree-select {
      width: 200px;
      border-color: #dde1e6;
      border-radius: 16px;
      ::v-deep .ant-select-selection {
        border-radius: 16px;
      }
    }
  }
}
.left-block {
  margin-right: 20px;
}
.place {
  width: 100%;
  height: 100%;
  font-size: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
