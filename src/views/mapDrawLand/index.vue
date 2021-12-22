<template>
  <div class="container">
    <div class="top-action">
      <div class="left">
        <div class="place-block"></div>
        <SG-Button
          v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_ADD_METHOD"
          @click="openAddMethodPop"
          type="primary"
          icon="edit"
          text
        >
          新增方案
        </SG-Button>
        <div class="place-block"></div>
        <SG-Button
          v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_UPLOAD_IMAGE"
          @click="btnUpload"
          class="right-block"
          icon="upload"
          text
        >
          上传背景图
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
        <!--        <SG-Button class="right-block" icon="save" text>保存绘制</SG-Button>-->
      </div>
      <div class="right">
        <TopOrganByUser
          type="segiSelect"
          @change="changeTopOrganId"
          :hasAll="false"
          :selectFirst="true"
        />
        <SG-Select
          v-model="layerSchemeId"
          class="right-block"
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
      </div>
    </div>
    <div class="middle-content">
      <div v-if="!mapFlag" class="place">初始化地图失败,缺少必要数据</div>
      <div v-else id="leaflet-map"></div>
      <AssetLandList
        ref="AssetLandListRef"
        class="filter-block"
        v-if="mapFlag"
        @handleDraw="handleDraw"
        @initAssetLayers="initAssetLayers"
      />
    </div>
    <div class="bottom-show">
      <!--      <div>-->
      <!--        <button @click="getAll">获取所有图形</button>-->
      <!--        <button @click="tempInit">初始化图形</button>-->
      <!--      </div>-->
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
    <AddMethodsModal
      v-if="modalList.addMethod.show"
      @success="handleSuccess"
      @doClosePop="doClosePop"
      @doRefresh="getMethodOptions"
      :modal-obj="modalList.addMethod"
    />
    <!-- 上传背景图 -->
    <input
      style="display: none"
      type="file"
      id="background"
      @change="handleUploadBackground"
    />
  </div>
</template>

<script>
import {
  arrayToObj,
  generatePathStyle,
  initMap,
} from "@/views/mapDrawLand/share";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import SimpleAssetLandInfo from "@/views/mapDrawLand/components/SimpleAssetLandInfo";
import AssetLandList from "@/views/mapDrawLand/AssetLandList";
import AddMethodsModal from "@/views/mapDrawLand/AddMethodsModal";
import TopOrganByUser from "@/views/common/topOrganByUser";
import Leaflet from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import Vue from "vue";

