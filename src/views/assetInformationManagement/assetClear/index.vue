<!--
  资产清理
-->
<template>
  <div class="assets-clear">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="plus" type="primary" @click="newClearForm">新建清理单</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" style="margin-right: 10px">查询</SG-Button>
        <SG-Button>清空</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="queryCondition.assetProject"
          :options="assetProjectOptions"
          :filterOption="filterOption"
        ></a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部状态"
          :defaultValue="queryCondition.approvalStatus"
        >
          <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产类型"
          :defaultValue="queryCondition.assetType"
          style="width: 190px; margin-right: 10px;"
        >
          <a-select-option v-for="(item, index) in assetTypeOptions" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <segi-range-picker label="录入时间" style="margin-right: 10px;" :defaultValue="[moment(queryCondition.beginDate, 'YYYY-MM-DD'), moment(queryCondition.endDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>
        <a-checkbox style="line-height: 32px" :checked="queryCondition.onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">仅当前机构下资产清理单</a-checkbox>
      </div>
    </SG-SearchContainer>
    <div>
      <!--<SearchContainer v-model="toggle" @input="searchContainerFn">-->
      <!--<div slot="headerBtns">-->
      <!--<a-button type="primary" icon="plus">新建变动单</a-button>-->
      <!--</div>-->
      <!--<div slot="headerForm">-->
      <!--<treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>-->
      <!--</div>-->
      <!--<div slot="contentForm">-->
      <!--<div>-->
      <!--<a-select-->
      <!--showSearch-->
      <!--placeholder="请选择资产项目"-->
      <!--optionFilterProp="children"-->
      <!--style="width: 170px; margin-right: 10px;"-->
      <!--v-model="queryCondition.assetProject"-->
      <!--:options="assetProjectOptions"-->
      <!--:filterOption="filterOption"-->
      <!--&gt;</a-select>-->
      <!--<a-select-->
      <!--:maxTagCount="1"-->
      <!--:style="allStyle"-->
      <!--mode="multiple"-->
      <!--:tokenSeparators="[',']"-->
      <!--placeholder="全部状态"-->
      <!--:defaultValue="queryCondition.approvalStatus"-->
      <!--style="width: 170px; margin-right: 10px;"-->
      <!--&gt;-->
      <!--<a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>-->
      <!--</a-select>-->
      <!--<a-select-->
      <!--:maxTagCount="1"-->
      <!--:style="allStyle"-->
      <!--mode="multiple"-->
      <!--:tokenSeparators="[',']"-->
      <!--placeholder="全部资产类型"-->
      <!--:defaultValue="queryCondition.assetType"-->
      <!--style="width: 190px; margin-right: 10px;"-->
      <!--&gt;-->
      <!--<a-select-option v-for="(item, index) in assetTypeOptions" :key="index" :value="item.value">{{item.name}}</a-select-option>-->
      <!--</a-select>-->
      <!--<SG-Button type="primary" style="margin-right: 10px">查询</SG-Button>-->
      <!--<SG-Button>清空</SG-Button>-->
      <!--</div>-->
      <!--<div>-->
      <!--<SG-DatePicker label="范围选择"  pickerType="RangePicker"></SG-DatePicker>-->
      <!--<div class="check-box-item" :class="{'active-item': queryCondition.onlyCurrentOrgan}">-->
      <!--<a-checkbox :checked="queryCondition.onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">只显示结果数据</a-checkbox>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</SearchContainer>-->
    </div>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn">审核</a>
          <a class="operation-btn">编辑</a>
          <a class="operation-btn">删除</a>
          <a class="operation-btn">详情</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import OperationPopover from '@/components/OperationPopover'
import SegiRangePicker from '@/components/SegiRangePicker'
import {getCurrentDate, getThreeMonthsAgoDate} from 'utils/formatTime'
import moment from 'moment'

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%'
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%'
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
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

export default {
  components: {
    SearchContainer, TreeSelect, OperationPopover, SegiRangePicker
  },
  data () {
    return {
      allStyle: 'width: 170px; margin-right: 10px;',
      toggle: false,
      columns,
      organName: '',
      organId: '',
      dataSource: [
        {
          key: '1',
          name: 'name',
          age: 'age',
          address: 'address'
        }
      ],
      operationData: [...operationData],
      approvalStatusData: [...approvalStatusData],
      assetProjectOptions: [
        {label: '全部资产项目', value: ''},
        {label: '公建2019', value: '1'},
        {label: '廉租房2018', value: '2'}
      ],
      assetTypeOptions: [
        {name: '全部资产类型', value: ''},
        {name: '房屋', value: '1'},
        {name: '构筑物', value: '2'},
        {name: '设备', value: '3'},
      ],
      queryCondition: {
        approvalStatus: [''],
        assetProject: '',
        assetType: [''],
        beginDate: getThreeMonthsAgoDate(),
        endDate: getCurrentDate(),
        onlyCurrentOrgan: false
      }
    }
  },
  methods: {
    moment,
    changeTree (value, label) {
      this.organName = label
      this.organId = value
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 起止日期发生变化
    onDateChange (val) {
      this.queryCondition.beginDate = val[0]
      this.queryCondition.endDate = val[1]
    },
    onOnlyCurrentOrganChange (event) {
      this.queryCondition.onlyCurrentOrgan = event.target.checked
    },
    // 新增清理单
    newClearForm () {
      this.$router.push({path: '/assetClear/newClearForm', query: {pageType: 'new'}})
    },
    // 详情
    operationFun () {},
    // 搜索
    onSearch () {},
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .formCon {
    display: flex;
    width: 100%;
    justify-content:flex-end;
    flex-wrap: wrap;
    > * {
      margin-right:10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
</style>