<template>
  <div>
    <div id="leaflet-map"></div>
    <button @click="demoFn">点击生成</button>
  </div>
</template>

<script>
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
  data() {
    return {
      mapInstance: null
    };
  },
  methods: {
    demoFn() {
      this.mapInstance.pm.addControls({
        position: "topleft",
        drawCircle: false
      });
    },
    initMap(id) {
      this.mapInstance = Leaflet.map(id, {
        crs: Leaflet.CRS.Simple
      });
      const imgInfo = [
        22000, // original width of image (here from `example/karta.jpg`)
        20000 // original height of image
      ];
      const rc = new LRasterCoords(this.mapInstance, imgInfo);
      this.mapInstance.setMaxZoom(rc.zoomLevel());
      this.mapInstance.setView(rc.unproject([imgInfo[0], imgInfo[1]]), 2);
      Leaflet.tileLayer("./views/mapDrawLand/tiles4/{z}/{x}/{y}.png", {
        noWrap: true,
        bounds: rc.getMaxBounds(),
        maxNativeZoom: rc.zoomLevel()
      }).addTo(this.mapInstance);
    }
  },
  mounted() {
    this.initMap("leaflet-map");
  }
};
</script>

<style scoped>
#leaflet-map {
  height: 500px;
}
</style>
