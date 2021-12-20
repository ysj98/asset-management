<template>
  <div class="container">
    <div class="top-action">
      <div class="left">
        <!-- TODO:权限控制  -->
        <SG-Button v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_ADD_METHOD" @click="openAddMethodPop" type="primary" icon="edit" text>
          新增方案
        </SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.DRAW_LAND_MAP_UPLOAD_IMAGE" @click="btnUpload" class="right-block" icon="upload" text>
          上传背景图
        </SG-Button>
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
      <div v-if="false">
        <button @click="getAll">获取所有图形</button>
        <button @click="tempInit">初始化图形</button>
        <button @click="removeAll">移除所有图形</button>
      </div>
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
    <SimpleAssetLandInfo
      ref="SimpleAssetLandInfoRef"
      :asset-land-info="currentAssetInfo"
    />
  </div>
</template>

<script>
import {ASSET_MANAGEMENT} from '@/config/config.power'
import SimpleAssetLandInfo from "@/views/mapDrawLand/components/SimpleAssetLandInfo";
// TODO: 通过 config 获取当前环境域名(看看能不能直接用相对路径获取 layerPath)
const baseUrl = "http://192.168.1.7:8088/";
import AssetLandList from "@/views/mapDrawLand/AssetLandList";
import AddMethodsModal from "@/views/mapDrawLand/AddMethodsModal";
import TopOrganByUser from "@/views/common/topOrganByUser";
import Leaflet from "leaflet";
import LRasterCoords from "leaflet-rastercoords";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";

