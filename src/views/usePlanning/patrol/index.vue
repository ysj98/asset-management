<template>
  <div class="protalRecord">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <a-button
          icon="plus"
          type="primary"
          v-power="ASSET_MANAGEMENT.PATROL_RECORD_NEW"
          @click="newChangeSheetFn"
        >巡查登记</a-button>
        <SG-Button v-power="ASSET_MANAGEMENT.PATROL_RECORD_EXPORT" class="ml10" type="primary" @click="downloadFn">导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect
            @changeTree="changeTree"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="assetTypeList"
          ></treeSelect>
          <a-select
            :style="assetTypeList"
            :allowClear="true"
            mode="multiple"
            :maxTagCount="1"
            v-model="queryCondition.projectIdList"
            :options="projectData"
            placeholder="全部资产项目"
            :loading="loading && !projectData.length"
          ></a-select>
          <a-select
            :maxTagCount="1"
            :style="assetTypeList"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="changeAssetType"
            v-model="queryCondition.assetTypeList"
          >
            <a-select-option
              v-for="(item, index) in assetTypeData"
              :key="index"
              :value="item.value"
            >{{item.name}}</a-select-option>
          </a-select>
        <a-input-search v-model="queryCondition.assetNameOrCode" placeholder="资产名称/编码" maxlength="30" :style="assetTypeList" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          :maxTagCount="1"
          :style="assetTypeList"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部巡查类型"
          @select="inspectionTypeListFn"
          v-model="queryCondition.inspectionTypeList"
        >
          <a-select-option
            v-for="(item, index) in changeTypeData"
            :key="index"
            :value="item.value"
          >{{item.name}}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          style="width: 160px; margin-right: 10px;"
          mode="multiple"
          placeholder="全部巡查状态"
          :tokenSeparators="[',']"
          @select="patrolStatusFn"
          v-model="queryCondition.inspectionStatusList"
        >
          <a-select-option
            v-for="(item, index) in patrolStatusData"
            :key="index"
            :value="item.value"
          >{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <segi-range-picker
            :disabledDateType="false"
            label="巡查日期"
            :defaultValue="undefined"
            :allowClear="true"
            :canSelectToday="true"
            @dateChange="onDateChange"
          ></segi-range-picker>
        </div>
      </div>
    </SG-SearchContainer>
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
  </div>
</template>

<script>
import { ASSET_MANAGEMENT } from "@/config/config.power";
import SegiRangePicker from "@/components/SegiRangePicker";
import TreeSelect from "../../common/treeSelect";
import OperationPopover from "@/components/OperationPopover";
import moment from "moment";
import noDataTips from "@/components/noDataTips";

const patrolStatusData = [
  { name: "全部巡查状态", value: '' },
  { name: "未开始", value: "0" },
  { name: "已完成", value: "1" },
];

const columns = [
  { title: "巡查编号", dataIndex: "recordId", width: 110 },
  { title: "所属机构", dataIndex: "organName" },
  { title: "资产项目", dataIndex: "projectName" },
  { title: "资产编码", dataIndex: "assetCode" },
  { title: "资产名称", dataIndex: "assetName" },
  { title: "资产类型", dataIndex: "assetTypeName" },
  { title: "巡查类型", dataIndex: "inspectionTypeName" },
  { title: "计划巡查日期", dataIndex: "inspectionDate" },
  { title: "实际巡查日期", dataIndex: "actualInspectionDate" },
  { title: "巡查人", dataIndex: "userNames" },
  { title: "巡查问题描述", dataIndex: "problemDescription" },
  { title: "现场处理措施", dataIndex: "sceneHandleMeasure" },
  { title: "巡查状态", dataIndex: "inspectionStatusName" },
  { title: "操作", dataIndex: "operation", width: 90, scopedSlots: { customRender: "operation" }}
];

export default {
  components: {
    TreeSelect,
    SegiRangePicker,
    noDataTips,
    OperationPopover
  },
  data() {
    return {
      moment,
      loading: false,
      toggle: false,
      ASSET_MANAGEMENT,
      patrolStatusData: [...patrolStatusData],
      assetTypeList: "width: 170px; max-height: 30px; margin-right: 10px;",
      location: "absolute",
      noPageTools: false,
      queryCondition: {
        assetNameOrCode: '',       // 资产类型/编码
        inspectionStatusList: '',         // 巡查状态 
        pageNum: 1,                 // 当前页
        pageSize: 10,               // 每页显示记录数
        projectIdList: undefined,              // 资产项目Id
        organId: '',                // 组织机构id
        inspectionTypeList: [],           // 巡查类型
        assetTypeList: '',              // 资产类型，多个用，分隔
        inspectionDateStart: '',   // 开始创建日期
        inspectionDateEnd: '',            // 结束创建日期
      },
      changeTypeData: [],
      assetTypeData: [],
      projectData: [],
      columns,
      tableData: [],
      count: '',
      organName: '',
      organId: '',
      numList: [
        { title: "全部", key: "total", value: 0, fontColor: "#324057" },
        { title: "草稿", key: "draft", value: 0, bgColor: "#5b8ff9" },
        { title: "待审批", key: "await", value: 0, bgColor: "#d48265" },
        { title: "已驳回", key: "reject", value: 0, bgColor: "#4BD288" },
        { title: "已审批", key: "complete", value: 0, bgColor: "#1890FF" },
        { title: "已取消", key: "cancel", value: 0, bgColor: "#DD81E6" }
      ]
    }
  },
  watch: {
    $route() {
      if (
        this.$route.path === "/patrolRecord" &&
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
    // 获取巡查类型
    this.queryOrganOptions();
  },
  methods: {
      // 导出
    downloadFn () {
      let obj = {                                         // 每页显示记录数
        organId: this.queryCondition.organId,                     // 组织机构id
        projectIdList: this.queryCondition.projectIdList === undefined ? [] : this.queryCondition.projectIdList,            // 项目id
        assetTypeList: this.alljudge(this.queryCondition.assetTypeList),       // 巡查类型id(多个用，分割)
        assetNameOrCode: this.queryCondition.assetNameOrCode,   // 单号/名称
        inspectionTypeList: this.queryCondition.inspectionTypeList,           // 交付类型
        inspectionDateStart: this.queryCondition.inspectionDateStart,    // 开始创建日期
        inspectionDateEnd: this.queryCondition.inspectionDateEnd,       // 结束创建日期
        inspectionStatusList: this.alljudge(this.queryCondition.inspectionStatusList) // 巡查状态
      }
      this.$api.useManage.exportList(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '巡查记录.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    // 新建交付单
    newChangeSheetFn() {
      let recordData = JSON.stringify([
        { organId: this.queryCondition.organId, organName: this.organName }
      ]);
      this.$router.push({
        path: '/patrolRecord/newEditor',
        query: { record: recordData, setType: 'new' }
      });
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectIdList = undefined
      this.allQuery();
      this.getObjectKeyValueByOrganIdFn();
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
    // 查询巡查类型-机构字典
    queryOrganOptions () {
      this.$api.basics.organDict({ code: 'inspection_type', organId: '1' }).then(r => {
        let res = r.data
        if (res && res.code + '' === '0') {
          this.changeTypeData = [{ name: "全部巡查类型", value: '' }, ...res.data]
        } else {
          this.$message.error(err || '查询巡查类型失败')
        }
      }).catch(err => {
        this.$message.error(err || '查询巡查类型失败')
      })
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function() {
        this.queryCondition.assetTypeList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetTypeList,
          this.assetTypeData
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
    commonFn(id) {
      let _this = this;
      let obj = {
        content: '确认要删除该交付单吗？',                        // 提示内容
        info: '删除成功'                  // 状态
      }
      this.$confirm({
        title: "提示",
        content: obj.content,
        onOk() {
          let o = {
            recordId: id + '',
            status: '2'
          };
          _this.$api.useManage.updateStatusOrDelete(o).then(res => {
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
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 巡查类型发生变化
    inspectionTypeListFn (value) {
      this.$nextTick(function() {
        this.queryCondition.inspectionTypeList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.inspectionTypeList,
          this.changeTypeData
        );
      });
    },
    // 状态发生变化
    patrolStatusFn(value) {
      this.$nextTick(function() {
        this.queryCondition.inspectionStatusList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.inspectionStatusList,
          this.patrolStatusData
        );
      });
    },
    // 起止日期发生变化
    onDateChange(val) {
      this.queryCondition.inspectionDateStart = val[0];
      this.queryCondition.inspectionDateEnd = val[1];
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
        projectIdList: this.queryCondition.projectIdList === undefined ? [] : this.queryCondition.projectIdList,            // 项目id
        assetTypeList: this.alljudge(this.queryCondition.assetTypeList),       // 资产类型id(多个用，分割)
        assetNameOrCode: this.queryCondition.assetNameOrCode,   // 巡查名称/编码
        inspectionDateStart: this.queryCondition.inspectionDateStart,    // 开始创建日期
        inspectionDateEnd: this.queryCondition.inspectionDateEnd,       // 结束创建日期
        inspectionTypeList: this.alljudge(this.queryCondition.inspectionTypeList),           // 巡查类型
        inspectionStatusList: this.alljudge(this.queryCondition.inspectionStatusList) // 巡查状态
      }
      this.$api.useManage.getListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data || [];
          this.tableData = data.map((item, index) => {
            // 处理按钮权限
            item.operationData = this.handleBtn(item)
            let date1 = item.inspectionDate ? new Date(item.inspectionDate) : ''
            let date2 = item.actualInspectionDate ? new Date(item.actualInspectionDate) : ''
            item.inspectionDate = date1 ? `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}` : ''
            item.actualInspectionDate = date2 ? `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}` : ''
            return {
              ...item,
              key: index
            };
          });
          this.count = res.data.data.count || 0;
        } else {
          this.$message.error(res.data.message);
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取权限
    handleBtn(record) {
      let arr = [];
      // 0草稿   2待审批、已驳回3、已审批1  已取消4
      // 编辑权限
      if (this.$power.has(ASSET_MANAGEMENT.PATROL_RECORD_EDIT)) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      if (this.$power.has(ASSET_MANAGEMENT.PATROL_RECORD_DELETE)) {
        arr.push({ iconType: "delete", text: "删除", editType: "delete" });
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
        this.$router.push({
          path: "/patrolRecord/details",
          query: { recordId: val.recordId, setType: 'details' }
        });
      }
      // 删除
      if (["delete"].includes(str)) {
        this.commonFn(val.recordId);
      }
      // 编辑
      if (["edit"].includes(str)) {
        let recordData = JSON.stringify([val]);
        this.$router.push({
          path: "/patrolRecord/edit",
          query: { record: recordData, setType: "edit" }
        });
      }
    }
  }
}
</script>>

<style lang="less" scoped>
.protalRecord{
 .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
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
