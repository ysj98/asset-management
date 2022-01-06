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
            <SG-Button v-if="createPower" class="mr10" type="info" @click="appendVisible = true">新增</SG-Button>
          </div>
          <div style="overflow: visible;margin-right: 10px;margin-top: 0px;">
            <top-organ-by-user
              :hasAll="false"
              :selectFirst="true"
              @change="handleOrganChange"
              v-model="queryCondition.organId"
              style="display: inline-block;vertical-align: bottom;"
              :formStyle="{ width: '170px', verticalAlign: 'bottom', }"
            />
            <dict-select
              style="width: 170px;margin-left: 10px;margin-top: -10px"
              :dict-options="statusOptions"
              v-model="queryCondition.status"
            />
            <a-input style="width: 170px;margin-left: 10px;" v-model="queryCondition.attrName" placeholder="请输入业务属性名称" />
            <SG-Button style="margin-left: 10px;margin-top: -2px" @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
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
          <template slot="status" slot-scope="text, record">
            <a-switch :checked="String(record.status) === '1'" disabled active-value="1"/>
          </template>
          <template slot="operate" slot-scope="text, record">
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
            v-model="queryCondition.pageNum"
            @change="handleChange"/>
      </div>
    </div>
    <append-dialog
      :organObject="organObject"
      :object="selectItem"
      :visible="appendVisible"
      @submit="handleAppendSubmit"
      @close="handleAppendClose"/>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import AppendDialog from "./components/AppendDialog";
import {
  columns,
  queryCondition, statusOptions,
} from "./dict.js";
import SearchContainer from "../../common/SearchContainer";
import TopOrganByUser from "../../common/topOrganByUser";
import DictSelect from "../../common/DictSelect";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
import {utils} from "../../../utils/utils";
import {queryAssetAttrConfig} from "../../../api/attrConfig";
import OperationPopover from "../../../components/OperationPopover";

export default {
  components: {
    OperationPopover,
    DictSelect,
    TopOrganByUser,
    SearchContainer,
    noDataTips,
    AppendDialog,
  },
  data() {
    return {
      selectItem: undefined, // 选中的元素
      organObject: undefined, // 组织机构
      queryCondition,
      statusOptions,
      appendVisible: false,
      typeFilter,
      ASSET_MANAGEMENT,
      table: {
        columns,
        dataSource: [{color: ''}],
        loading: false,
        totalCount: 0,
      },
      topOrganId: '',
      createPower: false, // 新建
      toggle: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init () {
      this.handlePower()
      this.queryCondition.assetType = this.$store.state.ASSET_TYPE_CODE.LAND
      this.queryCondition.pageNum = 1
      this.query()
    },
    handleColorSelectVisible (record) {
      console.log('handleColorSelectVisible')
      this.colorSelectVisible = true
      this.$set(this,'selectItem',record)
    },
    handleAppendSubmit () {
      this.appendVisible = false
      this.selectItem = undefined
      this.init()
    },
    handleAppendClose () {
      this.appendVisible = false
      this.selectItem = undefined
    },
    operationFun (type, record) {
      switch (type) {
        case "edit":
          this.$set(this,'selectItem',record)
          this.appendVisible = true
          break;
        case "enable":
          this.updateAssetAttrConfig(record,1)
          break;
        case "disable":
          this.updateAssetAttrConfig(record,0)
          break
      }
    },
    //////////////////////////////////////////////////////
    async query() {
      let data = {
        ...this.queryCondition,
      };
      console.log(data)
      this.table.dataSource = []
      this.table.totalCount = 0
      if (!data.organId) {return}
      this.queryAssetAttrConfig(data)
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    // 处理按钮权限
    handlePower() {
      if (this.$power.has(ASSET_MANAGEMENT.CUSTOM_CODE_LAND_ADD)) {
        this.createPower = true;
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
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 生成操作按钮
    createOperationBtn() {
      // 审批状态
      let arr = [];
      if (this.$power.has(ASSET_MANAGEMENT.CUSTOM_CODE_LAND_EDIT)) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.CUSTOM_CODE_LAND_CHANGE)) {
        arr.push({ iconType: "edit", text: "启用", editType: "enable" });
        arr.push({ iconType: "edit", text: "停用", editType: "disable" });
      }
      return arr;
    },
    /**************************************************** **/
    async queryAssetAttrConfig (params) {
      try {
        this.table.loading = true;
        const {data: res} = await this.$api.attrConfig.queryAssetAttrConfig(params);
        if (String(res.code) === "0") {
          this.table.dataSource = (res.data.data || []).map(item => {
            return {
              ...item,
              operationDataBtn: this.createOperationBtn(),
            }
          });
          this.table.totalCount = res.data.count;
        } else {
          this.$SG_Message.error(res.message)
        }
      } finally {
        this.table.loading = false;
      }
    },
    async updateAssetAttrConfig (record, status) {
      const { id, organId} = record
      const params = {
        id,
        status,
        organId: String(organId)
      }
      let loadingName = this.SG_Loding("更新中...");
      try{
        const { data: res } = await this.$api.attrConfig.updateAssetAttrConfig(params)
        this.DE_Loding(loadingName)
        if (String(res.code) === "0") {
          this.$SG_Message.success("更新成功")
          this.query()
        } else {
          this.$SG_Message.error(res.message)
        }
      }finally {
        this.DE_Loding(loadingName)
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

