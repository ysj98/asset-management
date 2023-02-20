<!--
  资产登记
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <a-button type="primary" @click="newChangeSheetFn">新建登记单</a-button>
        <div style="position: absolute; top: 20px; right: 76px; display: flex">
          <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle" :showSearch="true"></treeSelect>
          <a-input-search
            v-model="queryCondition.registerOrderName"
            placeholder="登记单名称/编号"
            :maxLength="30"
            style="width: 140px; margin-right: 10px"
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
          :style="allStyle"
          :allowClear="true"
          placeholder="全部资产项目"
          v-model="queryCondition.projectId"
          :showSearch="true"
          :filterOption="filterOption"
        >
          <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{ item.name }}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          placeholder="全部资产类型"
          :tokenSeparators="[',']"
          @select="assetTypeDataFn"
          v-model="queryCondition.assetType"
        >
          <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          style="width: 160px; margin-right: 10px"
          mode="multiple"
          placeholder="全部状态"
          :tokenSeparators="[',']"
          @select="approvalStatusFn"
          v-model="queryCondition.approvalStatus"
        >
          <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker label="创建日期" style="width: 200px" pickerType="RangePicker" v-model="createDateValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
      </div>
    </SG-SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList" />
    <div class="table-layout-fixed">
      <!-- ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <div class="tab-opt">
            <OperationPopover :operationData="record.operationDataBtn" @operationFun="operationFun($event, record)"></OperationPopover>
          </div>
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
  </div>
</template>

