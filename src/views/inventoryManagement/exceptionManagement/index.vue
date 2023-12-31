<!--
  异常管理
-->
<template>
  <div>
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="export" :loading="exportBtnLoading" @click="handleExport" v-power="ASSET_MANAGEMENT.EXCEPTION_MANAGE_EXPORT">导出</SG-Button>
        <div style="position: absolute; top: 20px; right: 76px; display: flex">
          <treeSelect
            @changeTree="changeTree"
            :multiple="true"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="allStyle"
            :showSearch="true"
          ></treeSelect>
          <a-input-search placeholder="资产名称/编码" :style="allStyle" :value="assetName" @change="assetNameChange" @search="queryClick" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="assetProject"
          :options="$addTitle(assetProjectOptions)"
          :filterOption="filterOption"
        ></a-select>
        <a-select :style="allStyle" placeholder="全部状态" v-model="status" :options="$addTitle(statusOptions)"></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部异常类型"
          v-model="exceptionType"
          :options="$addTitle(exceptionTypeOptions)"
          style="width: 190px; margin-right: 10px"
          @select="changeExceptionType"
        ></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产类型"
          v-model="assetType"
          :options="$addTitle(assetTypeOptions)"
          style="width: 190px; margin-right: 10px"
          @select="changeAssetType"
        ></a-select>
        <EquipmentSelectTree
          v-if="isSelectedEquipment"
          style="width: 300px"
          :top-organ-id="organId.split(',')[0]"
          :multiple="true"
          v-model="assetClassify"
          :options-data-format="
            (data) => {
              return [{ label: '全部资产分类', value: '', isLeaf: true }, ...data];
            }
          "
          @select="changeAssetClassify($event, true)"
        />
        <a-select
          v-else
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="assetClassify"
          :options="$addTitle(assetClassifyOptions)"
          style="width: 190px; margin-right: 10px"
          @select="changeAssetClassify"
        ></a-select>
        <SG-DatePicker
          label="提交日期"
          pickerType="RangePicker"
          style="width: 200px"
          :defaultValue="[moment(beginDate), moment(endDate)]"
          format="YYYY-MM-DD"
          @change="onDateChange"
        ></SG-DatePicker>
      </div>
    </SG-SearchContainer>
    <div>
      <a-table :columns="columns" :dataSource="dataSource" size="middle" :scroll="{ x: 1900 }" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" v-show="+record.handleStatus === 0" @click="handleOperation('handle', record)">处理</a>
          <a class="operation-btn" @click="handleOperation('detail', record)">详情</a>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect';
import noDataTips from '@/components/noDataTips';
import { getCurrentDate, getMonthsAgoDate } from 'utils/formatTime';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { exportDataAsExcel } from 'src/views/common/commonQueryApi';
import EquipmentSelectTree from '../../common/EquipmentSelectTree';

