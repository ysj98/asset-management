<!--报表管理-房屋资产统计分析入口页面--查询列表Part-->
<template>
  <div class="list_part">
    <SG-Title title="查询列表"/>
    <div style="margin-left: 45px">
      <a-row style="margin-bottom: 8px">
        <a-col :span="12">
          <SG-Button icon="import" type="primary" :loading='exportBtnLoading' @click="handleExport" v-power="ASSET_MANAGEMENT.TM_AA_EXPORT">
            导出
          </SG-Button>
        </a-col>
        <a-col :span="12" style="text-align: right; line-height: 32px">
          <a-icon type="setting" @click="openModal" style="color: #299fff; font-size: 18px; cursor: pointer; padding-right: 8px"/>
        </a-col>
      </a-row>
      <a-table 
        :columns="columns" 
        :dataSource="dataSource" 
        bordered 
        class="custom-table td-pd10" 
        :pagination="false" 
        :loading="tableLoading"
        :scroll="tableScroll">
        <template slot="area" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="transferOperationArea" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="selfUserArea" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="occupationArea" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="originalValue" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="latestValuationValue" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="idleArea" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="otherArea" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="firstOriginalValue" slot-scope="text">
          <span>{{getFormat(text)}}</span>
        </template>
        <template slot="detail" slot-scope="text,record,index">
          <span v-if="index<(dataSource.length-2)" @click="showIndex(index,record)" class="detail">明细</span>
        </template>
      </a-table>
      <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    </div>
    <!--编辑列表表头-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status" @ok="handleModalOk" @cancel="()=>{ modalObj.status = false }">
      <edit-table-header :key="key" ref="tableHeader" :penetrateData="penetrateData" :checkedArr="checkedHeaderArr" :columns="sortFactor"/>
    </SG-Modal>
  </div>
</template>

