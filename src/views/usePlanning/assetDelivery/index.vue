<!--
 * @Author: L
 * @Date: 2020-11-03 16:32:18
 * @LastEditTime: 2020-11-16 10:27:18
 * @Description: 资产交付管理
-->
<template>
  <div class="assetsRegistration">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <a-button
          icon="plus"
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_DELIVERY_NEW"
          @click="newChangeSheetFn"
        >新建交付单</a-button>
        <SG-Button v-power="ASSET_MANAGEMENT.ASSET_DELIVERY_EXPORT" class="ml10" type="primary" @click="downloadFn">导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect
            @changeTree="changeTree"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="allStyle"
          ></treeSelect>
          <a-input-search v-model="queryCondition.deliveryNameOrId" placeholder="交付单号/名称" maxlength="30" :style="allStyle" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          :style="allStyle"
          :allowClear="true"
          mode="multiple"
          :maxTagCount="1"
          v-model="queryCondition.projectId"
          :options="$addTitle(projectData)"
          placeholder="请选择资产项目"
          :filterOption="filterOption"
          :loading="loading && !projectData.length"
        ></a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          placeholder="全部资产类型"
          :tokenSeparators="[',']"
          @select="changeAssetType"
          v-model="queryCondition.assetType"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in assetTypeData"
            :key="index"
            :value="item.value"
          >{{item.name}}</a-select-option>
        </a-select>
        <a-select
          :style="allStyle"
          placeholder="全部交付类型"
          v-model="queryCondition.deliveryType"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in changeTypeData"
            :key="index"
            :value="item.value"
          >{{item.name}}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          style="width: 160px; margin-right: 10px;"
          mode="multiple"
          placeholder="全部状态"
          :tokenSeparators="[',']"
          @select="approvalStatusFn"
          v-model="queryCondition.approvalStatus"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in approvalStatusData"
            :key="index"
            :value="item.value"
          >{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <segi-range-picker
            :disabledDateType="false"
            label="交付日期"
            :defaultValue="undefined"
            :allowClear="true"
            :canSelectToday="true"
            @dateChange="onDateChange"
          ></segi-range-picker>
        </div>
      </div>
    </SG-SearchContainer>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover
            :operationData="record.operationData"
            @operationFun="operationFun(record, $event)"
          ></OperationPopover>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 结束交付 -->
    <terminationDelivery ref="deliveryRef" @submitFn="query"></terminationDelivery>
  </div>
</template>

<script>
import {generateTableAreaByAssetTypeString} from '@/utils/utils'
import SegiRangePicker from "@/components/SegiRangePicker";
import TreeSelect from "../../common/treeSelect";
import moment from "moment";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import noDataTips from "@/components/noDataTips";
import OverviewNumber from "@/views/common/OverviewNumber";
import OperationPopover from "@/components/OperationPopover";
import terminationDelivery from './child/terminationDelivery'
const approvalStatusData = [
  { name: "全部状态", value: '' },
  { name: "草稿", value: "0" },
  { name: "待审批", value: "2" },
  { name: "已驳回", value: "3" },
  { name: "已审批", value: "1" },
  { name: "已取消", value: "4" }
];
const columns = [
  { title: "交付单编号", dataIndex: "deliveryId", width: 110 },
  { title: "交付单名称", dataIndex: "deliveryName" },
  { title: "所属机构", dataIndex: "organName" },
  { title: "资产项目", dataIndex: "projectName" },
  { title: "资产类型", dataIndex: "assetTypeName" },
  { title: "交付类型", dataIndex: "deliveryTypeName" },
  { title: "交付单位", dataIndex: "deliveryCompany" },
  { title: "交付资产数量", dataIndex: "assetChangeCount", width: 100 },
  { title: "交付面积(㎡)", key: "deliveryArea", width: 100,
    customRender(record){
      return generateTableAreaByAssetTypeString({keyStr:'deliveryArea',record,assetTypeName:record.assetTypeName})
    }
  },
  { title: "交付日期", dataIndex: "deliveryDate" },
  { title: "结束日期", dataIndex: "endDate" },
  { title: "创建人", dataIndex: "createByName" },
  { title: "创建日期", dataIndex: "createTime" },
  { title: "状态", dataIndex: "approvalStatusName" },
  { title: "操作", dataIndex: "operation", width: 90, scopedSlots: { customRender: "operation" }}
];
export default {
  components: {
    TreeSelect,
    OverviewNumber,
    SegiRangePicker,
    noDataTips,
    OperationPopover,
    terminationDelivery
  },
  props: {},
  data() {
    return {
      toggle: false,
      // scrollHeight: {y: 0},
      ASSET_MANAGEMENT,
      isChild: false,
      loading: false,
      noPageTools: false,
      location: "absolute",
      approvalStatusData: [...approvalStatusData],
      allStyle: "width: 170px; margin-right: 10px;",
      columns,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {
        deliveryNameOrId: '',       // 交付单号/名称
        approvalStatus: '',         // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        pageNum: 1,                 // 当前页
        pageSize: 10,               // 每页显示记录数
        projectId: undefined,              // 资产项目Id
        organId: '',                // 组织机构id
        deliveryType: '',           // 交付类型
        assetType: '',              // 资产类型，多个用，分隔
        startCreateDate: '',   // 开始创建日期
        endCreateDate: '',            // 结束创建日期
      },
      count: '',
      changeTypeData: [
        { name: '全部交付类型', value: ''},
        { name: '交付物业', value: '1'},
        { name: '交付运营', value: '2'},
      ],
      assetTypeData: [],
      projectData: [],
      overviewNumSpinning: false,
      numList: [
        { title: "全部", key: "total", value: 0, fontColor: "#324057" },
        { title: "草稿", key: "draft", value: 0, bgColor: "#5b8ff9" },
        { title: "待审批", key: "await", value: 0, bgColor: "#d48265" },
        { title: "已驳回", key: "reject", value: 0, bgColor: "#4BD288" },
        { title: "已审批", key: "complete", value: 0, bgColor: "#1890FF" },
        { title: "已取消", key: "cancel", value: 0, bgColor: "#DD81E6" }
      ],
    };
  },
  computed: {},
  watch: {
    $route() {
      if (
        this.$route.path === "/assetDelivery" &&
        this.$route.query.refresh
      ) {
        this.queryCondition.pageNum = 1;
        this.queryCondition.pageSize = 10;
        this.query();
      }
    }
  },
  mounted() {
    // 获取资产类型
    this.platformDictFn("asset_type");
  },
  methods: {
    moment,
      // 导出
    downloadFn () {
      let obj = {
        pageNum: '',                                              // 当前页
        pageSize: '',                                             // 每页显示记录数
        organId: this.queryCondition.organId,                     // 组织机构id
        projectIdList: this.queryCondition.projectId === undefined ? [] : this.queryCondition.projectId,            // 项目id
        deliveryType: this.queryCondition.deliveryType,           // 交付类型
        deliveryNameOrId: this.queryCondition.deliveryNameOrId,   // 单号/名称
        assetTypeList: this.alljudge(this.queryCondition.assetType),       // 资产类型id(多个用，分割)
        deliveryDateStart: this.queryCondition.startCreateDate,    // 开始创建日期
        deliveryDateEnd: this.queryCondition.endCreateDate,       // 结束创建日期
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus), // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
      }
      this.$api.delivery.exportDeliveryList(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产交付管理.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 统一搜索
    allQuery () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    alljudge (val) {
    if (val.length !== 0) {
      if (val[0] === '') {
        return []
      } else {
        return val
      }
    } else {
      return []
    }
  },
    // 查询
    query() {
      this.loading = true;
      let obj = {
        pageNum: this.queryCondition.pageNum,                     // 当前页
        pageSize: this.queryCondition.pageSize,                   // 每页显示记录数
        organId: this.queryCondition.organId,                     // 组织机构id
        projectIdList: this.queryCondition.projectId === undefined ? [] : this.queryCondition.projectId,            // 项目id
        deliveryType: this.queryCondition.deliveryType,           // 交付类型
        deliveryNameOrId: this.queryCondition.deliveryNameOrId,   // 单号/名称
        assetTypeList: this.alljudge(this.queryCondition.assetType),       // 资产类型id(多个用，分割)
        deliveryDateStart: this.queryCondition.startCreateDate,    // 开始创建日期
        deliveryDateEnd: this.queryCondition.endCreateDate,       // 结束创建日期
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus), // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
      }
      this.$api.delivery.getDeliveryPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data || [];
          this.tableData = data.map((item, index) => {
            // 处理按钮权限
            item.operationData = this.handleBtn(item)
            return {
              ...item,
              key: index
            };
          });
          this.count = res.data.data.count || 0;
          this.getChangePageSum(obj);
        } else {
          this.$message.error(res.data.message);
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 查询统计列表
    getChangePageSum(obj) {
      this.overviewNumSpinning = true
      let data = { ...obj };
      delete data.pageNum;
      delete data.pageSize;
      this.$api.delivery.getDeliveryPageSum(data).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || {};
          this.numList = this.numList.map(item => {
            return {
              ...item,
              value: data[item.key]
            };
          });
        } else {
          this.$message.error(res.data.message);
          this.overviewNumSpinning = false;
        }
      }).finally(() => {
        this.overviewNumSpinning = false;
      });
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    // 起止日期发生变化
    onDateChange(val) {
      this.queryCondition.startCreateDate = val[0];
      this.queryCondition.endCreateDate = val[1];
    },
    // 新建交付单
    newChangeSheetFn() {
      let recordData = JSON.stringify([
        { organId: this.queryCondition.organId, organName: this.organName }
      ]);
      this.$router.push({
        path: '/assetDelivery/newEditor',
        query: { record: recordData, setType: 'new' }
      });
    },
    // 处理按钮
    handleBtn(record) {
      let arr = [];
      // 0草稿   2待审批、已驳回3、已审批1  已取消4
      // 编辑权限
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DELIVERY_EDIT) && ["0", "3"].includes(String(record.approvalStatus))) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DELIVERY_AUDIT) && ["2"].includes(String(record.approvalStatus))) {
        arr.push({ iconType: "check-square", text: "审批", editType: "audit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DELIVERY_DELETE) &&["0", "3"].includes(String(record.approvalStatus))) {
        arr.push({ iconType: "delete", text: "删除", editType: "delete" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DELIVERY_REVERSE_AUDIT) && ["1"].includes(String(record.approvalStatus))) {
        arr.push({ iconType: "logout", text: "反审批", editType: "reverseAudit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_DELIVERY_end) && ["1"].includes(String(record.approvalStatus))) {
        arr.push({ iconType: "book", text: "结束交付", editType: "end" });
      }
      arr.push({
        iconType: "file-text",
        text: "详情",
        editType: "particulars"
      });
      return arr;
    },
    // 操作
    operationFun(val, str) {
      // 详情
      if (["particulars"].includes(str)) {
        let particularsData = JSON.stringify([val]);
        this.$router.push({
          path: "/assetDelivery/details",
          query: { record: particularsData, setType: 'details' }
        });
      }
      // 删除
      if (["delete"].includes(str)) {
        this.commonFn("delete", val.deliveryId);
      }
      // 反审核
      if (["reverseAudit"].includes(str)) {
        this.commonFn("reverseAudit", val.deliveryId);
      }
      // 审批
      if (["audit"].includes(str)) {
        this.commonFn("audit", val.deliveryId);
      }
      // 结束交付
      if (["end"].includes(str)) {
        this.$refs.deliveryRef.status = true
        this.$refs.deliveryRef.replacement(val.deliveryId)        // 重置数据
      }
      // 编辑
      if (["edit"].includes(str)) {
        let recordData = JSON.stringify([val]);
        this.$router.push({
          path: "/assetDelivery/editDelivery",
          query: { record: recordData, setType: "edit" }
        });
      }
    },
    // 资产类型发生变化
    changeAssetType(value) {
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
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = [''];
      } else {
        let totalIndex = data.indexOf('');
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [''];
          }
        }
      }
      return data;
    },
    commonFn(str, id) {
      let _this = this;
      let obj = {
        content: '',                        // 提示内容
        info: '',                           // 成功提示内容
        approvalStatus: '',                 // 状态
      }
      if (str === "delete") {                // 删除
        obj.content = '确认要删除该交付单吗？'
        obj.info = '删除成功'
        obj.approvalStatus = 4
      } else if (str === 'reverseAudit') {   // 反审核
        obj.content = '确认要反审核该交付单吗？'
        obj.info = '反审核成功'
        obj.approvalStatus = 0
      } else if (str === 'audit') {          // 审核
        obj.content = '确认要审核该交付单吗？'
        obj.info = '审核成功'
        obj.approvalStatus = 1
      }
      if (obj.approvalStatus === '') {
        return
      }
      this.$confirm({
        title: "提示",
        content: obj.content,
        onOk() {
          let o = {
            deliveryId: id,
            approvalStatus: obj.approvalStatus,
            cause: '',
            endDate: ''
          };
          _this.$api.delivery.updateStatus(o).then(res => {
            if (Number(res.data.code) === 0) {
              _this.$message.info(obj.info);
              _this.query();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        }
      })
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = undefined
      this.allQuery();
      this.getObjectKeyValueByOrganIdFn();
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach(item => {
            arr.push({title: item.projectName, value: item.projectId, key: item.projectId,})
          })
          this.projectData = arr
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 平台字典获取变更类型
    platformDictFn(str) {
      let obj = {
        code: str
      };
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === "asset_type") {
            this.assetTypeData = [{ name: "全部资产类型", value: '' }, ...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 选择框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
  }
};
</script>
<style lang="less" scoped>
.assetsRegistration {
  /deep/ .sg-search-container .bottom-fold-wrap .search-icon {
    display: none;
  }
  .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084ff;
      cursor: pointer;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
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
