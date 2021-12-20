<template>
  <div class="land-asset-map">
    <div class="top-block">
      <TreeSelect
        class="left-block"
        @changeTree="changeTree"
        placeholder="全部领用部门"
      />
      <SG-Select
        left-block
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
      <div @click="toggleFullscreen" class="full-screen-open"></div>
    </div>
    <div ref="mapWrapperRef" class="middle-content">
      <div ref="closeBtn" @click="toggleFullscreen" class="default-close-btn">
        关闭
      </div>
      <div v-if="!mapFlag" class="place">初始化地图失败,缺少必要数据</div>
      <div v-else id="leaflet-map"></div>
    </div>
    <div class="bottom-show">
      <div
        class="item"
        v-for="item in operationModeList"
        :key="item.modeOperId"
      >
        <span class="color-block" :style="{ backgroundColor: item.modeColour }">
        </span>
        <span>{{ item.modeOperName }}</span>
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
const baseUrl = "http://192.168.1.7:8088/";
import { arrayToObj, generatePathStyle } from "@/views/mapDrawLand/share";
import TreeSelect from "src/views/common/treeSelect";
import Leaflet from "leaflet";
import LRasterCoords from "leaflet-rastercoords";
import "leaflet/dist/leaflet.css";
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
      mapFlag: false,
      currentAssetInfo: {},
      mapInstance: null,
      polygonLayer: null,
      organId: "",
      methodOptions: [],
      layerSchemeId: "",
      assetList: [],
      operationModeList: [],
      mapEle: null,
    };
  },
  methods: {
    toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else this.$refs.mapWrapperRef.requestFullscreen();
    },

    initAssetLayers(assetList) {
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
    getDialog({ assetId }) {
      if (!assetId) {
        console.error("错误");
        return null;
      }
      console.log("assetId", assetId);
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
            let Profile = Vue.extend(LandDetailPopup);
            // 创建 Profile 实例，并挂载到一个元素上。
            new Profile({ propsData: { popupData: data } }).$mount(
              "#landDetailPopup"
            );
          } else {
            this.$SG_Message.error(message);
          }
        }
      );
    },
    generatePop(layer) {
      layer.on("click", (e) => {
        const popup = Leaflet.popup({
          className: "custom-popup",
          minWidth: 459,
          maxWidth: 500,
          maxHeight: 540,
        })
          .setLatLng(e.latlng)
          .setContent('<div id="landDetailPopup"></div>')
          .openOn(layer);
        this.mapInstance.openPopup(popup);
        this.$nextTick(() => {
          this.getDialog({ assetId: e.target._assetId });
        });
      });
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
      this.generatePop(layer, feature);
      layer.addTo(this.polygonLayer);
      this.polygonLayer.addTo(this.mapInstance);
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
          return generatePathStyle({
            color: feature.properties.style.color,
          });
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
      }
      // this.mapLayers = {};
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
            };
            this.initMap(options);
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
    /*
     * 地图初始化
     * */
    initMap({ id, imageWidth, imgHeight, layerPath }) {
      this.polygonLayer = new Leaflet.layerGroup();
      this.mapInstance = Leaflet.map(id, {
        crs: Leaflet.CRS.Simple,
        attributionControl: false,
        zoomControl: false,
      });
      new Leaflet.Control.Zoom({ position: "bottomright" }).addTo(
        this.mapInstance
      );
      const imgInfo = [imageWidth, imgHeight];
      const rc = new LRasterCoords(this.mapInstance, imgInfo);
      this.mapInstance.setMaxZoom(rc.zoomLevel());
      this.mapInstance.setView(rc.unproject([imgInfo[0], imgInfo[1]]), 2);
      Leaflet.tileLayer(`${baseUrl}/scheme/${layerPath}/{z}/{x}/{y}.png`, {
        noWrap: true,
        // bounds: rc.getMaxBounds(),
        maxNativeZoom: rc.zoomLevel(),
      }).addTo(this.mapInstance);
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
        this.assetList = data;
        this.initAssetLayers(data);
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
    padding: 10px 60px;
    .item {
      margin-right: 40px;
      display: flex;
      align-items: center;
      .color-block {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
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
      width: 100px;
      height: 100px;
      background-color: blue;
      position: absolute;
      right: 0;
      top: 0;

      z-index: 3;
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
    top: 0;
    right: 0;
    z-index: 3;
    .full-screen-open {
      width: 100px;
      height: 100px;
      background-color: black;
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
