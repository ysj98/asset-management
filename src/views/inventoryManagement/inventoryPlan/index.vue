<!--
 * @Date: 2019-12-23 10:14:17
 * @Description: 盘点计划
 -->
<template>
  <div class="plan-page">
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
          placeholder="请选择权属情况"
          v-model="queryCondition.status"
          optionFilterProp="children"
          @change="statusSelect"
          mode="multiple"
          :maxTagCount="1"
          :style="allStyle"
          :options="statusOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
        />
        <div style="margin-top: 20px;">
          <SG-DatePicker
            v-model="queryCondition.startTime"
            :style="allWidth"
            label="生效日期"
          ></SG-DatePicker>
        </div>
        <div style="margin-top: 20px;">
          <SG-DatePicker
            v-model="queryCondition.endTime"
            :style="allWidth"
            label="失效日期"
          ></SG-DatePicker>
        </div>
        <!-- 输入框 -->
        <a-input-search
          :style="allStyle"
          v-model="queryCondition.name"
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
          <!-- <template slot="assetName" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="tranProgress" slot-scope="text, record">
            <div style="padding-right: 20px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_SET" @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          </template> -->
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
// 页面跳转
const operationTypes = {
  detail: "/inventoryPlan/detail",
  create: '/inventoryPlan/create',
  edit: '/inventoryPlan/edit',
};
const queryCondition = {
  status: "", // 状态
  organId: "",
  name: "",
  startTime: null,
  endTime: null,
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
let statusOpt = [
  { label: "全部状态", value: "" },
  { label: "有证", value: "1" },
  { label: "无证", value: "0" },
  { label: "待办", value: "2" }
]
let columns = [
  {
    title: "计划编号",
    dataIndex: "assetName",
    scopedSlots: { customRender: "assetName" },
    width: 150
  },
  {
    title: "所属机构",
    dataIndex: "assetCode",
    width: 120
  },
  {
    title: "计划名称",
    dataIndex: "assetTypeName",
    width: 120
  },
  {
    title: "生效时间",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "失效时间",
    dataIndex: "projectName",
    width: 120
  },
  {
    title: "实施频次",
    dataIndex: "location",
    width: 200
  },
  {
    title: "创建人",
    dataIndex: "area",
    width: 100
  },
  {
    title: "创建时间",
    dataIndex: "ownershipStatusName",
    width: 100
  },
  {
    title: "状态",
    dataIndex: "settingMethodName",
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
    TreeSelect
  },
  data() {
    return {
      queryCondition: { ...queryCondition },
      statusOpt,
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
  methods: {
    query() {},
    changeTree(value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ""
      this.query()
    },
    goPage(type, record) {
      let query = {
        type,
      };
      this.$router.push({ path: operationTypes[type], query });
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    statusSelect(value) {
      this.$nextTick(function() {
        this.queryCondition.status = this.handleMultipleSelectValue(
          value,
          this.queryCondition.status,
          this.statusOpt
        )
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
