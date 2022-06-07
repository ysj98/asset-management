<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerForm">
        <div style="width: 75%; float: right; margin-right: 8px; text-align: left">
          <a-row :gutter="8">
            <a-col :span="12">
              <organ-project-building v-model="organProjectBuildingValue" :isShowBuilding="false"/>
            </a-col>
            <a-col :span="6"><InsuranceCompany/></a-col>
            <a-col :span="6"><a-input placeholder="保险单号/投保人" v-model="insuranceCode"/></a-col>
          </a-row>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="12"></a-col>
          <a-col :span="5">
            <!-- <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择状态"
              v-model="status"
              @select="handleChange"
              :options="optionStatus"
            >
            </a-select> -->
          </a-col>
          <a-col :span="5">
            <InsuranceType/>
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
      <template slot="action" slot-scope="text, record">
        <a class="handle_sty" @click="handleClic(record)">
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
import OverviewNumber from 'src/views/common/OverviewNumber'
export default {
  components: {
    OrganProjectBuilding,
    SearchContainer,
    InsuranceType,
    InsuranceCompany,
    OverviewNumber
  },
  data () {
    return {
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
        {title: '全部', key: 'totalArea', value: 0, fontColor: '#324057'},
        {title: '待承保', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
        {title: '已生效', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'},
        {title: '已终止', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
      ],
      tableObj: {
        pagination: false,
        rowKey: 'assetHouseId',
        loading: false,
        dataSource: [
          {
            assetName: '测试',
            assetCode: '1231'
          }
        ],
        columns: [
          { title: '保险单号', dataIndex: 'assetName', fixed: 'left', width: 180 },
          { title: '所属机构', dataIndex: 'assetCode', width: 150 },
          { title: '资产项目', dataIndex: 'ownerOrganName', width: 150 },
          { title: '投保人', dataIndex: 'addressNo', width: 150 },
          { title: '保险类型', dataIndex: 'area', width: 150 },
          { title: '保险公司', dataIndex: 'projectName', width: 200 },
          { title: '保险有效期', dataIndex: 'uploadAttachment', width: 120 },
          { title: '保单金额（元）', dataIndex: 'address', width: 300 },
          { title: '资产数量', dataIndex: 'buildName', width: 150 },
          { title: '保单状态', dataIndex: 'unitName', width: 100 },
          { title: '提交时间', dataIndex: 'floor', width: 100 },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 100 }
        ]
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
    }
  },
  methods: {
    addPolicy () {
      let {organId, organName} = this.organProjectBuildingValue
      this.$router.push({path: '/insuranceManagement/addInsurancePolicy', query: {organId: organId, organName: organName}})
    },
    handleChange () {},
    queryTableData () {},
    handleClickOverview () {},
    pageChange () {},
    handleClic (record) {
      this.$router.push({path: '/insuranceManagement/insurancePolicyDetail'})
    }
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
</style>