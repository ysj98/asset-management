<!--
 * @Author: L
 * @Date: 2020-11-03 10:09:17
 * @LastEditTime: 2022-01-17 15:38:41
 * @Description: 资源报表
-->
<template>
  <div class="landAssetsView">
    <SearchContainer type="" v-model="toggle" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_RESOURCE_STATISTICS_EXPORT" @click="downloadFn">导出</SG-Button>
      </div>
      <div slot="headerForm" style="text-align: left; float: right">
        <a-checkbox @change="onCheck">展示资产数量为0得机构</a-checkbox>
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部分类" :tokenSeparators="[',']"  @select="assetClassifyDataFn" v-model="queryCondition.objectTypes">
          <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.statuss">
          <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <div class="table-layout-fixed" :class="{'overflowX': tableData.length === 0}">
      <a-table
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table table-boxs"
        :pagination="false"
        >
        <span slot="action" slot-scope="text, record">
          <span style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">资产明细</span>
        </span>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'
import { ASSET_MANAGEMENT } from "@/config/config.power";
import { getFormat } from '../../../utils/utils'
const columnsData = [
  { title: '管理机构', dataIndex: 'organName', width: 150 },
  { title: '资产数量', dataIndex: 'assetNum', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '楼栋数量', dataIndex: 'buildNum', width: 150 },
  { title: '房屋数量', dataIndex: 'houseNum', width: 150 },
  { title: '房屋总面积(㎡)', dataIndex: 'houseTotalArea', width: 150 },
  { title: '已租面积(㎡)', dataIndex: 'rentedArea', width: 150 },
  { title: '待租面积(㎡)', dataIndex: 'leaseArea', width: 150 },
  { title: '自用面积(㎡)', dataIndex: 'oneselfArea', width: 150 },
  { title: '闲置面积(㎡)', dataIndex: 'idleArea', width: 150 },
  { title: '销售面积(㎡)', dataIndex: 'sellArea', width: 150 },
  { title: '资产原值(元)', dataIndex: 'originalValue', width: 150 },
  { title: '最新估值(元)', dataIndex: 'marketValue', width: 150 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 100}
]
const approvalStatusData = [
  { name: '全部状态', value: ''},
  { name: '待入库', value: 0},
  { name: '正常', value: 1},
  { name: '报废', value: 2},
  { name: '转让', value: 3},
  { name: '报损', value: 4},
  // { name: '已出库', value: '5'},
  // { name: '已取消', value: '6' },
  { name: '入库中', value: 7 }
]
const queryCondition =  {
  objectTypes: '',    // 资产分类(多选)
  organId: '',        // 组织机构id
  statuss: '',        // 资产状态(多选)
  pageNum: 1,         // 当前页
  pageSize: 10,        // 每页显示记录数
  containEmpty: 0,    //展示资产数量为0得机构 1-展示 0-不展示
}
export default {
  components: {SearchContainer, TreeSelect, noDataTips, OverviewNumber},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      allStyle: 'width: 170px; margin-right: 10px;',
      modalShow: false,
      overviewNumSpinning: false,
      current: '',
      listValue: ['changeOrderDetailId', 'assetCode', 'assetName'],
      columnsData,
      scroll: {x: columnsData.length * 150},
      numList: [
        {title: '资产数量(个)', key: 'assetNum', value: 0, fontColor: '#324057'},
        {title: '资产面积(㎡)', key: 'assetArea', value: 0, bgColor: '#4BD288'},
        {title: '楼栋数量', key: 'buildNum', value: 0, bgColor: '#1890FF'},
        {title: '房屋数量', key: 'houseNum', value: 0, bgColor: '#DD81E6'},
        {title: '房屋面积(㎡)', key: 'houseTotalArea', value: 0, bgColor: '#FD7474'},
        {title: '已租面积(㎡)', key: 'rentedArea', value: 0, bgColor: '#FE0974'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      loading: false,
      noPageTools: false,
      location: 'absolute',
      toggle: false,
      columns: columnsData,
      organName: '',
      organId: '',
      tableData: [],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {...queryCondition},
      count: '',
      projectData: [{name: '全部资产项目', value: ''}],
      assetClassifyData: [{name: '全部分类', value: ''}]
    }
  },
  computed: {
  },
  methods: {
    onCheck(e){
      this.queryCondition.containEmpty = e.target.checked ? 1 : 0
    },
    // 导出
    downloadFn () {
      let obj = {
        organId: this.queryCondition.organId,                               // 组织机构id
        objectTypeIdList: this.alljudge(this.queryCondition.objectTypes),   // 资产分类
        statusList: this.alljudge(this.queryCondition.statuss)                 //  资产状态(多选)
      }
      this.$api.tableManage.houseResourceExport(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '房屋资产&资源统计表.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 查看土地资产视图详情
    handleViewDetail ({organId}) {
      this.$router.push({path: '/resourcesReport/assetDetails', query: { organId, selectOrganId: this.queryCondition.organId }})
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.objectTypes = ''
      this.getListFn()
      this.allQuery()
    },
    // 搜索
    allQuery (str) {
      this.queryCondition.pageNum = 1
      this.query(str)
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query('changePage')
    },
    // 资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: '1'
      }
      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = [{name: '全部资产分类', value: ''}, ...arr]
        }
      })
    },
    // 资产分类
    assetClassifyDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.objectTypes = this.handleMultipleSelectValue(value, this.queryCondition.objectTypes, this.assetClassifyData)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.statuss = this.handleMultipleSelectValue(value, this.queryCondition.statuss, this.approvalStatusData)
      })
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = ['']
      } else {
        let totalIndex = data.indexOf('')
        if (totalIndex > -1) {
          data.splice(totalIndex, 1)
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['']
          }
        }
      }
      return data
    },
    // 选择框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    alljudge (val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return []
        } else {
          return val
        }
      } else {
        return []
      }
    },
    // 查询
    query (str) {
      this.loading = true
      let obj = {
        organId: this.queryCondition.organId,                               // 组织机构id
        objectTypeIdList: this.alljudge(this.queryCondition.objectTypes),   // 资产分类
        statusList: this.alljudge(this.queryCondition.statuss),                 //  资产状态(多选)
        pageNum: this.queryCondition.pageNum,                               // 当前页
        pageSize: this.queryCondition.pageSize,                              // 每页显示记录数
      }
      this.$api.tableManage.houseResourcePageList({...obj,containEmpty: this.queryCondition.containEmpty}).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach(item => {
            for(let sub in item){
              if(sub != 'organId' && sub != 'organName'){
                item[sub] = getFormat(item[sub])
              }
            }
          })
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
          if (str !== 'asset') {
            if (str !== 'changePage'){
              this.assetViewTotal(obj)
            }
          }
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 明细统计
    assetViewTotal (obj) {
      this.overviewNumSpinning = true
      obj.pageNum = 1
      obj.pageSize = 1
      this.$api.tableManage.houseResourceTotal(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.numList = this.numList.map(m => {
            return { ...m, value: data[m.key] || 0 }
          })
          this.overviewNumSpinning = false
        } else {
          this.$message.error(res.data.message)
          this.overviewNumSpinning = false
        }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.landAssetsView {
  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    padding-bottom: 60px;
  }
  .overflowX{
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
  .city {
    float: right;
    margin-right: 8px;
    /deep/.ant-col-8 {width: 180px;}
    /deep/.province_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
