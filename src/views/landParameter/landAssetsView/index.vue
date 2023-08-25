<!--
 * @Author: LW
 * @Date: 2020-07-24 09:59:14
 * @LastEditTime: 2022-12-16 16:09:40
 * @Description: 土地资产视图
-->
<template>
  <div class="landAssetsView">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{ paddingTop: '16px' }">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary" :loading="exportBtnLoading" @click="handleExport" v-power="ASSET_MANAGEMENT.LAND_ASSET_VIEW_EXPORT"
          >导出资产视图</SG-Button
        >
        <SG-Button type="primary" @click="listSet" style="margin: 0 10px">列表设置</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect
          @changeTree="changeTree"
          placeholder="请选择组织机构"
          :allowClear="false"
          style="width: 170px; margin-right: 10px"
          :showSearch="true"
          :multiple="true"
          :treeCheckable="true"
        ></treeSelect>
        <a-input-search
          v-model="queryCondition.landName"
          placeholder="资产名称/编码"
          :maxLength="40"
          style="width: 140px; margin-right: 10px"
          @search="allQuery"
        />
        <a-input-search
          v-model="queryCondition.landCategory"
          placeholder="权属用途"
          :maxLength="20"
          style="width: 140px; margin-right: 10px"
          @search="allQuery"
        />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部来源方式"
            :tokenSeparators="[',']"
            @select="changeSource"
            v-model="queryCondition.sourceModes"
          >
            <a-select-option :title="item.name" v-for="item in sourceOptions" :key="item.key" :value="item.key">
              {{ item.title }}
            </a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            style="min-width: 165px"
            mode="multiple"
            placeholder="全部状态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.statuss"
          >
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select
            :style="allStyle"
            :showSearch="true"
            mode="multiple"
            :filterOption="filterOption"
            @select="projectIdFn"
            :tokenSeparators="[',']"
            placeholder="全部资产项目"
            v-model="queryCondition.projectId"
          >
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部分类"
            :tokenSeparators="[',']"
            @select="assetClassifyDataFn"
            v-model="queryCondition.objectTypes"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部用途"
            :tokenSeparators="[',']"
            @select="useTypeChange"
            v-model="queryCondition.useType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in useTypeOptions" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <ProvinceCityDistrict class="city" style="width: 550px" ref="ProvinceCityDistrict" v-model="provinces"></ProvinceCityDistrict>
          <a-input :style="allStyle" placeholder="详细地址" v-model="address" :maxLength="20" />
          <a-input :style="allStyle" placeholder="资产原始来源方" v-model="originSource" :maxLength="100" />
          <a-select
            :style="allStyle"
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            v-model="oldSourceModes"
            option-filter-prop="title"
            placeholder="请选择原始来源方式"
            :options="$addTitle(oldSourceOptions)"
            @change="changeOldSource"
          />
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">重置</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview" />
    </a-spin>
    <!-- <div class="table-layout-fixed"> -->
    <a-table :columns="columns" :scroll="scroll" :loading="loading" :data-source="tableData" :pagination="false" size="middle" class="pb70">
      <template slot="landArea" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="acreage" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="transferOperationArea" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="selfUserArea" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="idleArea" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="otherArea" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="originalValue" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="marketValue" slot-scope="text">
        <span>{{ getFormat(text) }}</span>
      </template>
      <template slot="desc" slot-scope="text">
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ text }}
          </template>
          <p class="ellipsis">{{ text }}</p>
        </a-tooltip>
      </template>
      <span slot="action" slot-scope="text, record">
        <span v-if="record.assetName !== '所有页-合计'" style="color: #0084ff; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
    </a-table>
    <!-- </div> -->
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      :location="location"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
    <SG-Modal
      width="500px"
      v-model="modalShow"
      okText="确定"
      title="列表设置"
      @ok="commonFn"
      @cancel="
        () => {
          modalShow = false;
        }
      "
    >
      <div>
        <a-checkbox-group v-model="listValue">
          <a-row>
            <a-col class="p10" :span="8" v-for="(item, index) in columnsData" :key="index">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled ? item.disabled : false">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import { debounce, getFormat } from '@/utils/utils';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '../../common/treeSelect';
