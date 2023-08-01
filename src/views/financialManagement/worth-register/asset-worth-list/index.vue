<!--价值登记页面--资产价值一览表Tab页面-->
<template>
  <div class="asset_worth_list pb70">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="export" @click="handleExport" :loading="exportBtnLoading" v-power="ASSET_MANAGEMENT.ASSET_IN_LIST_EXPORT">导出</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <tree-select @changeTree="changeTree" :multiple="true" style="width: 180px" :showSearch="true" />
        <a-input placeholder="请输入资产名称或编码" @pressEnter="queryTableData" v-model.trim="assetNameCode" style="width: 180px; margin: 0 10px" />
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-select
              v-bind="properties"
              :options="$addTitle(projectOptions)"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              v-model="organProjectType.projectId"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              v-bind="properties"
              placeholder="请选择资产类型"
              :options="$addTitle(assetTypeOptions)"
              :filterOption="filterOption"
              v-model="organProjectType.assetType"
              @select="changeAssetType"
            />
          </a-col>
          <a-col :span="5">
            <EquipmentSelectTree
              v-if="isSelectedEquipment"
              style="width: 300px"
              :top-organ-id="organProjectType.organId.split(',')[0]"
              :multiple="true"
              v-model="assetCategoryId"
              :options-data-format="
                (data) => {
                  return [{ label: '全部资产分类', value: '-1', isLeaf: true }, ...data];
                }
              "
              @select="changeAssetClassify($event, true)"
            />
            <a-select
              v-else
              mode="multiple"
              v-bind="properties"
              v-model="assetCategoryId"
              :options="$addTitle(categoryOptions)"
              placeholder="请选择资产分类"
              @select="changeAssetClassify($event)"
            />
          </a-col>
          <a-col :span="5">
            <a-date-picker @change="changeDate" style="width: 100%" placeholder="请选择评估基准日期" :defaultValue="moment()" />
          </a-col>
          <a-col :span="3" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">重置</SG-Button>-->
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据总览-->
    <overview-number :numList="numList" style="margin-bottom: 8px" />
    <!--列表部分-->
    <!-- size="middle" -->
    <a-table v-bind="tableObj" class="custom-tables">
      <template slot="assetCode" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="assetName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="organName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="projectName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="assetTypeName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="assetCategoryName" slot-scope="text">
        <tooltip-text :text="text" />
      </template>
      <template slot="action" slot-scope="text, record">
        <span v-if="record.projectName !== '合计：'" class="action_text" @click="viewTrendAction(true, record)">趋势图</span>
      </template>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" />
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength, type: page })" />
    <!--查看趋势图-->
    <SG-Modal title="资产估值趋势图" :footer="null" v-model="isShowTrend" @cancel="viewTrendAction(false)">
      <trend-chart-part :key="assetId" :assetId="assetId" :originalValue="originalValue" />
    </SG-Modal>
  </div>
</template>