export default {
  /*
   * 土地地图绘制
   * */
  name: "mapDrawLand",
  components: {
    TopOrganByUser,
    AddMethodsModal,
    AssetLandList,
    SimpleAssetLandInfo,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      currentAssetInfo: {},
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
    generatePop(layer, otherInfo) {
      // TODO:动态生成 不同资产数据的弹窗
      console.log("this.$refs", this.$refs);
      const popupContent = this.$refs.SimpleAssetLandInfoRef.$el;

      layer.bindPopup(popupContent);

      layer._assetId = otherInfo.assetId;
      // TODO:编辑的时候不做"悬浮"现实弹窗的效果,因为牵扯到编辑图形,来回在图形内外移动,实际操作效果很差
      // layer.on("mouseover", (e) => {
      //   e.target.openPopup();
      // });
      // layer.on("mouseout", (e) => {
      //   e.target.closePopup();
      // });
      // layer.on("click", layer.closePopup);
    },
    createLayersFromJson(data) {
      const _this = this;
      return Leaflet.geoJSON(data, {
        style: function (feature) {
          return _this.generatePathStyle({
            color: feature.properties.style.color,
          });
        },
        pointToLayer: function (feature, latlng) {},
        onEachFeature: (feature, layer) => {
          this.generatePop(layer, feature);
          this.initLayerEvent(layer);
          this.initLayerData(layer, {
            assetId: feature.assetId,
            layerDetailId: feature.layerDetailId,
          });
        },
      });
    },
    handleRender(itemData) {
      const res = this.createLayersFromJson(itemData);
      // // 好像不支持链式调用
      // res._assetId = itemData.assetId;
      // res._layerDetailId = itemData.layerDetailId;
      res.addTo(this.polygonLayer);
      // 好像不支持链式调用
      this.polygonLayer.addTo(this.mapInstance);
      this.jsonData = Object.assign({}, this.jsonData, {
        [itemData.assetId]: itemData,
      });
      this.mapLayers = Object.assign({}, this.mapLayers, {
        [itemData.assetId]: res,
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
              console.log("data", data);
            } else {
              this.$SG_Message.error(message);
            }
          });
      };
    },
    /*
     * type
     *   - 0 array to obj return Array  [{x,y}]
     *   - 1 obj to array return Array  [x,y]
     * */
    arrayToObj(data, type) {
      if (type === 0) {
        return data.map((ele) => {
          return {
            x: ele[0],
            y: ele[1],
          };
        });
      }
      if (type === 1) {
        return data.map((ele) => {
          return [ele.x, ele.y];
        });
      }
    },
    initAssetLayers(assetList) {
      // TODO: 先清空数据 清空原有图层,看看图层组
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
                this.arrayToObj(ele.layerSchemeDetailVo.coordinateList, 1),
              ],
            },
          };
        });
      geoJsonData.forEach((ele) => {
        this.handleRender(ele);
      });
    },
    removeAll() {
      this.polygonLayer.clearLayers();
      this.polygonLayer.eachLayer((layer) => {
        console.log("layer", layer);
      });
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
      geoJsonData.forEach((ele) => {
        this.handleRender(ele);
      });
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
      layer.on("click", () => {
        this.enableDraw(layer);
        this.currentSelectLayer = layer;
        this.$refs.AssetLandListRef.setSelectAsset({ assetId: layer._assetId });
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
            };
            this.initMap(options);
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
        // false
        removalMode: true,
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
    /*
     * type: 'edit' | 'text'
     * */
    handleDraw({ assetItemInfo, type }) {
      this.closeDraw();
      // TODO:根据所选资产 配置画笔,然后只能画一个多边形
      const { modeColour, assetId } = assetItemInfo;
      const layer = this.mapLayers[assetId];
      if (layer) {
        this.jumpMapLand(layer);
        // if (type === "edit") {
        //   this.enableDraw(layer);
        // }
        // 不管点击区域是哪一部分 都直接开启对应图形的编辑
        this.enableDraw(layer);
        this.currentSelectLayer = layer;
        console.log("layer", layer);
        layer.openPopup();
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
      // if (!layerDetailId) {
      //   this.$refs.AssetLandListRef.setAssetDrawFlag({ assetId, flag: true });
      //   delete this.jsonData[assetId];
      //   delete this.mapLayers[assetId];
      // }
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
        this.mapInstance.removeLayer(this.currentSelectLayer);
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
          resolve(data);
          this.$refs.AssetLandListRef.setAssetDrawFlag({ assetId, flag: true });
        }
      });
    },
    // 获取绘制样式
    generatePathStyle({ color }, options = {}) {
      const obj = {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        hintlineStyle: color,
        templineStyle: color,
        // weight: 0.8,
      };
      return Object.assign(obj, options);
    },
    setDrawOptions({ modeColour }) {
      const style = this.generatePathStyle({ color: modeColour });
      this.mapInstance.pm.setPathOptions(style);
    },
    closeDraw() {
      this.mapInstance.pm.disableDraw();
    },
    openDraw() {
      this.mapInstance.pm.enableDraw("Polygon", {
        snappable: true,
        snapDistance: 5,
        // markerEditable: true,
      });
    },
    // 地图平移到指定位置
    jumpMapLand(layerInfo) {
      // this.mapInstance.panTo(layerInfo._latlngs[0][0]);
      this.mapInstance.flyToBounds(layerInfo.getBounds());
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
    initEvent() {
      this.mapInstance.on("click", () => {
        // this.mapInstance.pm.disableGlobalEditMode();
        if (this.currentSelectLayer) {
          // 如果存在则关闭编辑并且 清空 currentSelectLayer
          // 插件默认阻止了冒泡,所以点击图形的时候不会执行当前函数
          this.currentSelectLayer.pm.disable();
          this.currentSelectLayer = null;
        }
      });
      // 监听绘制图形完成后 事件
      this.mapInstance.on("pm:create", (e) => {
        console.log("e", e);
        const res = e.layer.toGeoJSON();
        res.assetId = this.currentAssetId;
        res.properties || (res.properties = {});
        this.save({
          assetId: res.assetId,
          coordinateList: this.arrayToObj(res.geometry.coordinates[0], 0),
        }).then((value) => {
          this.generatePop(e.layer, { assetId: this.currentAssetId });
          this.jsonData = Object.assign({}, this.jsonData, {
            [this.currentAssetId]: res,
          });
          this.mapLayers[this.currentAssetId] = e.layer;
          // TODO:使用后端返回的详情id
          // this.initLayerData(e.layer, {
          //   layerDetailId: value.layerDetailId,
          //   assetId: res.assetId,
          // });
          this.initLayerEvent(e.layer);
        });
      });
      this.mapInstance.on("pm:markerdragend", (e) => {
        const res = e.layer.toGeoJSON();
        res.assetId = this.currentAssetId;
        res.properties || (res.properties = {});
        this.jsonData = Object.assign({}, this.jsonData, {
          [this.currentAssetId]: res,
        });
        this.mapLayers[this.currentAssetId] = e.layer;
        this.updatePolygon({
          assetId: res.assetId,
          coordinateList: this.arrayToObj(res.geometry.coordinates[0], 0),
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
        bounds: rc.getMaxBounds(),
        maxNativeZoom: rc.zoomLevel(),
      }).addTo(this.mapInstance);
      this.mapInstance.pm.setLang("zh");
      this.initEvent();
      this.initControls();
    },
  },
};
</script>
<style src="./index.less" lang="less" scoped></style>
