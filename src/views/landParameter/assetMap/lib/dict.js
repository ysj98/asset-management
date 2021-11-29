/*
 * @Date: 2020-09-07 10:35:23
 * @Description: 资产地图字典
 * @Author: chh
 */
import {MAP_ASSET_TYPE_CODE} from '../share'
import store from '@/store/index'
export const arrkeys = [
  ['数量个数', 'assetNum'],
  ['面积(㎡)', 'assetArea'],
  ['价值(万元)', 'assetValue'],
  ['所有权占比', 'ownerShipPercent'],
  ['使用权占比', 'onlyUsePercent'],
  ['有证资产占比', 'warrantPercent'],
  ['无证资产占比', 'noWarrantPercent'],
]
export const dataIndexs = [
  'totalInfo',
  'landInfo',
  'houseInfo',
  'equipmentInfo',
  'parkInfo'
]
export const getDataIndexs = (arr) => {
  let dataIndexs = ['totalInfo']
  if (arr.includes(store.state.ASSET_TYPE_CODE.LAND)) {
    dataIndexs.push('landInfo')
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.HOUSE)) {
    dataIndexs.push('houseInfo')
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.YARD)) {
    dataIndexs.push('parkInfo')
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.EQUIPMENT)) {
    dataIndexs.push('equipmentInfo')
  }
  return dataIndexs
}
export const columns = [{
  title: "类型",
  dataIndex: "name",
}, {
  title: "总数",
  dataIndex: "totalInfo",
}]
export let getColumns = (arr) => {
  let nvColumns = [...columns]
  if (arr.includes(store.state.ASSET_TYPE_CODE.LAND)) {
    nvColumns.push({
      title: "土地",
      dataIndex: "landInfo",
    })
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.HOUSE)) {
    nvColumns.push({
      title: "房屋",
      dataIndex: "houseInfo",
    })
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.YARD)) {
    nvColumns.push({
      title: "车场",
      dataIndex: "parkInfo",
    })
  }
  if (arr.includes(store.state.ASSET_TYPE_CODE.EQUIPMENT)) {
    nvColumns.push({
      title: "设备设施",
      dataIndex: "equipmentInfo",
      width: 90
      // customRender(record){
      //   console.log('record',record)
      //   // return record === null ? '/' : record
      // }
    })
  }
  return nvColumns
}
