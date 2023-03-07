<!--
 * @Author: LW
 * @Date: 2019-12-20 10:00:20
 * @LastEditTime: 2021-07-12 16:49:27
 * @LastEditors: Please set LastEditors
 * @Description: 资产处置一览表
 * @FilePath: \asset-management\src\views\disposalManagement\listDisposal\index.vue
 -->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{ paddingTop: '16px' }">
      <div slot="headerBtns">
        <div style="display: flex">
          <div></div>
          <SG-Button icon="export" @click="handleExport" :loading="exportBtnLoading" v-power="ASSET_MANAGEMENT.czyl_zcst_dc">导出</SG-Button>
          <!-- 防止 v-power 报错 -->
          <div></div>
          <SG-Button
            v-power="ASSET_MANAGEMENT.czyl_zcst_gx"
            :disabled="!selectedRowKeys.length"
            type="primary"
            style="margin-left: 20px"
            icon="export"
            @click="handleOpenPop(selectedRowKeys)"
            :loading="exportBtnLoading"
          >
            更新办证状态
          </SG-Button>
        </div>
      </div>
      <div slot="headerForm">
        <treeSelect
          @changeTree="changeTree"
          placeholder="请选择组织机构"
          :allowClear="false"
          style="width: 170px; margin-right: 10px; text-align: left"
        ></treeSelect>
        <a-input-search
          v-model="queryCondition.assetName"
          placeholder="资产名称/编码"
          :maxLength="30"
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
            placeholder="全部处置类型"
            :tokenSeparators="[',']"
            @select="changeStatus"
            v-model="queryCondition.disposeType"
          >
            <a-select-option :title="item.name" v-for="(item, index) in disposeTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select :style="allStyle" :showSearch="true" :filterOption="filterOption" placeholder="全部资产项目" v-model="queryCondition.projectId">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <!-- <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType" @change="assetTypeFn">
              <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select> -->
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="assetTypeDataFn"
            v-model="queryCondition.assetType"
            @change="assetTypeFn"
          >
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <EquipmentSelectTree
            :style="allStyle"
            v-if="isSelectedEquipment"
            :top-organ-id="queryCondition.organId.split(',')[0]"
            :multiple="true"
            v-model="queryCondition.assetClassify"
            :options-data-format="
              (data) => {
                return [{ label: '全部分类', value: '', isLeaf: true }, ...data];
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
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部处置方式"
            :tokenSeparators="[',']"
            @select="disposeModeDataFn"
            v-model="queryCondition.disposeMode"
          >
            <a-select-option :title="item.name" v-for="(item, index) in disposeModeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部办证状态"
            :tokenSeparators="[',']"
            @select="certificateStatusFn"
            v-model="queryCondition.certificateStatus"
          >
            <a-select-option :title="item.name" v-for="(item, index) in certificateStatusData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-input-search
            :style="allStyle"
            v-model="queryCondition.disposeRegisterDetailId"
            type="number"
            placeholder="处置单编号"
            :maxLength="30"
            style="width: 140px; margin-right: 10px; margin-top: 15px"
            @search="onSearch"
          />
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker label="提交日期" style="width: 232px" pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
          </div>
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker
              label="处置日期"
              style="width: 232px"
              pickerType="RangePicker"
              v-model="alterationDate"
              format="YYYY-MM-DD"
            ></SG-DatePicker>
          </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px" @click="queryFn">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <overview-number :numList="numList" />
    <div class="table-layout-fixed">
      <a-table
        :rowSelection="{ selectedRowKeys, onChange: handleSelectChange, hideDefaultSelections: false, getCheckboxProps: getCheckboxProps }"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        size="middle"
        :pagination="false"
        :scroll="scrollHeight"
      >
        <!-- 是否需协助办证 -->
        <template #isAssistAccreditationName="text, record">
          {{ record.isAssistAccreditationName }}
        </template>
        <!--办证状态-->
        <template #certificateStatusName="text, record">
          {{ record.certificateStatusName }}
        </template>
        <!--操作-->
        <template #action="text, record">
          <!-- 状态:已审批 办证状态:非已办证 -->
          <span
            v-power="ASSET_MANAGEMENT.czyl_zcst_gx"
            v-if="record.approvalStatusName === '已审批' && record.certificateStatusName === '未办证'"
            class="action info"
            @click="handleOpenPop([record.disposeRegisterDetailId])"
          >
            更新办证状态
          </span>
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
    <SG-Modal
      :title="modalObj.certificateStatus.title"
      :visible="modalObj.certificateStatus.flag"
      @cancel="
        () => {
          modalObj.certificateStatus.flag = false;
        }
      "
    >
      <SG-Title title="办证信息" />
      <div class="modal-body">
        <span class="validate-required" style="margin-right: 20px">新办证状态:</span>
        <div style="display: flex; justify-content: center">
          <a-select v-model="modalObj.certificateStatus.params.status" style="min-width: 500px">
            <a-select-option title="已办证" :value="1">已办证</a-select-option>
          </a-select>
        </div>
      </div>
      <div slot="footer">
        <SG-Button type="primary" @click="handleCertificateStatusPop">保存</SG-Button>
        <SG-Button
          style="margin-left: 20px"
          @click="
            () => {
              modalObj.certificateStatus.flag = false;
            }
          "
          >取消</SG-Button
        >
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '../../common/treeSelect';
import moment from 'moment';
import OverviewNumber from 'src/views/common/OverviewNumber';
import noDataTips from '@/components/noDataTips';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { exportDataAsExcel } from 'src/views/common/commonQueryApi';
const allWidth = { width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const dateWidth = { width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', display: 'inline-block', 'vertical-align': 'middle' };
const columns = [
  {
    title: '处置编号',
    dataIndex: 'disposeRegisterDetailId',
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
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName',
  },
  {
    title: '登记单号',
    dataIndex: 'disposeRegisterOrderId',
  },
  {
    title: '处置类型',
    dataIndex: 'disposeTypeName',
  },
  {
    title: '处置方式',
    dataIndex: 'disposeModeName',
  },
  {
    title: '处置日期',
    dataIndex: 'disposeDate',
  },
  {
    title: '处置原因',
    dataIndex: 'disposeReason',
  },
  {
    title: '处置面积(㎡)',
    dataIndex: 'dispArea',
  },
  {
    title: '处置成本(元)',
    dataIndex: 'disposeCost',
  },
  {
    title: '处置收入(元)',
    dataIndex: 'disposeReceive',
  },
  {
    title: '接收方',
    dataIndex: 'assetReceiver',
  },
  {
    title: '是否需协助办证',
    scopedSlots: { customRender: 'isAssistAccreditationName' },
  },
  {
    title: '办证状态',
    scopedSlots: {
      customRender: 'certificateStatusName',
    },
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
  {
    title: '操作',
    width: 120,
    dataIndex: 'action',
    scopedSlots: {
      customRender: 'action',
    },
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
  disposeType: '', // 变动类型
  assetType: '', // 资产类型Id
  assetClassify: '', // 资产分类
  disposeMode: '', // 处置方式
  certificateStatus: '', // 办证状态
  startDate: '', // 创建日期开始日期
  endDate: '', // 创建日期结束日期
  changStartDate: '', // 变动日期开始
  changEndDate: '', // 变动日期结束
  currentOrganId: '', // 仅当前机构下资产清理单 0 否 1 是
  assetName: '', // 资产名称/编码模糊查询
  disposeRegisterDetailId: '', //处置单编号
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示记录数
};
export default {
  components: { SearchContainer, TreeSelect, noDataTips, OverviewNumber, EquipmentSelectTree },
  props: {},
  watch: {
    toggle(flag) {
      this.$set(this.scrollHeight, 'y', flag ? 'calc(100vh - 500px)' : 'calc(100vh - 350px)');
    },
  },
  data() {
    return {
      certificateStatusOptions: {
        0: '未办证',
        1: '已办证',
        2: '--',
      },
      ASSET_MANAGEMENT,
      dateWidth,
      selectedRowKeys: [],
      scrollHeight: { y: 'calc(100vh - 500px)' },
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
      disposeTypeData: [],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部分类',
          value: '',
        },
      ],
      disposeModeData: [],
      certificateStatusData: [
        { name: '全部办证状态', value: '' },
        { name: '已办证', value: '1' },
        { name: '未办证', value: '0' },
      ],
      defaultValue: [],
      alterationDate: [],
      exportBtnLoading: false, // 导出按钮loading
      numList: [
        { title: '资产数量(个)', key: 'dispNum', value: 0, fontColor: '#324057' },
        { title: '处置面积(㎡)', key: 'dispArea', value: 0, bgColor: '#4BD288' },
        { title: '处置收入(元)', key: 'disposeReceive', value: 0, bgColor: '#1890FF' },
        { title: '已办证(个)', key: 'certificated', value: 0, bgColor: '#DD81E6' },
        { title: '未办证(个)', key: 'noCertificate', value: 0, bgColor: '#FD7474' },
      ],
      modalObj: {
        certificateStatus: {
          flag: false,
          title: '更新办证状态',
          params: {
            idArr: [],
            status: '',
          },
        },
      },
    };
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.queryCondition.assetType;
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  methods: {
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.approvalStatusName !== '已审批' || record.certificateStatusName !== '未办证',
        },
      };
    },
    /*
     * 选中 表格行
     * */
    handleSelectChange(selectedRowKeys) {
      // this.selectedRowKeys = selectedRows.map(ele=>ele.disposeRegisterDetailId)
      this.selectedRowKeys = selectedRowKeys;
    },
    /*
     * 关闭弹窗
     * */
    doClosePop() {
      this.modalObj.certificateStatus.flag = false;
    },
    /*
     * 打开 编辑 新办证状态 弹窗
     * */
    handleOpenPop(idArr) {
      this.modalObj.certificateStatus.params.idArr = idArr;
      this.modalObj.certificateStatus.flag = true;
    },
    handleValidateCertificateStatusPop() {
      if (!this.modalObj.certificateStatus.params.status) {
        return '请选择新办证信息';
      }
    },
    /*
     * 弹窗 保存按钮 更新办证状态
     * */
    async handleCertificateStatusPop() {
      let errorMsg = this.handleValidateCertificateStatusPop();
      if (errorMsg) {
        await this.$message.error(errorMsg);
        return null;
      }
      let requestData = {
        disposeRegisterDtailIdList: this.modalObj.certificateStatus.params.idArr,
      };
      let loadingName = this.SG_Loding('更新中...');
      try {
        let responseData = await this.$api.assets.updateCertificateStatus(requestData);
        if (responseData.data.code === '0') {
          await this.DE_Loding(loadingName);
          this.$message.success('更新成功');
          // 清空 旧选中数据
          this.handleSelectChange([]);
          this.doClosePop();
          this.queryFn();
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$message.error(responseData.data.message);
          });
        }
      } catch (error) {
        console.error(error);
        this.DE_Loding(loadingName).then(() => {
          this.$message.error('更新失败');
        });
      }
    },
    // 导出
    handleExport() {
      this.exportBtnLoading = true;
      let data = this.query('export');
      exportDataAsExcel(data, this.$api.tableManage.exportDetailExcel, '资产处置一览表.xlsx', this).then(() => {
        this.exportBtnLoading = false;
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
      this.getDetailAndDisposeListStat();
    },
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
      this.getDetailAndDisposeListStat();
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
          if (str === 'AMS_DISPOSE_TYPE') {
            this.disposeTypeData = [{ name: '全部处置类型', value: '' }, ...data];
          } else if (str === 'asset_type') {
            this.assetTypeData = [{ name: '全部资产类型', value: '' }, ...data];
            this.getListFn();
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 机构字典表
    organDict() {
      this.$api.assets.organDict({ code: 'AMS_DISPOSE_MODE' }).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.disposeModeData = [{ name: '全部处置方式', value: '' }, ...data];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产分类列表
    getListFn() {
      if (!this.queryCondition.organId) {
        return;
      }
      let obj = {
        organId: this.queryCondition.organId.split(',')[0],
        assetType: this.queryCondition.assetType,
      };
      this.$api.assets.getList(obj).then(
        (res) => {
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
        },
        (error) => {
          console.log(error);
        }
      );
    },
    // 资产类别
    assetTypeFn() {
      this.queryCondition.assetClassify = '';
      this.getListFn();
    },
    // 资产分类
    assetClassifyDataFn(value, isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyData;
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, resOptions);
      });
    },
    // 处置方式
    disposeModeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.disposeMode = this.handleMultipleSelectValue(value, this.queryCondition.disposeMode, this.disposeModeData);
      });
    },
    // 办证状态
    certificateStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.certificateStatus = this.handleMultipleSelectValue(
          value,
          this.queryCondition.certificateStatus,
          this.certificateStatusData
        );
      });
    },
    // 资产类型变化
    assetTypeDataFn() {
      // this.$nextTick(function () {
      //   this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
      // })
    },
    // 处置类型变化
    changeStatus(value) {
      this.$nextTick(function () {
        this.queryCondition.disposeType = this.handleMultipleSelectValue(value, this.queryCondition.disposeType, this.disposeTypeData);
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
      // this.defaultValue = [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())]
      this.defaultValue = [];
      this.queryCondition = { ...queryCondition };
      this.queryCondition.organId = organId;
      this.query();
      this.getDetailAndDisposeListStat();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    judgmentMethodFn(val) {
      if (val === '') {
        return [];
      } else if (val.length > 0 && val[0] !== '') {
        return val;
      } else if (val.length === 1 && val[0] === '') {
        return [];
      } else {
        return val;
      }
    },
    // 点击查询
    queryFn() {
      this.query('');
      this.getDetailAndDisposeListStat();
    },
    // 查询
    query(type) {
      let obj = {
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        organIds: this.queryCondition.organId, // 组织机构id
        submitDateStart: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '', // 提交时间,开始
        submitDateEnd: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '', // 提交时间,结束
        approvalStatusList: this.judgmentMethodFn(this.queryCondition.approvalStatus), // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        assetNameOrCode: this.queryCondition.assetName, // 资产名称/编码
        disposeRegisterDetailId: this.queryCondition.disposeRegisterDetailId,
        disposeDateStart: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '', // 处置日期,开始
        disposeDateEnd: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '', // 处置日期,结束
        projectId: this.queryCondition.projectId, // 资产项目Id
        assetTypeList: this.queryCondition.assetType === '' ? [] : [this.queryCondition.assetType], //类型：String  可有字段  资产类型Id
        disposeModeList: this.judgmentMethodFn(this.queryCondition.disposeMode), // 处置方式
        certificateStatusList: this.judgmentMethodFn(this.queryCondition.certificateStatus), // 办证状态
        objectTypeList: this.judgmentMethodFn(this.queryCondition.assetClassify), // 资产分类
        disposeTypeList: this.judgmentMethodFn(this.queryCondition.disposeType), // 处置类型(多选)
      };
      if (type === 'export') {
        return obj;
      }
      if (type === 'statis') {
        delete obj.pageNum;
        delete obj.pageSize;
        return obj;
      }
      this.loading = true;
      this.$api.disposalManagement.getDetailAndDisposeListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item) => {
              item.key = item.disposeRegisterDetailId;
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
    getDetailAndDisposeListStat() {
      this.numList.forEach((ele) => {
        ele.value = 0;
      });
      let obj = this.query('statis');
      this.$api.disposalManagement.getDetailAndDisposeListStat(obj).then(
        (res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data;
            this.numList.forEach((ele) => {
              ele.value = data[ele.key] || 0;
            });
          } else {
            this.$message.error(res.data.message);
          }
        },
        (res) => {
          this.$message.error(res.data.message);
        }
      );
    },
  },
  created() {},
  mounted() {
    // 获取处置类型
    this.platformDictFn('AMS_DISPOSE_TYPE');
    // 资产类型
    this.platformDictFn('asset_type');
    // 处置方式 机构字典表
    this.organDict();
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
.action {
  cursor: pointer;
}
.info {
  color: #0084ff;
}
/*校验 必填 样式 红星星*/
.validate-required::before {
  content: '*';
  color: red;
}
.modal-body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 60px;
}
</style>
