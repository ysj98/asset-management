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
            <!--            v-if="createPower"-->
            <SG-Button
                @click="goPage('create')"
                class="mr10"
                icon="plus"
                type="primary"
            >新增</SG-Button>
            <!--              v-if="hasPowerExport" -->
            <SG-Button
                @click="exportList"
                class="mr10">
              <segiIcon type="#icon-ziyuan10" class="mr10" />导出
            </SG-Button>
          </div>
          <div style="overflow: visible;margin-top:-10px;">
            <!-- 公司 -->
            <treeSelect :typeFilter="typeFilter"  @changeTree="organIdChange"  placeholder='请选择组织机构' :allowClear="false" :style="allWidth"></treeSelect>
            <!-- 全部运营项目-->
            <a-select
                showSearch
                placeholder="请选择运营项目"
                v-model="queryCondition.communityId"
                @change="communityIdSelect"
                mode="multiple"
                :maxTagCount="1"
                optionFilterProp="children"
                :style="allWidth"
                :options="$addTitle(communityIdOpt)"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
            />
            <!-- 全部土地类型 -->
            <a-select
                showSearch
                placeholder="请选择车场"
                v-model="queryCondition.landType"
                optionFilterProp="children"
                :style="allStyle"
                :options="$addTitle(parkTypeOpt)"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
            />
            <!-- 资产名称或编码 -->
            <a-input
                :maxLength="30"
                placeholder="车位名称/编码"
                v-model="queryCondition.queryName"
                :style="allStyle"
            />
            <a-checkbox :checked="Boolean(queryCondition.isCurrent)" @change="changeChecked" style="margin-top: 7px;margin-right: 10px;" :style="allWidth">
              仅当前机构下设备
            </a-checkbox>
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
          </div>
        </div>
      </div>
      <div slot="contentForm">
        <div class="top-search-one" style="padding: 0;">
          <div style="overflow: visible;margin-top:-10px;width: 950px;">
            <!-- 全部土地类型 -->
            <dict-select
                :style="allStyle"
                placeholder="请选择车场"
                v-model="queryCondition.landType"
                menu-code="PARKING_PLACE_RESOURCE_TYPE"
            />
            <dict-select
                :style="allStyle"
                placeholder="请选择车场"
                v-model="queryCondition.landType"
                menu-code="PARKING_PLACE_RESOURCE_TYPE"
            />
            <dict-select
                :style="allStyle"
                placeholder="请选择车场"
                v-model="queryCondition.landType"
                menu-code="PARKING_PLACE_RESOURCE_TYPE"
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
          class="custom-table td-pd10"
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
          :pageLength="queryCondition.pageLength"
          :totalCount="table.totalCount"
          location="fixed"
          v-model="queryCondition.pageNo"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SearchContainer from "@/views/common/SearchContainer";
import noDataTips from "@/components/noDataTips";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from "@/components/segiIcon.vue";
import { utils } from "@/utils/utils";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import {
  operationTypes,
  allStyle,
  columns,
  queryCondition,
  communityIdOpt,
  parkTypeOpt,
} from "./dict.js";
import {tablePageList} from './mock'
import DictSelect from "../../common/DictSelect";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
    DictSelect,
    TreeSelect,
    noDataTips,
    segiIcon,
    OperationPopover,
    SearchContainer
  },
  data() {
    return {
      typeFilter,
      ASSET_MANAGEMENT,
      hasPowerExport: false, // 导出按钮权限
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      communityIdOpt: utils.deepClone(communityIdOpt),
      parkTypeOpt: utils.deepClone(parkTypeOpt),
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
        this.$route.query.showKey === "equipment"
      ) {
        this.queryCondition.pageN0 = 1;
        this.queryCondition.pageLength = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.handlePower();
  },
  methods: {
    async query() {
      let data = {
        ...this.queryCondition,
        // communityId: this.queryCondition.communityId.join(","),
        systemCode: 'assets'
      };
      this.table.loading = true;
      try {
        const {data:res} = await this.$api.building.equipmentApiPageList(data)
        if (String(res.code) === "0") {
          let result = res.data.resultList || [];
          let btnArr = this.createOperationBtn();
          this.table.dataSource = result.map((item) => {
            return {
              key: utils.getUuid(),
              ...item,
              operationDataBtn: btnArr,
            };
          });
          this.table.totalCount = res.data.paginator.totalCount || 0;
        } else {
          this.$message.error(res.message);
        }
      } finally {
        this.table.loading = false;
      }

    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNo = 1;
      this.query();
    },
    // 查询土地类别
    queryLandType() {
      let data = {
        code: "PARKING_PLACE_RESOURCE_TYPE"
      };
      // this.$api.assets.getList(data) PARKING_PLACE_RESOURCE_TYPE
      // this.$api.basics.organDict(data)
      return this.$api.assets.platformDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.parkTypeOpt = utils.deepClone(parkTypeOpt);
          data.forEach((item) => {
            this.parkTypeOpt.push({
              value: item["value"],
              label: item["name"],
              // id: item["dictId"]
            });
          });
          this.queryCondition.landType = undefined;
        }
      });
    },
    queryCommunityListByOrganId() {
      let data = {
        topOrganId: this.queryCondition.topOrganId
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
      this.queryCondition.topOrganId = organId
      this.queryCommunityListByOrganId();
      // 异步接口
      if (this.parkTypeOpt.length === 1) {
        Promise.all([this.queryLandType()]).then(
          () => {
            this.searchQuery();
          }
        );
      } else {
        this.searchQuery();
      }
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
        return (data = [""]);
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === dataOptions.length - 1) {
        return (data = [""]);
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(""), 1);
      }
      return data;
    },
    // 生成操作按钮
    createOperationBtn() {
      // 审批状态
      let arr = [];
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_LAND_EDIT) || true) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_LAND_DELETE) || true) {
        arr.push({ iconType: "delete", text: "删除", editType: "delete" });
      }
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
    // 处理按钮权限
    handlePower() {
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_LAND_CREATE)) {
        this.createPower = true;
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BUILDLAND_EXPORT)) {
        this.hasPowerExport = true
      }
    },
    exportList() {
      let data = {
        ...this.queryCondition,
        communityId: this.queryCondition.communityId.join(","),
      };
      delete data.pageNo;
      delete data.pageLength;
      this.$api.building.blankApiExport(data).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `楼盘字典设备信息.xls`;
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
        this.$SG_Modal.confirm({
          title: `确定要删除该设备信息吗?`,
          okText: "确定",
          cancelText: "关闭",
          onOk: () => {
            let data = {
              topOrganId: this.queryCondition.topOrganId,
              blankId: record.blankId,
            };
            this.$api.building.blankApiDelete(data).then((res) => {
              if (res.data.code === "0") {
                this.$message.success("删除成功!");
                this.query();
              } else {
                this.$message.error(res.data.message);
              }
            });
          },
        });
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
          equipmentInstId: record.equipmentInstId,
          topOrganId: record.topOrganId
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
    changeChecked (e) {
      this.queryCondition.isCurrent = Number(e.target.checked)
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

