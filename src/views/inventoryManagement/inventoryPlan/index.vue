<!--
 * @Date: 2019-12-23 10:14:17
 * @Description: 盘点计划
 -->
<template>
  <div class="plan-page pb70">
    <!-- 搜索框start -->
    <div class="search-box">
      <div class="search-left">
        <SG-Button icon="plus" @click="goPage('create')" type="primary"
          >新增盘点计划</SG-Button
        >
      </div>
      <div class="search-right">
        <treeSelect
          @changeTree="changeTree"
          placeholder="请选择组织机构"
          :allowClear="false"
          :style="allStyle"
        ></treeSelect>
        <!-- 全部状态 -->
        <a-select
          showSearch
          placeholder="请选择状态"
          v-model="queryCondition.approvalStatus"
          optionFilterProp="children"
          @change="approvalStatusSelect"
          mode="multiple"
          :maxTagCount="1"
          :style="allStyle"
          :options="approvalStatusOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
        />
        <div style="margin-top: 20px;">
          <SG-DatePicker
            v-model="queryCondition.beginDate"
            :style="allWidth"
            @change="onSearch()"
            label="生效日期"
          ></SG-DatePicker>
        </div>
        <div style="margin-top: 20px;">
          <SG-DatePicker
            v-model="queryCondition.endDate"
            :style="allWidth"
            @change="onSearch()"
            label="失效日期"
          ></SG-DatePicker>
        </div>
        <!-- 输入框 -->
        <a-input-search
          :style="allStyle"
          v-model="queryCondition.ccccccccname"
          placeholder="盘点单名称/编号"
          maxlength="30"
          @search="onSearch"
        />
      </div>
    </div>
    <!-- 搜索框end -->
    <div>
        <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
           <template slot="operation" slot-scope="text, record">
            <OperationPopover :operationData="record.operationDataBtn"  @operationFun="operationFun($event, record)"></OperationPopover>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="absolute"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips"
import TreeSelect from "@/views/common/treeSelect"
import moment from "moment"
import {utils} from '@/utils/utils'
import OperationPopover from '@/components/OperationPopover'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes = {
  detail: "/inventoryPlan/detail",
  create: '/inventoryPlan/create',
  edit: '/inventoryPlan/edit',
  approval: '/inventoryPlan/detail' // 待审核
};
const queryCondition = {
  approvalStatus: [''], // 状态
  organId: "",
  ccccccccname: "",
  beginDate: null,
  endDate: null,
  pageNum: 1, // 当前页
  pageSize: 10 // 每页显示记录数
}
const allStyle = {
  width: "150px",
  marginRight: "10px",
  "margin-top": "20px",
  height: "32px",
  overflow: "hidden"
}
const allWidth = { width: "150px", marginRight: "10px" }
// 审批状态  0草稿   2待审批、已驳回3、已审批1  已取消4   
let approvalStatusOpt = [
  { label: "全部状态", key: "" },
  { label: "草稿", key: "0" },
  { label: "已审批", key: "1" },
  { label: "待审批", key: "2" },
  { label: "已驳回", key: "3" },
  { label: "已取消", key: "4" },
]
let columns = [
  {
    title: "计划编号",
    dataIndex: "planId",
    width: 150
  },
  {
    title: "所属机构",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "计划名称",
    dataIndex: "planName",
    width: 120
  },
  {
    title: "生效时间",
    dataIndex: "effDate",
    width: 120
  },
  {
    title: "失效时间",
    dataIndex: "expDate",
    width: 120
  },
  {
    title: "实施频次",
    dataIndex: "exePreName",
    width: 200
  },
  {
    title: "创建人",
    dataIndex: "createByName",
    width: 100
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 100
  },
  {
    title: "状态",
    dataIndex: "approvalStatusName",
    width: 120
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  }
];
export default {
  components: {
    noDataTips,
    TreeSelect,
    OperationPopover
  },
  data() {
    return {
      queryCondition: utils.deepClone(queryCondition),
      approvalStatusOpt,
      organName: "",
      allStyle,
      allWidth,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    }
  },
  created () {
  },
  methods: {
    query() {
      if (!this.queryCondition.organId) {
        return this.$message.error('请选择组织机构!')
      }
      let data = {
        ...this.queryCondition
      }
      console.log('data', data)
      data.approvalStatus = data.approvalStatus.join(',')
      data.beginDate = data.beginDate ? data.beginDate.format('YYYY-MM-DD hh:mm:ss') : ''
      data.endDate = data.endDate ? data.endDate.format('YYYY-MM-DD hh:mm:ss') : ''
      console.log(data)
      this.table.loading = true
      this.$api.building.getPlanList(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.data || []
          this.table.dataSource = result.map(item => {
            item.approvalStatusName = approvalStatusOpt.filter((o)=>o.key===String(item.approvalStatus)).pop().label
            return {key: getUuid(), ...item, operationDataBtn: this.createOperationBtn(item.approvalStatus)}
          })
          this.table.totalCount = res.data.data.count || ''
        } else {
          this.$message.error(res.data.message)
        }
      }).finally(() => {
        this.table.loading = false
      })
    },
    // 生成操作按钮
    createOperationBtn (type) {
      // 审批状态  0草稿   2待审批、已驳回3、已审批1  已取消4  
      console.log('生成按钮', type)
      let arr = []
      // 草稿 已驳回
      if (['0', '3'].includes(String(type))) {
        arr.push({iconType: 'edit', text: '编辑', editType: 'edit'})
        arr.push({iconType: 'delete', text: '删除', editType: 'delete'})
      }
      // 待审批
      if (['2'].includes(type)) {
        arr.push({iconType: 'edit', text: '审批', editType: 'approval'})
      }
      // 已审批
      if (['1'].includes(type)) {
        arr.push({iconType: 'edit', text: '反审核', editType: 'readApproval'})
      }
      arr.push({iconType: 'file-text', text: '详情', editType: 'detail'})
      return arr
    },
    // 操作事件函数
    operationFun (type, record) {
      console.log('操作事件', type, record)
      if (['edit', 'detail', 'approval', 'readApproval'].includes(type)) {
        this.goPage(type, record)
      }
      if (['delete'].includes(type)) {
        this.$SG_Modal.confirm({
          title: `确定删除该计划吗?`,
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
          }
        })
      }
      if (['readApproval'].includes(type)) {
        this.$SG_Modal.confirm({
          title: `确定反审核该计划吗?`,
          okText: '确定',
          cancelText: '再想想',
          onOk: () => {
          }
        })
      }
    },
    changeTree(value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.query()
    },
    goPage(type, record) {
      let query = {
        type,
        organId: this.queryCondition.organId,
        organName: this.organName
      };
      type !== 'create' && (query.planId = record.planId) 
      this.$router.push({ path: operationTypes[type], query });
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    approvalStatusSelect(value) {
      this.$nextTick(function() {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatus,
          this.approvalStatusOpt
        )
        this.onSearch()
      })
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf("") !== -1
      let len = data.length
      // 如果点击全选或者取消全选
      if (data[len - 1] === "" || len === 0) {
        return (data = [""])
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === dataOptions.length - 1) {
        return (data = [""])
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(""), 1)
      }
      return data
    }
  }
}
</script>
<style lang="less" scoped>
.search-box {
  padding: 0px 30px 20px;
  display: flex;
  .search-left {
    flex: 0 0 60px;
    padding-top: 20px;
  }
  .search-right {
    flex: 1;
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