export default {
  /*
   * 土地地图绘制
   * */
  name: "mapDrawLand",
  components: {
    TopOrganByUser,
    AddMethodsModal,
    AssetLandList,
  },
  data() {
    return {
      createLayerArr: [],
      assetList: [],
      ASSET_MANAGEMENT,
      currentSelectLayer: null,
      operationModeList: [],
      // 地图是否加载
      mapFlag: false,
      currentAssetId: "",
      mockAssetLandInfo: {},
      modalList: {
        addMethod: {
          show: false,
          modalName: "addMethod",
          title: "图层方案",
          payload: {
            organId: "",
          },
        },
      },
      mapInstance: null,
      polygonLayer: null,
      mapLayers: {},
      jsonData: {},
      currentTopOrganId: "",
      layerSchemeId: "",
      organIdByMethod: "",
      methodOptions: [],
    };
  },
  methods: {
    handleDel() {
      const assetId = this.currentSelectLayer._assetId;
      this.delPolygon({
        layerDetailId: this.currentSelectLayer._layerDetailId,
        assetId,
      });
    },
    getDialog({ assetId }) {
      const popupData = this.assetList.filter(
        (ele) => ele.assetId === assetId
      )[0];
      let Profile = Vue.extend(SimpleAssetLandInfo);
      new Profile({ propsData: { assetLandInfo: popupData } }).$mount(
        "#mapDialog-container"
      );
    },
    generatePop(layer) {
      layer.on("click", (e) => {
        const popup = Leaflet.popup({
          className: "custom-popup",
          minWidth: 199,
          maxHeight: 550,
        })
          .setLatLng(e.latlng)
          .setContent('<div id="mapDialog-container"></div>')
          .openOn(layer);
        this.mapInstance.openPopup(popup);
        this.$nextTick(() => {
          this.getDialog({ assetId: e.target._assetId });
        });
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
          console.log(
            "geoJsonFeature",
            _this.mapLayers[geoJsonFeature.assetId]
          );
          return !_this.mapLayers[geoJsonFeature.assetId];
        },
        onEachFeature: _this.initLayer,
      });
    },
    // 点击上传背景图
    btnUpload() {
      const id = this.layerSchemeId;
      if (!id) {
        this.$SG_Message.error("请先选择方案");
        return null;
      } else {
        if (!this.methodOptions.filter((e) => e.value === id).length) {
          this.$SG_Message.error("当前所选方案不存在");
          return null;
        }
      }
      const inputEle = document.getElementById("background");
      // 清空数据,保证change事件触发
      inputEle.value = null;
      inputEle.click();
    },
    handleInitMap(options) {
      const { layerPath, imageWidth, imgHeight } = options;
      const temp = layerPath.split("/");
      const obj = {
        id: "leaflet-map",
        imageWidth: imageWidth,
        imgHeight: imgHeight,
        layerPath: temp[temp.length - 1],
        mapInstanceKeyName: "mapInstance",
      };
      initMap.call(this, obj, () => {
        this.initMapEvent();
        this.initControls();
      });
    },
    // 上传背景图 后对应事件
    handleUploadBackground(event) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const { width, height } = img;
        const r = {
          imgFile: file,
          width,
          height,
          layerSchemeId: this.layerSchemeId,
        };
        const req = new FormData();
        Object.keys(r).forEach((ele) => {
          req.append(ele, r[ele]);
        });
        this.$api.drawMap
          .uploadImage(req)
          .then(({ data: { data, code, message } }) => {
            if (code === "0") {
              //TODO:这块要和后端确认返回的路径
              const options = {
                ...data,
                imgHeight: data.height,
                imageWidth: data.width,
              };
              this.handleInitMap(options);
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
      this.jsonData = {};
      this.mapLayers = {};
      this.createLayersFromJson(geoJsonData);
    },
    tempInit() {
      const geoJsonData = [
        {
          type: "Feature",
          properties: {
            style: {
              color: "black",
            },
          },
          assetId: 3,
          geometry: {
            type: "Polygon",
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
          type: "Feature",
          properties: {
            style: {
              color: "red",
            },
          },
          geometry: {
            type: "Polygon",
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
          type: "Feature",
          properties: {
            style: {
              color: "yellow",
            },
          },
          geometry: {
            type: "Polygon",
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
      console.log("res", res);
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
      layer.addEventListener("click", (e) => {
        Leaflet.DomEvent.stop(e);
        this.handleLayerClick(layer);
        this.$refs.AssetLandListRef.setSelectAsset({ assetId: layer._assetId });
      });
      layer.on("pm:update", (e) => {
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
            this.handleInitMap(options);
            this.$refs.AssetLandListRef.initData({
              layerSchemeId: value,
              organId,
            });
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
    initControls() {
      this.mapInstance.pm.addControls({
        position: "bottomright",
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
        organId: this.currentTopOrganId,
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
    handleLayerClick(layer) {
      this.jumpMapLand(layer);
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
        this.setDrawOptions({ modeColour });
        this.openDraw();
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
      if (code !== "0") {
        this.$SG_Message.error(message);
      } else {
        this.mapInstance.closePopup();
        this.$message.success("删除成功");
        this.mapInstance.removeLayer(this.currentSelectLayer);
        this.createLayerArr = this.createLayerArr.filter(
          (ele) => ele._assetId !== this.currentSelectLayer._assetId
        );
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
      if (code !== "0") {
        this.$SG_Message.error(message);
      } else {
        this.$message.success("编辑成功");
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
        if (code !== "0") {
          this.$SG_Message.error(message);
          reject(message);
        } else {
          this.$message.success("保存成功");
          resolve(data);
          this.$refs.AssetLandListRef.setAssetDrawFlag({ assetId, flag: true });
        }
      });
    },
    setDrawOptions({ modeColour }) {
      const style = generatePathStyle({ color: modeColour });
      this.mapInstance.pm.setPathOptions(style);
    },
    closeDraw() {
      this.mapInstance.pm.disableDraw();
    },
    openDraw() {
      this.mapInstance.pm.enableDraw("Polygon", {
        snappable: true,
        snapDistance: 2,
        // markerEditable: true,
      });
    },
    // 地图平移到指定位置
    jumpMapLand(layer) {
      // TODO:跳转要不要带动画
      // const latlngs = layer.getLatLngs();
      // this.mapInstance.panTo(latlngs[0]);
      this.mapInstance.flyToBounds(layer.getBounds());
    },
    handleSuccess() {},
    doOpenPop(modal, title) {
      if (title) {
        this.modalList[modal].title = title;
      }
      this.modalList[modal].show = true;
    },
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    openAddMethodPop() {
      this.modalList.addMethod.payload.organId = this.currentTopOrganId;
      this.doOpenPop("addMethod");
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
        organId: this.currentTopOrganId,
      };
      const {
        data: {
          code,
          message,
          data: { data },
        },
      } = await this.$api.assetOperationMode.queryAssetAttrConfig(req);
      if (code === "0") {
        this.operationModeList = data;
      } else {
        this.$SG_Message.error(message);
      }
    },
    changeTopOrganId({ value }) {
      this.currentTopOrganId = value;
      this.getMethodOptions();
      this.queryAssetAttrConfig();
    },
    initMapEvent() {
      const _this = this;
      function onClickFn() {
        _this.mapInstance.pm.disableGlobalEditMode();
        _this.currentSelectLayer = null;
      }
      this.mapInstance.on("click", onClickFn);
      this.mapInstance.on("pm:drawstart", () => {
        this.mapInstance.off("click", onClickFn);
      });
      this.mapInstance.on("pm:drawend", () => {
        this.mapInstance.on("click", onClickFn);
      });
      // 监听绘制图形完成后 事件
      this.mapInstance.on("pm:create", (e) => {
        console.log("e", e);
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
      this.mapInstance.on("pm:remove", (e) => {
        this.delPolygon({
          layerDetailId: e.target._layerDetailId,
          assetId: e.target._assetId,
        });
        delete this.mapLayers[e.layer._assetId];
        delete this.jsonData[e.layer._assetId];
      });
    },
  },
};
</script>
<style scoped>
.place-block {
  display: none;
}
</style>
<style src="./index.less" lang="less" scoped></style>
