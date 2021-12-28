import Leaflet from "leaflet";
import LRasterCoords from "leaflet-rastercoords";
/*
 * type
 *   - 0 array to obj return Array  [{x,y}]
 *   - 1 obj to array return Array  [x,y]
 * */

export function arrayToObj(data, type) {
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
}
/*
 * 根据默认样式生成自定义样式
 * */
export function generatePathStyle({ color }, options = {}) {
  const obj = {
    color: color,
    fillColor: color,
    fillOpacity: 0.3,
    hintlineStyle: color,
    templineStyle: color,
    // weight: 0.8,
  };
  return Object.assign(obj, options);
}

export function initMap(
  { id, imageWidth, imgHeight, layerPath, mapInstanceKeyName },
  callback
) {
  if (!id || !imageWidth || !imgHeight || !layerPath) {
    console.error("缺少数据初始化地图");
    return null;
  }
  if (this[mapInstanceKeyName] === undefined) {
    console.error("没有此数据,请定义key名");
    return null;
  }
  this.polygonLayer = new Leaflet.layerGroup();
  this[mapInstanceKeyName] = Leaflet.map(id, {
    crs: Leaflet.CRS.Simple,
    attributionControl: false,
    zoomControl: false,
  });
  new Leaflet.Control.Zoom({ position: "bottomright" }).addTo(this.mapInstance);
  const num = Math.max(imgHeight, imageWidth)
  const imgInfo = [num,num];
  const rc = new LRasterCoords(this.mapInstance, imgInfo);
  this[mapInstanceKeyName].setMaxBounds(
    rc.unproject([0, 0]),
    rc.unproject(imgInfo)
  );
  this[mapInstanceKeyName].setView(
    rc.unproject([imgInfo[0] / 2, imgInfo[1] / 2]),
    2
  );
  this[mapInstanceKeyName].setMaxZoom(rc.zoomLevel());
  Leaflet.tileLayer(
    `/scheme/${layerPath}/{z}/{x}/{y}.png?requestTime=${new Date().getTime()}`,
    {
      noWrap: true,
      bounds: rc.getMaxBounds(),
      maxNativeZoom: rc.zoomLevel(),
    }
  ).addTo(this[mapInstanceKeyName]);
  if (typeof callback === "function") {
    callback();
  }
}

export function jumpMapLand(layer, mapInstance) {
  mapInstance.flyToBounds(layer.getBounds());
}
