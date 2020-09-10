<!--
 * @Author: LW
 * @Date: 2020-07-24 09:59:14
 * @LastEditTime: 2020-08-25 17:15:40
 * @Description: 土地资产视图
-->
<template>
  <div class="landAssetsView">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <!-- <SG-Button type="primary" @click="downloadFn">导出</SG-Button> -->
        <SG-Button type="primary" @click="listSet">列表设置</SG-Button>
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <a-input-search v-model="queryCondition.landName" placeholder="资产名称/编码" maxlength="40" style="width: 140px; margin-right: 10px;" @search="allQuery" />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.statuss">
              <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :style="allStyle" :showSearch="true" mode="multiple" :filterOption="filterOption" @select="projectIdFn" :tokenSeparators="[',']" placeholder="全部资产项目" v-model="queryCondition.projectId">
              <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部分类" :tokenSeparators="[',']"  @select="assetClassifyDataFn" v-model="queryCondition.objectTypes">
              <a-select-option v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <ProvinceCityDistrict class="city" ref="ProvinceCityDistrict" v-model="provinces"></ProvinceCityDistrict>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
        <!--数据总览-->
    <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
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
          <span style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">详情</span>
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
    <SG-Modal
      width="500px"
      v-model="modalShow"
      okText="确定"
      title="列表设置"
      @ok="commonFn"
    >
      <div>
        <a-checkbox-group v-model="listValue">
          <a-row>
            <a-col class="p10" :span="8" v-for="(item, index) in columnsData" :key="index">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled ? item.disabled : false">{{item.title}}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'
