<!--
 * @Author: L
 * @Description: 资产使用一览表
-->
<template>
  <div class="landAssetsView">
    <SearchContainer type="" v-model="toggle" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <!-- v-power="ASSET_MANAGEMENT.ASSET_RESOURCE_STATISTICS_EXPORT" -->
        <SG-Button type="primary" @click="downloadFn">导出</SG-Button>
      </div>
      <div slot="headerForm" style="text-align: left; float: right">
        <span>统计维度：</span>
        <a-radio-group v-model="queryCondition.type" @change="typeChange">
          <a-radio v-for="(item, index) in typeList" :value="item.value" :key="index">{{item.name}}</a-radio>
        </a-radio-group>
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
      </div>
      <div slot="contentForm" style="margin-top: 15px">
        <div class="dbl">
          <span>资产类型：</span>
          <a-radio-group v-model="queryCondition.assetType" @change="allQuery">
            <a-radio v-for="(item, index) in assetTypeList" :value="item.value" :key="index">{{item.name}}</a-radio>
          </a-radio-group>
        </div>
        <a-select
          v-model="queryCondition.projectId"
          :style="allStyle"
          :options="$addTitle(projectOptions)"
          placeholder="请选择资产项目"
          :filterOption="filterOption"
        ></a-select>
        <a-select v-if="+queryCondition.type === 2" :style="allStyle" placeholder="全部分类" v-model="queryCondition.objectType">
          <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-input v-if="+queryCondition.type === 2" v-model.trim="queryCondition.assetNameOrCode" :style="allStyle" placeholder="资产名称或编码"/>
        <SG-Button type="primary" style="margin-right: 10px;" @click="allQuery">查询</SG-Button>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed" :class="{'overflowX': tableData.length === 0}">
      <a-table
        class="custom-total-one"
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        >
        <!-- 经营面积 -->
        <template slot="managerArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" @click="nextPageFn(record)" class="tab-text-decoration" :class="{'tab-red-color': record.managerArea !== record.pointer}" >{{text}}</span>
          <span v-else :class="{'tab-red-color': record.managerArea !== record.pointer}" >{{text}}</span>
        </template>
        <!-- 自用面积(㎡) -->
        <template slot="selfUserArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" @click="nextPageFn(record)" class="tab-text-decoration" >{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 占用面积(㎡) -->
        <template slot="occupationArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" @click="nextPageFn(record)" class="tab-text-decoration" >{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 经营情况 -->
        <!-- 建筑面积 -->
        <template slot="area" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" class="tab-text-decoration" @click="nextDetailFn(record)">{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 可租面积 -->
        <template slot="useArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" class="tab-text-decoration" @click="nextDetailFn(record)">{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 可租面积 -->
        <template slot="rentArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" class="tab-text-decoration" @click="nextDetailFn(record)" :class="{'tab-red-color': record.managerArea !== record.pointer}" >{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 已租面积 -->
        <template slot="rentAlreadyArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" @click="nextDetailFn(record)">{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
        <!-- 未租面积 -->
        <template slot="rentNotArea" slot-scope="text, record">
          <span v-if="record.key !== 'sg-t'" class="tab-text-decoration" @click="nextDetailFn(record)">{{text}}</span>
          <span v-else >{{text}}</span>
        </template>
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
// import {handleTableScrollHeight} from "@/utils/share"
import { getFormat } from "@/utils/utils";
import {typeList,assetTypeList, queryCondition, columnsData, projectData, assetsColumns, totalKeyArr} from './common.js'
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
      scroll: {x: 3000, y: 'calc(100vh - 430px)'},
      loading: false,
      noPageTools: false,
      location: 'absolute',
      toggle: true,
      columns: columnsData,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {...queryCondition},
      count: '',
      assetClassifyData: [{name: '全部分类', value: ''}],
      modalObj: { title: '展示列表设置', status: false, okText: '应用', width: 600 },
      typeColumns: {
        '0': columnsData,
        '1': projectData,
        '2': assetsColumns
      }
    }
  },
  computed: {
  },
  methods: {
    typeChange () {
      this.columns = this.typeColumns[this.queryCondition.type]
      this.allQuery()
    },
    // 表头自定义设置
    handleModalOk () {},
    // 导出
    downloadFn () {
      let obj = {}
      if (this.queryCondition.type === '2') {
        obj = {...this.queryCondition}
      } else {
        // 机构维度和项目维度查询条件没有资产分类和资产名称
        obj = {
          ...this.queryCondition,
          objectType: '',
          assetNameOrCode: ''
        }
      }
      let typeUrl = this.queryCondition.type === '2' ? 'exportQueryYueXinReportByAsset' : 'exportQueryYueXinReport'
      this.$api.assetUsageList[typeUrl](obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产使用一览表.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
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
    nextPageFn (record) {
      // 房屋机构视图 是机构维度+资产类型是 房屋
      if (this.queryCondition.type === '0' && this.queryCondition.assetType === '1') {
        this.$router.push({path: '/assetUsageList/UsageListOrganViewDetail', query: { organId: record.organId }})
      } else if (this.queryCondition.type === '0' && this.queryCondition.assetType === '4') {
        // 土地机构视图 是机构维度+资产类型是 土地
        this.$router.push({path: '/assetUsageList/landViewUsageList', query: { organId: record.organId }})
      } else if (this.queryCondition.type === '1' && this.queryCondition.assetType === '1') {
        // 房屋项目视图 是项目维度+资产类型是 房屋
        this.$router.push({path: '/assetUsageList/projectViewDetail', query: { projectId: record.projectId }})
      } else if (this.queryCondition.type === '1' && this.queryCondition.assetType === '4') {
        // 土地项目视图 是项目维度+资产类型是 土地
        this.$router.push({path: '/assetUsageList/landProjectUsageList', query: { projectId: record.projectId }})
      } else if (this.queryCondition.type === '2' && this.queryCondition.assetType === '1') {
        // 房屋资产视图 是资产维度+资产类型是 房屋
        this.$router.push({path: '/assetUsageList/usageListAssetView', query: { houseId: record.assetHouseId, assetId: record.assetId}})
      } else if (this.queryCondition.type === '2' && this.queryCondition.assetType === '4') {
        // 土地资产视图 是资产维度+资产类型是 土地
        this.$router.push({path: '/assetUsageList/usageListViewDetail', query: { assetLandId: record.assetLandId, assetId: record.assetId, organId: record.organId, organName: record.organName}})
      }
    },
    // 明细表
    nextDetailFn (record) {
      this.$router.push({path: '/assetUsageList/scheduleOf', query: { type: record.type, assetType: this.queryCondition.assetType}})
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.objectType = ''
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
        assetType: this.queryCondition.assetType
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
    // 千分位展示
    handleNumber(dataSource){
      dataSource.forEach(ele=>{
        Object.keys(ele).forEach(keyStr=>{
          if (totalKeyArr.includes(keyStr)){
            if (!isNaN(Number(ele[keyStr]))){
              ele[keyStr] = getFormat(ele[keyStr]) || "0"
            }
          }
        })
      })
    },
    // 查询
    query () {
      this.tableData = []
      this.loading = true
      let typeUrl = this.queryCondition.type === '2' ? 'queryYueXinReportByAsset' : 'queryYueXinReport'
      let obj = {}
      if (this.queryCondition.type === '2') {
        obj = {...this.queryCondition}
      } else {
        // 机构维度和项目维度查询条件没有资产分类和资产名称
        obj = {
          ...this.queryCondition,
          objectType: '',
          assetNameOrCode: ''
        }
      }
      this.$api.assetUsageList[typeUrl](obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            let newArr = []
            let objNum = {}
            // 找到每行出现的次数 用于合并
            if (this.queryCondition.type === '2') {
              data.forEach((element) => {
                if (newArr.includes(element.projectId)) {
                  objNum[element.projectId] = objNum[element.projectId] + 1
                } else {
                  newArr.push(element.projectId)
                  objNum[element.projectId] = 1
                }
              })
            }
            data.forEach((item, index) => {
              item.key = index
              if (this.queryCondition.type === '2' && objNum[item.projectId] > 1) {
                item.count = objNum[item.projectId]
                delete objNum[item.projectId]
              }
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
          this.assetViewTotal(obj)
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 明细统计
    assetViewTotal (obj) {
      this.overviewNumSpinning = true
      // obj.pageNum = 1
      // obj.pageSize = 10
      let typeUrl = this.queryCondition.type === '2' ? 'queryYueXinReportByAssetTotal' : 'queryYueXinReportTotal'
      this.$api.assetUsageList[typeUrl](obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || []
          data.key = 'sg-t'
          if (this.queryCondition.type === '0' ) {
            data.organName = '合计'
          } else {
            data.projectName = '合计'
          }
          this.tableData.push(data)
          this.handleNumber(this.tableData)
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
/deep/.ant-table-tbody {
  tr:nth-last-child(1){
    position: sticky;
    bottom: 4px;
    background: #fff;
  }
  // tr:nth-last-child(2){
  //   position: sticky;
  //   bottom: 43px;
  //   background: #fff;
  // }
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
.tab-red-color {
  color: red;
  cursor: pointer
}
.tab-text-decoration {
  text-decoration: underline;
}
</style>
