// 资产视图业务-资产视图详情页面-详情信息的字段集合
// detail: 细节信息；columns：列表列头
const keys = {
  // 接管信息
  receive: {
    title: '接管信息',
    details: {
      project: '资产项目',
      resource: '来源方式',
      way: '来源渠道'
    },
    table: {
      tableTitle: '当前权证信息', // 非必须
      rowKey: 'ssdfs',
      columns: [
        { title: '编号', key: 'num' },
        { title: '交付类型', key: 'payType' },
        { title: '交付时间', key: 'payDate', scopedSlots: { customRender: 'action' } }
      ]
    },
    table2: {
      title: '权属办理记录',
      rowKey: 'ssdfs',
      columns: [
        { title: '编号', key: 'num' },
        { title: '交付类型', key: 'payType' },
        { title: '交付时间', key: 'payDate', scopedSlots: { customRender: 'action' } }
      ]
    }
  }
}

export default keys
