<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <!-- <SG-Button
          type="primary"
          @click="addPolicy"
        >新建</SG-Button> -->
      </div>
      <div slot="headerForm">
        <div style="width: 75%; float: right; margin-right: 8px; text-align: left">
          <a-row :gutter="8">
            <a-col :span="12">
              <organ-project-building v-model="organProjectBuildingValue" :isShowBuilding="false"/>
            </a-col>
            <a-col :span="6"><InsuranceCompany @companyClick="companyClick" ref="companyRef"/></a-col>
            <a-col :span="6"><a-input placeholder="保险单号/投保人" v-model="insuranceCode"/></a-col>
          </a-row>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="12"></a-col>
          <a-col :span="5">
            <!-- <InsuranceStatus @statusClick="statusClick"  ref="statusRef"/> -->
          </a-col>
          <a-col :span="5">
            <InsuranceType @typeClick="typeClick" ref="typeRef"/>
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
      class="custom-table td-pd10">
      <template slot="policyAmount" slot-scope="text, record">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="assetNum" slot-scope="text, record">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="action" slot-scope="text, record">
        <a class="handle_sty" @click="handleClick(record)">
          详情
        </a>
      </template>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="pageChange"/>
  </div>
</template>

<script>
import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
import SearchContainer from 'src/views/common/SearchContainer'
import InsuranceType from '../components/InsuranceType.vue'
import InsuranceCompany from '../components/InsuranceCompany.vue'
import InsuranceStatus from '../components/InsuranceStatus.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import { getFormat } from "utils/utils";
export default {
  components: {
    OrganProjectBuilding,
    SearchContainer,
    InsuranceType,
    InsuranceCompany,
    OverviewNumber,
    InsuranceStatus
  },
  data () {
    return {
      companyList: [],
      typeList: [],
      getFormat,
      organProjectBuildingValue: {},
      insuranceCompanyIdList: [],
      insuranceStatusList: [],
      insuranceTypeList: [],
      fold: true,
      insuranceCode: '',
      status: ['0'],
      overviewNumSpinning: true,
      numList: [
        {title: '已到期', key: 'overdueAmount', value: 0, fontColor: '#324057', numkey: 'overdue',},
        {title: '1个月内到期', key: 'overdueInOneMonthAmount', value: 0, bgColor: '#4BD288', numkey: 'overdueInOneMonth'},
        {title: '3个月内到期', key: 'overdueInThirdMonthAmount', value: 0, bgColor: '#1890FF', numkey: 'overdueInThirdMonth'},
        {title: '6个月内到期', key: 'overdueInSixMonthAmount', value: 0, bgColor: '#DD81E6', numkey: 'overdueInSixMonth'},
      ],
      numarr: ['已到期', '1个月内到期', '3个月内到期', '6个月内到期'],
      tableObj: {
        pagination: false,
        rowKey: 'insuranceId',
        loading: false,
        dataSource: [],
        scroll:{x: '100%'},
        columns: [
          { title: '保险单号', dataIndex: 'insuranceCode', width: 180 },
          { title: '所属机构', dataIndex: 'organName', width: 150 },
          { title: '资产项目', dataIndex: 'projectName', width: 150 },
          { title: '投保人', dataIndex: 'policyHolder', width: 120 },
          { title: '保险类型', dataIndex: 'insuranceTypeName', width: 150 },
          { title: '保险公司', dataIndex: 'insuranceCompanyName', width: 120 },
          { title: '保险有效期', dataIndex: 'periodOfInsurance', width: 150 },
          { title: '保单金额（元）', dataIndex: 'policyAmount', width: 120, scopedSlots: { customRender: 'policyAmount' } },
          { title: '资产数量', dataIndex: 'assetNum', width: 120, scopedSlots: { customRender: 'assetNum' } },
          { title: '保单状态', dataIndex: 'insuranceStatusName', width: 100 },
          { title: '提交时间', dataIndex: 'createDate', width: 100 },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 100 }
        ]
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
    }
  },
  watch: {
    organProjectBuildingValue: {
      deep: true,
      handler(newval,oldval){
        this.init(newval.organId)
        // this.getDictData(newval.organId)
        this.$nextTick(() => {
          this.$refs.companyRef.getDictData(newval.organId)
          this.$refs.typeRef.getDictData(newval.organId)
        })
      }
    }
  },
  methods: {
    init (organId,load) {
      let {insuranceCode, insuranceCompanyIdList, insuranceStatusList, insuranceTypeList, organProjectBuildingValue: {projectId}} = this
      let data = {
        organId: organId,
        projectId: projectId,
        insuranceCompanyIdList: insuranceCompanyIdList,
        insuranceCodeAndPolicyHolder: insuranceCode,
        insuranceStatusList: insuranceStatusList,
        insuranceTypeList: insuranceTypeList,
        pageSize: this.paginationObj.pageLength,
        pageNum: this.paginationObj.pageNo,
        status: '1'
      }
      this.$api.assetInsurance.queryExpiringInsuranceList(data).then(res => {
        if(res.data.code === '0') {
          this.tableObj.dataSource = res.data.data.data
          this.paginationObj.totalCount = res.data.data.count
        }
        if(!load) {
          this.getCount(data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCount (data) {
      delete data.pageNum
      delete data.pageSize
      delete data.insuranceStatusList
      // data.insuranceStatusList = data.insuranceStatusList.length > 0 ? data.insuranceStatusList.join(','):''
      this.$api.assetInsurance.getExpiringInsuranceCount(data).then(res => {
        if(res.data.code === '0') {
          this.numList.map((item,index) => {
            this.numList[index].value = res.data.data[item.key]
            this.numList[index].title = `${this.numarr[index]}(${res.data.data[item.numkey]})`
          })
        }else{
          this.$message.error(res.data.message || '查询统计失败')
        }
        this.overviewNumSpinning = false
      }).catch(err => {
        this.overviewNumSpinning = false
        console.log(err)
      })
    },
    // addPolicy () {
    //   let {organId, organName} = this.organProjectBuildingValue
    //   this.$router.push({path: '/insuranceManagement/insurancePolicy/addInsurancePolicy', query: {organId: organId, organName: organName}})
    // },
    statusClick (val) { this.insuranceStatusList =  val.includes('-1') ? []:  val },
    typeClick (val) { this.insuranceTypeList =  val.includes('0') ? []:  val },
    companyClick (val) { this.insuranceCompanyIdList =  val.includes('0') ? []:  val },
    queryTableData () {
      let {organProjectBuildingValue: {organId}} = this
      this.init(organId)
    },
    handleClickOverview () {
      return
    },
    pageChange (val) {
      console.log(val, 'val')
      this.paginationObj.pageLength = val.pageLength
      this.paginationObj.pageNo = val.pageNo
      this.init(this.organId, true)
    },
    handleClick (record) {
      this.$router.push({path: '/insuranceManagement/insurancePolicy/insurancePolicyDetail', query: { insuranceId: record.insuranceId }})
    },
    getDictData (organId) {
      const list = [
          { code: 'ASSET_INSURANCE', tip: '保险公司', optionName: 'companyList', model: 'insuranceCompanyId', obj: { value: '', label: '全部保险公司' } },
          { code: 'INSURANCE_TYPE', tip: '保险类型', optionName: 'typeList', model: 'insuranceType', obj: { value: '', label: '全部保险类型' } }
        ]
        list.forEach(m => {
          const { code, tip, optionName, model } = m
          this.$api.basics.organDict({code, organId}).then(r => {
            let res = r.data
            if (res && String(res.code) === '0') {
              if(res.data.length > 0) {
                // this.form[model] = res.data[0].value // 默认选第一项
                return this[optionName] = res.data.map(item => (m.obj,{
                  label: item.name, value: item.value
                }))
              }else {
                this[optionName] = []
              }
            }
          }).catch(err => {
            console.log(err)
            this.$message.error(err || `查询${tip}失败`)
          })
        })
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