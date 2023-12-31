<!--
  资产转运营
-->
<template>
  <div class="ownershipRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{ paddingTop: '16px' }" style="position: relative">
      <div slot="headerBtns">
        <span style="height: 0"></span>
        <SG-Button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_OPERATING_ADD" @click="goAddEdit('add')"> 新建转运营单 </SG-Button>
        <span style="height: 0"></span>
        <SG-Button
          v-power="ASSET_MANAGEMENT.ASSET_OPERATING_EXPORT_FILE"
          style="margin-left: 20px"
          icon="export"
          type="primary"
          @click="handleExport"
        >
          导出
        </SG-Button>
      </div>
      <template slot="headerForm">
        <div style="position: absolute; top: 20px; right: 76px; display: flex">
          <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle2"></treeSelect>
          <a-select
            mode="multiple"
            :maxTagCount="1"
            :style="allStyle2"
            :showSearch="true"
            :filterOption="filterOption"
            placeholder="全部资产项目"
            v-model="queryCondition.projectId"
          >
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle2"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="assetTypeDataFn"
            v-model="queryCondition.assetType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-input-search
            :style="allStyle2"
            placeholder="转运营单名称/编码"
            @search="query"
            v-model="queryCondition.registerNameOrCode"
          ></a-input-search>
        </div>
      </template>
      <template slot="contentForm" style="position: absolute">
        <div class="search-content-box">
          <div class="search-from-box" style="display: flex; align-items: center">
            <a-checkbox :style="checkboxAllStyle" :checked="queryCondition.isCurrent" @change="checkboxFn"> 仅当前机构资产转运营单 </a-checkbox>
            <a-select
              :maxTagCount="1"
              :style="allStyle"
              mode="multiple"
              placeholder="全部状态"
              :tokenSeparators="[',']"
              @select="approvalStatusFn"
              v-model="queryCondition.approvalStatusList"
            >
              <a-select-option :title="item.name" v-for="(item, index) in approvalStatusListOptions" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <div class="box box-right" :style="dateWidth">
              <SG-DatePicker
                :allowClear="false"
                label="创建日期"
                pickerType="RangePicker"
                v-model="createAndEndTime"
                format="YYYY-MM-DD"
              ></SG-DatePicker>
            </div>
          </div>
          <div class="two-row-box">
            <SG-Button type="primary" style="margin-right: 10px" @click="query"> 查询 </SG-Button>
            <SG-Button @click="eliminateFn">重置</SG-Button>
          </div>
        </div>
      </template>
    </SearchContainer>
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div class="table-layout-fixed">
      <a-table rowKey="assetOperationRegisterId" :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="handleActionBtn(record)" @operationFun="operationFun($event, record)" />
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
import { generateAssetStringByCode } from '@/utils/utils';
import OperationPopover from '@/components/OperationPopover';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { handleDownloadFile, utils } from '@/utils/utils.js';
import OverviewNumber from '@/views/common/OverviewNumber';
import noDataTips from '@/components/noDataTips';
const checkboxAllStyle = {
  'margin-right': '10px',
  flex: 1,
  'margin-top': '20px',
  display: 'inline-block',
  'vertical-align': 'middle',
};
const dateWidth = {
  width: '360px',
  'margin-right': '10px',
  flex: 1,
  'margin-top': '14px',
  display: 'inline-block',
  'vertical-align': 'middle',
};
const columns = [
  {
    title: '转运营单编号',
    dataIndex: 'assetOperationRegisterId',
  },
  {
    title: '转运营单名称',
    dataIndex: 'title',
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
  },
  {
    title: '资产类型',
    key: 'assetType',
    customRender: (text, record) => {
      return generateAssetStringByCode({ record });
    },
  },
  {
    title: '转运营资产数量',
    dataIndex: 'assetOperationCount',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
  },
  {
    title: '创建日期',
    key: 'createTime',
    customRender(text, record) {
      return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 170,
    scopedSlots: { customRender: 'operation' },
  },
];
const operationData = [
  { iconType: 'form', text: '修改', editType: 'edit' },
  { iconType: 'delete', text: '删除', editType: 'delete' },
];
const approvalStatusListOptions = [
  {
    name: '全部状态',
    value: '',
  },
  {
    name: '草稿',
    value: 0,
  },
  {
    name: '已审批',
    value: 1,
  },
  {
    name: '待审批',
    value: 2,
  },
  {
    name: '已驳回',
    value: 3,
  },
  {
    name: '已取消',
    value: 4,
  },
];
const allWidth = {
  width: '170px',
  'margin-right': '10px',
  flex: 1,
  'margin-top': '14px',
  display: 'inline-block',
  'vertical-align': 'middle',
};
const allWidth2 = {
  width: '200px',
  'margin-right': '10px',
  flex: 1,
  'margin-top': '0',
  display: 'inline-block',
  'vertical-align': 'middle',
};
const queryCondition = {
  registerNameOrCode: '',
  organId: '', // 组织机构id
  projectId: [], // 资产项目Id
  assetType: [], // 资产类型Id
  approvalStatusList: [], // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
  createTimeStart: '', // 开始日期
  createTimeEnd: '', // 结束日期
  pageNum: 1, // 第几页
  pageSize: 10, // 每页显示记录数
  isCurrent: false, // 备注：仅当前机构下资产清理单 0 否 1 是
};
export default {
  name: 'assetOperating',
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    OverviewNumber,
    OperationPopover,
  },
  props: {},
  data() {
    return {
      organInfo: {},
      overviewNumSpinning: false,
      numList: [
        { title: '全部', key: 'total', value: 0, fontColor: '#324057' },
        { title: '草稿', key: 'draft', value: 0, bgColor: '#5b8ff9' },
        { title: '待审批', key: 'await', value: 0, bgColor: '#d48265' },
        { title: '已驳回', key: 'reject', value: 0, bgColor: '#4BD288' },
        { title: '已审批', key: 'complete', value: 0, bgColor: '#1890FF' },
        { title: '已取消', key: 'cancel', value: 0, bgColor: '#DD81E6' },
      ],
      checkboxAllStyle,
      ASSET_MANAGEMENT,
      dateWidth,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      allStyle2: allWidth2,
      toggle: true,
      columns,
      organId: '',
      tableData: [],
      operationData: [...operationData],
      approvalStatusListOptions: [...approvalStatusListOptions],
      queryCondition: { ...queryCondition },
      count: '',
      projectData: [],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: '',
        },
      ],
      createAndEndTime: [],
    };
  },
  computed: {},
  methods: {
    handleReq() {
      const res1 = this.queryCondition.assetType;
      const res2 = this.queryCondition.approvalStatusList;
      console.log('res1', res1);
      const assetTypes = res1.filter((ele) => !['', undefined, null].includes(ele));
      const approvalStatusList = res2.filter((ele) => !['', undefined, null].includes(ele));
      return {
        projectIdList: this.queryCondition.projectId,
        organId: Number(this.queryCondition.organId),
        assetTypes,
        approvalStatusList,
        createTimeStart: moment(this.createAndEndTime[0]).format('YYYY-MM-DD'),
        createTimeEnd: moment(this.createAndEndTime[1]).format('YYYY-MM-DD'),
        isCurrent: this.queryCondition.isCurrent,
        registerNameOrCode: this.queryCondition.registerNameOrCode,
      };
    },
    handleExport() {
      let obj = {
        ...this.handleReq(),
      };
      this.$api.toOperation.exportListPage(obj).then((res) => {
        handleDownloadFile({ fileName: '资产转运营列表.xls', data: res.data });
      });
    },
    handleActionBtn(record) {
      const { approvalStatus } = record;
      // 参考 approvalStatusListOptions 变量
      const operationList = [
        {
          iconType: 'edit',
          text: '编辑',
          editType: 'edit',
          statusAuth: [0, 3],
          auth: ASSET_MANAGEMENT.ASSET_OPERATING_EDIT,
        },
        {
          iconType: 'check-square',
          text: '审批',
          editType: 'approve',
          statusAuth: [2],
          auth: ASSET_MANAGEMENT.ASSET_OPERATING_APPROVE,
        },
        {
          iconType: 'delete',
          text: '删除',
          editType: 'delete',
          statusAuth: [0, 3],
          auth: ASSET_MANAGEMENT.ASSET_OPERATING_DEL,
        },
        { iconType: 'book', text: '详情', editType: 'detail' },
      ];
      const authRes = operationList.filter((ele) => {
        if (!ele.auth) {
          return true;
        } else {
          return this.$power.has(ele.auth);
        }
      });
      return authRes.filter((ele) => {
        // statusAuth 不存在代表所有状态可访问
        // statusAuth 存在并且 长度不为0,且权限数组包含当前数据的状态
        return !ele.statusAuth || (ele.statusAuth.length && ele.statusAuth.includes(approvalStatus));
      });
    },
    goDetail({ assetOperationRegisterId, approvalStatus, organId }, fromType) {
      this.$router.push({
        path: '/assetOperating/detail',
        query: {
          assetOperationRegisterId,
          organId: this.queryCondition.organId,
          approvalStatus,
          fromType,
          relatedOrganId: organId,
        },
      });
    },
    async handleDel({ assetOperationRegisterId }) {
      const req = {
        assetOperationRegisterId,
      };
      const {
        data: { code, message },
      } = await this.$api.toOperation.deleteOperation(req);
      if (code === '0') {
        this.query();
        this.$SG_Message.success('操作成功');
      } else {
        this.$SG_Message.error(message);
      }
    },
    async handleApprove({ assetOperationRegisterId }) {
      const req = {
        assetOperationRegisterId,
        approvalStatus: 1,
      };
      const {
        data: { code, message },
      } = await this.$api.toOperation.updateOperationApprovalStatus(req);
      if (code === '0') {
        this.query();
        this.$SG_Message.success('操作成功');
      } else {
        this.$SG_Message.error(message);
      }
    },
    operationFun(type, record) {
      const { assetOperationRegisterId, approvalStatus } = record;
      switch (type) {
        case 'edit':
          this.goAddEdit('edit', assetOperationRegisterId);
          break;
        case 'approve':
          this.goDetail({ assetOperationRegisterId, approvalStatus, organId: record.organId }, 'approve');
          break;
        case 'delete':
          this.handleDel({ assetOperationRegisterId, approvalStatus });
          break;
        case 'detail':
          this.goDetail({ assetOperationRegisterId, approvalStatus, organId: record.organId }, 'detail');
          break;
      }
    },
    operationFn(record, type) {
      if (type === 'particulars') {
        let recordData = JSON.stringify([record]);
        this.$router.push({
          path: '/ownershipRegistration/registrationParticulars',
          query: { record: recordData },
        });
      } else if (type === 'edit') {
        let recordData = JSON.stringify([
          {
            value: this.queryCondition.organId,
            name: this.organInfo.organName,
          },
        ]);
        let enitData = JSON.stringify([record]);
        this.$router.push({
          path: '/ownershipRegistration/registrationNew',
          query: { record: recordData, enitData: enitData, setType: 'edit' },
        });
      } else if (type === 'delete') {
        let _this = this;
        this.$confirm({
          title: '提示',
          content: '确认要删除该资产权属登记单吗？',
          onOk() {
            let obj = {
              registerId: record.registerId,
            };
            _this.$api.ownership.shipDelete(obj).then((res) => {
              if (Number(res.data.code) === 0) {
                _this.$message.info('删除成功');
                _this.query();
              } else {
                _this.$message.error(res.data.message);
              }
            });
          },
        });
      }
    },
    goAddEdit(type, assetOperationRegisterId) {
      let path = '/assetOperating/add';
      const query = {
        organId: this.organInfo.organId,
        organName: this.organInfo.organName,
        type,
      };
      if (type === 'edit') {
        query.assetOperationRegisterId = assetOperationRegisterId;
        path = '/assetOperating/edit';
      }
      this.$router.push({
        path,
        query,
      });
    },
    // 组织机构树
    changeTree(value, label) {
      this.organInfo = {
        organId: value,
        organName: label,
      };
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = [];
      this.getObjectKeyValueByOrganIdFn();
      this.query();
    },
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    // 选择是否查看当前机构权属登记
    checkboxFn(e) {
      this.queryCondition.isCurrent = e.target.checked;
    },
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
            });
          });
          this.projectData = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 平台字典获取变动类型
    platformDictFn(str) {
      let obj = {
        code: str,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === 'approval_status_type') {
            this.approvalStatusListOptions = [...data];
            let status = [];
            this.approvalStatusListOptions.forEach((item) => {
              status.push(item.value);
            });
            this.queryCondition.approvalStatusList = status;
          } else if (str === 'asset_type') {
            this.assetTypeData = [{ name: '全部资产类型', value: '' }, ...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData);
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatusList,
          this.approvalStatusListOptions
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
    // 清空
    eliminateFn() {
      this.initCreateAndEndTime();
      let organId = this.queryCondition.organId;
      this.queryCondition = { ...queryCondition };
      this.queryCondition.organId = organId;
      this.query();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    alljudge(val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return [];
        } else {
          return val;
        }
      } else {
        return [];
      }
    },
    initCreateAndEndTime() {
      this.createAndEndTime = [moment(new Date().getTime() - 24 * 1000 * 60 * 60 * 30), moment(new Date())];
    },
    // 查询
    query() {
      this.loading = true;
      let obj = {
        ...this.handleReq(),
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
      };
      this.$api.toOperation.getTransferOperationPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index;
              item.serial = index + 1 + (this.queryCondition.pageNum - 1) * this.queryCondition.pageSize;
            });
            this.tableData = data;
            this.count = res.data.data.count;
          } else {
            this.tableData = [];
            this.count = 0;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
      this.shipTotal(utils.deepClone(obj));
    },
    // 统计
    shipTotal(obj) {
      this.overviewNumSpinning = true;
      obj.pageNum = 1;
      obj.pageSize = 1;
      this.$api.toOperation.getOperationPageStatistics(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.numList = this.numList.map((m) => {
            return { ...m, value: data[m.key] || 0 };
          });
          this.overviewNumSpinning = false;
        } else {
          this.$message.error(res.data.message);
          this.overviewNumSpinning = false;
        }
      });
    },
  },
  mounted() {
    this.initCreateAndEndTime();
    // 资产类型
    this.platformDictFn('asset_type');
  },
  activated() {
    if (this.$route.meta.isKeep) {
      this.query();
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.isKeep = true;
    next();
  },
};
</script>
<style lang="less" scoped>
.ownershipRegistration {
  .from-second {
    padding: 26px 190px 0 0;
  }
  .box-right {
    margin-right: 10px;
  }
  .search-content-box {
    display: flex;
    justify-content: flex-end;
    .search-from-box {
      flex-wrap: wrap;
    }
    .two-row-box {
      padding-top: 14px;
      flex: 0 0 190px;
    }
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
}
</style>
