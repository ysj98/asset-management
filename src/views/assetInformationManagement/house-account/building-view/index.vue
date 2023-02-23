<!--楼栋视图业务-楼栋视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="6">
        <a-col :span="3">
          <SG-Button icon="import" type="primary" @click="handleExport" :loading="exportBtnLoading" v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_BV_EXPORT"
            >导出楼栋视图</SG-Button
          >
        </a-col>
        <!--<a-col :span="15">-->
        <!--<organ-project-building v-model="organProjectBuildingValue" mode="multiple"/>-->
        <!--</a-col>-->
        <a-col :span="3">
          <SG-Button v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_BV_ASSET_LABEL" type="default" @click="clickAsset">资产标签</SG-Button>
          <SG-Button type="default" @click="clickHeader">列表设置</SG-Button>
        </a-col>
        <a-col :span="4">
          <a-select
            showSearch
            style="width: 100%"
            :options="$addTitle(organOptions)"
            @change="queryBuildingList"
            :filterOption="filterOption"
            placeholder="请选择组织机构"
            v-model="organProjectBuildingValue.organId"
          ></a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            allowClear
            showSearch
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择楼栋"
            :options="$addTitle(buildingOptions)"
            :filterOption="filterOption"
            v-model="organProjectBuildingValue.buildingId"
          ></a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model="organProjectBuildingValue.statusList"
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择资产状态"
            :options="$addTitle(statusListOpt)"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model="label"
            mode="multiple"
            :maxTagCount="1"
            @select="assetLabelFn"
            style="width: 100%"
            placeholder="请选择资产标签"
            :options="$addTitle(assetLabelSelect)"
          />
        </a-col>
        <a-col :span="2">
          <SG-Button icon="search" type="primary" @click="queryTableData({ type: 'search' })">查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview" />
    </a-spin>
    <!--列表部分-->
    <a-table
      v-bind="tableObj"
      size="middle"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelectAll: onSelectAll }"
    >
      <template slot="buildName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <span slot="assetNum" slot-scope="text">
        <span style="color: #0084ff; cursor: pointer">{{ text }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <span style="color: #0084ff; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
      <template slot="fireMaterial" slot-scope="text">
        {{ +text === 1 ? "是" : "否" }}
      </template>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" />
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })" />
    <!--编辑资产标签-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status" @ok="handleModalOk" @cancel="modalObj.status = false">
      <edit-tag ref="editTagRef" :options="assetLabelOpt" />
    </SG-Modal>
    <SG-Modal v-bind="modalHead" v-model="modalHead.status" width="800px" @ok="headModalOk" @cancel="modalHead.status = false">
      <header-tag ref="headRef" :options="headerList" />
    </SG-Modal>
  </div>
</template>

