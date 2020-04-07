<!--报表管理-房屋资产统计分析入口页面--查询列表Part-->
<template>
  <div class="list_part">
    <SG-Title title="查询列表"/>
    <div style="margin-left: 45px">
      <a-row style="margin-bottom: 8px">
        <a-col :span="12">
          <SG-Button icon="import" type="primary" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
        </a-col>
        <a-col :span="12" style="text-align: right; line-height: 32px">
          <a-icon type="setting" @click="openModal" style="color: #299fff; font-size: 18px; cursor: pointer; padding-right: 8px"/>
        </a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="dataSource" bordered class="custom-table td-pd10" :pagination="false" :loading="tableLoading"/>
      <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    </div>
    <!--编辑列表表头-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status" @ok="handleModalOk">
      <edit-table-header :key="key" ref="tableHeader" :checkedArr="checkedHeaderArr" :columns="sortFactor"/>
    </SG-Modal>
  </div>
</template>

<script>
  import EditTableHeader from './EditTableHeader'
  import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
  export default {
    name: 'ListPart',
    components: { EditTableHeader },
    props: ['queryInfo'],
    data () {
      return {
        tableLoading: false,
        exportBtnLoading: false, // 导出button loading标志
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        dataSource: [], // Table数据源
        columnsFixed: [
          { title: '省份', dataIndex: 'provinceName' }, { title: '城市', dataIndex: 'cityName' },
          { title: '建筑面积', dataIndex: 'area' }, { title: '资产原值', dataIndex: 'originalValue' },
          { title: '首次评估原值', dataIndex: 'firstOriginalValue' }, { title: '最新估值', dataIndex: 'latestValuationValue' }
        ], // Table 列头固定部分
        sortFactor: [
          { title: '管理机构', dataIndex: 'organName' }, { title: '资产项目', dataIndex: 'projectName' },
          { title: '用途', dataIndex: 'useTypeName' }, { title: '地区', dataIndex: 'regionName' },
          { title: '权属情况', dataIndex: 'ownershipStatusName' }
        ], // 统计维度的集合
        columnsDynamic: [], // Table 列头动态部分, 用于合成columns
        columns: [], // // Table 列头 = columnsDynamic合并单元格处理后 + columnsFixed
        modalObj: { title: '统计维度设置', status: false, okText: '应用', width: 600 },
        checkedHeaderArr: [], // 格式如['name', 'age']
        key: 0, // 更新Modal包裹的子组件, 防止Modal关闭后仍保留组件状态
        sortIndex: {
          organName: 1,
          projectName: 2,
          useTypeName: 3,
          regionName: 4,
          ownershipStatusName: 5
        }, // 统计维度的顺序表，用于导出
        sortFunc: (a, b) => a - b // 默认排序算法
      }
    },
    
    mounted () {
      const { sortFactor } = this
      this.columnsDynamic = sortFactor
      this.sortFunc = this.generateSort(sortFactor)
      this.checkedHeaderArr = sortFactor.map(m => m.dataIndex)
      this.handleColumns()
    },

    watch: {
      queryInfo: function () {
        this.queryTableData({})
      }
    },

    methods: {
      // 查询Table DataSource
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const { queryInfo, columnsDynamic, sortIndex } = this
        if (!queryInfo.organId) { return this.$message.warn('请选择组织机构') }
        this.loading = true
        let dimension = columnsDynamic.map(m => sortIndex[m.dataIndex])
        this.$api.tableManage.queryAssetHouseList({...queryInfo, dimension, pageSize: pageLength, pageNum: pageNo}).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.dataSource = (data || []).map((m, key) => ({ ...m, key }))
            this.handleColumns()
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.loading = false
          this.$message.error(err || '查询列表接口出错')
        })
      },

      // 打开列表列头编辑Modal
      openModal () {
        this.key = Date.now()
        this.modalObj.status = true
      },

      // 列表设置Modal保存
      handleModalOk () {
        let { checkedList, options } = this.$refs['tableHeader']
        if (!checkedList.length) {
          return this.$message.info('请至少选中一项!')
        }
        // 同步sortFactor数据顺序
        this.sortFactor = options
        this.modalObj.status = false
        this.checkedHeaderArr = checkedList
        // 生成选中的且按统计维度顺序排列的columnsDynamic
        let columnsDynamic = options.filter(n => checkedList.includes(n.dataIndex))
        this.columnsDynamic = columnsDynamic
        this.sortFunc = this.generateSort(columnsDynamic)
        this.handleColumns()
        // 防止较少列时出现滚动
        // this.scroll = { x: columns.length * 100 }
      },

      // 按统计维度生成排序算法
      generateSort (columns) {
        // 字符串排序利用API referenceStr.localeCompare(compareString[, locales[, options]])
        // 详见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
        // 这里有个重要前提，已知要排序维度的最大值，该业务场景最大值为 5，厌恶的嵌套，没想到更好地思路
        // 没有对(a[columns[0]['dataIndex']]值的有无做判断，要保证有值，即使是''
        return (a, b) => {
          // 第一维度
          if (!columns[0] || !columns[0]['dataIndex']) { return false }
          if (a[columns[0]['dataIndex']].localeCompare(b[columns[0]['dataIndex']]) === 0) {
            // 第二维度
            if (!columns[1] || !columns[1]['dataIndex']) { return false }
            if (a[columns[1]['dataIndex']].localeCompare(b[columns[1]['dataIndex']]) === 0) {
              // 第三维度
              if (!columns[2] || !columns[2]['dataIndex']) { return false }
              if (a[columns[2]['dataIndex']].localeCompare(b[columns[2]['dataIndex']]) === 0) {
                // 第四维度
                if (!columns[3] || !columns[3]['dataIndex']) { return false }
                if (a[columns[3]['dataIndex']].localeCompare(b[columns[3]['dataIndex']]) === 0) {
                  // 第五维度
                  if (!columns[4] || !columns[4]['dataIndex']) { return false }
                  if (a[columns[4]['dataIndex']].localeCompare(b[columns[4]['dataIndex']]) === 0) {
                    // 第六维度
                    if (!columns[5] || !columns[5]['dataIndex']) { return false }
                    return a[columns[5]['dataIndex']].localeCompare(b[columns[5]['dataIndex']])
                  } else {
                    return a[columns[4]['dataIndex']].localeCompare(b[columns[4]['dataIndex']])
                  }
                } else {
                  return a[columns[3]['dataIndex']].localeCompare(b[columns[3]['dataIndex']])
                }
              } else {
                return a[columns[2]['dataIndex']].localeCompare(b[columns[2]['dataIndex']])
              }
            } else {
              return a[columns[1]['dataIndex']].localeCompare(b[columns[1]['dataIndex']])
            }
          } else {
            return a[columns[0]['dataIndex']].localeCompare(b[columns[0]['dataIndex']])
          }
        }
      },

      // 汇总需要合并的维度的rowSpan
      calcRowSpan (data, arr) {
        let obj = {}
        // 形如该格式的数据集合,存储的是相同值的个数,字段名为值的拼接值
        // _organName值A_projectName值A_useType值A: 22
        this.dataSource = data.map(m => {
          let rowSpanInfo = {}
          // 形如该格式的数据集合，存在dataSource每行中,存储的是相同值的开始位置标记
          // rowSpanInfo = { organName: true, projectName: true, ... }，true为需要设置rowSpan
          arr.forEach((n, i) => {
            let name = ''
            for (let c = 0; c <= i; c++) {
              name += `_${m[arr[c].dataIndex]}`
            }
            if (obj[name]) {
              obj[name] += 1
            } else {
              obj[name] = 1
              rowSpanInfo[n.dataIndex] = true
            }
          })
          return { ...m, rowSpanInfo }
        })
        return obj
      },

      // 处理columns中需要合并的列
      handleColumns () {
        const { columnsFixed, dataSource, sortFunc, columnsDynamic } = this
        // 对dataSource按统计维度排序
        let newDataSource = dataSource.sort(sortFunc)
        let gatherInfo = this.calcRowSpan(newDataSource, columnsDynamic)
        this.columns = columnsDynamic.map((m, i) => {
          return {
            ...m,
            customRender: (value, row) => this.renderCellContent(value, row, m.dataIndex, i, columnsDynamic, gatherInfo)
          }
        }).concat(columnsFixed)
      },

      // 合并单元格
      renderCellContent (value, row, dataIndex, i, columnsDynamic, gatherInfo) {
        let attrs = {}
        let rowSpanInfo = row.rowSpanInfo
        if (rowSpanInfo[dataIndex]) {
          let name = ''
          for (let c = 0; c <= i; c++) {
            name += `_${row[columnsDynamic[c].dataIndex]}`
          }
          attrs.rowSpan = gatherInfo[name]
        } else {
          attrs.rowSpan = 0
        }
        return { children: value, attrs }
      },

      // 导出
      handleExport () {
        const { queryInfo, dataSource, sortIndex, columnsDynamic } = this
        if (!dataSource.length) { return this.$message.info('暂无可导出数据') }
        this.exportBtnLoading = true
        let dimension = columnsDynamic.map(m => sortIndex[m.dataIndex])
        exportDataAsExcel({...queryInfo, dimension}, this.$api.tableManage.exportAssetHouseList, '房屋资产统计分析列表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .list_part {
    .custom-table {
      padding-bottom: 8px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th, td {
          white-space: nowrap;
          text-align: center;
        }
        td {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .ant-table-placeholder {
          display: block !important;
          border-bottom: 1px solid #e8e8e8 !important;
        }
      }
    }
  }
</style>