import ProvinceCityDistrict from '../../common/ProvinceCityDistrict'
const allWidth = {width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const columnsData = [
  { title: '资产名称', dataIndex: 'assetName', width: 150, disabled: true },
  { title: '资产编码', dataIndex: 'assetCode', width: 150, disabled: true },
  { title: '管理机构', dataIndex: 'organName', width: 150, disabled: true },
  { title: '宗地号', dataIndex: 'theNo', width: 150 },
  { title: '宗地位置', dataIndex: 'location', width: 150 },
  { title: '土地面积(㎡)', dataIndex: 'landArea', width: 150 },
  { title: '资产项目名称', dataIndex: 'projectName', width: 150 },
  { title: '土地类型', dataIndex: 'landType', width: 150 },
  { title: '土地用途', dataIndex: 'landuse', width: 150 },
  { title: '计容面积(㎡)', dataIndex: 'acreage', width: 150 },
  { title: '容积率', dataIndex: 'landRate', width: 150 },
  { title: '权属情况', dataIndex: 'ownershipStatusName', width: 150 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 150 },
  { title: '使用期限', dataIndex: 'validPeriod', width: 150 },
  { title: '接管日期', dataIndex: 'takeOverDate', width: 150 },
  { title: '运营(㎡)', dataIndex: 'transferOperationArea', width: 150 },
  { title: '自用(㎡)', dataIndex: 'selfUserArea', width: 150 },
  { title: '闲置(㎡)', dataIndex: 'idleArea', width: 150 },
  { title: '其他(㎡)', dataIndex: 'otherArea', width: 150 },
  { title: '财务卡片编码', dataIndex: 'cardCode', width: 150 },
  { title: '资产原值(元)', dataIndex: 'originalValue', width: 150 },
  { title: '最新估值(元)', dataIndex: 'marketValue', width: 150 },
  { title: ' 批准日期', dataIndex: 'approvalDate', width: 150 },
  { title: '资产状态', dataIndex: 'statusName', width: 150 },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 70}
]
const approvalStatusData = [
  { name: '全部状态', value: ''},
  { name: '待入库', value: '0'},
  { name: '正常', value: '1'},
  { name: '报废', value: '2'},
  { name: '转让', value: '3'},
  { name: '报损', value: '4'},
  { name: '已出库', value: '5'},
  { name: '已取消', value: '6' },
  { name: '入库中', value: '7' }
]
const queryCondition =  {
  city: '',           // 市
  province: '',       // 省
  region: '',         // 区
  flag: '',           // 类型：0运营；1闲置；2自用；3占用；4其他
  landName: '',       // 资产名称/编码模糊查询
  objectTypes: '',    // 资产分类(多选)
  organId: '',        // 组织机构id
  projectId: '',      //类型：String  必有字段  备注：项目id
  statuss: '',        // 资产状态(多选)
  pageNum: 1,         // 当前页
  pageSize: 10        // 每页显示记录数
}
export default {
  components: {SearchContainer, TreeSelect, noDataTips, OverviewNumber, ProvinceCityDistrict},
  props: {},
  data () {
    return {
      modalShow: false,
      current: '',
      listValue: ['changeOrderDetailId', 'assetCode', 'assetName'],
      columnsData,
      scroll: {x: columnsData.length * 150},
      numList: [
        {title: '资产数量', key: 'assetCount', value: 0, fontColor: '#324057'},
        {title: '土地面积(㎡)', key: 'area', value: 0, bgColor: '#4BD288'},
        {title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#1890FF'},
        {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#DD81E6'},
        {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#FD7474'},
        {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      provinces: {
        province: undefined,
        city: undefined,
        district: undefined
      },
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns: columnsData,
      organName: '',
      organId: '',
      tableData: [],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {...queryCondition},
      count: '',
      ownershipStatusObj: {
        '0': '无证',
        '1': '有证',
        '2': '待办',
      },
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ],
      // assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: ''
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    // 导出（暂无）
    // downloadFn () {
    //   let obj = {}
    //   this.$api.assets.exportChangeScheduleList(obj).then(res => {
    //     console.log(res)
    //     let blob = new Blob([res.data])
    //     let a = document.createElement('a')
    //     a.href = URL.createObjectURL(blob)
    //     a.download = '资产视图.xls'
    //     a.style.display = 'none'
    //     document.body.appendChild(a)
    //     a.click()
    //     a.remove()
    //   })
    // },
    // 查看土地资产视图详情
    handleViewDetail ({assetLandId, assetId}) {
      this.$router.push({ path: 'landAssetsView/detail', query: { assetLandId, assetId }})
    },
    // 点击总览数据块
    // 0运营；1闲置；2自用；3占用；4其他
    handleClickOverview({i}) {
      console.log(i)
      switch (i) {
        case 0:    // 资产数量
          this.current = ''
        break;
        case 1:    // 土地面积
          this.current = 4
        break;
        case 2:    // 运营
          this.current = 0
        break;
        case 3:    // 闲置
          this.current = 1
        break;
        case 4:    // 自用
          this.current = 2
        break;
        case 5:    // 其他
          this.current = 3
        break;
        case null:
          this.current = ''
        break;
      }
      this.allQuery()
    },
    // 列表设置
    listSet () {
      this.listValue = this.columns.map(item => {
        return item.dataIndex
      })
      this.modalShow = true
    },
    commonFn () {
      let arr = []
      columnsData.forEach(item => {
        if (this.listValue.includes(item.dataIndex)) {
          arr.push(item)
        }
      })
      this.columns = arr
      this.scroll = {x: this.columns.length * 150}
      this.modalShow = false
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.objectTypes = ''
      this.getObjectKeyValueByOrganIdFn()
      this.getListFn()
      this.allQuery()
    },
    // 搜索
    allQuery () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectData = [{name: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: '4'
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
    // 项目
    projectIdFn (value) {
      this.$nextTick(function () {
        this.queryCondition.projectId = this.handleMultipleSelectValue(value, this.queryCondition.projectId, this.projectData)
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.$refs.ProvinceCityDistrict.allClearFn()
      this.query()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    alljudge (val) {
      let str = ''
      if (val.length !== 0) {
        if (val[0] === '') {
          return ''
        } else {
          str = val.join(',')
          return str
        }
      } else {
        return ''
      }
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        city: this.provinces.city ? this.provinces.city : '',               // 市
        province: this.provinces.province ? this.provinces.province : '',   // 省
        region: this.provinces.district ? this.provinces.district : '',         // 区
        flag: this.current,                                                           // 类型：0运营；1闲置；2自用；3占用；4其他
        landName: this.queryCondition.landName,                             // 资产名称/编码模糊查询
        objectTypes: this.alljudge(this.queryCondition.objectTypes),    // 资产分类(多选)
        organId: this.queryCondition.organId,          // 组织机构id
        projectId: this.alljudge(this.queryCondition.projectId),      //类型：String  必有字段  备注：项目id
        statuss: this.alljudge(this.queryCondition.statuss),                 // 资产状态(多选)
        pageNum: this.queryCondition.pageNum,          // 当前页
        pageSize: this.queryCondition.pageSize         // 每页显示记录数
      }
      this.$api.land.assetView(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.ownershipStatusName = String(item.ownershipStatus) ? this.ownershipStatusObj[String(item.ownershipStatus)] : ''
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
    // 资产登记-详情明细统计
    assetViewTotal (obj) {
      obj.pageNum = 1
      obj.pageSize = 1
      this.$api.land.assetViewTotal(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          return this.numList = this.numList.map(m => {
            return { ...m, value: data[m.key] || 0 }
          })
        } else {
          this.$message.error(res.data.message)
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
