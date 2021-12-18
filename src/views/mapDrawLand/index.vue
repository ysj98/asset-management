<template>
  <div class="container">
    <div class="top-action">
      <div class="left">
        <!-- TODO:权限控制  -->
        <SG-Button @click="openAddMethodPop" type="primary" icon="edit" text>
          新增方案
        </SG-Button>
        <SG-Button @click="btnUpload" class="right-block" icon="upload" text>
          上传背景图
        </SG-Button>
        <SG-Button class="right-block" icon="delete" text>删除绘制</SG-Button>
        <SG-Button class="right-block" icon="save" text>保存绘制</SG-Button>
      </div>
      <div class="right">
        <TopOrganByUser
          type="segiSelect"
          @change="changeTopOrganId"
          :hasAll="false"
          :selectFirst="true"
        />
        <SG-Select
          v-model="currentMethodId"
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

      <!-- 资产项目、资产名称/资产编码 搜索条件 -->
      <div v-if="mapFlag" class="content-filter-block">
        <SG-Select
          v-model="currentAssetProject"
          filterable
          multiple
          class="select-layer"
          placeholder="全部资产项目"
        >
          <SG-Option
            v-for="project in assetProjectOptions"
            :key="project.value"
            :label="project.label"
            :value="project.value"
            :title="project.title"
          ></SG-Option>
        </SG-Select>
        <div class="input-layer">
          <a-input placeholder="搜资产名称、资产编码" class="input right-block">
          </a-input>
          <div class="search-block">
            <a-icon :style="{ color: '#ffffff' }" type="search" />
          </div>
        </div>
        <AssetLandList
          @handleDraw="handleDraw"
          style="position: absolute; top: 40px"
        />
      </div>
    </div>
    <div class="bottom-show">
      <button @click="getAll">获取所有图形</button>
      <button @click="tempInit">初始化图形</button>
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
  },
  data() {
    return {
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
      mapLayers: {},
      jsonData: [],
      currentTopOrganId: "",
      currentMethodId: "",
      currentAssetProject: [],
      methodOptions: [],
      assetProjectOptions: [],
    };
  },
  methods: {
    createLayersFromJson(data) {
      return Leaflet.geoJSON(data, {
        style: function (feature) {
          console.log("feature.properties", feature);
          return feature.properties && feature.properties.style;
        },
        pointToLayer: function (feature, latlng) {
          return Leaflet.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },
        onEachFeature: (feature, layer) => {
          var popupContent = "测试效果";

          layer.bindPopup(popupContent);

          layer._assetId = feature.assetId;
          layer.on("mouseover", (e) => {
            console.log("mouseover===>event", e);
            layer.openPopup();
          });
          layer.on("mouseout", (e) => {
            console.log("mouseover===>event", e);
            layer.closePopup();
          });
          layer.off("click", layer.openPopup, layer);
        },
      });
    },
    handleRender(itemData) {
      const res = this.createLayersFromJson(itemData);
      res.addTo(this.mapInstance);
      res._assetId = itemData.assetId;

      this.jsonData.push(itemData);
      this.mapLayers = Object.assign({}, this.mapLayers, {
        [itemData.assetId]: res,
      });
    },
    // 点击上传背景图
    btnUpload() {
      const id = this.currentMethodId;
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
          layerSchemeId: this.currentMethodId,
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
    changeMethod(value) {
      this.initStore();
      const res = this.methodOptions.filter((e) => e.value === value)[0];
      if (res) {
        const { organId, layerPath, width, height } = res;
        if (organId && layerPath && width && height) {
          this.mapFlag = true;
          this.$nextTick(() => {
            const temp = layerPath.split("/");
            console.log("temp[temp.length - 1]", temp[temp.length - 1]);
            const options = {
              id: "leaflet-map",
              imageWidth: width,
              imgHeight: height,
              layerPath: temp[temp.length - 1],
            };
            console.log("layerPath", temp[temp.length - 1]);
            this.initMap(options);

            this.getAssetProjectOptions({ organId });
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
        // removalMode: false,
        rotateMode: false,
        oneBlock: true,
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

    handleDraw(assetItemInfo) {
      this.closeDraw();
      // TODO:根据所选资产 配置画笔,然后只能画一个多边形
      const { color, assetId } = assetItemInfo;
      const res = this.mapLayers[assetId];
      if (res) {
        this.jumpMapLand(res);
        res.pm.enable();
      } else {
        this.currentAssetId = assetItemInfo.assetId;
        this.setDrawOptions({ color });
        this.openDraw();
      }
    },
    setDrawOptions({ color }) {
      this.mapInstance.pm.setPathOptions({
        color,
        fillColor: color,
        fillOpacity: 0.3,
        hintlineStyle: color,
        templineStyle: color,
      });
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
      }
      this.mapLayers = {};
    },
    // 获取资产项目 options
    async getAssetProjectOptions({ organId }) {
      let form = {
        organId: organId,
      };
      this.$api.assets
        .getObjectKeyValueByOrganId(form)
        .then(({ data: { data, code, message } }) => {
          if (code === "0") {
            this.assetProjectOptions = data.map((ele) => {
              return {
                label: ele.projectName,
                value: ele.projectId,
                title: ele.projectName,
              };
            });
          } else {
            this.$message.error(message);
          }
        });
    },
    changeTopOrganId({ value }) {
      this.currentTopOrganId = value;
      this.getMethodOptions();
    },
    initEvent() {
      // 监听绘制图形完成后 事件
      this.mapInstance.on("pm:create", (e) => {
        e.layer._assetId = this.currentAssetId;

        const res = e.layer.toGeoJSON();
        res.assetId = this.currentAssetId;
        res.properties || (res.properties = {});
        this.jsonData.push(res);
        this.mapLayers[this.currentAssetId] = e.layer;
      });
      this.mapInstance.on("pm:markerdragend", (e) => {
        console.log("e", e);
      });
      this.mapInstance.on("pm:remove", (e) => {
        console.log("e", e);
        const idx = this.jsonData.findIndex(
          (ele) => ele.assetId === e.layer._assetId
        );
        console.log("idx", idx);
        console.log("this.mapLayers", this.mapLayers);
        if (idx !== -1) {
          this.jsonData.splice(idx, 1);
          delete this.mapLayers[e.layer._assetId];
        }
      });
    },
    /*
     * 地图初始化
     * */
    initMap({ id, imageWidth, imgHeight, layerPath }) {
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
  mounted() {},
};
</script>
<style src="./index.less" lang="less" scoped></style>
