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
            <SG-Button class="mr10" type="info" @click="appendVisible = true">新增</SG-Button>
          </div>
          <div style="overflow: visible;margin-right: 10px">
            <top-organ-by-user
              :hasAll="false"
              :selectFirst="true"
              @change="handleOrganChange"
              :formStyle="{ width: '170px', verticalAlign: 'bottom', }"
            />
          </div>
        </div>
      </div>
    </SearchContainer>

    <div class="create-form">
      <!-- 搜索框 -->
      <!-- 表格部分 -->
      <div style="padding-top: 50px">
        <a-table
            class="custom-table"
            :loading="table.loading"
            :pagination="false"
            bordered
            align="center"
            :columns="table.columns"
            :dataSource="table.dataSource"
            :locale="{emptyText: '暂无数据'}"
            :scroll="{x: 1200}"
        >
          <template slot="state" slot-scope="text, record">
            <a-switch :checked="true" @click="handleChangeStatus(record)" :active-value="1"/>
          </template>
          <template slot="operate" slot-scope="text, record">
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
    <append-dialog
      :organObject="organObject"
      :visible="appendVisible"
      @submit="appendVisible = false"
      @close="appendVisible = false"/>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import AppendDialog from "./components/AppendDialog";
import {
  operationTypes,
  columns,
  queryCondition,
} from "./dict.js";
import SearchContainer from "../../common/SearchContainer";
import TopOrganByUser from "../../common/topOrganByUser";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
    TopOrganByUser,
    SearchContainer,
    noDataTips,
    AppendDialog,
  },
  data() {
    return {
      selectItem: {}, // 选中的元素
      organObject: undefined, // 组织机构
      queryCondition,
      appendVisible: false,
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
  mounted() {
    this.handlePower();
  },
  methods: {
    handleColorSelectVisible (record) {
      console.log('handleColorSelectVisible')
      this.colorSelectVisible = true
      this.selectItem = record
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
    handleColorSelectSubmit (val) {
      this.selectItem.color = val;
      this.colorSelectVisible = false
    },
    handleChangeStatus (record) {
      this.$confirm({
        title: "是否改变当前状态"
      })
    },
    // 组织机构树变化
    handleOrganChange (organObject) {
      this.organObject = organObject
    }
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

