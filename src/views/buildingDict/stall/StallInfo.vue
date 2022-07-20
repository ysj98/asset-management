<!--
 * @Date: 2020-07-10 10:02:56
 * @Description: 土地信息
-->
<template>
  <div class="landInfo-page pb70">
    <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0, overflow: 'visible'}">
      <div slot="headerForm" class="search-content-box">
        <div class="top-search-one" style="padding: 0;">
          <div>
            <SG-Button
                v-if="createPower"
                @click="goPage('create')"
                class="mr10"
                icon="plus"
                type="primary"
            >新增</SG-Button>
            <SG-Button
                v-if="hasPowerExport && false"
                @click="exportList"
                class="mr10">
              <segiIcon type="#icon-ziyuan10" class="mr10" />导出
            </SG-Button>
            <SG-Button v-if="stallImportButton" @click="showStallDataImport"><segiIcon type="#icon-ziyuan4" class="mr10"/>批量导入</SG-Button>
          </div>
          <div style="overflow: visible;margin-top:-10px;">
            <a-checkbox :checked="Boolean(queryCondition.isOnlyCurrent)" @change="changeChecked" style="margin-top: 7px;margin-right: 10px;" :style="allWidth">
              仅当前机构下车位
            </a-checkbox>
            <!-- 公司 -->
            <treeSelect :typeFilter="typeFilter"  @changeTree="organIdChange"  placeholder='请选择组织机构' :allowClear="false" :style="allWidth"></treeSelect>
            <!-- 全部运营项目-->
<!--                mode="multiple"-->
            <a-select
                showSearch
                placeholder="请选择运营项目"
                v-model="queryCondition.communityId"
                @change="communityIdSelect"
                :maxTagCount="1"
                optionFilterProp="children"
                :style="allWidth"
                :options="$addTitle(communityIdOpt)"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
            />
            <!-- 车场 -->
            <a-select
                showSearch
                placeholder="请选择车场"
                v-model="queryCondition.placeId"
                optionFilterProp="children"
                :style="allStyle"
                :options="parkTypeOpt"
                :allowClear="false"
                :filterOption="filterOption"
                @search="handleSearch"
                @change="handleParkChange"
                notFoundContent="没有查询到数据"
            />
            <!-- 资产名称或编码 -->
            <a-input
                :maxLength="30"
                placeholder="车位名称/编码"
                v-model="queryCondition.parkingPlaceStr"
                :style="allStyle"
            />
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
          </div>
        </div>
      </div>
      <div slot="contentForm">
        <div class="top-search-one" style="padding: 0;">
          <div style="overflow: visible;margin-top:-10px;position: absolute;right: 155px;">
            <!-- 全部土地类型 -->
            <dict-select
                :style="allStyle"
                placeholder="请选择车位类型"
                :dict-options="carTypeOptions"
                v-model="queryCondition.objType"
                menu-code="PARKING_OBJ_TYPE"
                @change="handleCarTypeChange"
            />
            <dict-select
                :style="allStyle"
                placeholder="请选择车位状态"
                :dict-options="carStatusOpt"
                v-model="queryCondition.objStatus"
                :menu-code="carType"
            />
            <a-select
                :style="allWidth"
                :options="$addTitle(parkAreaOpt)"
                :default-active-first-option="false"
                v-model="queryCondition.parkingAreaId"
            />
          </div>
        </div>
      </div>
    </SearchContainer>

    <div class="create-form">
      <!-- 搜索框 -->
      <!-- 表格部分 -->
      <div>
        <a-table
          class="custom-table td-pd10 custom-total-one"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
          :scroll="{x: 1200}"
        >
          <template slot="matchingName" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <OperationPopover
              :operationData="record.operationDataBtn"
              @operationFun="operationFun($event, record)"
            ></OperationPopover>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="fixed"
          v-model="queryCondition.pageNo"
          @change="handleChange"
        />
      </div>
    </div>
    <stallDataImport 
    title="导入数据" ref="stallDataImport" 
    :organIdCopy="queryCondition.organId"
    :defaultOrganName="selectedOrganName"
    @success="stallImportSuccess"
   ></stallDataImport>
  </div>
