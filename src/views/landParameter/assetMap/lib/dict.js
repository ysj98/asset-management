/*
 * @Date: 2020-09-07 10:35:23
 * @Description: 资产地图字典
 * @Author: chh
 */
export const arrkeys = [
  ['数量个数', 'assetNum'],
  ['面积(㎡)', 'assetArea'],
  ['价值(元)', 'assetValue'],
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
export const getDataIndexs = (arr) => {
  let dataIndexs = ['totalInfo']
  if (arr.includes('4')) {
    dataIndexs.push('landInfo')
  }
  if (arr.includes('1')) {
    dataIndexs.push('houseInfo')
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
  if (arr.includes('4')) {
    nvColumns.push({
      title: "土地",
      dataIndex: "landInfo",
    })
  }
  if (arr.includes('1')) {
    nvColumns.push({
      title: "房屋",
      dataIndex: "houseInfo",
    })
  }
  return nvColumns
}