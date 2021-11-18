import mapHouseIcon from "@/views/landParameter/assetMap/images/map_house.png";
import mapHouseTipIcon from "@/views/landParameter/assetMap/images/map_house_tip.png";
import mapLandIcon from "@/views/landParameter/assetMap/images/map_land.png";
import mapLandTipIcon from "@/views/landParameter/assetMap/images/map_land_tip.png";
import mapEquipmentIcon from "./images/map_equipment.png";
import mapYardIcon from "./images/map_yard.png";
// 与后端定义 枚举一致
export const assetMapResourceTypeOptions = [
  {
    name: "楼栋",
    value: 1
  },
  {
    name: "土地",
    value: 2
  },
  {
    name: "设备设施",
    value: 3
  },
  {
    name: "车场",
    value: 4
  }
];
// 与上面的保持一致
export const MAP_ASSET_TYPE_CODE = {
  HOUSE: "1",
  LAND: "2",
  EQUIPMENT: "3",
  YARD: "4",
};
export const detailInfoKey = {
  [MAP_ASSET_TYPE_CODE.HOUSE]: "buildInfo",
  [MAP_ASSET_TYPE_CODE.LAND]: "landInfo",
  [MAP_ASSET_TYPE_CODE.EQUIPMENT]: "equInfo",
  [MAP_ASSET_TYPE_CODE.YARD]: "parkInfo"
};
export const markerMap = {
  [MAP_ASSET_TYPE_CODE.HOUSE]: {
    name: "楼栋: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapHouseIcon,
    tipIcon: mapHouseTipIcon
  },
  [MAP_ASSET_TYPE_CODE.LAND]: {
    name: "土地: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapLandIcon,
    tipIcon: mapLandTipIcon
  },
  [MAP_ASSET_TYPE_CODE.EQUIPMENT]: {
    name: "设备设施: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapEquipmentIcon,
    tipIcon: mapLandTipIcon
  },
  [MAP_ASSET_TYPE_CODE.YARD]: {
    name: "车场: ",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.8)",
    boxShadow: "3px 3px 3px 3px rgba(4, 117, 221, 0.23)",
    markerIcon: mapYardIcon,
    tipIcon: mapLandTipIcon
  }
};