<script>
import NoDataTip from "src/components/noDataTips";
import TooltipText from "src/views/common/TooltipText";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OverviewNumber from "src/views/common/OverviewNumber";
import EditTag from "./editTag";
import HeaderTag from "./headerTag";
import { queryAssetLabelConfig } from "@/api/publicCode.js";
import { throttle } from "@/utils/utils";
import { getTableHeaders } from "@/utils/share.js";
// import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
const assetLabelOpt = [
  // { label: "全部资产标签  ", value: "" },
];
const defaultHeader = [
  { title: "楼栋名称", dataIndex: "buildName", scopedSlots: { customRender: "buildName" }, fixed: "left", width: 250 },
  { title: "楼栋编号", dataIndex: "buildCode", width: 200 },
  { title: "资产项目名称", dataIndex: "projectName", width: 200 },
  { title: "资产数量", dataIndex: "assetNum", scopedSlots: { customRender: "assetNum" }, width: 150 },
  { title: "是否有消防验收材料", dataIndex: "fireMaterial", width: 150, scopedSlots: { customRender: "fireMaterial" } },
  { title: "操作", key: "action", scopedSlots: { customRender: "action" }, width: 150, fixed: "right" },
];
const chooseHeader = [
  { title: "宗地号", dataIndex: "addressNo", width: 150 },
  { title: "建筑年代", dataIndex: "years", width: 150 },
  { title: "资产-实际产权单位", dataIndex: "propertyRightUnit", width: 200 },
  { title: "权证-实际保管单位", dataIndex: "safekeepUnit", width: 200 },
  { title: "楼栋建筑面积(㎡)", dataIndex: "buildBuiltArea", width: 150 },
  { title: "房屋建筑面积(㎡)", dataIndex: "area", width: 150 },
  { title: "楼高", dataIndex: "buildHeight", width: 150 },
  { title: "层数", dataIndex: "floorNum", width: 150 },
  { title: "地上层数", dataIndex: "upFloorNum", width: 150 },
  { title: "地下层数", dataIndex: "downFloorNum", width: 150 },
  { title: "运营(㎡)", dataIndex: "transferOperationArea", width: 150 },
  { title: "自用(㎡)", dataIndex: "selfUserArea", width: 150 },
  { title: "闲置(㎡)", dataIndex: "idleArea", width: 150 },
  { title: "占用(㎡)", dataIndex: "occupationArea", width: 150 },
  { title: "其它(㎡)", dataIndex: "otherArea", width: 150 },
  { title: "资产原值(元)", dataIndex: "originalValue", width: 150 },
  { title: "最新估值(元)", dataIndex: "marketValue", width: 150 },
  { title: "资产标签", dataIndex: "label", width: 150 },
];
// const optionHeader =[
//   { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
// ]
export default {
  name: "index",
  components: { OverviewNumber, NoDataTip, TooltipText, EditTag, HeaderTag },
  data() {
    return {
      assetLabelOpt,
      assetLabelSelect: [],
      label: [],
      funType: 17,
      selectedRowKeys: [],
      modalObj: { title: "资产设置", status: false, okText: "确定", width: 605 },
      modalHead: { title: "表头设置", status: false, okText: "确定", width: 605 },
      ASSET_MANAGEMENT, // 权限对象
      overviewNumSpinning: false, // 查询视图面积概览数据loading
      exportBtnLoading: false, // 导出按钮loading
      organOptions: [], // 组织机构选项
      buildingOptions: [], // 楼栋选项
      organProjectBuildingValue: {
        organId: undefined,
        projectId: undefined, // 用不到，暂存，临时需求隐藏处理
        buildingId: undefined,
        statusList: [],
      }, // 查询条件-组织机构-资产项目-楼栋对象
      numList: [
        { title: "所有资产(㎡)", key: "totalArea", value: 0, fontColor: "#324057" },
        { title: "运营(㎡)", key: "totalOperationArea", value: 0, bgColor: "#4BD288" },
        { title: "闲置(㎡)", key: "totalIdleArea", value: 0, bgColor: "#1890FF" },
        { title: "自用(㎡)", key: "totalSelfUserArea", value: 0, bgColor: "#DD81E6" },
        { title: "占用(㎡)", key: "totalOccupationArea", value: 0, bgColor: "#FD7474" },
        { title: "其他(㎡)", key: "totalOtherArea", value: 0, bgColor: "#BBC8D6" },
        { title: "楼栋面积(㎡)", key: "totalBuildArea", value: 0, fontColor: "#324057" },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      tableObj: {
        dataSource: [],
        loading: false,
        scroll: { x: 2500 },
        pagination: false,
        rowKey: "buildId",
        columns: [
          // { title: '楼栋名称', dataIndex: 'buildName', scopedSlots: { customRender: 'buildName' }, fixed: 'left', width: 250 },
          // { title: '楼栋编号', dataIndex: 'buildCode', width: 200},
          // { title: '资产项目名称', dataIndex: 'projectName', width: 200 },
          // { title: '宗地号', dataIndex: 'addressNo', width: 150 },
          // { title: '建筑年代', dataIndex: 'years', width: 150 },
          // { title: '资产-实际产权单位', dataIndex: 'propertyRightUnit', width: 200 },
          // { title: '权证-实际保管单位', dataIndex: 'safekeepUnit', width: 200 },
          // { title: '楼栋建筑面积(㎡)', dataIndex: 'buildBuiltArea', width: 150 },
          // { title: '房屋建筑面积(㎡)', dataIndex: 'area', width: 150 },
          // { title: '楼高', dataIndex: 'buildHeight', width: 150 },
          // { title: '层数', dataIndex: 'floorNum', width: 150 },
          // { title: '地上层数', dataIndex: 'upFloorNum', width: 150 },
          // { title: '地下层数', dataIndex: 'downFloorNum', width: 150 },
          // { title: '资产数量', dataIndex: 'assetNum', scopedSlots: { customRender: 'assetNum' }, width: 150 },
          // { title: '运营(㎡)', dataIndex: 'transferOperationArea', width: 150 },
          // { title: '自用(㎡)', dataIndex: 'selfUserArea', width: 150 },
          // { title: '闲置(㎡)', dataIndex: 'idleArea', width: 150 },
          // { title: '占用(㎡)', dataIndex: 'occupationArea', width: 150 },
          // { title: '其它(㎡)', dataIndex: 'otherArea', width: 150 },
          // { title: '资产原值(元)', dataIndex: 'originalValue', width: 150 },
          // { title: '最新估值(元)', dataIndex: 'marketValue', width: 150 },
          // { title: '是否有消防验收材料', dataIndex: 'fireMaterial', width: 150,scopedSlots: { customRender: 'fireMaterial' }},
          // { title: '资产标签', dataIndex: 'label', width: 150 },
          // { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
        ],
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: "absolute" },
      current: null, // 当前选中的概览区域下标，与后台入参一一对应
      statusListOpt: [
        { title: "全部状态", key: "all" },
        { title: "待入库", key: "0" },
        { title: "正常", key: "1" },
        { title: "报废", key: "2" },
        { title: "转让", key: "3" },
        { title: "报损", key: "4" },
      ],
      options: [],
    };
  },
  computed: {
    headerList() {
      let list = defaultHeader.concat(chooseHeader);
      let options = [];
      list.forEach((item) => {
        if (item.dataIndex) {
          let cur = {};
          cur.label = item.title;
          cur.value = item.dataIndex;
          if (
            item.dataIndex == "buildName" ||
            item.dataIndex == "buildCode" ||
            item.dataIndex == "projectName" ||
            item.dataIndex == "assetNum" ||
            item.dataIndex == "fireMaterial"
          ) {
            cur.disabled = true;
          }
          options.push(cur);
        }
      });
      return options;
    },
    allList() {
      return defaultHeader.concat(chooseHeader);
    },
  },
  methods: {
    assetLabelFn(value) {
      this.$nextTick(function () {
        this.label = this.handleMultipleSelectValue(value, this.label, this.assetLabelSelect);
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
    getAssetLabel(id) {
      queryAssetLabelConfig({ organId: id })
        .then((res) => {
          let { data, code } = res.data;
          if (!data) this.assetLabelOpt = [];
          if (code === "0") {
            this.assetLabelOpt = data.data.map((item) => {
              return { label: item.labelName, value: item.labelValue };
            });
            this.assetLabelSelect = this.assetLabelOpt.length > 0 ? [{ label: "全部资产标签", value: "" }, ...this.assetLabelOpt] : undefined;
            this.label = this.assetLabelOpt.length > 0 ? "" : undefined;
          }
        })
        .catch((err) => {
          this.$message.error(err || "当前组织机构下无资产标签");
        });
    },
    // 多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelectAll(selected) {
      // console.log(this.selectedRowKeys)
    },
    clickAsset() {
      if (this.assetLabelOpt.length === 0) return this.$message.error("该组织机构下暂无资产标签");
      // if(this.selectedRowKeys.length <= 0) return this.$message.error('请选择要操作的楼栋')
      this.modalObj.status = true;
    },
    clickHeader() {
      this.modalHead.status = true;
      this.$nextTick(() => {
        let cur = [];
        this.tableObj.columns.forEach((item) => {
          cur.push(item.dataIndex);
        });
        this.$refs.headRef.checkedList = cur;
      });
    },
    // 资产设置
    handleModalOk: throttle(function () {
      let arr = this.$refs.editTagRef.checkedList;
      if (this.selectedRowKeys.length <= 0) {
        return this.$message.error("请选择需要设置标签的楼栋");
      }
      let data = {
        buildIds: this.selectedRowKeys.join(","),
        labelCode: arr.join("、"),
      };
      if (!data.labelCode) delete data.labelCode;
      this.$api.assets.updateAssetLabelConfig(data).then((res) => {
        if (res.data.code === "0") {
          this.selectedRowKeys = [];
          this.queryTableData({ type: "" });
          this.$refs.editTagRef.checkedList = [];
          this.$refs.editTagRef.change();
        }
      });
      this.modalObj.status = false;
    }, 3000),
    //更改表头
    headModalOk() {
      let list = this.$refs.headRef.checkedList;
      console.log(list);
      console.log(this.tableObj.columns);
      let params = {
        funType: 17,
        chooseList: [],
      };
      list.forEach((item) => {
        this.allList.forEach((ele) => {
          let cur = {};
          if (ele.dataIndex === item) {
            cur.colCode = item;
            cur.colName = ele.title;
            cur.funType = 17;
            params.chooseList.push(cur);
          }
        });
      });
      this.$api.global.addCustomShowV2(params).then((res) => {
        if (res.data.code === "0") {
          this.getChoosedList();
          this.modalHead.status = false;
        }
      });
    },
    // 点击总览数据块
    handleClickOverview({ i }) {
      this.current = i;
      this.queryTableData({ type: "" });
    },
    // 查看楼栋视图详情
    handleViewDetail(record) {
      console.log("record", record);
      const {
        organProjectBuildingValue: { organId },
      } = this;
      const resObj = this.organOptions.filter((ele) => (ele.vaslukeye = organId))[0];
      const organName = resObj ? resObj.title : "";
      record.buildId &&
        this.$router.push({
          path: "/buildingView/buildingViewDetail",
          query: { organId, assetIds: record.assetIds, buildId: record.buildId, organName: organName },
        });
    },

    // 查询列表数据
    queryTableData({ pageNo = 1, pageLength = 10, type }) {
      let labelName = "";
      if (this.label.length > 0 && this.assetLabelSelect.length > 0) {
        labelName = this.label.map((item) => {
          return this.assetLabelSelect.find((sub) => sub.value === item).title;
        });
        labelName = labelName.length > 0 ? labelName.join("、") : "";
      }
      const {
        organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
        current,
      } = this;
      let statusList = this.organProjectBuildingValue.statusList.includes("all") ? [] : this.organProjectBuildingValue.statusList;
      if (!organId) {
        return this.$message.info("请选择组织机构");
      }
      this.tableObj.loading = true;
      let data = {
        organId,
        buildIdList,
        statusList,
        projectIdList,
        pageSize: pageLength,
        label: labelName,
        pageNum: pageNo,
        flag: current ? current - 1 : "",
      };
      if (labelName === "全部资产标签" || !labelName) {
        delete data.label;
      }
      this.$api.assets
        .queryBuildingViewPage(data)
        .then((r) => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === "0") {
            const { count, data } = res.data;
            this.tableObj.dataSource = data;
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
            return false;
          }
          throw res.message || "查询资产项目接口出错";
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || "查询资产项目接口出错");
        });
      // 查询楼栋面积统计数据
      if (type === "search") {
        this.queryAreaInfo();
      }
    },

    // 查询楼栋视图面积概览数据
    queryAreaInfo() {
      const {
        organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
        numList,
      } = this;
      let statusList = this.organProjectBuildingValue.statusList.includes("all") ? [] : this.organProjectBuildingValue.statusList;
      this.overviewNumSpinning = true;
      this.$api.assets
        .queryBuildingViewFloorArea({ organId, statusList, buildIdList, projectIdList })
        .then((r) => {
          this.overviewNumSpinning = false;
          let res = r.data;
          if (res && String(res.code) === "0") {
            return (this.numList = numList.map((m) => {
              res.data[m.key] = Math.round(res.data[m.key] * 10000) / 10000;
              return { ...m, value: res.data[m.key] };
            }));
          }
          throw res.message || "查询楼栋视图面积使用统计出错";
        })
        .catch((err) => {
          this.overviewNumSpinning = false;
          this.$message.error(err || "查询楼栋视图面积使用统计出错");
        });
    },

    // 导出数据
    handleExport() {
      if (!this.tableObj.dataSource.length) {
        return this.$message.info("无可导出数据");
      }
      let labelName = "";
      if (this.label.length > 0 && this.assetLabelSelect.length > 0) {
        labelName = this.label.map((item) => {
          return this.assetLabelSelect.find((sub) => sub.value === item).title;
        });
        labelName = labelName.length > 0 ? labelName.join("、") : "";
      }

      this.exportBtnLoading = true;
      const {
        organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
        current,
      } = this;
      let statusList = this.organProjectBuildingValue.statusList.includes("all") ? [] : this.organProjectBuildingValue.statusList;
      let data = { organId, buildIdList, projectIdList, statusList, label: labelName, flag: current ? current - 1 : "" };
      if (labelName === "全部资产标签" || !labelName) {
        delete data.label;
      }
      this.$api.assets
        .exportBuildingViewExcel(data)
        .then((res) => {
          this.exportBtnLoading = false;
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([res.data]));
            a.download = "楼栋视图导出列表.xls";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            return a.remove();
          }
          throw res.message || "导出楼栋视图失败";
        })
        .catch((err) => {
          this.exportBtnLoading = false;
          this.$message.error(err || "导出楼栋视图失败");
        });
    },

    // 搜索过滤选项
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },

    // 查询组织机构对应的楼栋数据
    queryBuildingList() {
      const {
        organProjectBuildingValue: { organId },
      } = this;
      // 清空组织机构，重置楼栋选项
      if (!organId) {
        return this.$message.warn("组织机构不存在");
      }
      this.buildingOptions = [];
      this.organProjectBuildingValue.buildingId = undefined;

      this.getAssetLabel(organId);
      this.$api.assets
        .queryBuildingByOrganId({ organId })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === "0") {
            this.buildingOptions = (res.data || []).map((item) => {
              return {
                key: item.buildId,
                title: item.buildName,
              };
            });
            return false;
          }
          throw res.message || "查询楼栋失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询楼栋失败");
        });
    },

    // 查询一级组织机构
    queryOrganList(init) {
      this.$api.assets
        .queryAsynOrganByUserId({ parentOrganId: "", typeFilter: "" })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let list = res.data.data || [];
            let id = list[0] ? list[0].organId : undefined;
            this.organProjectBuildingValue.organId = id;

            // this.getAssetLabel(this.organProjectBuildingValue.organId)
            id && this.queryBuildingList();
            this.organOptions = list.map((item) => {
              return {
                key: item.organId,
                title: item.name,
              };
            });
            return false;
          }
          throw res.message || "查询组织机构失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询组织机构失败");
        });
    },
    //获取选中的表头
    getChoosedList: async function () {
      let cur = await getTableHeaders({ funType: this.funType });
      this.tableObj.columns = [...defaultHeader];
      cur.customChose.forEach((item) => {
        let cur = chooseHeader.find((ele) => {
          return ele.dataIndex == item.colCode;
        });
        if (cur) {
          this.tableObj.columns.push(cur);
        }
      });
      // this.tableObj.columns.forEach((item,index)=>{
      //   if(!){
      //     this.tableObj.columns.splice(index,1)
      //   }
      // })
      console.log(this.tableObj.columns);
    },
  },

  created() {
    this.queryOrganList();
    this.getChoosedList();
  },
  watch: {
    organProjectBuildingValue: {
      handler: function (val) {
        val && val.organId && this.queryTableData({ type: "search" });
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.custom-table {
  padding-bottom: 55px;
  /*if you want to set scroll: { x: true }*/
  /*you need to add style .ant-table td { white-space: nowrap; }*/
  & /deep/ .ant-table {
    .ant-table-thead th {
      white-space: nowrap;
    }
  }
}
/deep/ .sg-FooterPagination {
  z-index: 2;
}
</style>
