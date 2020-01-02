<!--
 * @Date: 2020-01-02 09:46:38
 * @Description: 处置登记首页
 -->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <div class="box sg-datePicker" :style="dateWidth">
          <SG-DatePicker label="提交日期" style="width: 232px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <a-input-search v-model="queryCondition.assetName" placeholder="资产名称/编码" maxlength="30" style="width: 140px; margin-right: 10px;" @search="onSearch" />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
              <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部处置类型" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.disposeType">
              <a-select-option v-for="(item, index) in disposeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
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
            <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部处置方式" :tokenSeparators="[',']"  @select="disposeModeDataFn" v-model="queryCondition.disposeMode">
              <a-select-option v-for="(item, index) in disposeModeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <div class="box sg-datePicker" :style="dateWidth">
              <SG-DatePicker label="处置日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD"></SG-DatePicker>
            </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
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
  </div>
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import noDataTips from '@/components/noDataTips'
import {utils, debounce} from '@/utils/utils.js'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationData  = {
  detail: "/disposalRegister/detail",
  create: '/disposalRegister/create',
  edit: '/disposalRegister/edit',
  approval: '/disposalRegister/approval' // 待审核
};
const allWidth = {width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const dateWidth = {width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const columns = [
  {
    title: '处置编号',
    dataIndex: 'disposeRegisterDetailId'
  },
  {
    title: '资产编号',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类11',
    dataIndex: 'projectName11'
  },
  {
    title: '登记单号',
    dataIndex: 'disposeRegisterOrderId'
  },
  {
    title: '处置类型',
    dataIndex: 'disposeTypeName'
  },
  {
    title: '处置方式',
    dataIndex: 'disposeMode'
  },
  {
    title: '处置日期',
    dataIndex: 'disposeDate'
  },
  {
    title: '处置原因',
    dataIndex: 'disposeReason'
  },
  {
    title: '处置成本(元)',
    dataIndex: 'disposeCost'
  },
  {
    title: '处置收入(元)',
    dataIndex: 'disposeReceive'
  },
  {
    title: '接收方',
    dataIndex: 'assetReceiver'
  },
  {
    title: '提交人',
    dataIndex: 'createByName'
  },
  {
    title: '提交时间',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName'
  }
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
    organId: '',   // 组织机构id
    approvalStatus: '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
    projectId: '',   // 资产项目Id
    disposeType: '',   // 变动类型
    assetType: '',    // 资产类型Id
    assetClassify: '', // 资产分类
    disposeMode: '',    // 处置方式
    startDate: '',       // 创建日期开始日期
    endDate: '',    // 创建日期结束日期
    changStartDate: '',  // 变动日期开始
    changEndDate: '',   // 变动日期结束
    currentOrganId: '',   // 仅当前机构下资产清理单 0 否 1 是
    assetName: '',    // 资产名称/编码模糊查询
    pageNum: 1,     // 当前页
    pageSize: 10    // 每页显示记录数
  }
export default {
  components: {SearchContainer, TreeSelect, segiIcon, noDataTips},
  props: {},
  data () {
    return {}
  },
  methods: {
    query () {},
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.assetClassify = ''
      this.getObjectKeyValueByOrganIdFn()
      this.getListFn()
      this.query()
    },
  }
}
</script>
<style lang="less" scoped>
.scheduleChanges {
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
