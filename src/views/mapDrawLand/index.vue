<template>
  <div class="container">
    <div class="top-action">
      <div class="left">
        <div class="place-block"></div>
        <SG-Button v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_ADD_METHOD" @click="openAddMethodPop" type="primary" icon="edit" text>
          新增方案
        </SG-Button>
        <div class="place-block"></div>
        <SG-Button
          v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_UPLOAD_IMAGE"
          @click="btnUpload"
          class="right-block"
          icon="upload"
          text
          :disabled="!isCanUpload"
        >
          上传背景图
        </SG-Button>
        <div class="place-block"></div>
        <SG-Button v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_SET_CENTER" class="right-block" icon="plus" text @click="jumpDefaultLatLng">
          设置中心点
        </SG-Button>
        <div class="place-block"></div>
        <SG-Button
          v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_DELETE_POLYGON"
          @click="handleDel"
          class="right-block"
          icon="delete"
          text
          :disabled="!currentSelectLayer"
        >
          删除绘制
        </SG-Button>
        <div class="place-block"></div>
        <SG-Button v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_POPUP_SETTINGS" class="right-block" icon="setting" text @click="btnClickPopInfoSetting">
          浮层设定
        </SG-Button>
      </div>
      <div class="right">
        <TopOrganByUser type="segiSelect" @change="changeTopOrganId" :hasAll="false" :selectFirst="true" />
        <SG-Select v-model="layerSchemeId" class="right-block" placeholder="请选择方案" @change="changeMethod">
          <SG-Option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value"></SG-Option>
        </SG-Select>
      </div>
    </div>
    <div class="middle-content">
      <div v-if="!mapFlag" class="place">
        {{ errorText }}
      </div>
      <div v-else id="leaflet-map"></div>
      <AssetLandList
        ref="AssetLandListRef"
        class="filter-block"
        v-if="mapFlag"
        :popupDataSource="popupDataSource"
        @handleDraw="handleDraw"
        @initAssetLayers="initAssetLayers"
      />
    </div>
    <div class="bottom-show">
      <!--      <div>-->
      <!--        <button @click="getAll">获取所有图形</button>-->
      <!--        <button @click="tempInit">初始化图形</button>-->
      <!--      </div>-->
      <div class="item" v-for="item in operationModeList" :key="item.modeOperId">
        <span class="color-block" :style="{ backgroundColor: item.modeColour }"> </span>
        <span>{{ item.modeOperName }}</span>
      </div>
    </div>
    <AddMethodsModal
      v-if="modalList.addMethod.show"
      @success="handleSuccess"
      @doClosePop="doClosePop"
      @doRefresh="getMethodOptions"
      :modal-obj="modalList.addMethod"
    />
    <PopupParamsConfigModal
      v-if="modalList.popupParamsConfig.show"
      @doClosePop="doClosePop"
      @success="handlePopupParamsConfigSuccess"
      v-bind="{
        ...modalList.popupParamsConfig,
        ...modalList.popupParamsConfig.payload,
        dataSource: this.popupDataSource,
      }"
    />
    <!-- 上传背景图 -->
    <input style="display: none" type="file" id="background" @change="handleUploadBackground" />
  </div>
</template>

<script>
import { arrayToObj, generatePathStyle, getOffsetNum, initMap, jumpMapLand, markerIcon } from '@/views/mapDrawLand/share';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import SimpleAssetLandInfo from '@/views/mapDrawLand/components/SimpleAssetLandInfo';
import CenterText from '@/views/mapDrawLand/components/CenterText';
import AssetLandList from '@/views/mapDrawLand/AssetLandList';
import AddMethodsModal from '@/views/mapDrawLand/AddMethodsModal';
import PopupParamsConfigModal from '@/views/mapDrawLand/PopupParamsConfigModal';
import TopOrganByUser from '@/views/common/topOrganByUser';
import Leaflet from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import Vue from 'vue';
import { queryLayerById } from './share';

