<!--
 * @Date: 2020-09-09 14:07:25
 * @Description: 权属登记一览表
 * @Author: chh
-->
<template>
  <div class="ownershipRegisterView-page">
    <div class="pb70">
      <SearchContainer v-model="toggle" :contentStyle="{ paddingTop: toggle ? '16px' : 0 }">
        <div slot="headerBtns">
          <SG-Button v-if="hasRegisterViewExport" type="primary" @click="exportData"><segiIcon type="#icon-ziyuan10" class="mr10" />导出</SG-Button>
        </div>
        <div slot="headerForm" style="float: right; text-align: left">
          <treeSelect
            @changeTree="changeTree"
            :multiple="true"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="allStyle"
            :showSearch="true"
          ></treeSelect>
          <!-- 资产项目 -->
          <a-select
            showSearch
            placeholder="请选择资产项目"
            v-model="queryCondition.projectIdList"
            optionFilterProp="children"
            @change="projectIdListSelect"
            mode="multiple"
            :maxTagCount="1"
            :style="allStyle"
            :options="$addTitle(projectIdListOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 全部资产类型 -->
          <a-select
            showSearch
            placeholder="请选择资产类型"
            v-model="queryCondition.assetTypeList"
            optionFilterProp="children"
            @change="assetTypeListSelect"
            mode="multiple"
            :maxTagCount="1"
            :style="allStyle"
            :options="$addTitle(assetTypeListOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 全部资产分类 -->
          <!-- <EquipmentSelectTree
              :style="allStyle"
              v-if="isSelectedEquipment"
              style="width: 300px"
              :top-organ-id="queryCondition.organId"
              :multiple="true"
              v-model="queryCondition.objectTypeList"
              :options-data-format="(data)=>{
                 return [{label: '全部资产分类', value: '', isLeaf: true},...data]
              }"
              @select="objectTypeListSelect($event,true)"
            />
            <a-select
              v-else
              showSearch
              placeholder="请选择资产分类"
              v-model="queryCondition.objectTypeList"
              @change="objectTypeListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle "
              :options="$addTitle(objectTypeListOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            /> -->
          <!-- 资产名称/编码 -->
          <a-input :maxLength="30" placeholder="输入资产名称/编码" v-model="queryCondition.assetNameCode" :style="allStyle" />
        </div>
        <div slot="contentForm" class="search-content-box">
          <div class="search-from-box">
            <!-- 全部登记类型-->
            <a-select
              showSearch
              placeholder="请选择登记类型"
              v-model="queryCondition.registerTypeList"
              @change="registerTypeListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(registerTypeListOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 请选择登记状态 -->
            <a-select
              showSearch
              :style="allWidth"
              placeholder="请选择登记状态"
              v-model="queryCondition.approvalStatusList"
              @change="approvalStatusListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :options="$addTitle(approvalStatusListOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <div class="box">
              <segi-range-picker label="登记日期" :canSelectToday="true" :allowClear="true" @dateChange="onDateChange"></segi-range-picker>
            </div>
            <a-input :maxLength="30" v-model="queryCondition.registerNameCode" placeholder="权属登记单名称" :style="allWidth" />
          </div>
          <div class="two-row-box">
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <!-- <SG-Button @click="restQuery">清除</SG-Button> -->
          </div>
        </div>
      </SearchContainer>
      <!--数据概览信息-->
      <a-spin :spinning="overviewNumSpinning">
        <overview-number :numList="numList" />
      </a-spin>
      <div class="table-layout-fixed">
        <a-table
          class="custom-table"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: 1400, y: scrollHeight }"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{ emptyText: '暂无数据' }"
        >
          <template slot="matchingName" slot-scope="text">
            {{ text }}
            <!-- <span class="nav_name" @click="goPage('detail', record)">{{
              text
            }}</span> -->
          </template>
          <!-- <template slot="operation" slot-scope="text, record">
            <OperationPopover
              :operationData="record.operationDataBtn"
              @operationFun="operationFun($event, record)"
            ></OperationPopover>
          </template> -->
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="absolute"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
import noDataTips from '@/components/noDataTips';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import segiIcon from '@/components/segiIcon.vue';
import Tools from '@/utils/utils';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import OperationPopover from '@/components/OperationPopover';
import SegiRangePicker from '@/components/SegiRangePicker';
import {
  allStyle,
  allWidth,
  queryCondition,
  columns,
  projectIdListOpt,
  assetTypeListOpt,
  approvalStatusListOpt,
  registerTypeListOpt,
  objectTypeListOpt,
} from './lib/dict.js';
import OverviewNumber from '@/views/common/OverviewNumber';