<script>
import TreeSelect from "../../common/treeSelect";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import moment from "moment";
import OperationPopover from "@/components/OperationPopover";
import noDataTips from "@/components/noDataTips";
import OverviewNumber from "src/views/common/OverviewNumber";
const approvalStatusData = [
  {
    name: "全部状态",
    value: "",
  },
  {
    name: "未核实",
    value: "0",
  },
  {
    name: "待入库",
    value: "1",
  },
  {
    name: "已入库",
    value: "2",
  },
];
const columns = [
  {
    title: "登记单编号",
    dataIndex: "registerOrderId",
  },
  {
    title: "登记单名称",
    dataIndex: "registerOrderName",
  },
  {
    title: "管理机构",
    dataIndex: "organName",
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
  },
  {
    title: "资产数量",
    dataIndex: "assetNum",
  },
  {
    title: "创建日期",
    dataIndex: "createTime",
  },
  {
    title: "创建人",
    dataIndex: "createByName",
  },
  {
    title: "核实时间",
    dataIndex: "verifierTime",
  },
  {
    title: "核实人",
    dataIndex: "verifierByName",
  },
  {
    title: "入库时间",
    dataIndex: "storageTime",
  },
  {
    title: "入库人",
    dataIndex: "storageByName",
  },
  {
    title: "状态",
    dataIndex: "approvalStatusName",
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  components: { TreeSelect, noDataTips, OperationPopover, OverviewNumber },
  props: {},
  data() {
    return {
      checkNick: false,
      toggle: false,
      // scrollHeight: {y: 0},
      ASSET_MANAGEMENT,
      isChild: false,
      loading: false,
      noPageTools: false,
      approvalStatusData: [...approvalStatusData],
      allStyle: "width: 150px; margin-right: 10px;",
      columns,
      organName: "",
      organId: "",
      tableData: [],
      numList: [
        { title: "全部", key: "whole", value: 0, fontColor: "#324057" },
        { title: "未核实", key: "notVerified", value: 0, bgColor: "#FD7474" },
        { title: "待入库", key: "waitStorage", value: 0, bgColor: "#1890FF" },
        { title: "已入库", key: "alreadyStorage", value: 0, bgColor: "#DD81E6" },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      queryCondition: {
        approvalStatus: "", // 状态
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示记录数
        projectId: undefined, // 资产项目Id
        organId: 1, // 组织机构id
        assetType: "", // 变动类型id(多个用，分割)
        createDateS: "", // 开始创建日期
        crateDateE: "", // 结束创建日期
        registerOrderName: "", // 登记单名称/编码
      },
      createDateValue: null, // 去掉时间的默认值 [moment([moment().year(), '0', '1']), moment(new Date())],  查询起始时间默认为今年1月1号
      count: "",
      assetTypeData: [
        {
          name: "全部资产类型",
          value: "",
        },
      ],
      projectData: [],
    };
  },
  computed: {},
  methods: {
    // 获取是否资产自动入库 设置 checkNick
    async getApproveConfig() {
      let {
        data: { code, data },
      } = await this.$api.paramsConfig.queryParamsConfigDetail({
        // 参考 serviceTypeAll.js 文件
        serviceType: 1012,
        organId: this.queryCondition.organId,
      });
      if (code === "0") {
        const { isValid } = data;
        if (isValid === 1) {
          this.checkNick = true;
        }
      }
    },
    // 操作
    operationFun(str, val) {
      let recordData = JSON.stringify([{ value: this.queryCondition.organId, name: this.organName, ...val }]);
      switch (str) {
        case "detail":
          {
            // 详情
            // val.assetType = "3"
            let particularsData = JSON.stringify([val]);
            this.$router.push({ path: "/assetRegister/particulars", query: { record: particularsData, setType: "detail" } });
          }
          break;
        case "basicInformation": // 登记基础信息
          this.$router.push({ path: "/assetRegister/registerEdit", query: { record: recordData, setType: "edit", activeStepIndex: 0 } });
          break;
        case "registrationAccessory": // 登记附属配套
          this.$router.push({ path: "/assetRegister/registerEdit", query: { record: recordData, setType: "edit", activeStepIndex: 1 } });
          break;
        case "registeredInformation": // 登记价值信息
          this.$router.push({ path: "/assetRegister/registerEdit", query: { record: recordData, setType: "edit", activeStepIndex: 2 } });
          break;
        case "registerDirections": // 登记使用方向
          this.$router.push({ path: "/assetRegister/registerEdit", query: { record: recordData, setType: "edit", activeStepIndex: 3 } });
          break;
        case "registrationFees": // RegistrationFees
          this.$router.push({ path: "/assetRegister/registerEdit", query: { record: recordData, setType: "edit", activeStepIndex: 4 } });
          break;
        case "delete": // 删除
          this.commonFn("delete", val.registerOrderId);
          break;
        case "undoCheck": // 撤销核实
          this.commonFn("undoCheck", val.registerOrderId);
          break;
        case "verify": // 核实
          this.commonFn("verify", val.registerOrderId);
          break;
      }
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 新建登记单
    newChangeSheetFn() {
      let recordData = JSON.stringify([{ value: this.queryCondition.organId, name: this.organName }]);
      this.$router.push({ path: "/assetRegister/newEditSingle", query: { record: recordData, setType: "new", activeStepIndex: "0" } });
    },
    commonFn(str, id) {
      let _this = this,
        interfaceName = "",
        contentTitle = "",
        succeedMessage = "";
      if (str === "delete") {
        // 删除
        interfaceName = "deleteByRegisterOrderId";
        contentTitle = "确认要删除该资产登记单吗？";
        succeedMessage = "删除成功";
      } else if (str === "undoCheck") {
        // 撤销核实
        interfaceName = "registerOrderReAudit";
        contentTitle = "确认要撤销核实该登记单吗？";
        succeedMessage = "撤销核实该登记单成功";
      } else if (str === "verify") {
        // 核实
        interfaceName = "registerOrderAudit";
        (contentTitle = (h) => (
          <div>
            确认要核实该登记单吗？
            <p v-if="checkNick">
              <input style="vertical-align: middle;" type="checkbox" checked="true" disabled="true"></input>自动资产入库
            </p>
          </div>
        )),
          (succeedMessage = "核实该登记单成功");
      }
      this.$confirm({
        title: "提示",
        content: contentTitle,
        onOk() {
          let obj = {
            registerOrderId: id,
          };
          _this.$api.assets[interfaceName](obj).then((res) => {
            if (Number(res.data.code) === 0) {
              _this.$message.info(succeedMessage);
              _this.query();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData);
      });
    },
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData);
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
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      this.getApproveConfig();
      this.query();
      this.getObjectKeyValueByOrganIdFn();
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
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
    allQuery() {
      this.queryCondition.pageNum = 1;
      this.queryCondition.pageSize = 10;
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
    // 查询
    query() {
      this.loading = true;
      let obj = {
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus), // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [], // 资产项目Id
        organId: this.queryCondition.organId, // 组织机构id
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(",") : "", // 资产类型id(多个用，分割)
        createDateS: this.createDateValue ? (this.createDateValue[0] ? moment(this.createDateValue[0]).format("YYYY-MM-DD") : "") : "", // 开始创建日期
        crateDateE: this.createDateValue ? (this.createDateValue[1] ? moment(this.createDateValue[1]).format("YYYY-MM-DD") : "") : "", // 结束创建日期
        registerOrderName: this.queryCondition.registerOrderName ? this.queryCondition.registerOrderName : null, // 登记单名称
      };
      this.$api.assets.getRegisterOrderListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            (item.key = index), (item.operationDataBtn = this.createOperationBtn(item));
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.loading = false;
          this.pageListStatistics(obj);
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 查询统计信息
    pageListStatistics(form) {
      this.$api.assets
        .pageListStatistics(form)
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === "0") {
            let { numList } = this;
            return (this.numList = numList.map((m) => {
              return { ...m, value: (res.data || {})[m.key] };
            }));
          }
          throw res.message;
        })
        .catch((err) => {
          this.$message.error(err || "查询统计信息出错");
        });
    },
    createOperationBtn(record) {
      // 审批状态
      let arr = [];
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_BASIC)) {
        arr.push({ iconType: "book", text: "登记基础信息", editType: "basicInformation" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_ACCESSORY)) {
        arr.push({ iconType: "hdd", text: "登记附属配套", editType: "registrationAccessory" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_REGISTERED)) {
        arr.push({ iconType: "strikethrough", text: "登记价值信息", editType: "registeredInformation" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_DIRECTION)) {
        arr.push({ iconType: "select", text: "登记使用方向", editType: "registerDirections" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_FEES)) {
        arr.push({ iconType: "block", text: "登记相关费用", editType: "registrationFees" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_VERIFY)) {
        arr.push({ iconType: "check-square", text: "核实", editType: "verify" });
      }
      if (String(record.approvalStatus) === "0" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_DELETE)) {
        arr.push({ iconType: "delete", text: "删除", editType: "delete" });
      }
      if (String(record.approvalStatus) === "1" && this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTER_UNDOCHECK)) {
        arr.push({ iconType: "logout", text: "撤销核实", editType: "undoCheck" });
      }
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
  },
  watch: {
    $route() {
      if (this.$route.path === "/assetRegister" && this.$route.query.refresh) {
        this.queryCondition.pageNum = 1;
        this.queryCondition.pageSize = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
};
</script>
<style lang="less" scoped>
.assetRegister {
  .box {
    display: inline-block;
    // vertical-align: middle;
    margin-right: 10px;
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084ff;
      cursor: pointer;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
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
