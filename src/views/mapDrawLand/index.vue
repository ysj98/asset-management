<template>
  <div>
    <div id="leaflet-map"></div>
    <button @click="demoFn">点击生成</button>
    <button @click="testFn">点击测试</button>
    <button @click="disableGlobalEditMode">关闭编辑</button>
  </div>
</template>

<script>
import Leaflet from "leaflet";
import LRasterCoords from "leaflet-rastercoords";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import {uuid} from "utils/utils";
export default {
  /*
   * 土地地图绘制
   * */
  name: "mapDrawLand",
  data() {
    return {
      mapInstance: null,
      layerList: [],
    };
  },
  methods: {
    del(){
      this.layerList[0].remove()
      this.l
    },
    disableGlobalEditMode() {
      this.mapInstance.pm.disableGlobalEditMode();
    },
    testFn() {
      this.layerList[0].pm.enable();
    },
    demoFn() {
      this.mapInstance.pm.addControls({
        position: "topleft",
        drawCircle: false,
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        rotateMode: false,
      });
    },
    initMap(id) {
      this.mapInstance = Leaflet.map(id, {
        crs: Leaflet.CRS.Simple,
      });
      const imgInfo = [
        22000, // original width of image (here from `example/karta.jpg`)
        20000, // original height of image
      ];
      const rc = new LRasterCoords(this.mapInstance, imgInfo);
      this.mapInstance.setMaxZoom(rc.zoomLevel());
      this.mapInstance.setView(rc.unproject([imgInfo[0], imgInfo[1]]), 2);
      Leaflet.tileLayer("http://192.168.200.27:8081/tiles4/{z}/{x}/{y}.png", {
        noWrap: true,
        bounds: rc.getMaxBounds(),
        maxNativeZoom: rc.zoomLevel(),
      }).addTo(this.mapInstance);
      this.mapInstance.on("click", function (event) {
        console.log(arguments);
        // to obtain raster coordinates from the map use `project`
        console.log("event.latlng", event.latlng);
        const coord = rc.project(event.latlng);
        console.log("coord", coord);
        const res = event.target;
        res.pm.enable &&
          res.pm.enable({
            allowSelfIntersection: false,
          });
      });
      this.mapInstance.on("pm:click", (...e) => {
        console.log("e", e);
      });
      this.mapInstance.on("pm:create", (e) => {
        console.log(e);
        const arr = e.layer._latlngs[0].map((ele) => {
          console.log("ele", ele);
          return rc.project(ele);
        });
        this.layerList.push({
          layer:e.layer,
          uuid: uuid()
        });
        console.log("arr", arr);
      });
    },
  },
  mounted() {
    this.initMap("leaflet-map");
  },
};
</script>

<style scoped>
#leaflet-map {
  height: 90%;
  background-color: #ffffff;
}
</style>
