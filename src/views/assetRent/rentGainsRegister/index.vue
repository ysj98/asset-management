<!--资产出租-出租收益登记-->
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
          >收益登记</SG-Button
        >
        <SG-Button
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_EARNINGS_REGISTER"
          @click="exportFn"
          ><segiIcon type="#icon-ziyuan10" class="icon-right" />导出</SG-Button
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
              v-for="(item, index) in projectData"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
          <SG-DatePicker
            :allowClear="false"
            label="收益账期"
            style="width: 200px; margin-right: 10px"
            pickerType="RangePicker"
            v-model="signDate"
            format="YYYY-MM-DD"
            :placeholder="['起', '止']"
          ></SG-DatePicker>
          <a-input-search
            v-model="queryCondition.assetNameCode"
            placeholder="收益单名称/编号"
            maxlength="30"
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
        >
          <a-select-option
            v-for="(item, index) in assetTypeData"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          placeholder="全部状态"
          :tokenSeparators="[',']"
          @select="contractStatusFn"
          v-model="queryCondition.contractStatus"
        >
          <a-select-option
            v-for="(item, index) in contractStatusData"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-input-search
          v-model="queryCondition.rentNameCode"
          placeholder="出租单名称/编号"
          maxlength="30"
          style="width: 160px; height: 32px; margin-right: 10px"
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
          <!-- <OperationPopover
            :operationData="record.operationDataBtn"
            @operationFun="operationFun($event, record)"
          ></OperationPopover> -->
        </template>
      </a-table>
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
    <gainsAdd ref="gainsAdd"></gainsAdd>
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
    title: "所属出租单",
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
    value: 2,
  },
];
import { ASSET_MANAGEMENT } from "@/config/config.power";
import segiIcon from "@/components/segiIcon.vue";
import TreeSelect from "../../common/treeSelect";
import moment from "moment";
import OperationPopover from "@/components/OperationPopover";
import noDataTips from "@/components/noDataTips";
import gainsAdd from './child/gainsAdd'
export default {
  components: { segiIcon, TreeSelect, OperationPopover, noDataTips, gainsAdd },
  data() {
    return {
      columns,
      toggle: false,
      ASSET_MANAGEMENT,
      loading: false,
      organID: 0,
      organName: "",
      queryCondition: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示记录数
        organId: 1, // 组织机构id
        projectId: undefined, // 资产项目Id
        assetType: [""], // 全部资产类型id(多个用，分割)
        approvalStatus: "", // 审批状态
        assetNameCode: "", // 收益单名称/编号
        rentNameCode: "", // 出租单名称/合同编号
        contractStatus: [""], // 状态
      },
      allStyle: "width: 150px; margin-right: 10px;",
      projectData: [],
      signDate: [],
      assetTypeData: [
        {
          name: "全部资产类型",
          value: "",
        },
      ],
      contractStatusData: [...contractStatusData],
      tableData: [],
      noPageTools: false,
      count: "",
    };
  },
  methods: {
    query() {
      this.loading = true;
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
        status: +this.alljudge(this.queryCondition.contractStatus),
        feeSubject: '',
        orderNameOrId: this.queryCondition.rentNameCode,
        orderType: 1
      };
      this.$api.assetRent.getIncomePageList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          console.log('data',data);
          /* data.forEach((item, index) => {
            item.key = index;
            item.operationDataBtn = this.createOperationBtn(
              item.approvalStatus
            );
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.loading = false;
          if (this.queryCondition.pageNum === 1) {
            this.pageListStatistics(obj);
          } */
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    allQuery() {
      this.queryCondition.pageNum = 1;
      this.queryCondition.pageSize = 10;
      // this.query();
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    // 收益登记新建
    registerFn() {
      this.$refs.gainsAdd.show = true
    },
    // 导出
    exportFn() {
      console.log("导出");
      /*       let obj = {
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus),      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        objectTypeList: this.alljudge(this.queryCondition.contractStatus),  // 资产分类id(多个用，分割)
        assetNameCode: this.queryCondition.assetNameCode,         // 资产名称/编码
        createTimeStart: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        createTimeEnd: moment(this.defaultValue[1]).format('YYYY-MM-DD'),          // 结束创建日期
        registerOrderNameOrId: this.queryCondition.registerOrderNameOrId                                // 登记单编码
      }
      this.$api.assets.assetRegListPageExport(obj).then(res => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产登记一览表.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }) */
    },
    changeTree(value, label) {
      // console.log(value, label);
      this.organID = value;
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      // this.query();
      this.getObjectKeyValueByOrganIdFn();
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
    // 资产状态变化
    contractStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.contractStatus = this.handleMultipleSelectValue(
          value,
          this.queryCondition.contractStatus,
          this.contractStatusData
        );
      });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      // this.query();
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
      // 审批状态  0草稿   2待审批、3已驳回、 已审批1  已取消4
      let arr = [];
      // 草稿 已驳回
      if (["0", "3"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.RENT_FORM_EDIT)) {
          arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
        }
        if (this.$power.has(ASSET_MANAGEMENT.RENT_FORM_DELETE)) {
          arr.push({ iconType: "delete", text: "删除", editType: "delete" });
        }
      }
      // 待审批
      if (["2"].includes(type)) {
        if (this.$power.has(ASSET_MANAGEMENT.RENT_FORM_APPROVE)) {
          arr.push({ iconType: "edit", text: "审批", editType: "approval" });
        }
      }
      // 已审批
      if (["1"].includes(type)) {
        if (this.$power.has(ASSET_MANAGEMENT.RENT_FORM_REVERSE_AUDIT)) {
          arr.push({
            iconType: "edit",
            text: "反审核",
            editType: "readApproval",
          });
        }
      }
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
};
</script>

<style lang="less" scoped>
.rentGainsRegister {
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
}
</style>