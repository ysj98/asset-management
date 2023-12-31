<template>
  <div class="land-asset-map">
    <div class="top-block">
      <div class="progress-block left-block">
        <span class="text" style="line-height: 32px">透明度</span>
        <a-progress @click="handleProgress" type="line" class="progress" :percent="progress" :strokeWidt="20"
          status="normal" />
      </div>
      <TreeSelect class="left-block tree-select" @changeTree="changeTree" placeholder="请选择" />
      <SG-Select class="left-block" v-model="layerSchemeId" placeholder="请选择方案" @change="changeMethod">
        <SG-Option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value"></SG-Option>
      </SG-Select>
      <div @click="handleToggleFullscreen" class="full-icon-block">
        <a-icon type="fullscreen" />
      </div>
    </div>
    <div ref="mapWrapperRef" class="middle-content">
      <div ref="closeBtn" @click="handleToggleFullscreen" class="default-close-btn">
        <a-icon type="fullscreen-exit" />
      </div>
      <div v-if="!mapFlag" class="place">
        {{ errorText }}
      </div>
      <div v-else id="leaflet-map"></div>
      <AssetLandList ref="AssetLandListRef" class="filter-block" :class="{ 'filter-block-full': isFull }" v-if="mapFlag"
        :popupDataSource="popupDataSource" :previewMode="true" @handleDraw="handleClickAsset"
        @initAssetLayers="initAssetLayers" />
    </div>
    <div class="bottom-show">
      <!--      <button @click="autoChange">开启自动轮播</button>-->
      <!--      <button @click="autoChange">关闭自动轮播</button>-->
      <!--      <button @click="changeStyle">改变透明度</button>-->
      <div v-if="mapFlag" class="summary">
        <div>
          <span class="title">宗地：</span>
          <span>{{ parcel }}块</span>
        </div>
        <div v-if="!hasSelf">
          <span class="title">自有：</span>
          <span>{{ allAssetArea }}m²</span>
        </div>
      </div>
      <div class="item" v-for="item in operationModeList" :key="item.modeOperId">
        <span class="color-block" :style="{ backgroundColor: item.color }"> </span>
        <div class="text">
          <div style="margin-bottom: 5px">{{ item.operName }}</div>
          <div>{{ `${item.landArea}m²` }}</div>
        </div>
      </div>
      <div class="export" v-if="mapFlag">
        <SG-Button type="primary" icon="import" :loading="exportLoading" @click="handleExport">导出</SG-Button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import LandDetailPopup from '@/views/landParameter/landAssetMap/LandDetailPopup';
