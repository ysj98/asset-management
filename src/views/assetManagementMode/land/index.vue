<!--
 * @Date: 2020-07-10 10:02:56
 * @Description: 土地信息
-->
<template>
  <div class="landInfo-page pb70">
    <SearchContainer :value="false" :contentStyle="{paddingTop: toggle?'16px': 0, overflow: 'visible'}">
      <div slot="headerForm" class="search-content-box">
      <div style="overflow: visible;margin-right: 10px">
        <top-organ-by-user
          :hasAll="false"
          :selectFirst="true"
          v-model="queryCondition.organId"
          :formStyle="{ width: '170px', verticalAlign: 'bottom' }"
        />
      </div>
      </div>
    </SearchContainer>

    <div class="create-form">
      <!-- 搜索框 -->
      <!-- 表格部分 -->
      <div style="padding-top: 50px">
        <a-table
            class="custom-table td-pd10"
            :loading="table.loading"
            :pagination="false"
            bordered
            align="center"
            :columns="table.columns"
            :dataSource="table.dataSource"
            :locale="{emptyText: '暂无数据'}"
            :scroll="{x: 1200}"
        >
          <template slot="assetOperationModes" slot-scope="text, record">
            <coloe-select v-if="record.color" v-model="record.color" @click.native="handleColorSelectVisible(record)" />
            <a-button v-else type="link"  @click.native="handleAssetOperationVisible(record)">添加业务属性</a-button>
          </template>
          <template slot="TCYS" slot-scope="text, record">
            <coloe-select v-if="record.color" v-model="record.color" @click.native="handleColorSelectVisible(record)" />
            <a-button v-else type="link"  @click.native="handleColorSelectVisible(record)">设定</a-button>
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
    <color-select-dialog
      :visible="colorSelectVisible"
      :value="selectItem.color"
      @close="()=>colorSelectVisible = false"
      @submit="handleColorSelectSubmit"
    />
    <asset-operation-modes-dialog
        :organ-id="queryCondition.organId"
        :visible="assetOperationModelVisible"
        :value="selectItem.color"
        @close="()=>assetOperationModelVisible = false"
        @submit="handleAssetOperationModesSubmit"
    />
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import {
  operationTypes,
  columns,
  queryCondition,
} from "./dict.js";
import ColoeSelect from "./components/coloeSelect";
import ColorSelectDialog from "./components/ColorSelectDialog";
import AssetOperationModesDialog from "./components/AssetOperationModesDialog";
import SearchContainer from "../../common/SearchContainer";
import TopOrganByUser from "../../common/topOrganByUser";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
    TopOrganByUser,
    SearchContainer,
    AssetOperationModesDialog,
    ColorSelectDialog,
    ColoeSelect,
    noDataTips,
    OperationPopover,
  },
  data() {
    return {
      selectItem: {}, // 选中的元素
      queryCondition,
      colorSelectVisible: false,
      assetOperationModelVisible: false,
      typeFilter,
      ASSET_MANAGEMENT,
      installValue: [], // 安装日期
      expValue: [], // 报废日期
      hasPowerExport: false, // 导出按钮权限
      table: {
        columns,
        dataSource: [{color: ''}],
        loading: false,
        totalCount: 0,
      },
      topOrganId: '',
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
    handleColorSelectVisible (record) {
      console.log('handleColorSelectVisible')
      this.colorSelectVisible = true
      this.selectItem = record
    },
    handleAssetOperationVisible (record) {
      console.log('handleAssetOperationVisible')
      this.assetOperationModelVisible = true
      this.selectItem = record
    },
    handleColorSelectSubmit (val) {
      this.selectItem.color = val;
      this.colorSelectVisible = false
    },
    handleAssetOperationModesSubmit(val){
      console.log(val)
      this.assetOperationModelVisible = false
    },
    //////////////////////////////////////////////////////
    async query() {
      let data = {
        ...this.queryCondition,
        // communityId: this.queryCondition.communityId.join(","),
        systemCode: "assets",
        organId: ""
      };
      let organId = ""
      data.organId = organId
      delete data.communityId
      this.table.dataSource = [{}]
      this.table.totalCount = 0
      try {
        this.table.loading = true;
      } finally {
        this.table.loading = false;
      }
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNo = 1;
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNo = data.pageNo;
      this.queryCondition.pageLength = data.pageLength;
      this.query();
    },
    // 处理按钮权限
    handlePower() {
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_EQUIPMENT_CREATE)) {
        this.createPower = true;
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BUILDLAND_EXPORT)) {
        this.hasPowerExport = true
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

