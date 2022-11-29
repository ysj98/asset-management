<template>
  <div>
    <!--资产保险一览表 -- 搜索条件-->
    <search-container size="fold" v-model="fold">
       <div slot="headerBtns">
        <SG-Button
          v-power="ASSET_MANAGEMENT.INSURANCE_INSURANCE_POLICY_EXPORT"
          type="primary"
          @click="handleExport"
        >导出</SG-Button>
      </div>
      <div slot="headerForm">
        <div style="width: 75%; float: right; margin-right: 8px; text-align: left">
          <a-row :gutter="8">
            <a-col :span="6">
            </a-col>
            <a-col :span="12">
              <organ-project-building v-model="organProjectBuildingValue" :isShowBuilding="false"/>
            </a-col>
            <a-col :span="6"><a-input placeholder="资产名称/资产编码" v-model="assetName"/></a-col>
          </a-row>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="12"></a-col>
          <a-col :span="10">
            <province-city-district v-model="provinceCityDistrictValue"/>
          </a-col>
         
          <a-col :span="2">
            <SG-Button type="primary" @click="queryTableData()">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
    </a-spin>
    <a-table
      v-bind="tableObj"
      class="custom-table td-pd70">
      <template slot="action" slot-scope="text, record">
        <a class="handle_sty" @click="handleClick(record)">
          详情
        </a>
      </template>
      <template slot="insuranceStatus" slot-scope="text">
        <span>{{ text ? '有' : '无' }}</span>
      </template>
      <template slot="area" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="type" slot-scope="text">
        <span>{{ types[text] }}</span>
      </template>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="pageChange"/>
  </div>
</template>

<script>
import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
import SearchContainer from 'src/views/common/SearchContainer'
import InsuranceType from '../components/InsuranceType.vue'
import InsuranceCompany from '../components/InsuranceCompany.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
import { getFormat } from "utils/utils";
import {ASSET_MANAGEMENT} from '@/config/config.power'
export default {
  components: {
    OrganProjectBuilding,
    SearchContainer,
    InsuranceType,
    InsuranceCompany,
    OverviewNumber,
    ProvinceCityDistrict
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      getFormat,
      allStyle: 'width: 100%; margin-right: 10px;',
      assetName: '',
      assetType: [],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      provinceCityDistrictValue: {}, // 查询条件-省-市-区值对象
      organProjectBuildingValue: {},
      fold: true,
      insuranceCode: '',
      status: ['0'],
      optionStatus: [
        {
          value: '0',
          label: '全部状态'
        },
        {
          value: '1',
          label: '待承保'
        },
        {
          value: '2',
          label: '有效'
        },
        {
          value: '3',
          label: '终止'
        },
      ],
      overviewNumSpinning: true,
      numList: [
        {title: '全部', key: 'allTotalArea', value: 0, fontColor: '#324057', numkey: 'allTotalCount'},
        {title: '已投保资产', key: 'effectiveArea', value: 0, bgColor: '#4BD288', numkey: 'effectiveCount'},
        {title: '未投保资产(', key: 'terminatedArea', value: 0, bgColor: '#1890FF', numkey: 'terminatedCount'},
      ],
      numarr: ['全部', '已投保资产', '未投保资产'],
      tableObj: {
        pagination: false,
        rowKey: 'assetHouseId',
        loading: false,
        scroll: {x: '100%'},
        dataSource: [
        ],
        columns: [
          { title: '管理机构', dataIndex: 'organName', width: 280, fixed: 'left' },
          { title: '资产项目', dataIndex: 'projectName', width: 150 },
          { title: '资产编码', dataIndex: 'assetCode', width: 150 },
          { title: '资产名称', dataIndex: 'assetName', width: 150 },
          { title: '资产类型', dataIndex: 'type', width: 150, scopedSlots: { customRender: 'type' } },
          { title: '资产分类', dataIndex: 'objectTypeName', width: 120 },
          { title: '资产面积(㎡)', dataIndex: 'area', width: 150, scopedSlots: { customRender: 'area' } },
          { title: '地理位置', dataIndex: 'pasitionString', width: 200,}, //  ellipsis: true
          { title: '有无投保', dataIndex: 'insuranceStatus', width: 100 ,scopedSlots: { customRender: 'insuranceStatus' }},
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 100 }
        ]
      },
      types: ['','楼栋','房屋'],
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
    }
  },
  watch: {
    organProjectBuildingValue: {
      deep: true,
      handler(newval,oldval){
        this.init(newval.organId)
        
      }
    }
  },
  created () {
    this.platformDictFn()
  },
  methods: {
    init (organId, load) {
      let {organProjectBuildingValue: {projectId}, assetName, provinceCityDistrictValue: { city, district, province }, paginationObj: {pageNo,pageLength}} = this
      let data = {
        organId,
        projectId:projectId,
        province,
        city,
        region: district,
        pageSize: pageLength,
        pageNum: pageNo,
        assetNameCode: assetName,
      }
      this.$api.assetInsurance.findAssetRegInsuranceList(data)
      .then(res => {
        if(res.data.code === '0') {
          this.tableObj.dataSource = res.data.data.data
          this.paginationObj.totalCount = res.data.data.count
        }
        if(!load){
          this.getCount(data)
        }
      }).catch(err => {
        this.$message.error('查询列表失败' || err)
      })

    },
    // 导出
       handleExport () {
        let {organProjectBuildingValue: {projectId}, assetName, provinceCityDistrictValue: { city, district, province }, paginationObj: {pageNo,pageLength}} = this
      let data = {
        organId:this.organProjectBuildingValue.organId,
        projectId:projectId,
        province,
        city,
        region: district,
        pageSize: 5000,
        pageNum: 1,
        assetNameCode: assetName,
      }
        exportDataAsExcel(data, this.$api.assetInsurance.exportValueExcel, '资产保险一览表.xls', this)
      },
    getCount (data) {
      this.$api.assetInsurance.getAssetRegInsuranceTotal(data)
      .then(res => {
        if(res.data.code === '0') {
          this.numList.map((item,index) => {
            this.numList[index].value = getFormat(res.data.data[item.key])+'㎡'
            this.numList[index].title = `${this.numarr[index]}(${res.data.data[item.numkey]})`
          })
        }
        this.overviewNumSpinning = false
      }).catch(err => {
        this.overviewNumSpinning = false
        this.$message.error('查询统计失败' || err)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.assetType = this.handleMultipleSelectValue(value, this.assetType, this.assetTypeData)
      })
    },
    platformDictFn () {
      let obj = {
        code: 'asset_type'
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleChange () {},
    queryTableData () {
      let {organId} = this.organProjectBuildingValue
      this.init(organId)
    },
    handleClickOverview () {return},
    pageChange (pageInfo) {
      let {organId} = this.organProjectBuildingValue
      this.paginationObj.pageNo = pageInfo.pageNo
      this.paginationObj.pageLength = pageInfo.pageLength
      this.init(organId, true)
    },
    handleClick (record) {
      this.$router.push({path: '/insuranceManagement/insuranceSchedule/detail', query: { detail: JSON.stringify(record)}})
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
  }
}
</script>

<style lang="less" scoped>
  .handle_sty {
    padding: 0 5px 0 3px;
    // border-bottom: 1px solid #ccc;
    font-size: 14px;
    line-height: 38px;
    margin-bottom: 0;
    cursor: pointer;
    span{
      padding-left: 8px;
    }
  }
  .custom-table {
    padding-bottom: 70px;
  }
  /deep/.overview_num .current_selected:before {
    border: 0 !important;
  }
</style>