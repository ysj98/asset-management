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
          @click="registerFn"
          >维修登记</SG-Button
        >
        <SG-Button
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_REPAIR_REGISTER"
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
          <!-- <a-select
            :maxTagCount="1"
            style="width: 160px; margin-right: 10px"
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
            style="width: 160px; height: 32px; margin-right: 10px"
            @search="allQuery"
          /> -->
        </div>
      </div>
      <!-- <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div> -->
      <!-- <div slot="form" class="formCon">
        <a-select
          :maxTagCount="1"
          style="width: 160px; margin-right: 10px"
          mode="multiple"
          placeholder="全部合同状态"
          :tokenSeparators="[',']"
          @select="contractStatusListFn"
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
          style="width: 200px"
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
      </div> -->
    </SG-SearchContainer>
    <!--数据总览-->
    <!-- <overview-number :numList="numList" /> -->
    <!-- <div class="table-layout-fixed">
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
    </div> -->
    <!-- <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    /> -->
  </div>
</template>

<script>
import { ASSET_MANAGEMENT } from "@/config/config.power";
import segiIcon from "@/components/segiIcon.vue";
import TreeSelect from "../common/treeSelect";
export default {
  data() {
    return {
      toggle: false,
      ASSET_MANAGEMENT,
      organID: 0,
      organName: "",
      queryCondition: {
        organId: 0, // 组织机构id
        pageNum: 1, // 当前页
        projectId: undefined, // 资产项目id
        assetType: [""], // 全部资产类型id(多个用，分割)
      },
      assetTypeData: [],
      allStyle: "width: 150px; margin-right: 10px;",
      projectData: [], // 资产项目列表
    };
  },
  components: {
    segiIcon,
    TreeSelect,
  },
  methods: {
    changeTree(value, label) {
      this.organID = value;
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      // this.query();
      this.getObjectKeyValueByOrganIdFn();
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
    // 出租登记
    registerFn() {
      this.$router.push({
        path: `/repairRegister/repairAdd/` /* ${this.organID}/${this.organName} */,
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
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
};
</script>

<style lang="less" scoped>
.assetRepair {
}
</style>