<!--投资单模块-->
<template>
  <SG-Modal
    v-model="show"
    :width="960"
    wrapClassName="assetRentForm"
    :noPadding="true"
    :maskClosable="false"
    :footer="null"
  >
    <template #title>
      <div style="font-size: 16px">选择投资单</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <a-select
          :maxTagCount="1"
          style="width: 150px; margin: 0 20px 0 250px"
          mode="multiple"
          placeholder="全部投资状态"
          :tokenSeparators="[',']"
          v-model="contractStatus"
          @change="contractStatusListFn"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in contractStatusList"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <SG-DatePicker
          :allowClear="false"
          label="投资日期"
          style="width: 200px; margin-right: 20px"
          pickerType="RangePicker"
          v-model="rentDate"
          format="YYYY-MM-DD"
          :placeholder="['起', '止']"
          @change="dateChange"
        ></SG-DatePicker>
        <a-input-search
          placeholder="投资单名称/ID/合同编号"
          v-model="rentNameOrId"
          style="width: 175px"
          @pressEnter="onPressEnter()"
          @search="onSearch"
        />
      </div>
      <!-- 表格 -->
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :bordered="true"
        :scroll="{ x: 2200 }"
        size="middle"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="chose(record)">选择</a>
        </template>
        <template slot="leaseArea" slot-scope="text">
          <tooltip-text width="120" :text="text" />
        </template>
      </a-table>
      <SG-FooterPagination
        :pageLength="pagination.pageLength"
        :totalCount="count"
        location="absolute"
        :noPageTools="true"
        v-model="pagination.pageNo"
        @change="pageChange"
      />
    </div>
  </SG-Modal>
</template>

<script>
const columns = [
  {
    title: "投资单ID",
    dataIndex: "investOrderId",
    fixed: "left",
    align: "center",
    width: 120,
  },
  {
    title: "投资单名称",
    dataIndex: "investName",
    align: "center",
  },
  {
    title: "资产项目",
    dataIndex: "projectName",
    align: "center",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    align: "center",
    width: 125
  },
  {
    title: "投资项目",
    dataIndex: "investProject",
    align: "center",
  },
  {
    title: "资产数量",
    dataIndex: "assetSum",
    align: "center",
    width: 70
  },
  {
    title: "投资面积(㎡)",
    width: 100,
    dataIndex: "investArea",
    align: "center",
  },
  {
    title: "起投日期",
    dataIndex: "startInvestDate",
    align: "center",
    width: 150,
  },
  {
    title: "止投日期",
    dataIndex: "endInvestDate",
    align: "center",
    width: 150,
  },
  {
    title: "合同编号",
    dataIndex: "contractCode",
    align: "center",
  },
  {
    title: "投资状态",
    dataIndex: "investStatusName",
    align: "center",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 70,
    fixed: "right",
    align: "center",
  },
];
const contractStatusList = [
  {
    name: "全部投资状态",
    value: "",
  },
  {
    name: "未生效",
    value: "0",
  },
  {
    name: "待执行",
    value: "1",
  },
  {
    name: "执行中",
    value: "2",
  },
  {
    name: "已终止",
    value: "3",
  },
  {
    name: "已作废",
    value: "4",
  },
];
import moment from "moment";
import TooltipText from "@/views/common/TooltipText";
export default {
  data() {
    return {
      columns,
      show: false,
      loading: false,
      contractStatusList: [...contractStatusList], // 合同状态列表
      contractStatus: [""], // 当前合同状态
      rentNameOrId: "", // 投资单名称/ID/合同编号
      rentDate: [
        moment(new Date() - 24 * 1000 * 60 * 60 * 90),
        moment(new Date()),
      ],
      tableData: [],
      count: 0, // 总条数
      pagination: {
        pageNo: 1,
        pageLength: 10,
      },
    };
  },
  props: ["organId"],
  components: { TooltipText },
  watch: {
    show(newVal) {
      if (newVal === true) {
        this.query();
      } else {
        this.$emit("input", newVal);
      }
    },
  },
  methods: {
    query() {
      console.log(this.contractStatus);
      this.loading = true;
      let obj = {
        pageNum: this.pagination.pageNo, // 当前页
        pageSize: this.pagination.pageLength, // 每页显示记录数
        organId: Number(this.organId), // 组织机构id
        investNameOrId: this.rentNameOrId,
        investStatusList:
          this.contractStatus[0] === "" ? [] : this.contractStatus,
        startInvestDateStart: moment(this.rentDate[0]).format("YYYY-MM-DD"),
        startInvestDateEnd: moment(this.rentDate[1]).format("YYYY-MM-DD"),
      };
      this.$api.assetInvest.getInvestOrderPageList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 搜索回车
    onPressEnter() {
      this.pagination.pageNo = 1;
      this.query();
    },
    // 搜索框按钮搜索
    onSearch() {
      this.onPressEnter();
    },
    // 选择按钮
    chose(record) {
      this.$emit("getRentList", record);
      this.show = false;
    },
    // 页码改变
    pageChange(page) {
      this.pagination.pageNo = page.pageNo;
      this.query();
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === "") {
        data = [""];
      } else {
        let totalIndex = data.indexOf("");
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [""];
          }
        }
      }
      return data;
    },
    // 状态改变
    contractStatusListFn(value) {
      this.$nextTick(function () {
        this.contractStatus = this.handleMultipleSelectValue(
          value,
          this.contractStatus,
          this.contractStatusList
        );
        this.query();
      });
    },
    // 日期改变
    dateChange() {
      this.query();
    },
  },
};
</script>

<style lang="less" scoped>
.assetRentForm {
  .content {
    padding: 0 15px;
    padding-bottom: 55px;
    .search_box {
      display: flex;
      height: 60px;
      align-items: center;
    }
  }
}
</style>