import AssetLandList from '@/views/mapDrawLand/AssetLandList';
import { arrayToObj, generatePathStyle, getOffsetNum, initMap, jumpMapLand, markerIcon } from '@/views/mapDrawLand/share';
import TreeSelect from 'src/views/common/treeSelect';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SimpleAssetLandInfo from '@/views/mapDrawLand/components/SimpleAssetLandInfo';
import { queryLayerById } from '@/views/mapDrawLand/share';
import { handleDownloadFile } from '@/utils/utils';
export default {
  /*
   * 土地资产地图预览
   * */
  name: 'landAssetMap',
  components: {
    TreeSelect,
    AssetLandList,
  },
  data() {
    return {
      exportLoading: false,
      parcel: 0,
      allAssetArea: 0,
      currentSelectLayer: null,
      oldPathOptions: {},
      isFull: false,
      selectedLayerInfo: {},
      popupDataSource: [],
      autoChaneIngFlag: false,
      progress: 11,
      assetList: [],
      cycleArr: [],
      idx: 0,
      assetIds: [],
      mapLayers: {},
      mapFlag: false,
      currentAssetInfo: {},
      mapInstance: null,
      polygonLayer: null,
      organId: '',
      methodOptions: [],
      layerSchemeId: '',
      operationModeList: [],
      mapEle: null,
      pathStyle: {
        fillOpacity: 0.11,
      },
      sleepTimer: null,
      timer: null,
      hasSelf: false, // operationModeList是否含有自有项目
    };
  },
  computed: {
    errorText() {
      if (!this.layerSchemeId) {
        return '请先选择方案';
      } else {
        return '当前方案不存在背景图';
      }
    },
  },
  methods: {
    async handleExport() {
      this.exportLoading = true;
      try {
        const req = this.$refs.AssetLandListRef.handleGetListReq();
        const responseData = await this.$api.drawMap.exportLandDetails(req);
        if (responseData.data.type === 'application/json') {
          const enc = new TextDecoder('utf-8');
          responseData.data.arrayBuffer().then((buffer) => {
            let data = JSON.parse(enc.decode(new Uint8Array(buffer))) || {};
            console.log('data', data);
            this.$SG_Message.error(data.message);
          });
        } else {
          handleDownloadFile({
            data: responseData.data,
            fileName: '已绘制地块资产列表.xls',
          });
        }
      } finally {
        this.exportLoading = false;
      }
    },
    // 资产列表 点击具体资产对应事件
    handleClickAsset({ assetItemInfo }, { needOpenDetailPop } = { needOpenDetailPop: false }) {
      if (this.currentSelectLayer) {
        this.currentSelectLayer.setStyle(this.oldPathOptions);
      }
      console.log({ assetItemInfo });
      const { assetId } = assetItemInfo;
      const layer = this.mapLayers[assetId];
      this.currentSelectLayer = layer;
      const latlng = layer.getCenter();
      jumpMapLand(layer, this.mapInstance);
      if (needOpenDetailPop) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateDetailPop({
              layer,
              assetId: this.cycleArr[this.idx],
              latlng,
            });
          }, 300);
        });
      }

      const { color, fillColor, fillOpacity, weight } = layer.options;

      this.oldPathOptions = {
        color,
        fillColor,
        fillOpacity,
        weight,
      };
      layer.setStyle({
        weight: 4,
        color: 'white',
        fillOpacity: Math.min(1, this.pathStyle.fillOpacity + 0.3),
      });
    },
    handleProgress(e) {
      if (!['ant-progress-inner', 'ant-progress-bg'].includes(e.target.className)) {
        return null;
      }
      let allWidth = e.target.offsetWidth;
      if (e.target.className === 'ant-progress-bg') {
        allWidth = e.target.parentNode.offsetWidth;
      }
      this.progress = Math.ceil((e.offsetX / allWidth) * 100);
      if (this.mapFlag) {
        this.changeStyle({ fillOpacity: e.offsetX / allWidth });
      }
    },
    // 改变透明度
    changeStyle({ fillOpacity = 0.11 }) {
      this.pathStyle = {
        fillOpacity: fillOpacity,
      };
      this.initAssetLayers(this.assetList, { needGetLandUseStatistics: false });
    },
    closeAutoChange() {
      console.log('关闭了定时器');
      clearInterval(this.timer);
      this.autoChaneIngFlag = false;
    },
    async autoChange(flag = true) {
      const _this = this;
      if (!Object.keys(this.mapLayers).length) {
        console.warn('没有图层数据');
        return null;
      }
      this.closeAutoChange();
      this.idx = 0;
      if (!flag) {
        return null;
      }
      cycleFn();
      this.autoChaneIngFlag = true;
      this.timer = setInterval(cycleFn, 5000);
      function cycleFn() {
        if (_this.idx === Object.keys(_this.mapLayers).length) {
          _this.idx = 0;
        }
        _this.$nextTick(() => {
          _this.handleClickAsset({ assetItemInfo: { assetId: _this.cycleArr[_this.idx] } }, { needOpenDetailPop: true });
        });
        _this.idx++;
      }
    },
    handleToggleFullscreen() {
      if (!this.mapFlag) {
        this.$SG_Message.error('地图未初始化');
        return null;
      }
      this.toggleFullscreen();
    },
    toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else this.$refs.mapWrapperRef.requestFullscreen();
    },
    handleSummary() {
      this.parcel = this.assetList.length;
      this.allAssetArea = this.assetList.reduce((pre, cur) => {
        return pre + cur.landArea;
      }, 0);
    },
    // type参数用来控制是否调用 汇总信息接口,注意: 子组件 emit传参变动，此处判断要做对应修改
    initAssetLayers(assetList, { needGetLandUseStatistics } = { needGetLandUseStatistics: true }) {
      this.assetList = assetList;
      if (needGetLandUseStatistics) {
        this.getLandUseStatistics({ assetList });
      }
      this.handleSummary();
      this.cycleArr = assetList.filter((ele) => ele.layerSchemeDetailVo).map((ele) => ele.assetId);
      this.mapLayers = {};
      this.polygonLayer.clearLayers();
      const geoJsonData = assetList
        .filter((ele) => ele.layerSchemeDetailVo)
        .map((ele) => {
          return {
            assetId: ele.assetId,
            layerDetailId: ele.layerSchemeDetailVo.layerDetailId,
            type: 'Feature',
            properties: {
              style: {
                color: ele.modeColour,
              },
            },
            geometry: {
              type: 'Polygon',
              coordinates: [arrayToObj(ele.layerSchemeDetailVo.coordinateList, 1)],
            },
          };
        });
      this.createLayersFromJson(geoJsonData);
    },
    getDetailDialog({ assetId }, popup) {
      if (!assetId || !popup) {
        console.error('错误');
        return null;
      }
      let Profile = Vue.extend(LandDetailPopup);
      const popupInstance = new Profile({
        propsData: {
          mapInstance: this.mapInstance,
          popupDataSource: this.popupDataSource,
          assetId,
        },
      }).$mount('#landDetailPopup');
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
          if (code === '0') {
            console.log(landInfo);
            const data = {
              ...landInfo,
            };
            // 创建构造器
            // 创建 Profile 实例，并挂载到一个元素上。
            console.log('popupInstance', popupInstance);
            popupInstance.init(data);
          } else {
            this.$SG_Message.error(message);
          }
        }
      );
    },
    /*
     * 查询浮层设定信息
     * */
    queryLayerFields() {
      const req = {
        topOrganId: this.organId,
      };
      this.$api.drawMap.queryLayerFields(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          this.popupDataSource = data;
        } else {
          this.$message.error(message);
          this.popupDataSource = [];
        }
      });
    },
    getDialog({ assetId }) {
      let Profile = Vue.extend(SimpleAssetLandInfo);
      new Profile({
        propsData: { popupDataSource: this.popupDataSource, assetId },
      }).$mount('#simple-popup');
    },
    generateSimplePop({ layer, latlng, assetId }) {
      const _this = this;
      const resOffset = getOffsetNum({
        mapInstance: _this.mapInstance,
        latlng: latlng,
        width: 260,
        height: 214,
      });
      const popup = Leaflet.popup({
        className: 'custom-popup',
        minWidth: 260,
        maxHeight: 214,
        autoPan: false,
        offset: resOffset,
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
      const _this = this;
      // jumpMapLand(layer, this.mapInstance);
      const resOffset = getOffsetNum({
        mapInstance: _this.mapInstance,
        latlng: latlng,
        width: 400,
        height: 520,
      });
      const popup = Leaflet.popup({
        className: 'custom-popup',
        closeButton: false,
        minWidth: 400,
        maxWidth: 400,
        maxHeight: 520,
        autoPan: false,
        offset: resOffset,
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
      layer.on('click', (e) => {
        const assetId = e.target._assetId;
        this.$nextTick(() => {
          this.$refs.AssetLandListRef.setSelectAsset({ assetId: layer._assetId });
          this.handleClickAsset({ assetItemInfo: { assetId } }, { needOpenDetailPop: true });
        });
      });
      layer.on('mouseover', (e) => {
        if (this.autoChaneIngFlag) {
          return null;
        }
        layer._popup_ = this.generateSimplePop({
          layer,
          latlng: layer.getBounds().getCenter(),
          assetId: e.target._assetId,
        });
        this.$refs.AssetLandListRef.setSelectAsset({ assetId: layer._assetId });
      });
      layer.on('mouseout', mouseoutCb, this);
      layer.addTo(this.polygonLayer);
      this.polygonLayer.addTo(this.mapInstance);
      this.mapLayers = Object.assign({}, this.mapLayers, {
        [feature.assetId]: layer,
      });
      function mouseoutCb(e) {
        if (this.autoChaneIngFlag) {
          return null;
        }
        const target = e.originalEvent.toElement || e.originalEvent.relatedTarget;
        if (target.getAttribute('id') === 'leaflet-map') {
          this.mapInstance.closePopup(layer._popup_);
          layer._popup_ = null;
        }
      }
    },
    async getLandUseStatistics({ assetList }) {
      const req = {
        assetIdList: assetList.filter((ele) => ele.layerSchemeDetailVo).map((ele) => ele.assetId),
      };
      const {
        data: { code, message, data },
      } = await this.$api.drawMap.landUseStatistics(req);
      if (code === '0') {
        this.operationModeList = data;
        this.hasSelf = this.operationModeList.some((item) => item.operName === '自有');
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
      console.log('organId', organId);
      this.organId = organId;
      this.layerSchemeId = '';
      this.getMethodOptions();
      this.queryLayerFields();
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
      if (code === '0') {
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
      this.operationModeList = [];
    },
    /*
     * 生成中心点
     * */
    generateCenterMarker({ latlng, centralName }) {
      const marker = Leaflet.marker(latlng, {
        icon: markerIcon,
        zIndexOffset: 1000,
        riseOnHover: true,
        draggable: false,
      }).addTo(this.mapInstance);
      marker.bindPopup(centralName || '中心点位').openPopup();
    },
    async changeMethod(value) {
      this.initStore();
      // const res = this.methodOptions.filter((e) => e.value === value)[0];
      const res = await queryLayerById({ layerId: value });
      if (res) {
        const { organId, layerPath, width, height, centralLevel, centralX, centralY, centralName } = res;
        if (organId && layerPath && width && height) {
          this.mapFlag = true;
          this.$nextTick(() => {
            const temp = layerPath.split('/');
            const options = {
              id: 'leaflet-map',
              imgWidth: width,
              imgHeight: height,
              layerPath: temp[temp.length - 1],
              mapInstanceKeyName: 'mapInstance',
              defaultZoom: [null, ''].includes(centralLevel) ? 4 : centralLevel,
              defaultLatLng: { lat: centralX, lng: centralY },
            };
            initMap.call(this, options, ({ defaultLatLng }) => {
              this.$nextTick(() => {
                this.generateCenterMarker({ latlng: defaultLatLng, centralName });
              });
            });
            this.$refs.AssetLandListRef.initData({
              layerSchemeId: value,
              organId,
            });
            this.organIdByMethod = organId;
          });
        } else {
          this.mapFlag = false;
          console.warn('初始化地图失败,缺少必要数据');
        }
      } else {
        this.$SG_Message.error('系统出错,请刷新后重试');
      }
    },
    mouseMoveCb() {
      this.closeAutoChange();
      clearTimeout(this.sleepTimer);
      this.sleepTimer = setTimeout(() => {
        this.autoChange();
      }, 5000);
    },
    initFullEvent() {
      document.addEventListener('fullscreenchange', this.fullscreenchangeCb);
    },
    fullscreenchangeCb() {
      console.log('this', arguments);
      this.isFull = document.fullscreenElement;
      this.$refs.closeBtn.className = document.fullscreenElement ? 'full-screen-close' : 'default-close-btn';

      if (document.fullscreenElement) {
        this.mouseMoveCb();
        document.addEventListener('mousemove', this.mouseMoveCb);
      } else {
        document.removeEventListener('mousemove', this.mouseMoveCb);
        clearTimeout(this.sleepTimer);
        this.closeAutoChange();
      }
    },
  },
  mounted() {
    this.initFullEvent();
  },
  beforeDestroy() {
    this.closeAutoChange();
    document.removeEventListener('mousemove', this.mouseMoveCb);
    document.removeEventListener('fullscreenchange', this.fullscreenchangeCb);
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
    position: relative;

    .item {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: baseline;
      margin-left: 40px;

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

    .filter-block {
      position: absolute;
      left: 20px;
      top: 20px;
      z-index: 999;
      min-width: 600px;
    }

    .filter-block-full {
      display: none;
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

#landDetailPopup {
  overflow: auto;
}

::v-deep .leaflet-popup-tip-container {
  display: none;
}

.summary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    font-weight: bold;
  }
}

.export {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translate(0, -50%);
}
</style>
