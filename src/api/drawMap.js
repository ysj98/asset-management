import { axiosPost } from "../utils/axios";
import { drawMap } from "../config/config.url";

// 上传图层图片
export function uploadImage(data) {
  return axiosPost(drawMap.uploadImage, data,true,false,{ timeout: 1000 * 60 * 10 });
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
