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
      <div style="font-size: 16px">选择资产出租单</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <a-select
          style="width: 150px; margin: 0 20px 0 250px"
          placeholder="全部合同状态"
          :tokenSeparators="[',']"
          v-model="contractStatus"
          @select="contractStatusListFn"
        >
          <a-select-option
            v-for="(item, index) in contractStatusList"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <SG-DatePicker
          :allowClear="false"
          label="出租日期"
          style="width: 200px; margin-right: 20px"
          pickerType="RangePicker"
          v-model="rentDate"
          format="YYYY-MM-DD"
          :placeholder="['起', '止']"
        ></SG-DatePicker>
        <a-input-search
          placeholder="出租单名称/ID/合同编号"
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
        :scroll="{ x: 1200 }"
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
    title: "出租单ID",
    dataIndex: "leaseOrderId",
    fixed: "left",
    align: "center",
    width: 120,
  },
  {
    title: "出租单名称",
    dataIndex: "leaseName",
    fixed: "left",
    width: 120,
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
  },
  {
    title: "承租人",
    dataIndex: "lesseeName",
    align: "center",
  },
  {
    title: "资产数量",
    dataIndex: "assetSum",
    align: "center",
  },
  {
    title: "出租面积(㎡)",
    width: 100,
    dataIndex: "leaseArea",
    align: "center",
  },
  {
    title: "起租日期",
    dataIndex: "startLeaseDate",
    align: "center",
  },
  {
    title: "止租日期",
    dataIndex: "endLeaseDate",
    align: "center",
  },
  {
    title: "合同编号",
    dataIndex: "contractCode",
    align: "center",
  },
  {
    title: "合同状态",
    dataIndex: "contractStatusName",
    align: "center",
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
    name: "全部合同状态",
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
import TooltipText from "../../common/TooltipText";
export default {
  data() {
    return {
      columns,
      show: false,
      loading: false,
      contractStatusList: [...contractStatusList], // 合同状态列表
      contractStatus: [], // 当前合同状态
      rentNameOrId: "", // 出租单名称/ID/合同编号
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
    /* contractStatusListFn() {
      this.$nextTick(()=>{
        console.log(this.contractStatus);
      })
    } */
    query() {
      this.loading = true;
      let obj = {
        pageNum: this.pagination.pageNo, // 当前页
        pageSize: this.pagination.pageLength, // 每页显示记录数
        organId: Number(this.organId), // 组织机构id
        leaseNameOrId: this.rentNameOrId,
        contractStatusList: this.contractStatus,
        startleaseDateStart: moment(this.rentDate[0]).format("YYYY-MM-DD"),
        startleaseDateEnd: moment(this.rentDate[1]).format("YYYY-MM-DD"),
      };
      this.$api.assetRent.getLeaseOrderPageList(obj).then((res) => {
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
    // 状态改变
    contractStatusListFn(val) {
      (this.contractStatus = [val]), (this.pagination.pageNo = 1);
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