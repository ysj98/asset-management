// 抽离一些公共接口，减少接口重复调用的代码书写
// context 执行上下文，vue组件实例
// 方法返回Promise实例，便于异步处理响应数据及loading状态

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
    throw res.message
  }).catch(() => {
    return []
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
    throw res.message
  }).catch(() => {
    return []
  })
}

// 根据资产类型及organId查资产分类列表
export function queryCategoryList ({assetType, organId}) {
  return API.assets.getList({assetType, organId}).then(res => {
    if (Number(res.data.code) === 0) {
      let { data } = res.data
      return data.map( m => ({
        title: m.professionName, key: m.professionCode
      }))
    }
    throw res.message
  }).catch(() => {
    return []
  })
}

// 根据organId查询来源字典
export const querySourceType = (organId, context) => {
  return context.$api.assets.platformDict({code: 'ams_source_type', organId: 1}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return (res.data || []).map(item => {
        return { key: item.value, title: item.name }
      })
    }
    throw res.message
  }).catch(err => {
    context.$message.error(err || '查询来源字典失败')
    return []
  })
}

// 导出及下载excel文件
export const exportDataAsExcel = (data, API, name, context) => {
  // data: 后台入参，url: 导出地址，无法统一，name:导出excel名字
  return API(data).then(res => {
    debugger
    if (res.status === 200 && res.data && res.data.size) {
      let a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([res.data]))
      a.download = name
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      return a.remove()
    }
    throw res.message
  }).catch(err => {
    context.$message.error(err || '操作失败')
  })
}

// 查询平台字典
// code: 'ASSESSMENT_METHOD' 查询评估方法
// code: 'asset_type' 查询评估方法
// code: 'AMS_KIND_OF_RIGHT' 查询权属类型
// code: 'TAKEOVER_ASSET_STATUS' 查询接管状态
export const queryPlatformDict = (code) => {
  return API.basics.platformDict({code}).then(r => {
    let res = r.data
    if (res && String(res.code) === '0') {
      return res.data.map(item => ({
        title: item.name, key: String(item.value)
      }))
    }
    throw res.message
  }).catch(() => {
    return []
  })
}
