/*
 * @Date: 2020-09-07 10:35:23
 * @Description: 资产地图字典
 * @Author: chh
 */
export const arrkeys = [
  ['数量个数', 'assetNum' ],
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
  'houseInfo'
]
export const columns = [{
  title: "类型",
  dataIndex: "name",
}, {
  title: "总数",
  dataIndex: "totalInfo",
}, {
  title: "土地",
  dataIndex: "landInfo",
}, {
  title: "房屋",
  dataIndex: "houseInfo",
}]