export default {
  name: 'ownershipRegisterView',
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon,
    OverviewNumber,
    SegiRangePicker,
    EquipmentSelectTree,
  },
  data() {
    return {
      scrollHeight: 290,
      hasRegisterViewExport: false, // 导出权限
      allStyle,
      allWidth,
      queryCondition: Tools.deepClone(queryCondition),
      projectIdListOpt,
      assetTypeListOpt,
      approvalStatusListOpt,
      registerTypeListOpt,
      objectTypeListOpt,
      toggle: true,
      organName: '',
      overviewNumSpinning: false,
      numList: [
        { title: '全部', key: 'total', value: 0, fontColor: '#324057' },
        { title: '草稿', key: 'zero', value: 0, bgColor: '#5b8ff9' },
        { title: '待审批', key: 'two', value: 0, bgColor: '#d48265' },
        { title: '已驳回', key: 'three', value: 0, bgColor: '#4BD288' },
        { title: '已审批', key: 'one', value: 0, bgColor: '#1890FF' },
        { title: '已取消', key: 'four', value: 0, bgColor: '#DD81E6' },
      ],
      // 表格数据
      table: {
        columns,
        dataSource: [],
        pagination: false,
        loading: false,
      },
    };
  },
  watch: {
    toggle(val) {
      if (val) {
        this.scrollHeight = 290;
      } else {
        this.scrollHeight = 422;
      }
    },
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.queryCondition.assetTypeList;
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  created() {
    this.handleBtnPower();
    this.platformDictFn('asset_type');
    this.platformDictFn('AMS_REGISTER_TYPE');
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
      };
      data.organIds = data.organId;
      delete data.organId;
      // 资产类型参数改变
      data.projectIdList = Tools.deepClone(data.projectIdList).filter((item) => item !== '');
      data.assetTypeList = Tools.deepClone(data.assetTypeList).filter((item) => item !== '');
      data.approvalStatusList = Tools.deepClone(data.approvalStatusList).filter((item) => item !== '');
      data.registerTypeList = Tools.deepClone(data.registerTypeList).filter((item) => item !== '');
      data.objectTypeList = Tools.deepClone(data.objectTypeList).filter((item) => item !== '');
      if (!data.startDate) {
        delete data.startDate;
      }
      if (!data.endDate) {
        delete data.endDate;
      }
      this.getChangePageSum(data);
      this.table.loading = true;
      this.$api.ownership
        .registerList(data)
        .then((res) => {
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              return {
                key: Tools.getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    // 查询统计列表
    getChangePageSum(obj) {
      let data = { ...obj };
      delete data.pageNum;
      delete data.pageSize;
      this.$api.ownership
        .registerTotal(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data || {};
            this.numList = this.numList.map((item) => {
              return {
                ...item,
                value: data[item.key] || 0,
              };
            });
            console.log('this.numList', this.numList);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .finally(() => {
          this.overviewNumSpinning = false;
        });
    },
    // 导出列表
    exportData() {
      let data = {
        ...this.queryCondition,
      };
      data.organIds = data.organId;
      delete data.organId;
      // 资产类型参数改变
      data.projectIdList = Tools.deepClone(data.projectIdList).filter((item) => item !== '');
      data.assetTypeList = Tools.deepClone(data.assetTypeList).filter((item) => item !== '');
      data.approvalStatusList = Tools.deepClone(data.approvalStatusList).filter((item) => item !== '');
      data.registerTypeList = Tools.deepClone(data.registerTypeList).filter((item) => item !== '');
      data.objectTypeList = Tools.deepClone(data.objectTypeList).filter((item) => item !== '');
      if (!data.startDate) {
        delete data.startDate;
      }
      if (!data.endDate) {
        delete data.endDate;
      }
      delete data.pageNum;
      delete data.pageSize;
      let loadingName = this.SG_Loding('导出中...');
      this.$api.ownership.registerExport(data).then(
        (res) => {
          this.$SG_Message.destroy(loadingName);
          let blob = new Blob([res.data]);
          let a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          // ${this.organName}
          a.download = `权属登记一览表.xls`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
        () => {
          this.$SG_Message.destroy(loadingName);
          this.$SG_Message.error('权属登记一览表导出失败!');
        }
      );
    },
    // 按钮权限
    handleBtnPower() {
      this.hasRegisterViewExport = this.$power.has(ASSET_MANAGEMENT.ASSET_REGISTERVIEW_EXPORT);
      console.log('权限按钮=>', this.hasRegisterViewExport);
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions() {
      let obj = {
        organId: this.queryCondition.organId.split(',')[0],
        assetType: this.queryCondition.assetTypeList.join(','),
      };
      this.queryCondition.objectTypeList = [''];
      this.objectTypeListOpt = Tools.deepClone(objectTypeListOpt);
      if (!obj.assetType) {
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
          this.objectTypeListOpt = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map((item) => {
            return {
              label: item.projectName,
              value: item.projectId,
            };
          });
          this.projectIdListOpt = [...Tools.deepClone(projectIdListOpt), ...result];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    projectIdListSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.projectIdList = this.handleMultipleSelectValue(value, this.queryCondition.projectIdList, this.projectIdListOpt);
      });
    },
    assetTypeListSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypeList = this.handleMultipleSelectValue(value, this.queryCondition.assetTypeList, this.assetTypeListOpt);
        // this.getAssetClassifyOptions()
      });
    },
    approvalStatusListSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatusList,
          this.approvalStatusListOpt
        );
      });
    },
    registerTypeListSelect(value) {
      this.$nextTick(function () {
        this.queryCondition.registerTypeList = this.handleMultipleSelectValue(value, this.queryCondition.registerTypeList, this.registerTypeListOpt);
      });
    },
    objectTypeListSelect(value, isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.objectTypeListOpt;
        this.queryCondition.objectTypeList = this.handleMultipleSelectValue(value, this.queryCondition.objectTypeList, resOptions);
      });
    },
    // 起止日期发生变化
    onDateChange(val) {
      console.log('时间改变=>', val);
      this.queryCondition.startDate = val[0];
      this.queryCondition.endDate = val[1];
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.projectIdListOpt = Tools.deepClone(projectIdListOpt);
      this.queryCondition.projectIdList = ['']; // 清除项目
      this.getObjectKeyValueByOrganIdFn();
      // this.getAssetClassifyOptions()
      this.searchQuery();
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          let arr = result.map((item) => ({ label: item.name, ...item }));
          // 资产类型
          if (code === 'asset_type') {
            this.assetTypeListOpt = [...Tools.deepClone(assetTypeListOpt), ...arr];
          }
          // 登记类型
          if (code === 'AMS_REGISTER_TYPE') {
            this.registerTypeListOpt = [...Tools.deepClone(registerTypeListOpt), ...arr];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf('') !== -1;
      let len = data.length;
      // 如果点击全选或者取消全选
      if (data[len - 1] === '' || len === 0) {
        return (data = ['']);
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === dataOptions.length - 1) {
        return (data = ['']);
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(''), 1);
      }
      return data;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less" scoped>
.ownershipRegisterView-page {
  /deep/ .search-box .search-content .search-content .content-icon {
    display: none;
  }
  /deep/ .search-box .search-content .content-form {
    text-align: initial !important;
  }
  .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    margin-top: 14px;
  }
}
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 100px;
  }
}
</style>
