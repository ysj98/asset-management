<!--资产投资-投资收益登记-->
<template>
  <div class="rentGainsRegister">
    <SG-SearchContainer
      size="fold"
      background="white"
      v-model="toggle"
      @input="searchContainerFn"
    >
      <div slot="headBtns">
        <SG-Button
          class="fl"
          style="margin-right: 20px"
          type="primary"
          @click="registerFn"
          v-power="ASSET_MANAGEMENT.INVEST_INCOME_NEW"
          >收益登记</SG-Button
        >
        <SG-Button
          icon="export"
          :loading="exportBtnLoading"
          @click="exportFn"
          v-power="ASSET_MANAGEMENT.INVEST_EARNINGS_REGISTER"
          >导出</SG-Button
        >
        <div style="position: absolute; top: 20px; right: 76px; display: flex">
          <treeSelect
            @changeTree="changeTree"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="allStyle"
          ></treeSelect>
          <a-select
            :maxTagCount="1"
            mode="multiple"
            :style="allStyle"
            :allowClear="true"
            placeholder="全部资产项目"
            v-model="queryCondition.projectId"
            :showSearch="true"
            :filterOption="filterOption"
            :getPopupContainer="
              (triggerNode) => {
                return triggerNode.parentNode;
              }
            "
          >
            <a-select-option
              :title="item.name"
              v-for="(item, index) in projectData"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
          <SG-DatePicker
            :allowClear="false"
            :defaultValue="signDate"
            label="收益账期"
            style="width: 200px; margin-right: 10px"
            pickerType="RangePicker"
            v-model="signDate"
            format="YYYY-MM-DD"
            :placeholder="['起', '止']"
          ></SG-DatePicker>
          <a-input-search
            v-model="queryCondition.assetNameCode"
            placeholder="收益名称/编号"
            :maxLength="30"
            style="width: 160px; height: 32px; margin-right: 10px"
            @search="allQuery"
          />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          :maxTagCount="1"
          mode="multiple"
          placeholder="全部资产类型"
          :tokenSeparators="[',']"
          @select="assetTypeDataFn"
          v-model="queryCondition.assetType"
          style="width: 170px"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in assetTypeData"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-select
          placeholder="全部状态"
          v-model="queryCondition.contractStatus"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in contractStatusData"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          @select="billOptionFn"
          show-search
          :placeholder="'请选择费用科目'"
          style="width: 200px"
          optionFilterProp="children"
          :options="$addTitle(billConfigOptions)"
          :allowClear="true"
          :filterOption="filterOption"
          v-model="queryCondition.billOption"
          notFoundContent="没有查询到数据"
        />
        <a-input-search
          v-model="queryCondition.rentNameCode"
          placeholder="投资单名称/编号"
          :maxLength="30"
          style="width: 150px; height: 32px; margin-right: 10px"
          @search="allQuery"
        />
      </div>
    </SG-SearchContainer>
    <div class="table-layout-fixed">
      <!-- ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover
            :operationData="record.operationDataBtn"
            @operationFun="operationFun($event, record)"
          ></OperationPopover>
        </template>
      </a-table>
      <div class="sum" v-if="loading === false">
        全部合计：
        <span style="font-size: 16px; font-weight: bold">{{ totalCount }}</span>
      </div>
    </div>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
    <!-- 新建 -->
    <gainsAdd
      v-model="close"
      v-if="close"
      ref="gainsAdd"
      :organId="organID"
      :organName="organName"
      @childrenSubmit="allQuery"
    ></gainsAdd>
    <gainsEdit
      ref="gainsEdit"
      :organId="organID"
      @childrenSubmit="allQuery"
    ></gainsEdit>
    <gainsDetail ref="gainsDetail"></gainsDetail>
  </div>
</template>

