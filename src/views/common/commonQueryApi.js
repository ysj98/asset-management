// 常用的查询数据接口，函数返回promise结果
// 非数据查询接口函数，正常return结果
import API from 'src/api'
  // 搜索过滤选项
export function filterOption (input, option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

// 根据organId查询资产项目列表
export function queryProjectListByOrganId (organId) {
  return API.assets.getObjectKeyValueByOrganId({organId}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return (res.data || []).map(item => {
        return { key: item.projectId, title: item.projectName }
      })
    }
    // throw res.message || '查询资产项目失败'
  // }).catch(err => {
  //   this.$message.error(err || '查询资产项目失败')
  })
}

// 根据organId查询楼栋列表
export function queryBuildingListByOrganId (organId) {
  return API.assets.queryBuildingByOrganId({organId}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return (res.data || []).map(item => {
        return { key: item.buildId || item.projectId, title: item.buildName || item.projectName }
      })
    }
    // throw res.message || '查询楼栋失败'
  // }).catch(err => {
  //   this.$message.error(err || '查询楼栋失败')
  })
}

// 查询资产类型--平台字典
export function queryAssetTypeList () {
  return API.basics.platformDict({code: 'asset_type'}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return res.data.map(item => ({
        title: item.name, key: item.value
      }))
    }
  //   throw res.message || '查询资产类型失败'
  // }).catch(err => {
  //   this.$message.error(err || '查询资产类型失败')
  })
}

// 查询评估方法平台字典
export function queryAssetMethodList () {
  let code = 'ASSESSMENT_METHOD'
  return API.basics.platformDict({code}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return res.data.map(item => ({
        title: item.name, key: String(item.value)
      }))
    }
    // throw res.message || `查询${tip}失败`
  // }).catch(err => {
  //   this.$message.error(err || `查询${tip}失败`)
  })
}

// 根据资产类型及organId查资产分类列表
export function queryCategoryList (data) {
  return API.assets.getList(data).then(res => {
    if (Number(res.data.code) === 0) {
      let { data } = res.data
      return data.map( m => ({
        title: m.professionName, key: m.professionCode
      }))
    }
    // throw res.message || '查询资产分类失败'
  // }).catch(err => {
  //   this.$message.error(err || '查询资产分类失败')
  })
}
