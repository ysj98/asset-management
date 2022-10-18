<!--
 * @Date: 2019-11-05 16:16:34
 * @Author: chen han
 * @Description: 房间信息
 -->
<template>
  <div class="houseInfo-page pb70">
    <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0, overflow: 'visible'}">
      <div slot="headerBtns">
        <SG-Button
          class="mr10"
          v-power="ASSET_MANAGEMENT.ASSET_ADD_HOUSE"
          icon="plus"
          @click="goPage('create')"
          type="primary"
        >新增</SG-Button>
        <SG-Button
          class="mr10"
          v-power="ASSET_MANAGEMENT.ASSET_HOUSEZL_IN"
          @click="showHouseDataImport"
        >
          <segiIcon type="#icon-ziyuan4" class="mr10" />房间资料导入
        </SG-Button>
        <SG-Button class="mr10" v-power="ASSET_MANAGEMENT.ASSET_HOUSE_OUT" @click="openExportModal">
          <segiIcon type="#icon-ziyuan10" class="mr10" />房间导出
        </SG-Button>
        <SG-Button
          icon="sync"
          v-power="ASSET_MANAGEMENT.ASSET_HOUSE_IN"
          @click="openImportModal"
        >批量更新</SG-Button>
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-checkbox :checked="Boolean(queryCondition.isCurrent)" @change="changeChecked" style="margin-top: 7px;margin-right: 10px;" :style="allWidth">
            仅当前机构下房屋
          </a-checkbox>
          <!-- 公司 -->
          <treeSelect
            :typeFilter="typeFilter"
            @changeTree="organIdChange"
            placeholder='请选择组织机构'
            :allowClear="false"
            :style="allWidth"
          >
          </treeSelect>
          <!-- 楼栋 -->
          <a-select
            showSearch
            placeholder="请选择楼栋"
            v-model="queryCondition.buildId"
            optionFilterProp="children"
            @search="handleSearch"
            @change="watchBuildChange"
            :style="allWidth"
            :options="$addTitle(buildOpt)"
            :allowClear="false"
            :filterOption="false"
            notFoundContent="没有查询到数据"
          />
          <!-- 单元 -->
          <a-select
            showSearch
            placeholder="请选择单元"
            @change="watchUnitChange"
            v-model="queryCondition.unitId"
            optionFilterProp="children"
            :style="allWidth"
            :options="$addTitle(unitOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房号 -->
          <a-select
            showSearch
            @search="onChangeHouseOpt"
            placeholder="请选择房号"
            v-model="queryCondition.houseId"
            :style="allWidth"
            :options="$addTitle(houseOpt)"
            :allowClear="false"
            :filter-option="false"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋建筑形态 -->
          <a-select
            showSearch
            placeholder="请选择建筑形态"
            v-model="queryCondition.houseCategory"
            optionFilterProp="children"
            :style="allWidth"
            :options="$addTitle(houseCategoryOpt)"
            @change="watchHouseCategory"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋类型 -->
          <a-select
            showSearch
            placeholder="请选择房间类型"
            v-model="queryCondition.houseType"
            optionFilterProp="children"
            :style="allWidth"
            :options="$addTitle(houseTypeOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋用途 -->
          <a-select
            showSearch
            placeholder="请选择房间用途"
            v-model="queryCondition.resType"
            optionFilterProp="children"
            :style="allWidth"
            :options="$addTitle(resTypeOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋状态 -->
          <a-select
            showSearch
            placeholder="请输入房间状态"
            v-model="queryCondition.status"
            optionFilterProp="children"
            :style="allWidth"
            :options="$addTitle(statusOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
        </div>
        <div class="two-row-box">
          <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
          <SG-Button @click="restQuery">清除</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <!-- 表格部分 -->
    <div class="table-layout-fixed">
      <a-table
        class="custom-table operation"
        :scroll="{x:'100%',y:600}"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
      >
        <template slot="houseName" slot-scope="text, record">
          <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <OperationPopover
            v-if="record.houseId !== '合计'"
            :operationData="String(record.status) === '1'?operationDataOn:operationDataOff"
            @operationFun="operationFun($event, record)"
          ></OperationPopover>
        </template>
      </a-table>
      <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageLength"
        :totalCount="table.totalCount"
        location="fixed"
        v-model="queryCondition.pageNo"
        @change="handleChange"
      />
    </div>
    <!-- 房间资料导入 -->
    <houseDataImport
      ref="houseDataImport"
      :organIdCopy="queryCondition.organId"
      :defaultOrganName="selectedOrganName"
      @success="houseDataImportSuccess"
    />
    <!-- 房间导出 -->
    <houseExport :organIdCopy="queryCondition.organId" :defaultOrganName="selectedOrganName" :isCurrent="queryCondition.isCurrent" ref="houseExport" />
    <!-- 批量更新 -->
    <eportAndDownFile
      @upload="uploadHouseFile"
      ref="eportAndDownFile"
      title="房间批量更新"
      :showDown="false"
    />
    <!-- 导入错误信息 -->
    <downErrorFile ref="downErrorFile">
      <div>{{upErrorInfo}}</div>
    </downErrorFile>
  </div>
