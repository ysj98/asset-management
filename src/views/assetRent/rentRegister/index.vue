<!--资产出租-出租登记-->
<template>
  <div class="rentRegister">
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
          >出租登记</SG-Button
        >
        <SG-Button
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_RENT_REGISTER"
          @click="exportFn"
          ><segiIcon type="#icon-ziyuan10" class="icon-right" />导出</SG-Button
        >
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
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
            style="width: 160px; margin-right: 10px;"
            mode="multiple"
            placeholder="全部审批状态"
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
            placeholder="出租单名称/合同编号"
            maxlength="30"
            style="width: 160px; height: 32px; margin-right: 10px;"
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
          style="width: 160px; margin-right: 10px;"
          mode="multiple"
          placeholder="全部合同状态"
          :tokenSeparators="[',']"
          @select="approvalStatusFn"
          v-model="queryCondition.contractStatus"
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
          label="签订日期"
          style="width: 200px;"
          pickerType="RangePicker"
          v-model="signDate"
          format="YYYY-MM-DD"
        ></SG-DatePicker>
        <SG-DatePicker
          :allowClear="false"
          label="出租日期"
          style="width: 200px; float: right"
          pickerType="RangePicker"
          v-model="rentDate"
          format="YYYY-MM-DD"
        ></SG-DatePicker>
      </div>
    </SG-SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList" />
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
        <!--  <template slot="operation" slot-scope="text, record">
          <router-link :to="{ path: '/assetCheckInView/detail', query: { registerOrderId: record.registerOrderId, assetId: record.assetId, assetType: record.assetType } }" class="action_text">详情</router-link>
        </template> -->
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
import { ASSET_MANAGEMENT } from "@/config/config.power";
import segiIcon from "@/components/segiIcon.vue";
import TreeSelect from "../../common/treeSelect";
import moment from "moment";
import noDataTips from "@/components/noDataTips";
import OverviewNumber from "src/views/common/OverviewNumber";
const approvalStatusData = [
  {
    name: "全部审批状态",
    value: "",
  },
  {
    name: "草稿",
    value: "0",
  },
  {
    name: "待审批",
    value: "2",
  },
  {
    name: "已驳回",
    value: "3",
  },
  {
    name: "已审批",
    value: "1",
  },
  {
    name: "已取消",
    value: "4",
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
const columns = [
  {
    title: "出租单ID",
    width: 100,
    dataIndex: "investOrderId",
  },
  {
    title: "所属机构",
    dataIndex: "organName",
  },
  {
    title: "出租单名称",
    dataIndex: "leaseName",
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
    title: "承租人",
    dataIndex: "lesseeName",
  },
  {
    title: "资产数量",
    dataIndex: "assetSum",
  },
  {
    title: "出租面积(㎡)",
    width: 100,
    dataIndex: "leaseArea",
  },
  {
    title: "起租日期",
    dataIndex: "startLeaseDate",
  },
  {
    title: "止租日期",
    dataIndex: "endLeaseDate",
  },
  {
    title: "租金单价",
    dataIndex: "rentPrice",
  },
  {
    title: "合同编号",
    dataIndex: "contractCode",
  },
  {
    title: "合同状态",
    dataIndex: "contractStatusName",
  },
  {
    title: "签订日期",
    dataIndex: "signingDate",
  },
  {
    title: "审批状态",
    dataIndex: "approvalStatusName",
  },
  {
    title: "操作",
    dataIndex: "storageByName",
  },
];
export default {
  components: { segiIcon, TreeSelect, noDataTips, OverviewNumber },
  data() {
    return {
      ASSET_MANAGEMENT,
      loading: false,
      columns,
      toggle: false,
      allStyle: "width: 150px; margin-right: 10px;",
      approvalStatusData: [...approvalStatusData],
      contractStatusList: [...contractStatusList],
      queryCondition: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示记录数
        organId: 1, // 组织机构id
        projectId: undefined, // 资产项目Id
        assetType: [""], // 全部资产类型id(多个用，分割)
        approvalStatus: "", // 审批状态
        assetNameCode: "", // 出租单名称/合同编号
        contractStatus: [""], // 合同状态
      },
      projectData: [],
      count: "",
      noPageTools: false,
      assetTypeData: [
        {
          name: "全部资产类型",
          value: "",
        },
      ],
      signDate: [
        moment(new Date() - 24 * 1000 * 60 * 60 * 90),
        moment(new Date()),
      ],
      rentDate: [
        moment(new Date() - 24 * 1000 * 60 * 60 * 90),
        moment(new Date()),
      ],
      tableData: [],
      numList: [
        { title: "全部", key: "whole", value: 0, fontColor: "#3d91f9" },
        { title: "草稿", key: "notVerified", value: 0, bgColor: "#e47e60" },
        { title: "待审批", key: "waitStorage", value: 0, bgColor: "#00d58e" },
        { title: "已驳回", key: "alreadyReject", value: 0, bgColor: "#0092ff" },
        {
          title: "已审批",
          key: "alreadyApproval",
          value: 0,
          bgColor: "#ed7ce3",
        },
        { title: "已取消", key: "alreadyCancel", value: 0, bgColor: "#ff6a6b" },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
    };
  },
  watch: {
    "queryCondition.assetType"() {
      console.log("queryCondition.assetType", this.queryCondition.assetType);
      this.getAssetClassifyOptions();
    },
  },
  mounted() {
    this.platformDictFn("asset_type");
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
        assetTypeList: this.alljudge(this.queryCondition.assetType),
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus),
        leaseNameOrId: this.queryCondition.assetNameCode,
        contractStatusList: this.alljudge(this.queryCondition.contractStatus),
        signingDateStart: moment(this.signDate[0]).format("YYYY-MM-DD"),
        signingDateEnd: moment(this.signDate[1]).format("YYYY-MM-DD"),
        startleaseDateStart: moment(this.rentDate[0]).format("YYYY-MM-DD"),
        startleaseDateEnd: moment(this.rentDate[1]).format("YYYY-MM-DD"),
      };
      this.$api.assetRent.getLeaseOrderPageList(obj).then((res) => {
        console.log('resres',res);
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
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
    // 高级搜索控制
    searchContainerFn(val) {
      console.log(val);
      this.toggle = val;
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
    // 出租登记
    registerFn() {
      this.$router.push('/rentRegister/rentAdd')
    },
    //
    changeTree(value, label) {
      console.log(value, label);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
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
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function() {
        this.queryCondition.assetType = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetType,
          this.assetTypeData
        );
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function() {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatus,
          this.approvalStatusData
        );
      });
    },
    // 查询统计信息
    pageListStatistics(form) {
      this.$api.assets
        .assetRegSta(form)
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
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
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
  },
  created() {
    this.getObjectKeyValueByOrganIdFn();
  },
};
</script>

<style lang="less" scoped>
.rentRegister {
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
