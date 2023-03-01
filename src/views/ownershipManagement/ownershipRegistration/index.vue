<!--
  权属登记
-->
<template>
  <div class="ownershipRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{ paddingTop: '16px' }" style="position: relative">
      <div slot="headerBtns">
        <SG-Button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_OWNERR_NEW" @click="newChangeSheetFn">新建登记单</SG-Button>
      </div>
      <div slot="headerForm"></div>
      <div slot="contentForm" class="search-content-box" style="position: absolute">
        <div class="search-from-box">
          <a-checkbox :style="checkboxAllStyle" :checked="queryCondition.flag" @change="checkboxFn">仅当前机构资产登记单</a-checkbox>
          <div class="box" style="positon: absolute">
            <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle" :showSearch="true"></treeSelect>
          </div>
          <a-select :style="allStyle" :showSearch="true" :filterOption="filterOption" placeholder="全部资产项目" v-model="queryCondition.projectId">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="assetTypeDataFn"
            v-model="queryCondition.assetType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部登记类型"
            :tokenSeparators="[',']"
            @select="changeTypeDataFn"
            v-model="queryCondition.registerTypeList"
          >
            <a-select-option :title="item.name" v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部审批状态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.approvalStatus"
          >
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <div class="box box-right" :style="dateWidth">
            <SG-DatePicker
              :allowClear="false"
              label="创建日期"
              style="width: 232px"
              pickerType="RangePicker"
              v-model="alterationDate"
              format="YYYY-MM-DD"
            ></SG-DatePicker>
          </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div class="table-layout-fixed">
      <a-table :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <!-- <OperationPopover :operationData="record.operationDataBtn" @operationFun="operationFn($event, record)"></OperationPopover> -->
          <div class="tab-opt">
            <span v-for="(item, index) in record.operationDataBtn" :key="index" @click="operationFn(item.editType, record)">{{ item.text }}</span>
          </div>
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
import OperationPopover from '@/components/OperationPopover';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '../../common/treeSelect';
import moment from 'moment';
import segiIcon from '@/components/segiIcon.vue';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { utils, debounce } from '@/utils/utils.js';
import OverviewNumber from '@/views/common/OverviewNumber';
import noDataTips from '@/components/noDataTips';
const checkboxAllStyle = { 'margin-right': '10px', flex: 1, 'margin-top': '20px', display: 'inline-block', 'vertical-align': 'middle' };
const allWidth = { width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const dateWidth = { width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const columns = [
  {
    title: '登记单编号',
    dataIndex: 'registerId',
  },
  {
    title: '登记单名称',
    dataIndex: 'registerName',
  },
  {
    title: '登记类型',
    dataIndex: 'registerTypeName',
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
    dataIndex: 'assetTypeName',
  },
  {
    title: '资产数量',
    dataIndex: 'assetCount',
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
  },
  {
    title: '当前状态',
    dataIndex: 'approvalStatusName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 170,
    scopedSlots: { customRender: 'operation' },
  },
];
const approvalStatusData = [
  {
    name: '全部状态',
    value: '',
  },
  {
    name: '草稿',
    value: '0',
  },
  {
    name: '待审批',
    value: '2',
  },
  {
    name: '已驳回',
    value: '3',
  },
  {
    name: '已审批',
    value: '1',
  },
  {
    name: '已取消',
    value: '4',
  },
];
const queryCondition = {
  registerTypeList: '',
  organId: '', // 组织机构id
  projectId: '', // 资产项目Id
  assetType: '', // 资产类型Id
  approvalStatus: '', // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
  minDate: '', // 开始日期
  maxDate: '', // 结束日期
  pageNum: 1, // 第几页
  pageSize: 10, // 每页显示记录数
  flag: false, // 备注：仅当前机构下资产清理单 0 否 1 是
};
export default {
  components: { OperationPopover, SearchContainer, TreeSelect, segiIcon, noDataTips, OverviewNumber },
  props: {},
  data() {
    return {
      overviewNumSpinning: false,
      numList: [
        { title: '全部', key: 'total', value: 0, fontColor: '#324057' },
        { title: '草稿', key: 'zero', value: 0, bgColor: '#5b8ff9' },
        { title: '待审批', key: 'tow', value: 0, bgColor: '#d48265' },
        { title: '已驳回', key: 'three', value: 0, bgColor: '#4BD288' },
        { title: '已审批', key: 'one', value: 0, bgColor: '#1890FF' },
        { title: '已取消', key: 'four', value: 0, bgColor: '#DD81E6' },
      ],
      checkboxAllStyle,
      ASSET_MANAGEMENT,
      dateWidth,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      approvalStatusData: [...approvalStatusData],
      queryCondition: { ...queryCondition },
      count: '',
      projectData: [
        {
          name: '全部资产项目',
          value: '',
        },
      ],
      changeTypeData: [],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: '',
        },
      ],
      alterationDate: [],
    };
  },
  computed: {},
  methods: {
    operationFn(type, record) {
      if (type === 'particulars') {
        this.$router.push({ path: '/ownershipRegistration/registrationParticulars', query: { registerId: record.registerId, type } });
      } else if (type === 'approval') {
        this.$router.push({ path: '/ownershipRegistration/registrationParticulars', query: { registerId: record.registerId, type } });
      } else if (type === 'edit') {
        let recordData = JSON.stringify([{ value: this.queryCondition.organId, name: this.organName }]);
        let enitData = JSON.stringify([record]);
        this.$router.push({ path: '/ownershipRegistration/registrationNew', query: { record: recordData, enitData: enitData, setType: 'edit' } });
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
    // 新建权属登记
    newChangeSheetFn() {
      let recordData = JSON.stringify([{ value: this.queryCondition.organId, name: this.organName }]);
      this.$router.push({ path: '/ownershipRegistration/registrationNew', query: { record: recordData, setType: 'new' } });
    },
    // 组织机构树
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = '';
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
      this.queryCondition.flag = e.target.checked;
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
          this.projectData = [{ name: '全部资产项目', value: '' }, ...arr];
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
            this.approvalStatusData = [...data];
            let status = [];
            this.approvalStatusData.forEach((item) => {
              status.push(item.value);
            });
            this.queryCondition.approvalStatus = status;
          } else if (str === 'asset_type') {
            this.assetTypeData = [{ name: '全部资产类型', value: '' }, ...data];
          } else if (str === 'AMS_REGISTER_TYPE') {
            this.changeTypeData = [{ name: '全部登记类型', value: '' }, ...data];
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
    changeTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.registerTypeList = this.handleMultipleSelectValue(value, this.queryCondition.registerTypeList, this.changeTypeData);
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData);
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
      let organId = this.queryCondition.organId;
      this.alterationDate = [];
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
    // 查询
    query() {
      this.loading = true;
      let obj = {
        registerTypeList: this.alljudge(this.queryCondition.registerTypeList),
        projectId: this.queryCondition.projectId, // 资产项目Id
        organId: Number(this.queryCondition.organId), // 组织机构id
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型Id
        approvalStatuss: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '', // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        minDate: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '', // 创建日期开始日期
        maxDate: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '', // 创建日期结束日期
        flag: this.queryCondition.flag ? 1 : 0, // 仅当前机构下资产清理单 0 否 1 是
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
      };
      this.$api.ownership.shipList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index;
              item.serial = index + 1 + (this.queryCondition.pageNum - 1) * this.queryCondition.pageSize;
              item.operationDataBtn = this.createOperationBtn(item.approvalStatus); // 操作按钮
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
    // 生成操作按钮
    createOperationBtn(type) {
      // 审批状态  0草稿   2待审批、已驳回3、已审批1  已取消4
      let arr = [];
      // 草稿 已驳回
      if (['0', '3'].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_OWNERR_EDIT)) {
          arr.push({ iconType: 'edit', text: '编辑', editType: 'edit' });
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_OWNERR_DELETE)) {
          arr.push({ iconType: 'delete', text: '注销', editType: 'delete' });
        }
      }
      // 待审批
      if (['2'].includes(String(type))) {
        arr.push({ iconType: 'edit', text: '审批', editType: 'approval' });
      }
      arr.push({ iconType: 'file-text', text: '详情', editType: 'particulars' });
      return arr;
    },
    // 统计
    shipTotal(obj) {
      this.overviewNumSpinning = true;
      obj.pageNum = 1;
      obj.pageSize = 1;
      this.$api.ownership.shipTotal(obj).then((res) => {
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
  watch: {
    $route() {
      if (this.$route.path === '/ownershipRegistration' && this.$route.query.refresh) {
        this.queryCondition.pageNum = 1;
        this.queryCondition.pageSize = 10;
        this.query();
      }
    },
  },
  created() {},
  mounted() {
    // 获取状态
    // this.platformDictFn('approval_status_type')
    // 资产类型
    this.platformDictFn('asset_type');
    this.platformDictFn('AMS_REGISTER_TYPE');
  },
};
</script>
<style lang="less" scoped>
.ownershipRegistration {
  .from-second {
    padding: 26px 190px 0 0;
  }
  .box {
    display: inline-block;
  }
  .box-right {
    margin-right: 10px;
  }
  .search-content-box {
    display: flex;
    justify-content: space-between;
    .search-from-box {
      flex: 1;
      flex-wrap: wrap;
      text-align: left;
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