<script>
const columns = [
  {
    title: "收益编号",
    dataIndex: "incomeId",
  },
  {
    title: "收益名称",
    dataIndex: "incomeName",
  },
  {
    title: "所属机构",
    dataIndex: "organName",
  },
  {
    title: "资产项目",
    dataIndex: "projectName",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
  },
  {
    title: "客户名称",
    dataIndex: "customerName",
  },
  {
    title: "费用科目",
    dataIndex: "feeSubjectName",
  },
  {
    title: "收益金额(元)",
    dataIndex: "amount",
  },
  {
    title: "账期",
    dataIndex: "accountingPeriod",
  },
  {
    title: "所属投资单",
    dataIndex: "orderName",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "创建人",
    dataIndex: "createByName",
  },
  {
    title: "创建日期",
    dataIndex: "createTime",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
const contractStatusData = [
  {
    name: "全部状态",
    value: "",
  },
  {
    name: "有效",
    value: 1,
  },
  {
    name: "已作废",
    value: 0,
  },
];
import { ASSET_MANAGEMENT } from "@/config/config.power";
import segiIcon from "@/components/segiIcon.vue";
import TreeSelect from "../../common/treeSelect";
import moment from "moment";
import OperationPopover from "@/components/OperationPopover";
import noDataTips from "@/components/noDataTips";
import gainsAdd from "./child/gainsAdd";
import gainsEdit from "./child/gainsEdit";
import gainsDetail from "./child/gainsDetail";
export default {
  components: {
    segiIcon,
    TreeSelect,
    OperationPopover,
    noDataTips,
    gainsAdd,
    gainsEdit,
    gainsDetail,
  },
  data() {
    return {
      close,
      columns,
      toggle: false,
      ASSET_MANAGEMENT,
      loading: false,
      exportBtnLoading: false, // 导出按钮loading
      organID: 0,
      organName: "",
      queryCondition: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示记录数
        organId: 1, // 组织机构id
        projectId: undefined, // 资产项目Id
        assetType: [""], // 全部资产类型id(多个用，分割)
        approvalStatus: "", // 审批状态
        assetNameCode: "", // 收益名称/编号
        rentNameCode: "", // 投资单名称/合同编号
        contractStatus: "", // 状态
        billOption: undefined,
      },
      allStyle: "width: 150px; margin-right: 10px;",
      projectData: [],
      billConfigOptions: [
        {
          name: "全部费用科目",
          value: undefined,
        },
      ], // 费用科目
      signDate: [
        moment(new Date() - 24 * 1000 * 60 * 60 * 90),
        moment(new Date()),
      ],
      assetTypeData: [
        {
          name: "全部资产类型",
          value: "",
        },
      ],
      contractStatusData: [...contractStatusData],
      tableData: [],
      noPageTools: false,
      count: "", // 总数
      totalCount: undefined, // 全部合计
    };
  },
  methods: {
    query(type) {
      let obj = {
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        organId: Number(this.queryCondition.organId), // 组织机构id
        projectIdList: this.queryCondition.projectId
          ? this.queryCondition.projectId
          : [], // 资产项目Id
        accountingPeriodStart: moment(this.signDate[0]).format("YYYY-MM-DD"),
        accountingPeriodEnd: moment(this.signDate[1]).format("YYYY-MM-DD"),
        incomeNameOrId: this.queryCondition.assetNameCode,
        assetTypeList: this.alljudge(this.queryCondition.assetType),
        status: this.queryCondition.contractStatus,
        feeSubjectList: this.queryCondition.billOption,
        orderNameOrId: this.queryCondition.rentNameCode,
        orderType: 2,
      };
      let obj2 = {
        organId: Number(this.queryCondition.organId), // 组织机构id
        projectIdList: this.queryCondition.projectId
          ? this.queryCondition.projectId
          : [], // 资产项目Id
        accountingPeriodStart: moment(this.signDate[0]).format("YYYY-MM-DD"),
        accountingPeriodEnd: moment(this.signDate[1]).format("YYYY-MM-DD"),
        incomeNameOrId: this.queryCondition.assetNameCode,
        assetTypeList: this.alljudge(this.queryCondition.assetType),
        status: this.queryCondition.contractStatus,
        feeSubjectList: this.queryCondition.billOption,
        orderNameOrId: this.queryCondition.rentNameCode,
        orderType: 2,
      };
      if (type === "export") {
        return obj2;
      }
      this.loading = true;
      this.$api.assetRent.getIncomePageList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
            item.operationDataBtn = this.createOperationBtn(item.status);
            item.status === 1
              ? (item.status = "有效")
              : (item.status = "已作废");
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
      this.$api.assetRent.getIncomeStatistics(obj2).then((res) => {
        if (+res.data.code === 0) {
          this.totalCount = res.data.data.totalAmount;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    allQuery() {
      this.queryCondition.pageNum = 1;
      this.queryCondition.pageSize = 10;
      this.query();
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    // 收益登记新建
    registerFn() {
      this.close = true;
      this.$nextTick(() => {
        this.$refs.gainsAdd.show = true;
      });
    },
    // 导出
    exportFn() {
      this.exportBtnLoading = true;
      let data = this.query("export");
      this.$api.assetRent
        .exportIncome(data)
        .then((res) => {
          if (res.status === 200) {
            let blob = new Blob([res.data]);
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "投资收益登记表.xls";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
          } else {
            this.$message.error(res.data.message);
          }
          this.exportBtnLoading = false;
        })
        .catch((err) => {
          context.$message.error(err || "操作失败");
        });
    },
    changeTree(value, label) {
      this.organID = value;
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      // this.query();
      this.getObjectKeyValueByOrganIdFn();
      this.getFeeTypeList();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: "",
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
            });
          });
          this.projectData = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 平台字典获取变动类型
    platformDictFn(str) {
      let obj = {
        code: str,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === "asset_type") {
            this.assetTypeData = [{ name: "全部资产类型", value: "" }, ...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 费用科目
    getFeeTypeList() {
      this.$api.assets.getFeeTypeList({ organId: this.organID }).then((res) => {
        if (+res.data.code === 0) {
          let arr = [];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.feeTypeName,
              value: item.feeTypeId,
            };
            arr.push(obj);
          });
          this.billConfigOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
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
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetType,
          this.assetTypeData
        );
      });
    },

    // 费用科目变化
    billOptionFn(value) {
      this.$nextTick(function () {
        this.queryCondition.billOption = this.handleMultipleSelectValue(
          value,
          this.queryCondition.billOption,
          this.billConfigOptions
        );
      });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    alljudge(val) {
      if (val.length !== 0) {
        if (val[0] === "") {
          return [];
        } else {
          return val;
        }
      } else {
        return [];
      }
    },
    // 生成操作按钮
    createOperationBtn(type) {
      // 审批状态  0已作废 1有效
      let arr = [];
      // 有效
      if (["1"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_INCOME_EDIT)) {
          arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
        }
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_INCOME_DELETE)) {
          arr.push({ iconType: "delete", text: "作废", editType: "delete" });
        }
      }
      // 已审批
      /* if (["1"].includes(type)) {
        if (this.$power.has(ASSET_MANAGEMENT.RENT_FORM_REVERSE_AUDIT)) {
          arr.push({
            iconType: "edit",
            text: "反审核",
            editType: "readApproval",
          });
        }
      } */
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
    // 操作事件函数
    operationFun(type, record) {
      // 编辑
      if (["edit"].includes(type)) {
        this.$refs.gainsEdit.show = true;
        this.$refs.gainsEdit.incomeId = record.incomeId;
      } else if (["detail"].includes(type)) {
        this.$refs.gainsDetail.show = true;
        this.$refs.gainsDetail.incomeId = record.incomeId;
      } else {
        let that = this;
        this.$confirm({
          title: "提示",
          content: "确认要作废该投资收益吗",
          onOk() {
            that.$api.assetRent
              .updateIncomeStatus({
                incomeId: record.incomeId,
                status: 0,
              })
              .then((res) => {
                if (+res.data.code !== 0) {
                  that.$message.error(res.data.message);
                } else {
                  that.allQuery();
                }
              });
          },
        });
      }
    },
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
  created() {
    this.query();
  },
};
</script>

<style lang="less" scoped>
.rentGainsRegister {
  padding-bottom: 60px;
  .formCon {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    > * {
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
  .sum {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }
}
</style>
