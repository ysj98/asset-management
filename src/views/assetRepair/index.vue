<!--资产维修-维修登记-->
<template>
  <div class="assetRepair">
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
          v-power="ASSET_MANAGEMENT.REPAIR_FORM_NEW"
          @click="registerFn"
          >维修登记</SG-Button
        >
        <SG-Button
          icon="export"
          :loading="exportBtnLoading"
          @click="exportFn"
          v-power="ASSET_MANAGEMENT.ASSET_REPAIR_REGISTER"
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
              v-for="(item, index) in projectData"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @change="assetTypeDataFn"
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
            style="width: 160px; margin-right: 10px"
            mode="multiple"
            placeholder="全部状态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.approvalStatus"
          >
            <a-select-option
              v-for="(item, index) in approvalStatusData"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
          <a-input-search
            v-model="queryCondition.assetNameCode"
            placeholder="维修单名称/编号"
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
          showSearch
          allowClear
          placeholder="全部资产分类"
          optionFilterProp="children"
          :maxTagCount="1"
          mode="multiple"
          v-model="queryCondition.objectTypeList"
          :tokenSeparators="[',']"
          :options="assetTypeList"
          @select="assetClassifyDataFn"
        ></a-select>
        <SG-DatePicker
          :allowClear="false"
          label="维修日期"
          style="width: 200px"
          pickerType="RangePicker"
          v-model="repairDate"
          format="YYYY-MM-DD"
        ></SG-DatePicker>
      </div>
    </SG-SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList" />
    <div class="pr mb50">
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        v-bind="tableObj"
      >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover
            :operationData="record.operationDataBtn"
            @operationFun="operationFun($event, record)"
          ></OperationPopover>
        </template>
      </a-table>
      <div class="sum pa" v-if="loading === false">
        全部合计：
        <span style="font-size: 16px; font-weight: bold">{{
          totalCount > 0 ? totalCount : 0
        }}</span>
      </div>
    </div>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageLength"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
  </div>
</template>

