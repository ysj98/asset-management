<!--
 * @Author: LW
 * @Date: 2020-07-24 09:59:14
 * @LastEditTime: 2020-07-24 15:01:07
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
        <a-input-search v-model="queryCondition.assetName" placeholder="资产名称/编码" maxlength="40" style="width: 140px; margin-right: 10px;" @search="onSearch" />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
              <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :style="allStyle" :showSearch="true" :filterOption="filterOption" placeholder="全部资产项目" v-model="queryCondition.projectId">
              <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType" @change="assetTypeFn">
              <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部分类" :tokenSeparators="[',']"  @select="assetClassifyDataFn" v-model="queryCondition.assetClassify">
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
    <overview-number :numList="numList"/>
    <div class="table-layout-fixed" :class="{'overflowX': tableData.length === 0}">
      <a-table
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table table-boxs"
        :pagination="false"
        >
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
  { title: '资产名称', dataIndex: 'changeOrderDetailId', width: 150, disabled: true },
  { title: '资产编码', dataIndex: 'assetCode', width: 150, disabled: true },
  { title: '管理机构', dataIndex: 'assetName', width: 150, disabled: true },
  { title: '宗地号', dataIndex: 'assetTypeName', width: 150 },
  { title: '宗地位置', dataIndex: 'organName', width: 150 },
  { title: '土地面积(㎡)', dataIndex: 'projectName', width: 150 },
  { title: '资产项目名称', dataIndex: 'changeOrderId', width: 150 },
  { title: '土地类型', dataIndex: 'changeTypeName', width: 150 },
  { title: '土地用途', dataIndex: 'oldChangeInfo', width: 150 },
  { title: '土地性质', dataIndex: 'changeInfo', width: 150 },
  { title: '计容面积(㎡)', dataIndex: 'changeDate', width: 150 },
  { title: '容积率', dataIndex: 'createByName', width: 150 },
  { title: '权属情况', dataIndex: 'createTime', width: 150 },
  { title: '权证号', dataIndex: 'approvalStatusName', width: 150 },
  { title: '使用期限', dataIndex: 'oldChangeInfo1', width: 150 },
  { title: '接管日期', dataIndex: 'changeInfo1', width: 150 },
  { title: '运营(㎡)', dataIndex: 'changeDate1', width: 150 },
  { title: '自用(㎡)', dataIndex: 'createByName1', width: 150 },
  { title: '闲置(㎡)', dataIndex: 'createTime1', width: 150 },
  { title: '其他(㎡)', dataIndex: 'approvalStatusName1', width: 150 },
  { title: '财务卡片编码', dataIndex: 'changeInfo2', width: 150 },
  { title: '资产原值(元)', dataIndex: 'changeDate2', width: 150 },
  { title: '最新估值(元)', dataIndex: 'createByName2', width: 150 },
  { title: '批准日期', dataIndex: 'createTime2', width: 150 },
  { title: '资产状态', dataIndex: 'approvalStatusName2', width: 150 }
]
const operationData = [
  {iconType: 'form', text: '修改', editType: 'edit'},
  {iconType: 'delete', text: '删除', editType: 'delete'}
]
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '草稿',
    value: '0'
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已驳回',
    value: '3'
  },
  {
    name: '已审批',
    value: '1'
  },
  {
    name: '已取消',
    value: '4'
  }
]
const queryCondition =  {
    organId: '',         // 组织机构id
    approvalStatus: '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
    projectId: '',       // 资产项目Id
    assetType: '',       // 资产类型Id
    assetClassify: '',   // 资产分类
    startDate: '',       // 创建日期开始日期
    endDate: '',         // 创建日期结束日期
    changStartDate: '',  // 变动日期开始
    changEndDate: '',    // 变动日期结束
    currentOrganId: '',  // 仅当前机构下资产清理单 0 否 1 是
    assetName: '',       // 资产名称/编码模糊查询
    pageNum: 1,          // 当前页
    pageSize: 10         // 每页显示记录数
  }
export default {
  components: {SearchContainer, TreeSelect, noDataTips, OverviewNumber, ProvinceCityDistrict},
  props: {},
  data () {
    return {
      modalShow: false,
      listValue: ['changeOrderDetailId', 'assetCode', 'assetName'],
      columnsData,
      scroll: {x: columnsData.length * 150},
      numList: [
        {title: '资产数量', key: 'whole', value: 0, fontColor: '#324057'},
        {title: '土地面积(㎡)', key: 'notVerified', value: 0, bgColor: '#5b8ff9'},
        {title: '运营(㎡)', key: 'waitStorage', value: 0, bgColor: '#1890FF'},
        {title: '闲置(㎡)', key: 'alreadyStorage', value: 0, bgColor: '#DD81E6'},
        {title: '自用(㎡)', key: 'waitStorage1', value: 0, bgColor: '#FD7474'},
        {title: '其他(㎡)', key: 'alreadyStorage1', value: 0, bgColor: '#BBC8D6'}
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
      operationData: [...operationData],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {...queryCondition},
      count: '',
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ],
      assetTypeData: [],
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
      this.queryCondition.assetClassify = ''
      // this.getObjectKeyValueByOrganIdFn()
      // this.getListFn()
      // this.query()
    },
    // 搜索
    onSearch () {
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
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
            this.getListFn()
          }
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
        assetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : ''
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
    // 资产类别
    assetTypeFn () {
      this.queryCondition.assetClassify = ''
      this.getListFn()
    },
    // 资产分类
    assetClassifyDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, this.assetClassifyData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
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
    // 查询
    query () {
      this.loading = false
      let obj = {
        projectId: this.queryCondition.projectId,       // 资产项目Id
        organId: Number(this.queryCondition.organId),         // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',       // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        currentOrganId: this.queryCondition.currentOrganId,   // 仅当前机构下资产清理单 0 否 1 是
        pageNum: this.queryCondition.pageNum,     // 当前页
        pageSize: this.queryCondition.pageSize,    // 每页显示记录数
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetCodeName: this.queryCondition.assetName,    // 资产名称/编码模糊查询
      }
      this.$api.assets.getChangeSchedulePage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
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
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    }
  },
  created () {
  },
  mounted () {
    // 资产类型
    // this.platformDictFn('asset_type')
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
    text-align: left;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
