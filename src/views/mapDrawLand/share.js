import Leaflet from "leaflet";
import LRasterCoords from "leaflet-rastercoords";
import * as apiDrawMap from "@/api/drawMap";
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
    fillOpacity: 0.11,
    weight: 0.5,
  };
  return Object.assign(obj, options);
}

export function initMap(
  {
    id,
    imgWidth,
    imgHeight,
    layerPath,
    mapInstanceKeyName,
    defaultZoom = 4,
    defaultLatLng,
  },
  callback
) {
  console.log(arguments);
  if (!id || !imgWidth || !imgHeight || !layerPath) {
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
    minZoom: 4,
    maxBoundsViscosity: 0.9,
  });
  new Leaflet.Control.Zoom({ position: "bottomright" }).addTo(this.mapInstance);
  // TODO:反过来倒是边界刚好, 暂时不知道为什么
  const imgInfo = [imgHeight, imgWidth];
  const rc = new LRasterCoords(this.mapInstance, imgInfo);
  // 默认经纬度同时存在取默认经纬度 否则取取片中心点
  const resDefaultLatLng =
    defaultLatLng.lat && defaultLatLng.lng
      ? defaultLatLng
      : rc.unproject([imgWidth / 2, imgHeight / 2]);
  rc.setMaxBounds();
  this[mapInstanceKeyName].setView(resDefaultLatLng, defaultZoom);
  this[mapInstanceKeyName].setMaxZoom(rc.zoomLevel());
  Leaflet.tileLayer(
    `/scheme/${layerPath}/{z}/{x}/{y}.png?requestTime=${new Date().getTime()}`,
    {
      noWrap: true,
      bounds: rc.getMaxBounds(),
      maxNativeZoom: rc.zoomLevel(),
    }
  ).addTo(this[mapInstanceKeyName]);

  // TODO:DEMO，测试功能时删除
  // BEGINNING
  // const temp = this[mapInstanceKeyName].unproject(
  //   this[mapInstanceKeyName].getPixelOrigin()
  // );
  // const tempBound = this[mapInstanceKeyName].getPixelBounds();
  // console.log("边界", tempBound);
  // console.log("左上角", temp);
  // console.log("resDefaultLatLng", resDefaultLatLng);
  // Leaflet.marker(temp, { icon: markerIcon })
  //   .bindPopup("左上角")
  //   .addTo(this[mapInstanceKeyName]);
  //
  // Leaflet.marker(this[mapInstanceKeyName].unproject(tempBound.max), {
  //   icon: markerIcon,
  // })
  //   .bindPopup("max")
  //   .addTo(this[mapInstanceKeyName]);
  // Leaflet.marker(this[mapInstanceKeyName].unproject(tempBound.min), {
  //   icon: markerIcon,
  // })
  //   .bindPopup("min")
  //   .addTo(this[mapInstanceKeyName]);
  // this[mapInstanceKeyName].setView(temp, defaultZoom);
  // END
  if (typeof callback === "function") {
    callback({ defaultLatLng: resDefaultLatLng });
  }
}

export function jumpMapLand(layer, mapInstance) {
  const latlng = layer.getCenter();
  console.log("latlng", latlng);
  mapInstance.panTo(latlng, {
    animate: true,
  });
}

const iconSrc = require("./assets/marker-icon.png");
export const markerIcon = Leaflet.icon({
  iconUrl: iconSrc,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

export async function queryLayerById({ layerId }) {
  const req = {
    layerId,
  };
  const {
    data: { code, data, message },
  } = await apiDrawMap.queryLayerById(req);
  if (code === "0") {
    return Promise.resolve(data);
  } else {
    this.$SG_Message.error(message);
    return Promise.reject(message);
  }
}

export const allBaseFields = [
  {
    title: "资产项目",
    key: "projectName",
  },
  {
    title: "资产编码",
    key: "assetCode",
  },
  {
    title: "宗地号",
    key: "theNo",
  },
  {
    title: "土地面积",
    key: "landArea",
  },
  {
    title: "土地性质",
    key: "landProperties",
  },
  {
    title: "经营方式",
    key: "modelOperName",
  },
  {
    title: "使用期限",
    key: "startAndEndTime",
    render(h, data, resValue, allInfo) {
      return allInfo.startDate && allInfo.endDate
        ? [allInfo.startDate, allInfo.endDate]
        : "";
    },
  },
  {
    title: "地理位置",
    key: "position",
  },
  {
    title: "运营项目",
    key: "communityName",
  },
  {
    title: "资产面积",
    key: "landArea",
  },
  {
    title: "资产原值",
    key: "originalValue",
  },
  {
    title: "最新估值",
    key: "marketValue",
  },
];
// 获取偏移位置
export function getOffsetNum({ mapInstance, latlng, width, height }) {
  // 逻辑没毛病，代码待优化
  let resOffset = [0, 0];
  const size = mapInstance.getSize();
  const block = mapInstance.latLngToContainerPoint(latlng);
  const allX = size.x;
  const allY = size.y;
  const currentX = block.x;
  const currentY = block.y;
  if (0 <= currentX && currentX <= width / 2) {
    console.log("弹窗向右偏移");
    resOffset[0] = width / 2 - currentX + 10;
  }
  if (currentX < 0) {
    console.log("弹窗向右偏移-中心点为超出当前区域");
    resOffset[0] = width / 2 + Math.abs(currentX) + 10;
  }
  if (currentY <= height) {
    console.log("弹窗向下偏移");
    // 30，20是边距 10是防止弹窗与容器贴和
    resOffset[1] = height - currentY + 30;
    // 防止弹窗覆盖图块 向左/右 偏移
    if (currentX > allX / 2) {
      resOffset[0] = Math.min(-(width / 2), resOffset[0]);
    } else {
      resOffset[0] = Math.max(width / 2, resOffset[0]);
    }
  }

  if (allX - currentX <= width / 2) {
    console.log("弹窗向左偏移");
    // resOffset[0] = -(260 - (allX - currentX));
    resOffset[0] = -(width / 2 - Math.abs(allX - currentX) + 10);
  }
  if (currentX > allX) {
    console.log("弹窗向左偏移-中心点为超出当前区域");
    resOffset[0] = -(Math.abs(currentX - allX) + width / 2 + 10);
  }
  if (currentY - allY >= 0) {
    console.log("弹窗向上偏移");
    resOffset[1] = -(currentY - allY) - 10;
  }
  console.log("resOffset", resOffset);
  return resOffset;
}