</template>
<script>
import SearchContainer from "@/views/common/SearchContainer";
import segiIcon from "@/components/segiIcon.vue";
import topOrganByUser from "@/views/common/topOrganByUser";
import { utils, debounce, getFormat } from "@/utils/utils";
import OperationPopover from "@/components/OperationPopover";
import houseExport from "./child/houseExport.vue";
import eportAndDownFile from "@/views/common/eportAndDownFile.vue";
import houseDataImport from "./child/houseDataImport.vue";
import downErrorFile from "@/views/common/downErrorFile";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import noDataTips from "@/components/noDataTips";
import TreeSelect from '../common/treeSelect'
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
let getUuid = ((uuid = 1) => () => ++uuid)();
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  float: "left",
  "margin-top": "14px"
};
// 页面跳转
const operationTypes = {
  create: "/buildingDict/createHouse",
  edit: "/buildingDict/editHouse",
  detail: "/buildingDict/detailHouse",
  copy: "/buildingDict/createHouse"
};
let queryCondition = {
  pageNo: 1,
  pageLength: 10,
  organId: "",
  buildId: "",
  unitId: "",
  houseId: "",
  houseCategory: "", //建筑形态
  houseType: "", //房间类型
  resType: "", // 房间用途
  status: "", // 房间状态
  isCurrent: 0,
};
const statusMap = {
  "1": "有效",
  "0": "无效"
};
const buildOpt = [{ label: "全部楼栋", value: "" }];
const unitOpt = [{ label: "全部单元", value: "" }];
const houseOpt = [{ label: "全部房号", value: "" }];
const houseCategoryOpt = [{ label: "所有建筑形态", value: "" }];
const houseTypeOpt = [{ label: "全部房间类型", value: "" }];
const resTypeOpt = [{ label: "全部房间用途", value: "" }];
const statusOpt = [
  { label: "全部状态", value: "" },
  { label: "有效", value: "1" },
  { label: "无效", value: "0" }
];
// 表格数据
let columns = [
  {
    title: "房间ID",
    dataIndex: "houseId",
    width: "15%"
  },
  {
    title: "机构名称",
    dataIndex: "organName",
    width: 200
  },
  {
    title: "房间名称",
    dataIndex: "houseName",
    width: 300,
    scopedSlots: { customRender: "houseName" }
  },
  {
    title: "房间类型",
    dataIndex: "houseTypeName",
    width: "15%"
  },
  {
    title: "建筑面积(㎡)",
    dataIndex: "area",
    width: 150
  },
  {
    title: "使用面积(㎡)",
    dataIndex: "useArea",
    width: 150
  },
  {
    title: "套内面积(㎡)",
    dataIndex: "innerArea",
    width: 150
  },
  {
    title: "分摊面积(㎡)",
    dataIndex: "shareArea",
    width: 150
  },
  {
    title: "房间状态",
    dataIndex: "statusName",
    width: "10%"
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: "124px"
  }
];
// 操作按钮
// const operationDataOff = [
//   {iconType: 'edit', text: '编辑', editType: 'edit'},
//   {iconType: 'play-circle', text: '启用', editType: 'on'},
//   {iconType: 'file-text', text: '详情', editType: 'detail'},
//   {iconType: 'copy', text: '复制', editType: 'copy'},
// ]
// const operationDataOn = [
//   {iconType: 'edit', text: '编辑', editType: 'edit'},
//   {iconType: 'close-circle', text: '禁用', editType: 'off'},
//   {iconType: 'file-text', text: '详情', editType: 'detail'},
//   {iconType: 'copy', text: '复制', editType: 'copy'},
// ]
export default {
  components: {
    SearchContainer,
    segiIcon,
    topOrganByUser,
    OperationPopover,
    houseExport,
    eportAndDownFile,
    houseDataImport,
    downErrorFile,
    noDataTips,
    TreeSelect
  },
  data() {
    return {
      houseName: '',
      selectedOrganName: '', // 当前所选 组织名称 导出弹窗回显使用
      typeFilter,
      ASSET_MANAGEMENT,
      upErrorInfo: "", // 导入文件错误提示
      allWidth,
      toggle: true,
      operationDataOff: [],
      operationDataOn: [],
      searchBuildName: "", // 搜索楼栋字符
      queryCondition: { ...queryCondition },
      buildOpt: utils.deepClone(buildOpt),
      unitOpt: utils.deepClone(unitOpt),
      houseOpt: utils.deepClone(houseOpt),
      houseCategoryOpt: utils.deepClone(houseCategoryOpt),
      houseTypeOpt: utils.deepClone(houseTypeOpt),
      resTypeOpt: utils.deepClone(resTypeOpt),
      statusOpt: utils.deepClone(statusOpt),
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  watch: {
    $route () {
      if (
        this.$route.path === "/buildingDict" &&
        this.$route.query.refresh &&
        this.$route.query.showKey === "house"
      ) {
        this.queryCondition.pageNo = 1;
        this.queryCondition.pageLength = 10;
        this.query();
      }
    }
  },
  created() {
    this.handleBtn();
    // 是否有记住搜索条件
    let query = this.GET_ROUTE_QUERY(this.$route.path);
    if (Object.keys(query).length > 0) {
      this.queryCondition.pageLength = query.pageLength;
      this.queryCondition.pageNo = query.pageNo;
      this.queryCondition.organId = query.organId;
      this.queryCondition.buildId = query.buildId;
      this.queryCondition.unitId = query.unitId;
      this.queryCondition.houseId = query.houseId;
      this.queryCondition.houseCategory = query.houseCategory;
      this.queryCondition.houseType = query.houseType;
      this.queryCondition.resType = query.resType;
      this.queryCondition.status = query.status;
      this.organName = query.organName;
      this.searchBuildName = query.searchBuildName;
      console.log("取=>", this.searchBuildName);
      this.formChildPage = true; // 用于公司记录一次
    }
    // 楼栋
    if (this.queryCondition.organId) {
      console.log("请求=>", this.searchBuildName);
      this.queryBuildList(this.queryCondition.organId, this.searchBuildName);
    }
    // 单元
    if (this.queryCondition.buildId) {
      this.getOptions("getUnitByBuildId", this.queryCondition.buildId);
    }
    // 房号
    if (this.queryCondition.unitId) {
      this.getOptions("getHouseByUnitId", this.queryCondition.unitId);
    }
    // 房间类型
    if (this.queryCondition.houseCategory) {
      let typeId = this.queryCondition.houseCategory.split(",")[1];
      this.queryChildNodesById(typeId);
    }
    this.query();
  },
  mounted() {
    this.queryNodesByRootCode("20");
    this.queryNodesByRootCode("60");
  },
  methods: {
    // 房间收拾搜索
    onChangeHouseOpt (val) {
      if (val) {
        this.houseName = val
        this.debounceHouse()
      }
    },
    // 防抖函数后台请求楼栋数据
    debounceHouse: debounce(function() {
      // 如果选择了楼栋和单元的就按单元查  反正按楼栋查
      // queryCondition.buildId
      // queryCondition.unitId
      let str = ''
      let strType = ''
      if (this.queryCondition.buildId && this.queryCondition.unitId) {
        str = this.queryCondition.unitId
        strType = 'getHouseByUnitId'
      } else {
        str = this.queryCondition.buildId
        strType = 'getHouseByBuildId'
      }
      this.getOptionsByAms(
        strType,
        str
      );
    }, 300),
    getOptionsByAms (type, value = "") {
      if (!type) {
        return;
      }
      if (!value) {
        return
      }
      let PARAMS = "";
      let resetArr = [];
      // 以单元请求房号
      if (type === "getHouseByUnitId") {
        PARAMS = "#UNIT_ID:" + value;
        resetArr = utils.deepClone(houseOpt);
        this.houseOpt = resetArr;
      }
      // 以楼栋请求房号
      if (type === "getHouseByBuildId") {
        PARAMS = "#BUILD_ID:" + value;
        resetArr = utils.deepClone(houseOpt);
        this.houseOpt = resetArr;
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      };
      this.$api.basics.getOptionsByAms(data, this.houseName).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          resetArr.push(
            ...result.map(item => {
              return {
                label: item.C_TEXT,
                value: item.C_VALUE
              };
            })
          );
        }
      });
    },
    // 处理是否选中仅当前机构
    changeChecked (e) {
      this.queryCondition.isCurrent = Number(e.target.checked)
    },
    // 查询房屋列表
    query() {
      this.queryConditionStore = { ...this.queryCondition };
      let data = {
        ...this.queryCondition
      };
      // 处理数据提取typeCode
      let keys = ["houseCategory", "houseType", "resType"];
      keys.forEach(item => {
        data[item] = data[item] ? data[item].split(",")[0] : data[item];
      });
      this.table.loading = true;
      this.$api.building.queryHouseByPage(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            this.table.dataSource = res.data.data.map(item => {
              item.innerArea = getFormat(item.innerArea, '') || "-";
              item.area = getFormat(item.area, '') || "-";
              item.useArea = getFormat(item.useArea, '') || "-"
              item.houseName = item.houseName || "-";
              item.shareArea = getFormat(item.shareArea, '') || "-"
              item.statusName = statusMap[item.status] || "-";
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.paginator.totalCount || 0;
            this.queryHouseTotal(data)
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 合计
    queryHouseTotal (data) {
      this.$api.building.queryHouseTotal(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data;
          data.area =  getFormat(data.areaTotal, '') || "-"
          data.innerArea =  getFormat(data.innerAreaTotal, '') || "-"
          data.shareArea =  getFormat(data.shareAreaTotal, '') || "-"
          data.useArea =  getFormat(data.useAreaTotal, '') || "-"
          data.houseId = '合计'
          this.table.dataSource.push(data)
        }
      });
    },
    // 处理按钮
    handleBtn() {
      this.operationDataOff = [];
      this.operationDataOn = [];
      // 编辑权限
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_EDIT_HOUSE)) {
        let o = { iconType: "edit", text: "编辑", editType: "edit" };
        this.operationDataOff.push(o);
        this.operationDataOn.push(o);
      }
      // 禁止启用
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_HOUSE_STATE)) {
        this.operationDataOff.push({
          iconType: "play-circle",
          text: "启用",
          editType: "on"
        });
        this.operationDataOn.push({
          iconType: "close-circle",
          text: "禁用",
          editType: "off"
        });
      }
      let obj = { iconType: "file-text", text: "详情", editType: "detail" };
      this.operationDataOff.push(obj);
      this.operationDataOn.push(obj);
      // 新增权限
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_ADD_HOUSE)) {
        let o = { iconType: "copy", text: "复制", editType: "copy" };
        this.operationDataOff.push(o);
        this.operationDataOn.push(o);
      }
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNo = 1;
      this.query();
    },
    // 重置查询条件
    restQuery() {
      this.queryCondition.buildId = "";
      this.queryCondition.unitId = "";
      this.queryCondition.houseId = "";
      this.queryCondition.houseCategory = "";
      this.queryCondition.houseType = "";
      this.queryCondition.resType = "";
      this.queryCondition.status = "";
      this.queryCondition.isCurrent = false
    },
    // organId改变
    organIdChange(organId,organName) {
      // 如果第一次进来为子页面
      if (this.formChildPage) {
        this.formChildPage = false;
        return;
      }
      this.organName = organName;
      this.selectedOrganName = organName || ''
      if (organId) {
        this.queryCondition.organId = organId
        this.watchOrganChange(organId);
        this.searchQuery();
      }
    },
    handleChange(data) {
      this.queryCondition.pageNo = data.pageNo;
      this.queryCondition.pageLength = data.pageLength;
      this.query();
    },
    // 监听楼栋变化
    watchBuildChange(value) {
      console.log("楼栋变化=>", value);
      this.unitOpt = utils.deepClone(unitOpt);
      this.houseOpt = utils.deepClone(houseOpt);
      this.queryCondition.houseId = "";
      this.queryCondition.unitId = "";
      if (!value) {
        return;
      }
      this.getOptions("getUnitByBuildId", value);
    },
    // 监听单元变化
    watchUnitChange(value) {
      this.houseOpt = utils.deepClone(houseOpt);
      this.queryCondition.houseId = "";
      if (!value) {
        return;
      }
      this.getOptions("getHouseByUnitId", value);
    },
    // 监听公司改变
    watchOrganChange(organId) {
      this.buildOpt = utils.deepClone(buildOpt);
      this.unitOpt = utils.deepClone(unitOpt);
      this.houseOpt = utils.deepClone(houseOpt);
      this.queryCondition.houseId = "";
      this.queryCondition.unitId = "";
      this.queryCondition.buildId = "";
      console.log("监听公司改变");
      if (!organId) {
        return;
      }
      this.queryBuildList(organId);
    },
    // 监听建筑形态变化
    watchHouseCategory(value) {
      console.log("建筑形态变化=>", value);
      this.queryCondition.houseType = "";
      this.houseTypeOpt = utils.deepClone(houseTypeOpt);
      if (!value) {
        return;
      }
      let typeId = value.split(",")[1];
      this.queryChildNodesById(typeId);
    },
    // 请求楼栋列表默认20条
    queryBuildList(organId, buildName) {
      this.$api.basics
        .queryBuildList({ organId, buildName: buildName || "" })
        .then(res => {
          if (res.data.code === "0") {
            let result = res.data.data || [];
            this.buildOpt = utils.deepClone(buildOpt);
            result.forEach(item => {
              this.buildOpt.push({
                label: item.buildName,
                value: item.buildId
              });
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取公司楼栋单元房号
    getOptions(type, value = "") {
      if (!type) {
        return;
      }
      let PARAMS = "";
      let resetArr = [];
      // 请求单元
      if (type === "getUnitByBuildId") {
        PARAMS = "#BUILD_ID:" + value;
        resetArr = utils.deepClone(unitOpt);
        this.unitOpt = resetArr;
      }
      // 以单元请求房号
      if (type === "getHouseByUnitId") {
        PARAMS = "#UNIT_ID:" + value;
        resetArr = utils.deepClone(houseOpt);
        this.houseOpt = resetArr;
      }
      // 以楼栋请求房号
      if (type === "getHouseByBuildId") {
        PARAMS = "#BUILD_ID:" + value;
        resetArr = utils.deepClone(houseOpt);
        this.houseOpt = resetArr;
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      };
      this.$api.basics.getOptions(data).then(res => {
        if (res.data.code === "0") {
          // 房号可以直接挂在楼栋下当没有单元是，以楼栋id取请求房号
          if (!res.data.data.length && type === "getUnitByBuildId") {
            this.getOptions("getHouseByBuildId", value);
            return;
          }
          let result = res.data.data || [];
          resetArr.push(
            ...result.map(item => {
              return {
                label: item.C_TEXT,
                value: item.C_VALUE
              };
            })
          );
        }
      });
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode(code) {
      /**
       * 20  建筑形态
       * 60  房间用途
       */
      let data = {
        categoryCode: code
      };
      this.$api.basics.queryNodesByRootCode(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode + "," + item.typeId,
              ...item
            };
          });
          // 建筑类型
          if (code === "20") {
            this.houseCategoryOpt = [
              ...utils.deepClone(houseCategoryOpt),
              ...resultArr
            ];
          }
          // 房间用途
          if (code === "60") {
            this.resTypeOpt = [...utils.deepClone(resTypeOpt), ...resultArr];
          }
        }
      });
    },
    // 根据业态Id 获取下面的子节点 请求房间类型
    queryChildNodesById(typeId) {
      let data = { typeId };
      this.$api.basics.queryChildNodesById(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode + "," + item.typeId,
              ...item
            };
          });
          this.houseTypeOpt = [...utils.deepClone(houseTypeOpt), ...resultArr];
        }
      });
    },
    // 显示房间资料导入弹窗
    showHouseDataImport() {
      this.$refs.houseDataImport.visible = true;
    },
    // 显示房间导出弹出
    openExportModal() {
      this.$refs.houseExport.visible = true;
    },
    // 显示批量更新弹窗
    openImportModal() {
      this.$refs.eportAndDownFile.visible = true;
    },
    // 上传文件
    uploadHouseFile(file) {
      // this.$refs.eportAndDownFile.hideModal()
      console.log("批量更新", file);
      let fileData = new FormData();
      fileData.append("acctHouseCodeFile", file);
      let loadingName = this.SG_Loding("导入中...");
      this.$api.building.acctHouseCodeImport(fileData).then(
        res => {
          if (res.data.code === "0") {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success("导入成功！");
              this.query();
            });
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$refs.downErrorFile.visible = true;
              this.upErrorInfo = res.data.message;
            });
          }
        },
        () => {
          this.DE_Loding(loadingName).then(res => {
            this.$SG_Message.error("导入失败！");
          });
        }
      );
    },
    // 导入房间资料成功
    houseDataImportSuccess() {
      this.query();
    },
    // 操作事件函数
    operationFun(type, record) {
      console.log("操作事件", type, record);
      if (["edit", "copy", "detail"].includes(type)) {
        this.goPage(type, record);
      }
      if (["on", "off"].includes(type)) {
        this.$SG_Modal.confirm({
          content: `确定${type === "on" ? "启用" : "禁用"}该房间吗?`,
          okText: "确定",
          cancelText: "关闭",
          onOk: () => {
            let data = {
              houseId: record.houseId,
              status: type === "on" ? "1" : "0"
            };
            this.$api.building.updateHouseStatus(data).then(res => {
              if (res.data.code === "0") {
                this.$SG_Message.success(
                  `${type === "on" ? "启用" : "禁用"}成功！`
                );
                this.query();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        });
      }
    },
    // 页面跳转
    goPage(type, record) {
      // 存储缓存搜索缓存数据
      let o = {
        ...this.queryConditionStore,
        organName: this.organName || "",
        showKey: "house"
      };
      console.log("存=>", this.searchBuildName);
      if (this.searchBuildName) {
        o.searchBuildName = this.searchBuildName;
      }
      this.SET_ROUTE_QUERY(this.$route.path, o);
      let query = { type };
      query.organId = this.queryCondition.organId
      query.selectedOrganName = this.selectedOrganName
      if (["edit", "copy", "detail"].includes(type)) {
        query.houseId = record.houseId
        query.searchBuildName = this.searchBuildName || "";
      }
      this.$router.push({ path: operationTypes[type], query: query || {} });
    },
    // 楼栋搜索
    handleSearch(value) {
      this.searchBuildName = value;
      this.debounceMothed();
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function() {
      this.queryBuildList(
        this.queryCondition.organId,
        this.searchBuildName || ""
      );
    }, 300),
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>
<style lang="less" scoped>
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>