export default {
  /*
   * 土地地图绘制
   * */
  name: 'mapDrawLand',
  components: {
    TopOrganByUser,
    AddMethodsModal,
    AssetLandList,
    PopupParamsConfigModal,
  },
  data() {
    return {
      centralName: '',
      centerMarker: null,
      popupDataSource: [],
      selectedLayerInfo: {},
      defaultLatLng: {},
      createLayerArr: [],
      assetList: [],
      ASSET_MANAGEMENT,
      currentSelectLayer: null,
      operationModeList: [],
      // 地图是否加载
      mapFlag: false,
      currentAssetId: '',
      mockAssetLandInfo: {},
      modalList: {
        addMethod: {
          show: false,
          modalName: 'addMethod',
          title: '图层方案',
          payload: {
            organId: '',
          },
        },
        popupParamsConfig: {
          show: false,
          modalName: 'popupParamsConfig',
          title: '浮层展示定义',
          payload: {
            organId: '',
            organName: '',
          },
        },
      },
      mapInstance: null,
      polygonLayer: null,
      mapLayers: {},
      jsonData: {},
      organInfo: {
        organId: '',
        organName: '',
      },
      layerSchemeId: '',
      organIdByMethod: '',
      methodOptions: [],
      isCanUpload: false,
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
    /*
     * 浮层设定 按钮点击事件
     * */
    btnClickPopInfoSetting() {
      if (!this.organInfo.organId) {
        this.$message.error('请先选择所属机构');
        return null;
      }
      this.doOpenPop('popupParamsConfig');
      const { organId, organName } = this.organInfo;
      this.modalList.popupParamsConfig.payload = {
        organId,
        organName,
      };
    },
    isSelectedMethod() {
      let res = true;
      if (!this.mapInstance) {
        res = false;
        this.$message.warn('请先选择方案');
      }
      return res;
    },
    clearAllPop() {
      this.mapInstance.closePopup();
    },
    /*
     * 设置中心点
     * */
    jumpDefaultLatLng() {
      if (!this.isSelectedMethod()) {
        return null;
      }
      this.clearAllPop();
      this.mapInstance.pm.disableGlobalEditMode();
      this.mapInstance.panTo(this.defaultLatLng);
      this.centerMarker.openPopup();
    },
    /*
     * 提交中心点信息到后台
     * */
    submitCenterInfo({ latlng, zIndex }) {
      return new Promise((resolve, reject) => {
        const req = {
          centralX: latlng.lat,
          centralY: latlng.lng,
          centralLevel: zIndex,
          layerId: this.selectedLayerInfo.layerId,
          organId: this.selectedLayerInfo.organId,
          schemeName: this.selectedLayerInfo.title,
        };
        this.$api.drawMap.updateLayerScheme(req).then(
          ({ data: { code, message } }) => {
            if (code === '0') {
              this.$message.success('中心点变更成功');
              this.defaultLatLng = latlng;
              resolve(latlng);
            } else {
              this.$message.error(message);
              reject(message);
            }
          },
          (reason) => {
            console.error(reason);
            reject(reason);
          }
        );
      });
    },
    /*
     * 初始化 中心点位事件,弹窗信息
     * */
    initCenterMarker({ marker, latlng }) {
      this.centerMarker = marker;
      // this.mapInstance.pm.disableGlobalEditMode() 函数会 dragging.disable()
      marker.on('mouseover', () => {
        marker.dragging.enable();
      });
      marker.on('dragend', (e) => {
        const zIndex = this.mapInstance.getZoom();
        const latlng = e.target._latlng;
        this.submitCenterInfo({ latlng, zIndex }).catch((reason) => {
          console.error(reason);
        });
      });
      marker.on('popupopen', () => {
        // 创建实例之前 如果已经创建则销毁
        marker._vuePopup && marker._vuePopup.$destroy();
        this.$nextTick(() => {
          let Profile = Vue.extend(CenterText);
          const resVue = new Profile({
            propsData: {
              defaultCentralName: this.centralName || '',
              layerId: this.selectedLayerInfo.layerId,
              organId: this.selectedLayerInfo.organId,
            },
          }).$mount('#center-container');
          resVue.$on('saveSuccess', (value) => {
            console.log('value', value);
            this.centralName = value || '';
          });
          marker._vuePopup = resVue;
        });
      });
      const popup = Leaflet.popup({
        minWidth: 200,
        autoPan: false,
      })
        .setLatLng(latlng)
        .setContent('<div id="center-container"></div>');
      marker.bindPopup(popup).openPopup();
    },
    /*
     * 生成中心点
     * */
    generateCenterMarker({ latlng }) {
      const marker = Leaflet.marker(latlng, {
        icon: markerIcon,
        zIndexOffset: 1000,
        riseOnHover: true,
        draggable: true,
      }).addTo(this.mapInstance);
      this.initCenterMarker({ marker, latlng });
    },

    handleDel() {
      const assetId = this.currentSelectLayer._assetId;
      this.delPolygon({
        layerDetailId: this.currentSelectLayer._layerDetailId,
        assetId,
      });
    },
    getDialog({ assetId }) {
      let Profile = Vue.extend(SimpleAssetLandInfo);
      new Profile({
        propsData: { popupDataSource: this.popupDataSource, assetId },
      }).$mount('#mapDialog-container');
    },
    generatePop(layer) {
      const _this = this;
      layer.on('click', (e) => {
        setTimeout(() => {
          const width = 260;
          const height = 214;
          const resOffset = getOffsetNum({
            mapInstance: _this.mapInstance,
            latlng: e.latlng,
            width: width,
            height: height,
          });
          const popup = Leaflet.popup({
            className: 'custom-popup',
            minWidth: width,
            maxHeight: height,
            autoPan: false,
            offset: resOffset,
          })
            .setLatLng(e.latlng)
            .setContent('<div id="mapDialog-container"></div>')
            .openOn(layer);
          _this.mapInstance.openPopup(popup);
          _this.$nextTick(() => {
            _this.getDialog({ assetId: e.target._assetId });
          });
        }, 300);
      });
    },
    // 根据 geoJsonData 生成图层时 对每一个图层做初始化处理
    initLayer(feature, layer) {
      this.generatePop(layer);
      this.initLayerEvent(layer);
      this.initLayerData(layer, {
        assetId: feature.assetId,
        layerDetailId: feature.layerDetailId,
      });
      layer.addTo(this.polygonLayer);
      this.polygonLayer.addTo(this.mapInstance);
      this.jsonData = Object.assign({}, this.jsonData, {
        [feature.assetId]: layer,
      });
      this.mapLayers = Object.assign({}, this.mapLayers, {
        [feature.assetId]: layer,
      });
    },
    createLayersFromJson(data) {
      const _this = this;
      return Leaflet.geoJSON(data, {
        style: function (feature) {
          return generatePathStyle({
            color: feature.properties.style.color,
          });
        },
        filter: function (geoJsonFeature) {
          return !_this.mapLayers[geoJsonFeature.assetId];
        },
        onEachFeature: _this.initLayer,
      });
    },
    // 点击上传背景图
    btnUpload() {
      const id = this.layerSchemeId;
      if (!id) {
        this.$SG_Message.error('请先选择方案');
        return null;
      } else {
        if (!this.methodOptions.filter((e) => e.value === id).length) {
          this.$SG_Message.error('当前所选方案不存在');
          return null;
        }
      }
      const inputEle = document.getElementById('background');
      // 清空数据,保证change事件触发
      inputEle.value = null;
      inputEle.click();
    },
    handleInitMap(options) {
      const { layerPath, imgWidth, imgHeight, defaultZoom, defaultLatLng } = options;
      const temp = layerPath.split('/');
      const obj = {
        id: 'leaflet-map',
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        layerPath: temp[temp.length - 1],
        mapInstanceKeyName: 'mapInstance',
        defaultZoom,
        defaultLatLng,
      };
      initMap.call(this, obj, ({ defaultLatLng }) => {
        this.defaultLatLng = defaultLatLng;
        this.initMapEvent();
        this.initControls();
        this.$nextTick(() => {
          this.generateCenterMarker({ latlng: this.defaultLatLng });
        });
        this.mapInstance.pm.setLang('zh');
      });
    },
    // 上传背景图 后对应事件
    handleUploadBackground(event) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const r = {
          imgFile: file,
          width: naturalWidth,
          height: naturalHeight,
          layerSchemeId: this.layerSchemeId,
        };
        const req = new FormData();
        Object.keys(r).forEach((ele) => {
          req.append(ele, r[ele]);
        });
        this.$api.drawMap.uploadImage(req).then(({ data: { data, code, message } }) => {
          if (code === '0') {
            this.$SG_Message.success(data);
            this.isCanUpload = false;
          } else {
            this.$SG_Message.error(message);
          }
        });
      };
    },
    initAssetLayers(assetList) {
      this.assetList = assetList;
      this.polygonLayer.clearLayers();
      this.createLayerArr.forEach((ele) => {
        this.mapInstance.removeLayer(ele);
      });
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
      this.jsonData = {};
      this.mapLayers = {};
      this.createLayersFromJson(geoJsonData);
    },
    tempInit() {
      const geoJsonData = [
        {
          type: 'Feature',
          properties: {
            style: {
              color: 'black',
            },
          },
          assetId: 3,
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [16.75, -73.25],
                [17.5, -113.25],
                [33, -73.25],
                [16.75, -73.25],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            style: {
              color: 'red',
            },
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [126, -67.75],
                [116.25, -112.75],
                [99, -93.5],
                [99, -49.75],
                [126, -67.75],
              ],
            ],
          },
          assetId: 2,
        },
        {
          type: 'Feature',
          properties: {
            style: {
              color: 'yellow',
            },
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [45.125, -13.125],
                [46.25, -19.125],
                [40.25, -20.25],
                [40.125, -26.75],
                [49, -26],
                [49.375, -32.5],
                [58, -32.5],
                [56.375, -20.875],
                [72, -19.5],
                [68.375, -14.5],
                [59, -14.375],
                [55.5, -8.375],
                [45.125, -13.125],
              ],
            ],
          },
          assetId: 1,
        },
      ];
      this.createLayersFromJson(geoJsonData);
    },
    getAll() {
      const res = this.mapInstance.pm.getGeomanDrawLayers();
      console.log('res', res);
    },
    // 开启单个图形绘制
    enableDraw(layer) {
      this.mapInstance.pm.disableGlobalEditMode();
      layer.pm.enable();
    },
    initLayerData(layer, { layerDetailId, assetId }) {
      layer._layerDetailId = layerDetailId;
      layer._assetId = assetId;
    },
    // 初始化 图块事件
    initLayerEvent(layer) {
      layer.addEventListener('click', (e) => {
        Leaflet.DomEvent.stop(e);
        this.handleLayerClick(layer);
        this.$refs.AssetLandListRef.setSelectAsset({ assetId: layer._assetId });
      });
      layer.on('pm:update', (e) => {
        const res = e.layer.toGeoJSON();
        res.assetId = this.currentAssetId;
        res.properties || (res.properties = {});
        this.jsonData = Object.assign({}, this.jsonData, {
          [this.currentAssetId]: res,
        });
        this.mapLayers[this.currentAssetId] = e.layer;
        this.updatePolygon({
          layerDetailId: e.layer._layerDetailId,
          coordinateList: arrayToObj(res.geometry.coordinates[0], 0),
        });
      });
    },
    async changeMethod(value) {
      try {
        this.selectedLayerInfo = this.methodOptions.find((ele) => ele.layerId === value);
        this.initStore();
        this.mapFlag = false;
        this.isCanUpload = false;
        // const res = this.methodOptions.filter((e) => e.value === value)[0];
        const res = await queryLayerById({ layerId: value });
        console.log('res', res);
        const { organId, layerPath, width, height, isgenerate, centralX, centralY, centralLevel, centralName } = res;
        this.centralName = centralName;
        //   0: "未生成",
        //   1: "生成中",
        //   2: "已生成",
        if (isgenerate === 1) {
          this.$SG_Message.error('当前方案最新背景图正在生成中');
          return null;
        } else if (isgenerate === 0) {
          this.isCanUpload = true;
          return null;
        } else if (isgenerate === 2) {
          this.isCanUpload = true;
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
                centralName,
              };
              this.handleInitMap(options);
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
        }
      } catch (error) {
        console.log('test');
        console.error(error);
        this.$SG_Message.error(error);
      }
    },
    initControls() {
      this.mapInstance.pm.addControls({
        position: 'bottomright',
        drawMarker: false,
        drawCircle: false,
        drawPolygon: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        dragMode: false,
        cutPolygon: false,
        removalMode: false,
        rotateMode: false,
        oneBlock: true,
        editMode: false,
      });
    },
    async getMethodOptions() {
      const req = {
        pageSize: 99999,
        pageNum: 1,
        organId: this.organInfo.organId,
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
    handleLayerClick(layer) {
      jumpMapLand(layer, this.mapInstance);
      this.enableDraw(layer);
      this.currentSelectLayer = layer;
      layer.openPopup();
    },
    /*
     * type: 'edit' | 'text'
     * */
    handleDraw({ assetItemInfo }) {
      this.closeDraw();
      const { modeColour, assetId } = assetItemInfo;
      const layer = this.mapLayers[assetId];
      if (layer) {
        this.handleLayerClick(layer);
      } else {
        this.currentAssetId = assetItemInfo.assetId;
        this.openDraw({ modeColour });
      }
    },
    /*
     * 入库 删除图块
     * */
    async delPolygon({ assetId, layerDetailId }) {
      const res = {
        layerSchemeDetailReqDtos: [
          {
            layerDetailId,
          },
        ],
      };
      const {
        data: { code, message },
      } = await this.$api.drawMap.deleteLayerDetails(res);
      if (code !== '0') {
        this.$SG_Message.error(message);
      } else {
        this.mapInstance.closePopup();
        this.$message.success('删除成功');
        this.mapInstance.removeLayer(this.currentSelectLayer);
        this.createLayerArr = this.createLayerArr.filter((ele) => ele._assetId !== this.currentSelectLayer._assetId);
        this.currentSelectLayer = null;
        delete this.jsonData[assetId];
        delete this.mapLayers[assetId];
        this.$refs.AssetLandListRef.setAssetDrawFlag({ assetId, flag: false });
      }
    },
    /*
     * 入库 更新图块信息
     * */
    async updatePolygon({ layerDetailId, coordinateList }) {
      const res = {
        layerSchemeDetailReqDtos: [
          {
            layerDetailId: layerDetailId,
            coordinateList: coordinateList,
          },
        ],
      };
      const {
        data: { code, message },
      } = await this.$api.drawMap.updateLayerDetails(res);
      if (code !== '0') {
        this.$SG_Message.error(message);
      } else {
        this.$message.success('编辑成功');
      }
    },
    /*
     * 入库 图块
     * */
    async save({ assetId, coordinateList }) {
      return new Promise(async (resolve, reject) => {
        const res = {
          layerSchemeDetailReqDtos: [
            {
              layerId: this.layerSchemeId,
              organId: this.organIdByMethod,
              assetId,
              coordinateList: coordinateList,
            },
          ],
        };
        const {
          data: { code, message, data },
        } = await this.$api.drawMap.addLayerDetails(res);
        if (code !== '0') {
          this.$SG_Message.error(message);
          reject(message);
        } else {
          this.$message.success('保存成功');
          resolve(data);
          this.$refs.AssetLandListRef.setAssetDrawFlag({ assetId, flag: true });
        }
      });
    },
    closeDraw() {
      this.mapInstance.pm.disableDraw();
    },
    openDraw({ modeColour }) {
      const style = generatePathStyle({ color: modeColour });
      this.mapInstance.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 2,
        hintlineStyle: { color: modeColour, dashArray: [5, 5] },
        templineStyle: { color: modeColour },
        pathOptions: style,
      });
    },
    handleSuccess() {},
    doOpenPop(modal, title) {
      if (title) {
        this.modalList[modal].title = title;
      }
      this.modalList[modal].show = true;
    },
    /*
     * 查询浮层设定信息
     * */
    queryLayerFields() {
      const req = {
        topOrganId: this.organInfo.organId,
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
    /*
     * 浮层设定保存成功回调
     * */
    handlePopupParamsConfigSuccess() {
      this.queryLayerFields();
    },
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    openAddMethodPop() {
      this.modalList.addMethod.payload.organId = this.organInfo.organId;
      this.doOpenPop('addMethod');
    },
    initStore() {
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
        this.polygonLayer = null;
        this.createLayerArr = [];
      }
      this.mapLayers = {};
    },
    async queryAssetAttrConfig() {
      const req = {
        pageSize: 99999,
        pageNum: 1,
        assetType: this.$store.state.ASSET_TYPE_CODE.LAND,
        organId: this.organInfo.organId,
      };
      const {
        data: {
          code,
          message,
          data: { data },
        },
      } = await this.$api.assetOperationMode.queryAssetAttrConfig(req);
      if (code === '0') {
        this.operationModeList = data;
      } else {
        this.$SG_Message.error(message);
      }
    },
    changeTopOrganId({ value, name }) {
      this.organInfo = {
        organId: value,
        organName: name,
      };
      this.getMethodOptions();
      this.queryAssetAttrConfig();
      this.queryLayerFields();
    },
    initMapEvent() {
      const _this = this;
      function onClickFn() {
        _this.mapInstance.pm.disableGlobalEditMode();
        _this.currentSelectLayer = null;
      }
      this.mapInstance.on('click', onClickFn);
      this.mapInstance.on('pm:drawstart', () => {
        this.mapInstance.off('click', onClickFn);
        this.centerMarker.setOpacity(0.2);
      });
      this.mapInstance.on('pm:drawend', () => {
        this.mapInstance.on('click', onClickFn);
        this.centerMarker.setOpacity(1);
      });
      // 监听绘制图形完成后 事件
      this.mapInstance.on('pm:create', (e) => {
        console.log('e', e);
        this.createLayerArr.push(e.layer);
        const res = e.layer.toGeoJSON();
        res.assetId = this.currentAssetId;
        res.properties || (res.properties = {});
        this.save({
          assetId: res.assetId,
          coordinateList: arrayToObj(res.geometry.coordinates[0], 0),
        }).then((arr) => {
          const { layerDetailId, assetId } = arr[0];
          this.generatePop(e.layer);
          this.jsonData = Object.assign({}, this.jsonData, {
            [this.currentAssetId]: res,
          });
          this.mapLayers[this.currentAssetId] = e.layer;
          this.initLayerData(e.layer, {
            layerDetailId: layerDetailId,
            assetId: assetId,
          });
          this.initLayerEvent(e.layer);
        });
      });
      this.mapInstance.on('pm:remove', (e) => {
        this.delPolygon({
          layerDetailId: e.target._layerDetailId,
          assetId: e.target._assetId,
        });
        delete this.mapLayers[e.layer._assetId];
        delete this.jsonData[e.layer._assetId];
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    for (let key in this.modalList) {
      this.modalList[key].show = false;
    }
    next();
  },
};
</script>
<style scoped>
.place-block {
  display: none;
}
::v-deep .leaflet-popup-tip-container {
  display: none;
}
</style>
<style src="./index.less" lang="less" scoped></style>