<script>
import moment from 'moment';
import NoDataTip from 'src/components/noDataTips';
import TreeSelect from 'src/views/common/treeSelect';
import TrendChartPart from './component/TrendChartPart';
import { ASSET_MANAGEMENT } from 'src/config/config.power';
import OverviewNumber from 'src/views/common/OverviewNumber';
import SearchContainer from 'src/views/common/SearchContainer';
import TooltipText from 'src/views/common/TooltipText';
import { queryCategoryList, queryProjectListByOrganId, filterOption, queryAssetTypeList, exportDataAsExcel } from 'src/views/common/commonQueryApi';
import EquipmentSelectTree from '../../../common/EquipmentSelectTree';
export default {
  name: 'index',
  components: { EquipmentSelectTree, SearchContainer, TreeSelect, NoDataTip, TrendChartPart, OverviewNumber, TooltipText },
  data() {
    return {
      moment,
      assetId: '', // 资产ID
      ASSET_MANAGEMENT, // 权限对象
      fold: true, // 查询条件折叠按钮
      isShowTrend: false, // 显示趋势图Modal
      assetNameCode: '', // 查询条件-登记名称
      exportBtnLoading: false, // 导出按钮loading
      assessmenBaseDate: moment().format('YYYY-MM-DD'), // 查询条件-日期,默认当天
      originalValue: 0, // 资产原值,趋势图中展示
      categoryOptions: [{ title: '全部资产分类', key: '-1' }], // 查询条件-资产分类选项
      assetCategoryId: undefined, // 查询条件-资产分类id
      organProjectType: {
        organId: '',
        organName: '',
        projectId: undefined,
        assetType: undefined,
      }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
      projectOptions: [], // 资产项目选项
      assetTypeOptions: [], // 资产类型选项
      tableObj: {
        dataSource: [],
        loading: false,
        scroll: { x: 2600 },
        pagination: false,
        rowKey: 'assetId',
        columns: [
          { title: '资产编号', dataIndex: 'assetCode', fixed: 'left', width: '150px', scopedSlots: { customRender: 'assetCode' } },
          { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: '150px', scopedSlots: { customRender: 'assetName' } },
          { title: '资产类型', dataIndex: 'assetTypeName', width: '150px', scopedSlots: { customRender: 'assetTypeName' } },
          { title: '资产分类', dataIndex: 'assetCategoryName', width: '150px', scopedSlots: { customRender: 'assetCategoryName' } },
          { title: '所属机构', dataIndex: 'organName', width: '150px', scopedSlots: { customRender: 'organName' } },
          { title: '资产项目', dataIndex: 'projectName', width: '150px', scopedSlots: { customRender: 'projectName' } },
          { title: '资产原值(元)', dataIndex: 'originalValue', width: '150px' },
          { title: '首次成本法估值(元)', dataIndex: 'assetValuation' },
          { title: '首次市场法估值(元)', dataIndex: 'firstMarketValue' },
          { title: '最新估值(元)', dataIndex: 'assessmentValue', width: '150px' },
          { title: '评估方法', dataIndex: 'assessmentMethodName' },
          { title: '评估机构', dataIndex: 'assessmentOrganName' },
          { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
          { title: '操作', dataIndex: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 120 },
        ],
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
      numList: [
        { title: '资产总数', key: 'total', value: 0, fontColor: '#324057' },
        { title: '资产原值(元)', key: 'originalValue', value: 0, fontColor: '#324057' },
        { title: '首次成本法估值(元)', key: 'assetValuation', value: 0, fontColor: '#324057' },
        { title: '首次市场法估值(元)', key: 'firstMarketValue', value: 0, fontColor: '#324057' },
        { title: '最新价值(元)', key: 'marketValue', value: 0, fontColor: '#324057' },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      properties: { allowClear: true, showSearch: true, maxTagCount: 1, style: 'width: 100%' }, // 查询表单控件公共属性
    };
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.organProjectType.assetType || [];
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },

  methods: {
    // 下拉搜索筛选
    filterOption,

    // 获取选择的组织机构
    changeTree(organId, organName) {
      Object.assign(this.organProjectType, {
        projectId: undefined,
        organName,
        organId,
      });
      this.projectOptions = []; // 清空
      this.queryProjectByOrganId(organId);
      organId && this.queryTableData({});
      this.queryCategoryOptions();
    },

    // 根据organId查询资产项目
    queryProjectByOrganId(organId) {
      organId && queryProjectListByOrganId(organId).then((list) => (list ? (this.projectOptions = list) : this.$message.error('查询资产项目失败')));
    },

    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then((list) => {
        list ? (this.assetTypeOptions = [{ title: '全部资产类型', key: '-1' }].concat(list)) : this.$message.error('查询楼栋失败');
      });
    },

    // 导出
    handleExport() {
      this.exportBtnLoading = true;
      let data = this.queryTableData({ type: 'export' });
      exportDataAsExcel(data, this.$api.tableManage.exportValueExcel, '资产价值一览表.xlsx', this).then(() => {
        this.exportBtnLoading = false;
      });
    },

    // 查询列表数据
    queryTableData({ pageNo = 1, pageLength = 10, type }) {
      const {
        assetNameCode,
        assetCategoryId,
        organProjectType,
        organProjectType: { assetType },
        assessmenBaseDate,
      } = this;
      if (!organProjectType.organId) {
        return this.$message.info('请选择组织机构');
      }
      let form = {
        assetNameCode,
        pageSize: pageLength,
        pageNum: pageNo,
        assessmenBaseDate,
        ...organProjectType,
        assetType: !assetType || assetType.includes('-1') ? undefined : assetType.join(','),
        assetCategoryId: !assetCategoryId || assetCategoryId.includes('-1') ? undefined : assetCategoryId.join(','),
      };
      form.organIds = form.organId;
      delete form.organId;
      if (type === 'export') {
        return form;
      }
      this.tableObj.loading = true;
      this.$api.worthRegister
        .queryAssetValuePageList(form)
        .then((r) => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            this.tableObj.dataSource = data;
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
            // 查询统计信息
            if (!type) {
              this.querySumInfo(form);
            }
            return this.calcTotal(form);
          }
          throw res.message || '资产价值一览表接口出错';
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || '资产价值一览表接口出错');
        });
    },

    // 处理登记日期
    changeDate(date, dateString) {
      this.assessmenBaseDate = dateString;
      this.queryTableData({});
    },

    // 查看趋势图
    viewTrendAction(bool, record) {
      this.isShowTrend = bool;
      if (bool) {
        this.assetId = record.assetId;
        this.originalValue = record.originalValue;
      }
    },

    // 查询统计信息
    querySumInfo(form) {
      this.$api.worthRegister
        .queryPageListSum(form)
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            let { numList } = this;
            return (this.numList = numList.map((m) => {
              return { ...m, value: (res.data || {})[m.key] || 0 };
            }));
          }
          throw res.message;
        })
        .catch((err) => {
          this.$message.error(err || '查询汇总接口出错');
        });
    },
    // 资产分类发生变化
    changeAssetClassify(value, isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.categoryOptions;
        this.assetCategoryId = this.handleMultipleSelectValue(value, this.assetCategoryId, resOptions);
      });
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function () {
        this.categoryOptions = [{ title: '全部资产分类', key: '-1' }];
        this.organProjectType.assetType = this.handleMultipleSelectValue(value, this.organProjectType.assetType, this.assetTypeOptions);
        this.queryTableData({});
        this.queryCategoryOptions();
      });
    },
    // 根据资产类型查资产分类列表
    queryCategoryOptions() {
      this.categoryOptions = [{ title: '全部资产分类', key: '-1' }];
      const {
        organProjectType: { organId, assetType },
        assetTypeOptions,
      } = this;
      if (!organId || !assetType || !assetType.length) {
        return false;
      }
      let assetVal = '';
      this.assetCategoryId = ['-1'];
      if (assetType.includes('-1')) {
        this.categoryOptions = [{ title: '全部资产分类', key: '-1' }];
        assetVal = [...assetTypeOptions]
          .splice(1)
          .map((m) => m.key)
          .join(',');
        return;
      } else {
        assetVal = assetType.join(',');
      }
      if (assetType.length > 1) {
        return;
      }
      queryCategoryList({ assetType: assetVal, organId: organId.split(',')[0] }).then((list) => {
        list ? (this.categoryOptions = [{ title: '全部资产分类', key: '-1' }].concat(list)) : this.$message.error('查询资产分类失败');
      });
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === '-1') {
        data = ['-1'];
      } else {
        let totalIndex = data.indexOf('-1');
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['-1'];
          }
        }
      }
      return data;
    },
    // 汇总当前页数据
    calcTotal() {
      const {
        tableObj: { dataSource },
      } = this;
      if (dataSource.length) {
        let market = 0;
        let original = 0;
        let asset = 0;
        let assetNew = 0;
        dataSource.forEach((m) => {
          const { firstMarketValue, originalValue, assetValuation, assessmentValue } = m;
          market += firstMarketValue ? Number(firstMarketValue) : 0;
          original += originalValue ? Number(originalValue) : 0;
          asset += assetValuation ? Number(assetValuation) : 0;
          assetNew += assessmentValue ? Number(assessmentValue) : 0;
        });
        this.tableObj.dataSource = dataSource.concat({
          assetId: '-1111',
          projectName: '合计：',
          firstMarketValue: market.toFixed(2),
          originalValue: original.toFixed(2),
          assetValuation: asset.toFixed(2),
          assessmentValue: assetNew.toFixed(2),
        });
        console.log(this.tableObj.dataSource);
      }
    },
  },

  created() {
    this.queryAssetType();
  },

  watch: {
    // 全选与其他选项互斥处理
    // assetCategoryId: function (val) {
    //   if (val && val.length !== 1 && val.includes('-1')) {
    //     this.assetCategoryId = ['-1']
    //   }
    // },
    // 长度不能超过30字符
    assetNameCode: function (val, pre) {
      if (val && val.length > 40) {
        this.$message.warn('登记名称不能超40个字符');
        this.assetNameCode = pre;
      }
    },

    'organProjectType.projectId': function () {
      this.queryTableData({});
    },
  },
};
</script>

<style lang="less" scoped>
.asset_worth_list {
  .custom-table {
    padding-bottom: 70px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
  }
  .action_text {
    color: #0084ff;
    cursor: pointer;
    margin-right: 12px;
    white-space: nowrap;
  }
}
</style>