const columns = [
  {
    title: '异常编号',
    dataIndex: 'resultId',
    width: 120,
    fixed: 'left',
  },
  {
    title: '资产编号',
    dataIndex: 'assetCode',
    width: 200,
    fixed: 'left',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 120,
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 120,
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    width: 120,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName',
    width: 120,
  },
  {
    title: '异常类型',
    dataIndex: 'checkResultName',
    width: 120,
  },
  {
    title: '异常说明',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '异常提交人',
    dataIndex: 'checkByName',
    width: 120,
  },
  {
    title: '异常提交时间',
    dataIndex: 'checkTime',
    width: 120,
  },
  {
    title: '处理建议',
    dataIndex: 'handleTip',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'handleByName',
    width: 80,
  },
  {
    title: '处理时间',
    dataIndex: 'handleTime',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'handleStatusName',
    width: 80,
  },
  {
    title: '操作',
    width: 140,
    dataIndex: 'operation',
    fixed: 'right',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  components: {
    EquipmentSelectTree,
    TreeSelect,
    noDataTips,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      exportBtnLoading: false, // 导出按钮loading
      allStyle: 'width: 170px; margin-right: 10px;',
      firstLoad: true,
      toggle: false,
      organName: '',
      organId: '',
      assetName: '',
      columns,
      dataSource: [],
      status: '',
      statusOptions: [
        { label: '全部状态', value: '' },
        { label: '已处理', value: '1' },
        { label: '未处理', value: '0' },
      ],
      assetProject: '',
      assetProjectOptions: [],
      exceptionType: [''],
      exceptionTypeOptions: [],
      assetType: [''],
      assetTypeOptions: [],
      assetSubject: [''],
      assetSubjectOptions: [],
      assetClassify: [''],
      assetClassifyOptions: [{ label: '全部资产分类', value: '' }],
      beginDate: getMonthsAgoDate(3),
      endDate: getCurrentDate(),
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0,
      },
      showNoDataTips: false,
    };
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.assetType;
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  watch: {
    $route() {
      if (this.$route.path === '/inventoryManagement/exceptionManagement' && this.$route.query.refresh) {
        this.queryClick();
      }
    },
    assetType() {
      this.getAssetClassifyOptions();
    },
  },
  methods: {
    moment,
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    changeTree(value, label) {
      this.organName = label;
      this.organId = value;
      this.getAssetProjectOptions();
      this.getAssetClassifyOptions();
      if (this.firstLoad) {
        this.firstLoad = false;
        this.getExceptionTypeOptions();
      } else {
        this.queryClick();
      }
    },
    // 资产名称发生变化
    assetNameChange(event) {
      if (event.target.value.length <= 30) {
        this.assetName = event.target.value;
      }
    },
    // 异常类型发生变化
    changeExceptionType(value) {
      this.$nextTick(function () {
        this.exceptionType = this.handleMultipleSelectValue(value, this.exceptionType, this.exceptionTypeOptions);
      });
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function () {
        this.assetType = this.handleMultipleSelectValue(value, this.assetType, this.assetTypeOptions);
      });
    },
    // 资产分类发生变化
    changeAssetClassify(value, isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyOptions;
        this.assetClassify = this.handleMultipleSelectValue(value, this.assetClassify, resOptions);
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
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 提交日期发生变化
    onDateChange(moment, val) {
      this.beginDate = val[0];
      this.endDate = val[1];
    },
    // 页码发生变化
    handlePageChange(page) {
      this.paginator.pageNo = page.pageNo;
      this.paginator.pageLength = page.pageLength;
      this.queryList();
    },
    handleOperation(pageType, record) {
      this.$router.push({
        path: '/inventoryManagement/exceptionManagement/' + pageType,
        query: { pageType: pageType, organId: record.organId, resultId: record.resultId },
      });
    },
    formatFormArr(arr, type) {
      if (arr.length === 0 || arr[0] === '') {
        arr = [];
        if (type === 1) {
          let objArr = this.exceptionTypeOptions.slice(1, this.exceptionTypeOptions.length);
          for (let item of objArr) {
            arr.push(item.value);
          }
        }
      }
      return arr;
    },
    // 点击查询
    queryClick() {
      this.paginator.pageNo = 1;
      this.queryList();
    },
    queryList(type) {
      let form = {
        organIds: this.organId,
        checkTimeDateStart: this.beginDate,
        checkTimeDateEnd: this.endDate,
        checkResultList: this.formatFormArr(this.exceptionType, 1),
        handleStatus: this.status,
        assetNameOrCode: this.assetName,
        projectId: this.assetProject,
        assetTypeList: this.formatFormArr(this.assetType),
        objectTypeList: this.formatFormArr(this.assetClassify),
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength,
      };
      if (type === 'export') {
        return form;
      }
      this.$api.inventoryManagementApi.exceptionList(form).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data.data;
          if (data.length === 0) {
            this.showNoDataTips = true;
          } else {
            this.showNoDataTips = false;
          }
          data.forEach((item, index) => {
            item.key = index;
            for (let key in item) {
              if (item[key] === '' || item[key] === null) {
                item[key] = '--';
              }
            }
          });
          this.dataSource = data;
          this.paginator.totalCount = res.data.data.count;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取资产项目下拉列表
    getAssetProjectOptions() {
      let form = {
        organId: this.organId,
      };
      this.$api.assets.getObjectKeyValueByOrganId(form).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部资产项目', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.projectName,
              value: item.projectId,
            };
            arr.push(obj);
          });
          this.assetProjectOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取异常类型下拉列表
    getExceptionTypeOptions() {
      let form = {
        code: 'AMS_CHECK_RESULT_TYPE',
      };
      this.$api.basics.platformDict(form).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部异常类型', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.name,
              value: item.value,
            };
            arr.push(obj);
          });
          this.exceptionTypeOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
        this.queryClick();
      });
    },
    // 获取资产类型下拉列表
    getAssetTypeOptions() {
      let form = {
        code: 'asset_type',
      };
      this.$api.basics.platformDict(form).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部资产类型', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.name,
              value: item.value,
            };
            arr.push(obj);
          });
          this.assetTypeOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions() {
      let obj = {
        organId: this.organId.split(',')[0],
        assetType: this.assetType.length === 1 ? this.assetType.join(',') : '',
      };
      if (!obj.assetType) {
        this.assetClassify = [''];
        this.assetClassifyOptions = [{ label: '全部资产分类', value: '' }];
        return;
      }
      this.$api.assets.getList(obj).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部资产分类', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.professionName,
              value: item.professionCode,
            };
            arr.push(obj);
          });
          this.assetClassifyOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 导出
    handleExport() {
      this.exportBtnLoading = true;
      let data = this.queryList('export');
      exportDataAsExcel(data, this.$api.tableManage.exportExceptionExcel, '异常管理列表.xlsx', this).then(() => {
        this.exportBtnLoading = false;
      });
    },
  },
  created() {},
  mounted() {
    this.getAssetTypeOptions();
  },
};
</script>

<style lang="less" scoped>
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
.operation-btn {
  color: #0084ff;
  margin-right: 10px;
}
.custom-table {
  padding-bottom: 50px;
}
</style>