import noDataTips from '@/components/noDataTips';
import OverviewNumber from 'src/views/common/OverviewNumber';
import ProvinceCityDistrict from '../../common/ProvinceCityDistrict';
import { querySourceType, queryOldSourceType } from '@/views/common/commonQueryApi';
import { ASSET_MANAGEMENT } from '@/config/config.power';
const judgment = [undefined, null, ''];
const allWidth = { width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const columnsData = [
  { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150, disabled: true, fixed: 'left' },
  { title: '资产编码', dataIndex: 'assetCode', width: 150, disabled: true },
  { title: '权属单位', dataIndex: 'organName', width: 150, disabled: true },
  { title: '宗地号', dataIndex: 'theNo', width: 150 },
  { title: '宗地位置', dataIndex: 'location', width: 150 },
  { title: '产权地址', dataIndex: 'seatingPosition', width: 300 },
  { title: '土地面积(㎡)', dataIndex: 'landArea', width: 150, scopedSlots: { customRender: 'landArea' } },
  { title: '资产项目名称', dataIndex: 'projectName', width: 150 },
  { title: '权属用途', dataIndex: 'landCategory', width: 150 },
  { title: '土地类型', dataIndex: 'landType', width: 150 },
  { title: '土地用途', dataIndex: 'landuse', width: 150 },
  { title: '资产-实际产权单位', dataIndex: 'propertyRightUnit', width: 150 },
  { title: '权证-实际保管单位', dataIndex: 'safekeepUnit', width: 150 },
  { title: '计容面积(㎡)', dataIndex: 'acreage', width: 150, scopedSlots: { customRender: 'acreage' } },
  { title: '容积率', dataIndex: 'landRate', width: 150 },
  { title: '权属情况', dataIndex: 'ownershipStatusName', width: 150 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 150 },
  { title: '来源方式', dataIndex: 'sourceName', width: 150, defaultHide: true },
  { title: '使用期限', dataIndex: 'validPeriod', width: 150 },
  { title: '接管日期', dataIndex: 'takeOverDate', width: 150 },
  { title: '运营(㎡)', dataIndex: 'transferOperationArea', width: 150, scopedSlots: { customRender: 'transferOperationArea' } },
  { title: '自用(㎡)', dataIndex: 'selfUserArea', width: 150, scopedSlots: { customRender: 'selfUserArea' } },
  { title: '闲置(㎡)', dataIndex: 'idleArea', width: 150, scopedSlots: { customRender: 'idleArea' } },
  { title: '其他(㎡)', dataIndex: 'otherArea', width: 150, scopedSlots: { customRender: 'otherArea' } },
  { title: '财务卡片编码', dataIndex: 'cardCode', width: 150 },
  { title: '资产原值(元)', dataIndex: 'originalValue', width: 150, scopedSlots: { customRender: 'originalValue' } },
  { title: '最新估值(元)', dataIndex: 'marketValue', width: 150, scopedSlots: { customRender: 'marketValue' } },
  { title: '批准日期', dataIndex: 'approvalDate', width: 150 },
  { title: '资产状态', dataIndex: 'statusName', width: 150 },
  { title: '质押', dataIndex: 'pledgeName', width: 100 },
  { title: '抵押', dataIndex: 'mortgageName', width: 100 },
  { title: '涉诉', dataIndex: 'lawsuitName', width: 100 },
  { title: '涉诉情况', dataIndex: 'lawsuitRemark', width: 150 },
  { title: '地块是否已签订土地交储协议', dataIndex: 'isSign', width: 160 },
  { title: '是否城市更新项目', dataIndex: 'cityUpdate', width: 150 },
  { title: '三旧改造图编号', dataIndex: 'transformDrawingNo', width: 150 },
  { title: '四至范围', dataIndex: 'fourToRange', width: 350 },
  { title: '是否确权', dataIndex: 'isRight', width: 150 },
  { title: '缴纳土地出让金时间', dataIndex: 'payAssignmentTime', width: 150 },
  { title: '资产原始来源方', dataIndex: 'originSource', width: 150 },
  { title: '原始来源方式', dataIndex: 'oldSourceModeName', width: 150 },
  { title: '土地备注', dataIndex: 'desc', width: 150, scopedSlots: { customRender: 'desc' } },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 90, fixed: 'right' },
];
const approvalStatusData = [
  { name: '全部状态', value: '' },
  { name: '待入库', value: '0' },
  { name: '正常', value: '1' },
  { name: '报废', value: '2' },
  { name: '转让', value: '3' },
  { name: '报损', value: '4' },
  { name: '已出库', value: '5' },
  { name: '已取消', value: '6' },
  { name: '入库中', value: '7' },
];
const queryCondition = {
  city: '', // 市
  province: '', // 省
  region: '', // 区
  flag: '', // 类型：0运营；1闲置；2自用；3占用；4其他
  landName: '', // 资产名称/编码模糊查询
  objectTypes: '', // 资产分类(多选)
  organId: '', // 组织机构id
  projectId: '', //类型：String  必有字段  备注：项目id
  statuss: ['0', '1', '2', '3', '4', '7'], // 资产状态(多选)
  useType: '', // 用途
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示记录数
  address: '', // 地理位置
  originSource: '', // 资产原始来源方
  landCategory: '',
  sourceModes: '', // 来源方式
};
const decimalFormat = (area) => {
  return Math.round(area * 10000) / 10000;
};
// 概览数字数据, title 标题，value 数值，bgColor 背景色
const numList = [
  { title: '资产数量', key: 'assetCount', value: 0, fontColor: '#324057' },
  { title: '土地面积(㎡)', key: 'area', value: 0, bgColor: '#4BD288' },
  { title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#1890FF', flag: '0' },
  { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#DD81E6', flag: '1' },
  { title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#FD7474', flag: '2' },
  { title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#BBC8D6', flag: '3' },
  { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#4BD288', flag: '4' },
];
export default {
  components: { SearchContainer, TreeSelect, noDataTips, OverviewNumber, ProvinceCityDistrict },
  props: {},
  watch: {
    toggle(val) {
      this.$set(this.scroll, 'y', val ? 'calc(100vh - 481px)' : 'calc(100vh - 380px)');
    },
  },
  data() {
    return {
      oldSourceOptions: [],
      oldSourceModes: ['all'], // 原始来源方式
      getFormat,
      ASSET_MANAGEMENT,
      exportBtnLoading: false,
      modalShow: false,
      overviewNumSpinning: false,
      current: '',
      listValue: ['changeOrderDetailId', 'assetCode', 'assetName'],
      columnsData,
      scroll: { x: 1300, y: 'calc(100vh - 481px)' },
      numList: numList,
      provinces: {
        province: undefined,
        city: undefined,
        district: undefined,
      },
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns: columnsData,
      organName: '',
      organId: '',
      address: '',
      originSource: '',
      tableData: [],
      approvalStatusData: [...approvalStatusData],
      queryCondition: { ...queryCondition },
      count: '',
      ownershipStatusObj: {
        0: '无证',
        1: '有证',
        2: '待办',
      },
      sourceOptions: [
        {
          key: '',
          title: '全部来源方式',
        },
      ],
      projectData: [
        {
          name: '全部资产项目',
          value: '',
        },
      ],
      // assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: '',
        },
      ],
      useTypeOptions: [
        {
          name: '全部用途',
          value: '',
        },
      ],
      totalField: {
        landArea: '', // 土地面积
        acreage: '', // 计容面积
        transferOperationArea: '', // 运营
        selfUserArea: '', // 自用
        idleArea: '', // 闲置
        otherArea: '', // 其他
        originalValue: '', // 资产原值
        marketValue: '', // 最新估值
      },
      listLength: 0,
    };
  },
  computed: {},
  methods: {
    // 原始来源方式
    changeOldSource(value) {
      let lastIndex = value.length - 1;
      this.oldSourceModes = value[lastIndex] === 'all' ? ['all'] : value.filter((m) => m !== 'all');
    },
    // 根据原始查询来源方式
    async getOldSourceOptions() {
      this.oldSourceOptions = [];
      this.oldSourceModes = ['all'];
      queryOldSourceType(this).then((list) => {
        return (this.oldSourceOptions = [{ key: 'all', title: '全部原始来源方式' }].concat(list));
      });
    },
    // 查询和导出使用
    initQueryReqParams(options) {
      // 选择导出的列名
      let obj = {};
      if (options) obj = options;
      return {
        city: this.provinces.city ? this.provinces.city : '', // 市
        province: this.provinces.province ? this.provinces.province : '', // 省
        region: this.provinces.district ? this.provinces.district : '', // 区
        flag: this.current, // 类型：0运营；1闲置；2自用；3占用；4其他
        landName: this.queryCondition.landName, // 资产名称/编码模糊查询
        objectTypes: this.alljudge(this.queryCondition.objectTypes), // 资产分类(多选)
        useTypes: this.alljudge(this.queryCondition.useType), // 用途(多选)
        organIds: this.queryCondition.organId.toString(), // 组织机构id
        projectId: this.alljudge(this.queryCondition.projectId), // 项目id
        statuss: this.alljudge(this.queryCondition.statuss), // 资产状态(多选)
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        landCategory: this.queryCondition.landCategory,
        address: this.address, // 详细地址
        originSource: this.originSource, // 资产原始来源方
        sourceModes: this.alljudge(this.queryCondition.sourceModes),
        oldSourceModes: this.oldSourceModes.includes('all') ? [] : this.oldSourceModes,
        ...obj,
      };
    },
    // 导出数据
    handleExport() {
      this.exportBtnLoading = true;
      // 这里导出的参数 与搜索条件 实时同步(参照之前的风格)
      let obj = this.initQueryReqParams({
        display: this.columns.filter((col) => col.key !== 'action').map((m) => m.dataIndex),
      });
      let filename = '土地资产视图导出列表';
      this.$api.land
        .exportAssetLandViewList(obj)
        .then((res) => {
          this.exportBtnLoading = false;
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([res.data]));
            a.download = `${filename}.xls`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            return a.remove();
          }
          throw res.message || '导出土地资产视图列表失败';
        })
        .catch((err) => {
          this.exportBtnLoading = false;
          this.$message.error(err || '导出土地资产视图列表失败');
        });
    },
    // 查看土地资产视图详情
    handleViewDetail({ assetLandId, assetId }) {
      const query = {
        organId: this.queryCondition.organId,
        organName: this.organName,
      };
      this.$router.push({ path: 'landAssetsView/detail', query: { assetLandId, assetId, ...query } });
    },
    // 点击总览数据块
    // 0运营；1闲置；2自用；3占用；4其他
    handleClickOverview({ i }) {
      this.current = i;
      this.allQuery('');
    },
    // 列表设置
    listSet() {
      // 默认不显示来源方式,
      this.listValue = columnsData
        .filter((ele) => !ele.defaultHide)
        .map((item) => {
          return item.dataIndex;
        });
      this.modalShow = true;
    },
    commonFn() {
      let arr = [];
      columnsData.forEach((item) => {
        if (this.listValue.includes(item.dataIndex)) {
          // 当做过列表设置确定操作之后,判断默认不展示的属性删除掉,按照旧有逻辑进行
          delete item.defaultHide;
          arr.push(item);
        }
      });
      this.columns = arr;
      this.scroll = { x: this.columns.length * 150, y: 'calc(100vh - 481px)' };
      this.modalShow = false;
    },
    // 组织机构树
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = '';
      this.queryCondition.objectTypes = '';
      this.queryCondition.useType = '';
      this.getObjectKeyValueByOrganIdFn();
      this.getSourceOptions();
      this.getListFn();
      this.allQuery();
      this.queryLandUseList();
    },
    // 搜索
    allQuery(str) {
      this.queryCondition.pageNum = 1;
      this.query(str);
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
        organIds: this.queryCondition.organId.toString(),
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
    async getSourceOptions() {
      let organId = this.queryCondition.organId.toString();
      this.sourceOptions = [];
      this.queryCondition.sourceModes = '';
      querySourceType(organId, this).then((list) => {
        return (this.sourceOptions = [{ key: '', title: '全部来源方式' }].concat(list));
      });
    },
    // 资产分类列表
    getListFn() {
      if (!this.queryCondition.organId) {
        return;
      }
      let obj = {
        organId: this.queryCondition.organId.split(',')[0],
        assetType: '4',
      };
      this.$api.assets.getList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.professionName,
              value: item.professionCode,
            });
          });
          this.assetClassifyData = [{ name: '全部资产分类', value: '' }, ...arr];
        }
      });
    },
    // 资产分类
    assetClassifyDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.objectTypes = this.handleMultipleSelectValue(value, this.queryCondition.objectTypes, this.assetClassifyData);
      });
    },
    // 用途
    useTypeChange(value) {
      this.$nextTick(function () {
        this.queryCondition.useType = this.handleMultipleSelectValue(value, this.queryCondition.useType, this.useTypeOptions);
      });
    },
    // 项目
    projectIdFn(value) {
      this.$nextTick(function () {
        this.queryCondition.projectId = this.handleMultipleSelectValue(value, this.queryCondition.projectId, this.projectData);
      });
    },
    // 来源方式
    changeSource(value) {
      this.$nextTick(function () {
        this.queryCondition.sourceModes = this.handleMultipleSelectValue(value, this.queryCondition.sourceModes, this.sourceOptions);
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.statuss = this.handleMultipleSelectValue(value, this.queryCondition.statuss, this.approvalStatusData);
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
      this.queryCondition = { ...queryCondition };
      this.queryCondition.organId = organId;
      this.$refs.ProvinceCityDistrict.allClearFn();
      this.query();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    alljudge(val) {
      let str = '';
      if (val.length !== 0) {
        if (val[0] === '') {
          return '';
        } else {
          str = val.join(',');
          return str;
        }
      } else {
        return '';
      }
    },
    // 查询
    query(str) {
      this.loading = true;
      let obj = this.initQueryReqParams();
      if (str !== 'asset') {
        this.assetViewTotal(obj);
      }
      this.$api.land.assetView(obj).then((res) => {
        this.loading = false;
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index;
              item.ownershipStatusName = String(item.ownershipStatus) ? this.ownershipStatusObj[String(item.ownershipStatus)] : '';
            });
            this.tableData = [...data];
            this.listLength = data.length;
            this.count = res.data.data.count;
            this.totalFn(obj);
          } else {
            this.tableData = [];
            this.count = 0;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 合计汇总合并
    totalFn: debounce(function (obj) {
      this.loading = true;
      this.$api.land.assetViewListTotal(obj).then((res) => {
        if (String(res.data.code) === '0') {
          let data = res.data.data;
          this.totalField.landArea = judgment.includes(data.area) ? 0 : decimalFormat(data.area); // 土地面积
          this.totalField.acreage = judgment.includes(data.acreageTotal) ? 0 : decimalFormat(data.acreageTotal); // 计容面积
          this.totalField.transferOperationArea = judgment.includes(data.transferOperationArea) ? 0 : decimalFormat(data.transferOperationArea); // 运营
          this.totalField.selfUserArea = judgment.includes(data.selfUserArea) ? 0 : decimalFormat(data.selfUserArea); // 自用
          this.totalField.idleArea = judgment.includes(data.idleArea) ? 0 : decimalFormat(data.idleArea); // 闲置
          this.totalField.otherArea = judgment.includes(data.otherArea) ? 0 : decimalFormat(data.otherArea); // 其他
          this.totalField.originalValue = judgment.includes(data.originalValue) ? 0 : Math.round(data.originalValue * 100) / 100; // 资产原值
          this.totalField.marketValue = judgment.includes(data.marketValue) ? 0 : Math.round(data.marketValue * 100) / 100; // 最新估值
          let obj = { assetName: '所有页-合计', key: 'key', ...this.totalField };
          this.$set(this.tableData, this.listLength, obj);
          for (let key in data) {
            data[key] = getFormat(data[key]);
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.message);
        }
      });
    }, 400),
    // 资产登记-详情明细统计
    assetViewTotal(obj) {
      this.overviewNumSpinning = true;
      const params = {
        ...obj,
      };
      params.pageNum = 1;
      params.pageSize = 1;
      this.$api.land.assetViewTotal(params).then((res) => {
        if (Number(res.data.code) === 0) {
          this.overviewNumSpinning = false;
          let data = res.data.data;
          this.numList = numList
            .map((m) => {
              return { ...m, value: data[m.key] ? (['assetCount'].includes(m.key) ? data[m.key] : Math.round(data[m.key] * 10000) / 10000) : 0 };
            })
            .filter((item) => {
              return item.value !== 0;
            });
        } else {
          this.$message.error(res.data.message);
          this.overviewNumSpinning = false;
        }
      });
    },
    // 取全部土地用途
    queryLandUseList() {
      let data = {
        dictCode: 'OCM_LANDUSE',
        dictFlag: '1',
        groupIds: this.queryCondition.organId[0],
        code: 'OCM_LANDUSE',
        organId: this.queryCondition.organId[0],
      };
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data;
          this.useTypeOptions = [{ name: '全部用途', value: '' }, ...data];
        }
      });
    },
  },
  created() {},
  mounted() {
    this.getOldSourceOptions();
    this.columns = this.columns.filter((ele) => !ele.defaultHide);
  },
};
</script>
<style lang="less" scoped>
.landAssetsView {
  .ellipsis {
    width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    //padding-bottom: 60px;
    & /deep/ table {
      tr:last-child,
      tr:nth-last-child(1) {
        font-weight: bold;
      }
    }
  }
  .overflowX {
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
  .city {
    width: 100%;
    // float: right;
    // margin-right: 8px;
    /deep/.ant-col-8 {
      width: 180px;
    }
    /deep/.province_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
