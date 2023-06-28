<!--
  资产变更一览表  /assetChangeView
-->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{ paddingTop: '16px' }">
      <div slot="headerBtns">
        <SG-Button type="primary" @click="downloadFn" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_LIST_EXPORT">
          <segiIcon type="#icon-ziyuan10" class="icon-right" />导出
        </SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" style="width: 170px; margin-right: 10px"></treeSelect>
        <a-input-search
          v-model="queryCondition.assetName"
          placeholder="资产名称/编码"
          :maxLength="40"
          style="width: 140px; margin-right: 10px"
          @search="onSearch"
        />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部状态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.approvalStatus"
          >
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部变更类型"
            :tokenSeparators="[',']"
            @select="changeStatus"
            v-model="queryCondition.changeType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
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
            @change="assetTypeDataFn"
            v-model="queryCondition.assetType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <EquipmentSelectTree
            v-if="isSelectedEquipment"
            :style="allStyle"
            :top-organ-id="queryCondition.organId.split(',')[0]"
            :multiple="true"
            v-model="queryCondition.assetClassify"
            :options-data-format="
              (data) => {
                return [{ label: '全部资产分类', value: '', isLeaf: true }, ...data];
              }
            "
            @select="assetClassifyDataFn($event, true)"
          />
          <a-select
            v-else
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部分类"
            :tokenSeparators="[',']"
            @select="assetClassifyDataFn"
            v-model="queryCondition.assetClassify"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker label="提交日期" style="width: 232px" pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
          </div>
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker
              label="变更日期"
              style="width: 232px"
              pickerType="RangePicker"
              v-model="alterationDate"
              format="YYYY-MM-DD"
            ></SG-DatePicker>
          </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">重置</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
      <!--  ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false">
        <!-- <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover>
        </template> -->
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
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '../../common/treeSelect';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import segiIcon from '@/components/segiIcon.vue';
import noDataTips from '@/components/noDataTips';
import { utils, debounce } from '@/utils/utils.js';
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
const allWidth = { width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const dateWidth = { width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const columns = [
  {
    title: '变更编号',
    dataIndex: 'changeOrderDetailId',
  },
  {
    title: '资产编号',
    dataIndex: 'assetCode',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName',
  },
  {
    title: '所属变更单',
    dataIndex: 'changeOrderId',
  },
  {
    title: '变更类型',
    dataIndex: 'changeTypeName',
  },
  {
    title: '变更前信息',
    dataIndex: 'oldChangeInfo',
  },
  {
    title: '变更后信息',
    dataIndex: 'changeInfo',
  },
  {
    title: '变更时间',
    dataIndex: 'changeDate',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '提交人',
    dataIndex: 'createByName',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
  },
];
const operationData = [
  { iconType: 'form', text: '修改', editType: 'edit' },
  { iconType: 'delete', text: '删除', editType: 'delete' },
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
  organId: '', // 组织机构id
  approvalStatus: '', // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
  projectId: '', // 资产项目Id
  changeType: '', // 变更类型
  assetType: '', // 资产类型Id
  assetClassify: '', // 资产分类
  startDate: '', // 创建日期开始日期
  endDate: '', // 创建日期结束日期
  changStartDate: '', // 变更日期开始
  changEndDate: '', // 变更日期结束
  currentOrganId: '', // 仅当前机构下资产清理单 0 否 1 是
  assetName: '', // 资产名称/编码模糊查询
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示记录数
};
export default {
  components: { SearchContainer, TreeSelect, segiIcon, noDataTips, EquipmentSelectTree },
  props: {},
  data() {
    return {
      ASSET_MANAGEMENT,
      dateWidth,
      // scrollHeight: {y: 0},
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      operationData: [...operationData],
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
          name: '全部资产分类',
          value: '',
        },
      ],
      defaultValue: [],
      alterationDate: [],
    };
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.queryCondition.assetType;
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  methods: {
    // 导出
    downloadFn() {
      let obj = {
        projectId: this.queryCondition.projectId, // 资产项目Id
        organIds: this.queryCondition.organId, // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '', // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        startCreateDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '', // 创建日期开始日期
        endCreateDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '', // 创建日期结束日期
        currentOrganId: this.queryCondition.currentOrganId, // 仅当前机构下资产清理单 0 否 1 是
        // pageNum: this.queryCondition.pageNum,     // 当前页
        // pageSize: this.queryCondition.pageSize,    // 每页显示记录数
        multiChangeType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '', // 变更类型
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetCodeName: this.queryCondition.assetName, // 资产名称/编码模糊查询
        startChangeDate: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '', // 变更日期开始
        endChangeDate: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '', // 变更日期结束
      };
      this.$api.assets.exportChangeScheduleList(obj).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '资产变更一览表.xls';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 组织机构树
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = '';
      this.queryCondition.assetClassify = '';
      this.getObjectKeyValueByOrganIdFn();
      this.getListFn();
      this.query();
    },
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
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
    // 平台字典获取变更类型
    platformDictFn(str) {
      let obj = {
        code: str,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === 'asset_change_type') {
            this.changeTypeData = [{ name: '全部变更类型', value: '' }, ...data];
          } else if (str === 'asset_type') {
            this.assetTypeData = [{ name: '全部资产类型', value: '' }, ...data];
            this.getListFn();
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // organDict () {
    //   this.$api.assets.organDict({code: 'approval_status_type'}).then(res => {
    //     if (Number(res.data.code) === 0) {
    //       let data = res.data.data
    //       this.approvalStatusData = [{name: '全部状态', value: ''}, ...data]
    //     } else {
    //       this.$message.error(res.data.message)
    //     }
    //   })
    // },
    // 资产分类列表
    getListFn() {
      if (!this.queryCondition.organId) {
        return;
      }
      let obj = {
        organId: this.queryCondition.organId.split(',')[0],
        assetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',
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
    assetClassifyDataFn(value, isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyData;
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, resOptions);
      });
    },
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData);
        if (!this.queryCondition.assetType[0] || this.queryCondition.assetType.length > 1) {
          this.assetClassifyData = [{ name: '全部资产分类', value: '' }];
          this.queryCondition.assetClassify = [''];
        } else {
          this.getListFn();
        }
      });
    },
    // 状态发生变化
    changeStatus(value) {
      this.$nextTick(function () {
        this.queryCondition.changeType = this.handleMultipleSelectValue(value, this.queryCondition.changeType, this.changeTypeData);
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
      this.alterationDate = [];
      this.defaultValue = [];
      this.queryCondition = { ...queryCondition };
      this.query();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 计算滚动条宽度
    // computedHeight () {
    //   let elem = this.$refs.table_box
    //   if (!elem) {
    //     return
    //   }
    //   let height = utils.AdjustHeight(elem)
    //   let y = parseFloat(height) < 200 || !height ? 200 : parseFloat(height)
    //   this.scrollHeight = {y: y - 70 - 40}
    //   console.log(this.scrollHeight, '-=-=-=')
    // },
    // // 防抖函数
    // debounceMothed: debounce(function () {
    //   this.computedHeight()
    // }, 200),
    // 查询
    query() {
      this.loading = true;
      let obj = {
        projectId: this.queryCondition.projectId, // 资产项目Id
        organIds: this.queryCondition.organId, // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '', // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        startCreateDate: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '', // 创建日期开始日期
        endCreateDate: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '', // 创建日期结束日期
        currentOrganId: this.queryCondition.currentOrganId, // 仅当前机构下资产清理单 0 否 1 是
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        multiChangeType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '', // 变更类型
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetCodeName: this.queryCondition.assetName, // 资产名称/编码模糊查询
        startChangeDate: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '', // 变更日期开始
        endChangeDate: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '', // 变更日期结束
      };
      this.$api.assets.getChangeSchedulePage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index;
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
    },
  },
  created() {},
  mounted() {
    // this.computedHeight()
    // window.addEventListener('resize', () => {
    //   this.debounceMothed()
    // })
    // 获取变更类型
    this.platformDictFn('asset_change_type');
    // 获取状态
    // this.organDict('approval_status_type')
    // 资产类型
    this.platformDictFn('asset_type');
  },
};
</script>
<style lang="less" scoped>
.scheduleChanges {
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
    padding-bottom: 60px;
  }
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
</style>