</template>
<script>
import SearchContainer from "@/views/common/SearchContainer";
import noDataTips from "@/components/noDataTips";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from "@/components/segiIcon.vue";
import { utils, getFormat } from "@/utils/utils";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import stallDataImport from './stallDataImport.vue'
import {
  operationTypes,
  allStyle,
  columns,
  queryCondition,
  communityIdOpt,
  parkTypeOpt,
  carTypeOptions,
  carTypeMenu, parkAreaOpt,carStatusOpt
} from "./dict.js";
import {tablePageList} from './mock'
import DictSelect from "../../common/DictSelect";
import {stallApiDelete, stallApiExport, stallApiPageList} from "../../../api/building";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
    DictSelect,
    TreeSelect,
    noDataTips,
    segiIcon,
    OperationPopover,
    SearchContainer,
    stallDataImport
  },
  data() {
    return {
      stallImportButton: false,
      typeFilter,
      ASSET_MANAGEMENT,
      carTypeOptions,
      carTypeMenu,
      carStatusOpt,
      carType: '',
      hasPowerExport: false, // 导出按钮权限
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      communityIdOpt: utils.deepClone(communityIdOpt),
      parkTypeOpt: utils.deepClone(parkTypeOpt), // 车场
      parkAreaOpt: utils.deepClone(parkAreaOpt), // 区域
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
      createPower: false, // 新建
      editPower: false, // 编辑
      deletePower: false, // 删除
      toggle: false
    };
  },
  watch: {
    $route() {
      if (
        this.$route.path === "/buildingDict" &&
        this.$route.query.refresh &&
        this.$route.query.showKey === "stall"
      ) {
        this.queryCondition.pageNo = 1;
        this.queryCondition.pageLength = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.handlePower();
  },
  methods: {
    stallImportSuccess () {
      this.query()
    },
    query() {
      let data = {
        ...this.queryCondition,
        // communityId: this.queryCondition.communityId.join(","),
      };
      this.table.loading = true;
      this.$api.building.stallApiPageList(data).then(({data: res}) => {
      this.table.loading = false;
        if (res.code === "0") {
          let result = res.data.resultList || [];
          let btnArr = this.createOperationBtn();
          this.table.dataSource = result.map((item) => {
            return {
              key: utils.getUuid(),
              ...item,
              floorArea: getFormat(item.floorArea, '') || "-",
              useArea: getFormat(item.useArea, '') || "-",
              shareArea: getFormat(item.shareArea, '') || "-",
              operationDataBtn: btnArr,
            };
          });
          this.table.totalCount = res.data.Paginator.totalCount || 0;
          this.table.dataSource.length && this.table.dataSource.push({
            parkingId: '合计',
            floorArea: getFormat(res.data.dataTotal.floorAreaTotal, '') || "-",
            useArea: getFormat(res.data.dataTotal.shareAreaTotal, '') || "-",
            shareArea: getFormat(res.data.dataTotal.useAreaTotal, '') || "-",
          })
        } else {
          this.$message.error(res.message);
          this.table.loading = false;
        }
      })
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNo = 1;
      this.query();
    },
    // 查询项目
    queryCommunityListByOrganId() {
      let data = {
        organId: this.queryCondition.organId,
      };
      this.$api.basics.queryCommunityListByOrganId(data).then((res) => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let resultArr = result.map((item) => {
            return {
              label: item.name,
              value: item.communityId,
              ...item,
            };
          });
          this.communityIdOpt = [
            ...utils.deepClone(communityIdOpt),
            ...resultArr,
          ];
        }
      });
    },
    // orangId改变
    organIdChange(organId,organName) {
      console.log("一级物业改变", organId);
      this.organName = organName;
      if (!organId) {
        return;
      }
      this.queryCondition.communityId = '' // [""]
      this.queryCondition.placeId= ''
      this.queryCondition.organId = organId
      this.queryCommunityListByOrganId();
      // 异步接口
      this.searchQuery();
      this.parkApiList();
    },
    communityIdSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.communityId = this.handleMultipleSelectValue(
          value,
          this.queryCondition.communityId,
          this.communityIdSelect
        );
      });
    },
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf("") !== -1;
      let len = data.length;
      // 如果点击全选或者取消全选
      if (data[len - 1] === "" || len === 0) {
        return (data = [""].join(","));
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === dataOptions.length - 1) {
        return (data = [""].join(","));
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(""), 1);
      }
      return data.join(",");
    },
    // 生成操作按钮
    createOperationBtn() {
      // 审批状态
      let arr = [];
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_STALL_EDIT)) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_STALL_DELETE)) {
        arr.push({ iconType: "delete", text: "删除", editType: "delete" });
      }
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
    // 处理按钮权限
    handlePower() {
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_STALL_CREATE)) {
        this.createPower = true;
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BUILDLAND_EXPORT)) {
        this.hasPowerExport = true
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_STALL_IMPORT)) {
        this.stallImportButton = true
      }
    },
    showStallDataImport () {
      this.$refs.stallDataImport.visible = true
    },
    // 删除车位
    handleDel(record) {
      this.$SG_Modal.confirm({
        content: `确定要删除该车位信息吗?`,
        okText: "确定",
        cancelText: "关闭",
        onOk: () => {
          let data = {
            organId: record.organId,
            placeId: record.placeId,
            parkingId: record.parkingId
          };
          this.$api.building.stallApiDelete(data).then((res) => {
            if (String(res.data.code) === "0") {
              this.$message.success("删除成功!");
              this.query();
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    exportList() {
      if(!this.queryCondition.organId) {
        this.$message.warn("请选择组织机构")
        return
      }
      let data = {
        ...this.queryCondition,
        communityId: this.queryCondition.communityId.join(","),
      };
      delete data.pageNo;
      delete data.pageLength;
      this.$api.building.stallApiExport(data).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `楼盘字典车位信息.xls`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    importList () {},
    // 操作事件函数
    operationFun(type, record) {
      console.log("操作事件", type, record);
      if (["edit", "detail"].includes(type)) {
        this.goPage(type, record);
      }
      if (["delete"].includes(type)) {
        this.handleDel(record)
      }
    },
    goPage(type, record) {
      let query = Object.assign(
        {},
        {
          organId: this.queryCondition.organId,
          organName: this.organName,
          type,
        }
      );
      if (["edit", "detail"].includes(type)) {
        Object.assign(query, {
          placeId: record.placeId,
          parkingId: record.parkingId
        });
      }
      this.$router.push({ path: operationTypes[type], query: query || {} });
    },
    handleChange(data) {
      this.queryCondition.pageNo = data.pageNo;
      this.queryCondition.pageLength = data.pageLength;
      this.query();
    },
    // 搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 仅当先组织机构 1 选中, "" 不选中
    changeChecked (e) {
      this.queryCondition.isOnlyCurrent = Number(e.target.checked) ? "1" : ""
    },
    /* ******************************************************** */
    // 车场搜索
    handleSearch (key) {
      this.parkApiList({nameOrCode: key})
    },
    // 查询 车场列表
    parkApiList(data) {
      if(!this.queryCondition.organId) {
        this.$message.error('请选择所属机构');
        return
      }
      this.parkTypeOpt = utils.deepClone(parkTypeOpt)
      const params = {
        ...data,
        organId:  this.queryCondition.organId,
        pageNo: 1,
        pageLength:20
      }
      this.$api.building.parkApiList(params).then(({data: res}) => {
        if (res.code === "0") {
          let result = res.data.resultList || [];
          this.parkTypeOpt = result.map(item=>({value: item.placeId, label: item.placeName}))
          this.parkTypeOpt.unshift(...parkTypeOpt)
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 查询 区域
    parkAreaApiList (data) {
      this.$api.building.parkApiDetail(data).then((res) => {
        this.loading = false
        if (res.data.code === "0") {
          this.parkAreaOpt = (res.data.data.areaArray || []).map(item=>({value:item.parkingAreaId, label:item.areaName}))
          this.parkAreaOpt.unshift(...parkAreaOpt)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 车场 变化查询区域
    handleParkChange (ev) {
      this.queryCondition.parkingAreaId = ''
      this.parkAreaOpt = utils.deepClone(parkAreaOpt)
      if (!ev) return
      const params = {
        placeId: ev,
        organId: this.queryCondition.organId
      }
      this.parkAreaApiList(params)
    },
    handleCarTypeChange (ev) {
      this.queryCondition.objStatus = ''
      this.checkCarType(ev)
    },
    checkCarType(ev) {
      console.log(ev)
      switch (String(ev)) {
        case '0': // 临时
        case '1': // 固定
          this.carType = this.carTypeMenu.PARKING_OBJ_STATUS
          break;
        case '2': // 产权
          this.carType = this.carTypeMenu.PROPERTY_PARKING_OBJ_STATUS
          break;
        default:
          this.carType = undefined
          return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.top-search-one {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
</style>

