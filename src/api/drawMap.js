import { axiosGet, axiosPost } from "../utils/axios";
import { drawMap } from "../config/config.url";

// 上传图层图片
export function uploadImage(data) {
  return axiosPost(drawMap.uploadImage, data, true, false, {
    timeout: 1000 * 60 * 10,
  });
}
// 图层方案修改
export function updateLayerScheme(data) {
  return axiosPost(drawMap.updateLayerScheme, data);
}
// 图层方案删除
export function deleteLayerScheme(data) {
  return axiosPost(drawMap.deleteLayerScheme, data);
}
// 新增图层方案
export function addLayerScheme(data) {
  return axiosPost(drawMap.addLayerScheme, data);
}
// 查询图层方案(分页)
export function queryLayerPageList(data) {
  return axiosPost(drawMap.queryLayerPageList, data);
}

// 根据项目查询资产及经营方式
export function queryAssetOpMode(data) {
  return axiosPost(drawMap.queryAssetOpMode, data);
}

// 批量新增图层绘制详情
export function addLayerDetails(data) {
  return axiosPost(drawMap.addLayerDetails, data);
}
// 批量删除图层绘制详情
export function deleteLayerDetails(data) {
  return axiosPost(drawMap.deleteLayerDetails, data);
}
// 批量修改图层绘制详情
export function updateLayerDetails(data) {
  return axiosPost(drawMap.updateLayerDetails, data);
}
// 统计土地用途
export function landUseStatistics(data) {
  return axiosPost(drawMap.landUseStatistics, data);
}

// 资产地图-土地资产和业务详情
export function landBusinessDetail(data) {
  return axiosGet(drawMap.landBusinessDetail, data);
}

// 根据方案id查询图层方案
export function queryLayerById(data) {
  return axiosGet(drawMap.queryLayerById, data, true);
}

export function setLayerFields(data) {
  return axiosPost(drawMap.setLayerFields, data, true);
}
// 根据方案id查询图层方案
export function queryLayerFields(data) {
  return axiosGet(drawMap.queryLayerFields, data);
}
export function exportLandDetails(data) {
  return axiosPost(drawMap.exportLandDetails, data, false, false,{
    responseType: 'blob'
  });
}

