<!--
 * @Date: 2020-07-10 10:02:56
 * @Description: 土地信息
-->
<template>
  <div class="landInfo-page pb70">
    <SearchContainer
      :value="false"
      :contentStyle="{ paddingTop: toggle ? '16px' : 0, overflow: 'visible' }"
    >
      <div slot="headerForm" class="search-content-box">
        <div style="overflow: visible; margin-right: 10px">
          <top-organ-by-user
            :hasAll="false"
            :selectFirst="true"
            @change="handleTreeChange"
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
          :locale="{ emptyText: '暂无数据' }"
          :scroll="{ x: 1200 }"
        >
          <template slot="assetOperationModes" slot-scope="text, record">
            <template v-for="(item, index) of record.assetOperationModes">
              <span style="font-size: 14px; margin-right: 10px" :key="index">{{
                item.attrCode
              }}</span>
            </template>
            <a-button
              v-if="record.isEdit"
              type="link"
              @click.native="handleAssetOperationVisible(record)"
              >添加业务属性</a-button
            >
          </template>
          <template slot="modeColour" slot-scope="text, record">
            <template v-if="record.isEdit">
              <coloe-select
                v-if="record.modeColour"
                v-model="record.modeColour"
                @click.native="handleColorSelectVisible(record)"
              />
              <a-button
                v-else
                type="link"
                @click.native="handleColorSelectVisible(record)"
                >设定</a-button
              >
            </template>
            <template v-else>
              <coloe-select
                v-if="record.modeColour"
                v-model="record.modeColour"
              />
            </template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editPower">
              <template v-if="!record.isEdit">
                <a-button type="link" @click.native="handleEdit(record)"
                  >编辑</a-button
                >
              </template>
              <template v-else>
                <a-button type="link" @click.native="handleSave(record)"
                  >保存</a-button
                >
                <a-button type="link" @click.native="handleClose(record)"
                  >取消</a-button
                >
              </template>
            </template>
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
      :value="selectItem.modeColour"
      @close="() => (colorSelectVisible = false)"
      @submit="handleColorSelectSubmit"
    />
    <asset-operation-modes-dialog
      :organ-id="queryCondition.organId"
      :visible="assetOperationModelVisible"
      :value="selectItem.color"
      @close="() => (assetOperationModelVisible = false)"
      @submit="handleAssetOperationModesSubmit"
    />
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import { typeFilter } from "@/views/buildingDict/buildingDictConfig";
import { operationTypes, columns, queryCondition } from "./dict.js";
import ColoeSelect from "./components/coloeSelect";
import ColorSelectDialog from "./components/ColorSelectDialog";
import AssetOperationModesDialog from "./components/AssetOperationModesDialog";
import SearchContainer from "../../common/SearchContainer";
import TopOrganByUser from "../../common/topOrganByUser";
import { updateAssetAttrConfig } from "../../../api/assetOperationMode";
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px",
};
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
      selectItemCache: "",
      selectItem: {}, // 选中的元素
      queryCondition,
      colorSelectVisible: false,
      assetOperationModelVisible: false,
      typeFilter,
      ASSET_MANAGEMENT,
      table: {
        columns,
        dataSource: [{ color: "" }],
        loading: false,
        totalCount: 0,
      },
      topOrganId: "",
      toggle: false,
    };
  },
  mounted() {
    this.handlePower();
  },
  methods: {
    handleTreeChange() {
      this.$nextTick(() => {
        this.query();
      });
    },
    handleEdit(record) {
      if (this.table.dataSource.findIndex((item) => item.isEdit) !== -1) {
        this.$SG_Message.error("请保存其它编辑的数据");
        return;
      }
      this.selectItemCache = JSON.stringify(record);
      record.isEdit = true;
    },
    handleClose(record) {
      record = JSON.parse(this.selectItemCache);
    },
    handleSave(record) {
      this.$SG_Modal.confirm({
        content: `确定要保存信息吗?`,
        okText: "确定",
        cancelText: "关闭",
        onOk: async () => {
          await this.updateAssetAttrConfig(record);
          await this.query();
        },
      });
    },
    handleColorSelectVisible(record) {
      console.log("handleColorSelectVisible");
      this.colorSelectVisible = true;
      this.selectItem = record;
    },
    handleAssetOperationVisible(record) {
      console.log("handleAssetOperationVisible");
      this.assetOperationModelVisible = true;
      this.selectItem = record;
    },
    handleColorSelectSubmit(val) {
      this.selectItem.modeColour = val;
      this.colorSelectVisible = false;
    },
    handleAssetOperationModesSubmit(val) {
      console.log(val);
      this.selectItem.assetOperationModes = val;
      this.assetOperationModelVisible = false;
    },
    //////////////////////////////////////////////////////
    async query() {
      let params = {
        organId: this.queryCondition.organId,
        assetType: this.$store.state.ASSET_TYPE_CODE.LAND,
        pageNum: this.queryCondition.pageNo,
        pageSize: this.queryCondition.pageLength,
      };
      this.table.dataSource = [];
      this.table.totalCount = 0;
      try {
        this.table.loading = true;
        const { data: res } =
          await this.$api.assetOperationMode.queryAssetAttrConfig(params);
        if (String(res.code) === "0") {
          this.table.dataSource = (res.data.data || []).map((item) => ({
            ...item,
            isEdit: false,
            editPower: this.$power.has(ASSET_MANAGEMENT.ASSET_FUNCTION_EDIT),
          }));
          this.table.totalCount = res.data.count;
        } else {
          this.$SG_Message.error(res.message);
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
        this.hasPowerExport = true;
      }
    },
    /////////////////////////////////////////////
    async updateAssetAttrConfig(record) {
      try {
        const { modeOperId, modeColour, assetOperationModes } = record;
        const params = {
          assetType: this.$store.state.ASSET_TYPE_CODE.LAND,
          organId: this.queryCondition.organId,
          modeOperId,
          assetOperationModes: (assetOperationModes || []).map((item) => ({
            attrConfigId: item.attrConfigId,
          })),
          modeColour,
        };
        const { data: res } =
          await this.$api.assetOperationMode.updateAssetAttrConfig(params);
        if (String(res.code) === "0") {
          record.isEdit = false;
          this.$SG_Message.success("操作成功");
        } else {
          this.$SG_Message.error(res.message);
        }
      } finally {
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