<script>
const columns = [
  {
    title: "维修编号",
    dataIndex: "maintainId",
    fixed: "left",
    width: 150,
    align: "center",
  },
  {
    title: "所属机构",
    dataIndex: "organName",
    fixed: "left",
    width: 140,
    align: "center",
  },
  { title: "维修单名称", dataIndex: "maintainName", align: "center" },
  { title: "资产名称", dataIndex: "assetName", align: "center" },
  { title: "资产编码", dataIndex: "assetCode", align: "center" },
  { title: "资产项目", dataIndex: "projectName", align: "center" },
  { title: "资产类型", dataIndex: "assetTypeName", align: "center" },
  { title: "资产分类", dataIndex: "objectTypeName", align: "center" },
  { title: "维修说明", dataIndex: "remark", align: "center" },
  { title: "开始日期", dataIndex: "startDate", align: "center" },
  { title: "完成日期", dataIndex: "completeDate", align: "center" },
  { title: "维修人", dataIndex: "maintainUserId", align: "center" },
  { title: "维修费用（元）", dataIndex: "maintainCost", align: "center" },
  { title: "提交人", dataIndex: "createByName", align: "center" },
  { title: "提交时间", dataIndex: "createTime", align: "center" },
  { title: "状态", dataIndex: "approvalStatus", align: "center" },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    fixed: "right",
    width: 90,
  },
];
const approvalStatusData = [
  { name: "全部状态", value: "" },
  { name: "草稿", value: "0" },
  { name: "待审批", value: "2" },
  { name: "已驳回", value: "3" },
  { name: "已审批", value: "1" },
  { name: "已取消", value: "4" },
];
import { ASSET_MANAGEMENT } from "@/config/config.power";
import segiIcon from "@/components/segiIcon.vue";
import TreeSelect from "../common/treeSelect";
import moment from "moment";
import OverviewNumber from "src/views/common/OverviewNumber";
import OperationPopover from "@/components/OperationPopover";
import noDataTips from "@/components/noDataTips";
export default {
  data() {
    return {
      columns,
      toggle: false,
      loading: false,
      exportBtnLoading: false, // 导出按钮loading
      noPageTools: false,
      ASSET_MANAGEMENT,
      organId: 0,
      organName: "",
      count: 0,
      totalCount: 0, // 全部合计
      tableData: [],
      tableObj: {
        pagination: false,
        scroll: { x: 2400 },
        class: "custom-table td-pd10",
      },
      queryCondition: {
        pageLength: 10, // 页容量
        pageNum: 1, // 当前页
        organId: 0, // 组织机构id
        projectId: undefined, // 资产项目id
        assetType: [""], // 全部资产类型id(多个用，分割)
        approvalStatus: "", // 状态
        assetNameCode: "", // 维修单名称/编号
        objectTypeList: [""], // 资产分类
      },
      assetTypeData: [], // 资产类型列表
      assetTypeList: [
        {
          label: "全部资产分类",
          value: "",
        },
      ], // 资产分类列表
      allStyle: "width: 150px; margin-right: 10px;",
      projectData: [], // 资产项目列表
      approvalStatusData: [...approvalStatusData],
      repairDate: [
        moment(new Date() - 24 * 1000 * 60 * 60 * 30),
        moment(new Date()),
      ],
      numList: [
        { title: "全部", key: "total", value: 0, fontColor: "#3d91f9" },
        { title: "草稿", key: "draftCount", value: 0, bgColor: "#e47e60" },
        { title: "待审批", key: "pendingCount", value: 0, bgColor: "#00d58e" },
        { title: "已驳回", key: "rejectCount", value: 0, bgColor: "#0092ff" },
        { title: "已审批", key: "approvedCount", value: 0, bgColor: "#ed7ce3" },
        { title: "已取消", key: "cancelTotal", value: 0, bgColor: "#ff6a6b" },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
    };
  },
  components: {
    segiIcon,
    TreeSelect,
    OverviewNumber,
    OperationPopover,
    noDataTips,
  },
  methods: {
    // 导出
    exportFn() {
      this.exportBtnLoading = true;
      let data = this.query("export");
      this.$api.assetRent
        .exportMaintain(data)
        .then((res) => {
          if (res.status === 200) {
            let blob = new Blob([res.data]);
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "维修登记表.xls";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
          this.exportBtnLoading = false;
        })
        .catch((err) => {
          context.$message.error(err || "操作失败");
        });
    },
    query(type) {
      this.totalCount = 0;
      let obj = {
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageLength, // 每页显示记录数
        organId: Number(this.queryCondition.organId), // 组织机构id
        projectIdList: this.queryCondition.projectId
          ? this.queryCondition.projectId
          : [], // 资产项目Id
        objectTypeList:
          this.queryCondition.objectTypeList[0] === ""
            ? []
            : this.queryCondition.objectTypeList,
        assetTypeList: this.alljudge(this.queryCondition.assetType),
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus),
        maintainName: this.queryCondition.assetNameCode,
        startMaintainDate: moment(this.repairDate[0]).format("YYYY-MM-DD"),
        endMaintainDate: moment(this.repairDate[1]).format("YYYY-MM-DD"),
      };
      if (type === "export") {
        return obj;
      }
      this.loading = true;
      this.$api.assetRent.getMaintainPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
            item.operationDataBtn = this.createOperationBtn(
              item.approvalStatus
            );
            if (item.approvalStatus === 0) {
              item.approvalStatus = "草稿";
            } else if (item.approvalStatus === 1) {
              item.approvalStatus = "已审批";
            } else if (item.approvalStatus === 2) {
              item.approvalStatus = "待审批";
            } else if (item.approvalStatus === 3) {
              item.approvalStatus = "已驳回";
            } else if (item.approvalStatus === 4) {
              item.approvalStatus = "已取消";
            }
            this.totalCount += item.maintainCost;
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.loading = false;
          if (this.queryCondition.pageNum === 1) {
            this.pageListStatistics(obj);
          }
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    changeTree(value, label) {
      this.organId = value;
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      this.query();
      this.getListFn();
      this.getObjectKeyValueByOrganIdFn();
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
    // 查询资产分类列表
    getListFn() {
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetType.join(","),
      };
      this.queryCondition.objectTypeList = [""];
      if (!obj.assetType) {
        return;
      }
      this.$api.assets.getList(obj).then((res) => {
        if (+res.data.code === 0) {
          let arr = [{ label: "全部资产分类", value: "" }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.professionName,
              value: item.professionCode,
            };
            arr.push(obj);
          });
          this.assetTypeList = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 出租登记
    registerFn() {
      this.$router.push({
        path: "/repairRegister/repairAdd",
        query: { organName: this.organName, organId: this.organId },
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
            this.getListFn();
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
        this.getListFn();
      });
    },
    // 全部资产分类
    assetClassifyDataFn(value) {
      this.$nextTick(() => {
        this.queryCondition.objectTypeList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.objectTypeList,
          this.assetTypeList
        );
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatus,
          this.approvalStatusData
        );
      });
    },
    // 查询表头统计
    pageListStatistics(form) {
      this.$api.assetRent
        .getMaintainSum(form)
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
        if (this.$power.has(ASSET_MANAGEMENT.REPAIR_FORM_EDIT)) {
          arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
        }
        if (this.$power.has(ASSET_MANAGEMENT.REPAIR_FORM_DELETE)) {
          arr.push({ iconType: "delete", text: "删除", editType: "delete" });
        }
      }
      // 待审批
      if (["2"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.REPAIR_FORM_APPROVE)) {
          arr.push({ iconType: "edit", text: "审批", editType: "approval" });
        }
      }
      // 已审批
      if (["1"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.REPAIR_FORM_REVERSE_AUDIT)) {
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
    // 操作按钮函数
    operationFun(type, record) {
      // 编辑
      if (["edit"].includes(type)) {
        this.$router.push({
          path: "/repairRegister/repairEdit",
          query: { maintainId: record.maintainId, organId: this.organId },
        });
      } else if (["detail"].includes(type)) {
        this.$router.push({
          path: "/repairRegister/repairDetail",
          query: { maintainId: record.maintainId },
        });
      } else if (["readApproval"].includes(type)) {
        let that = this;
        this.$confirm({
          title: "提示",
          content: "确认要作废该维修单吗？",
          onOk() {
            that.$api.assetRent
              .opposeApproveMaintain({
                maintainId: record.maintainId,
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
      } else if (["delete"].includes(type)) {
        let that = this;
        this.$confirm({
          title: "提示",
          content: "确认要删除该维修单吗？",
          onOk() {
            that.$api.assetRent
              .deleteMaintain({
                maintainId: record.maintainId,
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
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageLength = data.pageLength;
      this.query();
    },
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
};
</script>

<style lang="less" scoped>
.assetRepair {
  .formCon {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    > * {
      margin-right: 12px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
  .sum {
    bottom: 22px;
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }
  /deep/.ant-table-body {
    margin-bottom: 90px;
  }
}
</style>