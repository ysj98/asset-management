<!--
 * @Author: L
 * @Description: 资产使用一览表
-->
<template>
  <div class="landAssetsView">
    <SearchContainer type="" v-model="toggle" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <!-- <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_RESOURCE_STATISTICS_EXPORT" @click="downloadFn">导出</SG-Button> -->
        <span>统计维度：</span>
        <a-radio-group v-model="queryCondition.type" @change="typeChange">
          <a-radio v-for="(item, index) in typeList" :value="item.value" :key="index">{{item.name}}</a-radio>
        </a-radio-group>
      </div>
      <div slot="headerForm" style="text-align: left; float: right">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select
          v-model="queryCondition.projectId"
          :style="allStyle"
          :options="$addTitle(projectOptions)"
          placeholder="请选择资产项目"
          :filterOption="filterOption"
        ></a-select>
        <div class="dbl">
          <span>资产类型：</span>
          <a-radio-group v-model="queryCondition.assetType">
            <a-radio v-for="(item, index) in assetTypeList" :value="item.value" :key="index">{{item.name}}</a-radio>
          </a-radio-group>
        </div>
        <a-select v-if="+queryCondition.type === 3" :style="allStyle" placeholder="全部分类" v-model="queryCondition.objectType">
          <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-input v-if="+queryCondition.type === 3" v-model.trim="queryCondition.assetNameOrCode" :style="allStyle" placeholder="资产名称或编码"/>
        <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed" :class="{'overflowX': tableData.length === 0}">
      <a-table
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        >
        <!-- <span slot="action" slot-scope="text, record, index">
          <span v-if="index < tableData.length - 2" style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">资产明细</span>
        </span> -->
      </a-table>
      <!-- <no-data-tips v-show="tableData.length === 0"></no-data-tips> -->
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
import TreeSelect from '../common/treeSelect'
import noDataTips from '@/components/noDataTips'
import { ASSET_MANAGEMENT } from "@/config/config.power";
import {handleTableScrollHeight} from "@/utils/share"
import {typeList,assetTypeList, queryCondition, columnsData} from './common.js'
const totalKeyArr = ['assetNum', 'assetArea', 'buildNum', 'houseNum', 'houseTotalArea', 'rentedArea', 'leaseArea', 'oneselfArea', 'idleArea', 'sellArea', 'originalValue', 'marketValue',]
export default {
  components: {SearchContainer, TreeSelect, noDataTips},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      projectOptions: [],
      allStyle: 'width: 170px; margin-right: 10px;',
      typeList: typeList,
      assetTypeList: assetTypeList,
      modalShow: false,
      current: '',
      listValue: ['changeOrderDetailId', 'assetCode', 'assetName'],
      columnsData,
      scroll: {x: columnsData.length * 150, y: 200},
      loading: false,
      noPageTools: false,
      location: 'absolute',
      toggle: false,
      columns: columnsData,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {...queryCondition},
      count: '',
      assetClassifyData: [{name: '全部分类', value: ''}],
      modalObj: { title: '展示列表设置', status: false, okText: '应用', width: 600 },
    }
  },
  computed: {
  },
  methods: {
    typeChange () {
      this.allQuery()
    },
    // 表头自定义设置
    handleModalOk () {},
    // 导出
    downloadFn () {
      // let obj = {
      //   organId: this.queryCondition.organId,                               // 组织机构id
      //   objectTypeIdList: this.alljudge(this.queryCondition.objectTypes),   // 资产分类
      //   statusList: this.alljudge(this.queryCondition.statuss)                 //  资产状态(多选)
      // }
      // this.$api.tableManage.houseResourceExport(obj).then(res => {
      //   let blob = new Blob([res.data])
      //   let a = document.createElement('a')
      //   a.href = URL.createObjectURL(blob)
      //   a.download = '房屋资产&资源统计表.xls'
      //   a.style.display = 'none'
      //   document.body.appendChild(a)
      //   a.click()
      //   a.remove()
      // })
    },
    projectFn () {
      this.$api.assets.getObjectKeyValueByOrganId({organId: this.queryCondition.organId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.projectOptions = (res.data || []).map(item => {
            return {
              key: item.projectId,
              title:item.projectName
            }
          })
          this.projectOptions = [{title: '全部资产项目', key: ''}, ...this.projectOptions]
        }
      }).catch(err => {
        this.$message.error(err)
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
      this.projectFn()
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
    // 选择框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleNumber(dataSource){
      dataSource.forEach(ele=>{
        Object.keys(ele).forEach(keyStr=>{
          if (totalKeyArr.includes(keyStr)){
            if (!isNaN(Number(ele[keyStr]))){
              ele[keyStr] = Number(ele[keyStr]).toLocaleString()
            }
          }
        })
      })
    },
    // 查询
    query (str) {
      this.loading = true
      this.$api.assetUsageList.queryYueXinReport(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.tableData = data
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
          if (str !== 'asset' || str !== 'changePage') {
            this.assetViewTotal(obj)
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
    handleTableScrollHeight(this.scroll)
    this.scroll.y = 420
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-table-tbody {
  tr:nth-last-child(1){
    position: sticky;
    bottom: 4px;
    background: #fff;
  }
  tr:nth-last-child(2){
    position: sticky;
    bottom: 43px;
    background: #fff;
  }
}
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
    padding-bottom: 70px;
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