<script>
import EditTableHeader from './EditTableHeader'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {exportDataAsExcel} from 'src/views/common/commonQueryApi'
import {getFormat, getMutipSort, getSort, utils} from '@/utils/utils'
import { handleTableScrollHeight } from "utils/share";
import {math} from '@/utils/math'
export default {
    name: 'ListPart',
    components: { EditTableHeader },
    props: ['queryInfo','titleList'],
    data () {
      return {
        // scroll:{x: 1500, y: 600},
        tableScroll:{
          x: '80%',
          y: 600
        },
        getFormat,
        penetrateData: '2',
        organQueryType: '2',    // 统计维度设置
        ASSET_MANAGEMENT, // 权限对象
        tableLoading: false,
        exportBtnLoading: false, // 导出button loading标志
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        dataSource: [], // Table数据源
        columnsPC: [{ title: '省份', dataIndex: 'provinceName', width: 80 }, { title: '城市', dataIndex: 'cityName', width: 80 }], // 省份城市字段跟随地区展示
        columnsFixed: [
          { title: '资产数量', dataIndex: 'assetNum', width: 100 },
          { title: '资产面积(㎡)', dataIndex: 'area', scopedSlots: { customRender: 'area' }, width: 150 }, { title: '运营(㎡)', dataIndex: 'transferOperationArea', scopedSlots: { customRender: 'transferOperationArea' }, width: 150,code:'1001' },
          { title: '自用(㎡)', dataIndex: 'selfUserArea', scopedSlots: { customRender: 'selfUserArea' }, width: 150,code:'1003' }, { title: '闲置(㎡)', dataIndex: 'idleArea', scopedSlots: { customRender: 'idleArea' }, width: 150 ,code:'1002'},
          { title: '占用(㎡)', dataIndex: 'occupationArea', scopedSlots: { customRender: 'occupationArea' }, width: 150 ,code:'1004'}, { title: '其它(㎡)', dataIndex: 'otherArea', scopedSlots: { customRender: 'otherArea' }, width: 150,code:'1005' },
          { title: '资产原值', dataIndex: 'originalValue', scopedSlots: { customRender: 'originalValue' }, width: 150 }, { title: '首次评估原值', dataIndex: 'firstOriginalValue', scopedSlots: { customRender: 'firstOriginalValue' }, width: 150},
          { title: '最新估值', dataIndex: 'latestValuationValue', scopedSlots: { customRender: 'latestValuationValue' }, width: 150 },{ title: '',  scopedSlots: { customRender: 'detail' }, width: 100,align: 'center' },
        ], // Table 列头固定部分
        sortFactor: [
          { title: '管理机构', dataIndex: 'organName', fixed: 'left', width: 180 }, { title: '资产项目', dataIndex: 'projectName', width: 160 },
          { title: '经营单位', dataIndex: 'businessUnit', width: 150},
          { title: '资产分类', dataIndex: 'objectTypeName', width: 100 }, { title: '权属情况', dataIndex: 'ownershipStatusName', width: 100 },
          { title: '地区', dataIndex: 'regionName', width: 80},
        ], // 统计维度的集合
        columnsDynamic: [], // Table 列头动态部分, 用于合成columns
        columns: [], // // Table 列头 = columnsDynamic合并单元格处理后 + columnsFixed
        modalObj: { title: '展示列表设置', status: false, okText: '应用', width: 600 },
        checkedHeaderArr: [], // 格式如['name', 'age']
        key: 0, // 更新Modal包裹的子组件, 防止Modal关闭后仍保留组件状态
        sortIndex: {
          organName: 1,
          projectName: 2,
          objectTypeName: 3,
          ownershipStatusName: 5,
          businessUnit: 6,
          regionName: 4,
        }, // 统计维度的顺序表，用于导出
        sortFunc: (a, b) => a - b, // 默认排序算法
        totalData: {}
      }
    },
    created(){
      handleTableScrollHeight(this.tableScroll, 290)
    },
    mounted () {
      const { sortFactor, columnsPC } = this
      let sortFactorData = utils.deepClone(sortFactor)
      sortFactorData.splice(5, 0, ...columnsPC)
      // this.columnsDynamic = sortFactor.concat(columnsPC)
      this.columnsDynamic = sortFactorData
      // this.sortFunc = this.generateSort(sortFactor)
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
      async queryTableData ({pageNo = 1, pageLength = 10}) {
        const { queryInfo, columnsDynamic, sortIndex } = this
        this.tableLoading = true
        let dimension = columnsDynamic.map(m => sortIndex[m.dataIndex]).filter(n => n)
        dimension.splice(dimension.indexOf(6),1)
        // dimension.splice(dimension.indexOf(4),1)
        // dimension.push(4)
        this.$api.tableManage.queryAssetHouseList({...queryInfo, dimension, pageSize: pageLength, pageNum: pageNo, organQueryType: this.organQueryType}).then(r => {
          this.tableLoading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            const arr = ['organName', 'projectName', 'objectTypeName', 'regionName', 'ownershipStatusName', 'businessUnit']
            const sortArr = this.sortFactor.map(ele=>ele.dataIndex)
            sortArr.forEach((ele,index)=>{
              // regionName 代表 三个字段合并前后顺序 固定 省/市/区
              if (ele === 'regionName'){
                sortArr.splice(index,1, 'provinceName', 'cityName', 'regionName')
              }
            })
            const sortFnArr = sortArr.map(ele=>{
              return getSort( (a,b) => {
                return a[ele] > (b[ele])
              })
            })
            this.dataSource = (data || []).map((m, key) => {
              let obj = {}
              // 防止排序时出现字段值为null,无法使用localeCompare
              arr.forEach(n => obj[n] = m[n] || '')
              return { ...m, ...obj, key }
            })
            this.dataSource.sort((a,b)=>{
              return getMutipSort(sortFnArr)(a, b)
            })
            this.handleColumns()
            this.getTitle()
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })

          }
          throw res.message
        }).catch(err => {
          this.tableLoading = false
          this.$message.error(err || '查询列表接口出错')
        })
      },
      //获取自定义表头
      getTitle(){
        console.log(this.titleList)
       this.titleList.forEach(item=>{
              this.columns.forEach(ele=>{
                if(ele.code==item.code){
                  ele.title=item.alias+'(㎡)'
                }
              })
            })
      },
      // 打开列表列头编辑Modal
      openModal () {
        this.key = Date.now()
        // this.modalType = 1
        this.modalObj.status = true
      },
      // 列表设置Modal保存
      handleModalOk () {
        let { checkedList, options, penetrateValue} = this.$refs['tableHeader']
        console.log(this.$refs['tableHeader'])
        this.penetrateData = penetrateValue
        this.organQueryType = checkedList.includes('organName') ? penetrateValue : ''
        if (!checkedList.length) {
          return this.$message.info('请至少选中一项!')
        }
        const { columnsPC } = this
        // 同步sortFactor数据顺序
        this.sortFactor = options
        this.modalObj.status = false
        this.checkedHeaderArr = checkedList
        let columnsDynamic = []   // 生成选中头部
        let arr = utils.deepClone(options)
        let arrData = []
        // 给每个选中的压入一个标识
        arr.forEach(item => {
          item.keys = '1'
          if (!checkedList.includes(item.dataIndex)) {
            item.keys = '0'
          }
          if (item.keys === '1') {
            arrData.push(item)
          }
        })
        // 在通过选中的标识拿到要在第几位添加省市区
        let isHasRegionIndex = 0
        arrData.forEach((item, index) => {
          if (item.dataIndex === 'regionName') {
            isHasRegionIndex = index
          }
          columnsDynamic.push(item)
        })
        // 如果包含地区维度，则添加省份、城市列头
        checkedList.includes('regionName') && columnsDynamic.splice(isHasRegionIndex, 0, ...columnsPC)
        this.columnsDynamic = columnsDynamic
        // this.handleColumns()
        this.queryTableData({})
        // 防止较少列时出现滚动
        // this.scroll = { x: columns.length * 160 }
      },

      // 按统计维度生成排序算法
      generateSort (columns) {
        console.log(columns, 'dsfsdfds ')
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
      async handleColumns () {
        const { columnsFixed, dataSource, columnsDynamic, queryInfo, sortIndex } = this
        // 对dataSource按统计维度排序
        // let newDataSource = dataSource.sort(sortFunc)
        let gatherInfo = this.calcRowSpan(dataSource, columnsDynamic)
        this.columns = columnsDynamic.map((m, i) => {
          return {
            ...m,
            customRender: (value, row) => this.renderCellContent(value, row, m.dataIndex, i, columnsDynamic, gatherInfo)
          }
        }).concat(columnsFixed)
        // 表格添加合计和小计
        let sumarr = ['assetNum', 'area', 'transferOperationArea', 'selfUserArea','idleArea', 'occupationArea', 'otherArea', 'originalValue', 'firstOriginalValue', 'latestValuationValue']
        let sumObj = {}
        // sumarr.forEach(key => {
        //   let num = 0
        //   this.dataSource.forEach((item, index) => {
        //     item[key] = item[key] ? item[key] : 0
        //     num += Number(item[key])
        //     if(index === this.dataSource.length - 1) sumObj[key] = num
        //   })
        // })
        // 计算小计
        const { format, bignumber, add } = math
        sumarr.forEach(key => {
         sumObj[key]= this.dataSource.reduce((pre, cur) => {
            cur[key] = cur[key] ? cur[key] : 0
            return  +format(add(bignumber(pre || 0), bignumber(cur[key] || 0)))
          }, 0)
        })
        let dimension = columnsDynamic.map(m => sortIndex[m.dataIndex]).filter(n => n)
        dimension.splice(dimension.indexOf(6),1)
        try {
          let res = await this.$api.tableManage.pageListStatistics({...queryInfo, dimension,  organQueryType: this.organQueryType})
          if(res.data.code === '0'){
            this.totalData = res.data.data
            console.log(this.totalData)
          }
        } catch (error) {
          console.log(error)
          this.$message.error(error || '合计查询失败')
        }
        // 处理合计数据
        let totalObj = {}
        Object.keys(this.totalData).forEach(key => {
          if(key === 'assetAreaCount'){
            totalObj.area = this.totalData[key]
          }else{
            let str = key.split('C')[0]
            totalObj[str] = this.totalData[key]
          }
        })

        this.dataSource && this.dataSource.length > 0 && this.dataSource.push({ organName: '当前页-合计', ...sumObj}, { ...totalObj,organName: '所有页-合计' }) // ,
      },

      // 合并单元格
      renderCellContent (value, row, dataIndex, i, columnsDynamic, gatherInfo) {
        if(row.organName !== '当前页-合计' && row.organName !== '所有页-合计'){
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
        }else {
          return {children: value}
        }
      },

      // 导出
      handleExport () {
        const { queryInfo, dataSource, sortIndex, columnsDynamic } = this
        if (!dataSource.length) { return this.$message.info('暂无可导出数据') }
        this.exportBtnLoading = true
        let dimension = columnsDynamic.map(m => sortIndex[m.dataIndex])
        dimension.splice(dimension.indexOf(4),1)
        dimension.push(4)
        exportDataAsExcel({...queryInfo, dimension}, this.$api.tableManage.exportAssetHouseList, '房屋资产统计分析列表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },
      showIndex(val,record){
        const params={
          organIds:record.organId,
          projectId:record.projectId,
          objectType:record.objectType,
          ownershipStatus:record.ownershipStatus,
          province:record.province,
          city:record.city,
          region:record.region,
          type:'across'
        }
        window.parent.openPortalMenu(`/asset-management/#/assetView?organIds=${record.organId}&projectId=${record.projectId}&objectType=${record.objectType}&ownershipStatus=${record.ownershipStatus}&province=${record.province}&city=${record.city}&region=${record.region}`, '房屋资产视图')
        // this.$router.push({
        //   path: '/assetView',
        //   query: {
        //     ...params
        //   }
        // })
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
        .ant-table-thead th {
          white-space: nowrap;
          text-align: center;
        }
        td {
          text-align: center;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        tr:last-child, tr:nth-last-child(2) {
          font-weight: bold !important;
        }
        .ant-table-placeholder {
          display: block !important;
          border-bottom: 1px solid #e8e8e8 !important;
        }
      }
      & /deep/ .ant-table-fixed-header .ant-table-scroll .ant-table-header {
        height: unset !important;
      }
    }
  }
   /deep/.ant-table-tbody {
  tr:nth-last-child(1){
    position: sticky;
    bottom: 0px;
    background: #fff;
  }
  tr:nth-last-child(2){
    position: sticky;
    bottom: 40px;
    background: #fff;
  }
   }
   .detail{
     color: blue;
     cursor: pointer;
   }
</style>
