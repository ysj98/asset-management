<!--
 * @Description: 
 * @Date: 2020-02-26 12:45:49
 * @LastEditTime: 2020-02-26 12:46:22
 -->
<!--
呈报记录页面
-->
<template>
  <div>
    <div class="pb70">
      <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0}">
        <div slot="headerBtns">
          <SG-Button @click="goPage('create')" class="mr10" icon="plus" type="primary">新增</SG-Button>
          <SG-Button class="mr10"><segiIcon type="#icon-ziyuan4" class="mr10"/>批量导入</SG-Button>
          <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
        </div>
        <div slot="headerForm">
            <treeSelect
              @changeTree="changeTree"
              placeholder="请选择组织机构"
              :allowClear="false"
              :style="allStyle"
            ></treeSelect>
            <!-- 资产项目 -->
            <a-select
              showSearch
              placeholder="请选择资产项目"
              v-model="queryCondition.projectId"
              optionFilterProp="children"
              :style="allStyle"
              :options="projectIdOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部资产类型 -->
            <a-select
              showSearch
              placeholder="请选择资产类型"
              v-model="queryCondition.assetType"
              optionFilterProp="children"
              @change="assetTypeSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="assetTypeOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 资产名称或编码 -->
            <a-input
              :maxLength="30"
              placeholder="输入资产名称/编码"
              v-model="queryCondition.nameOrCode"
              :style="allStyle"
            />
          </div>
        <div slot="contentForm" class="search-content-box">
          <div class="search-from-box">
            <!-- 全部资产状态 -->
            <a-select
              showSearch
              placeholder="请选择资产状态"
              v-model="queryCondition.assetStatusList"
              @change="assetStatusListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="assetStatusListOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部附属配套类型-->
            <a-select
              showSearch
              placeholder="请选择附属配套类型"
              v-model="queryCondition.matchingTypeList"
              @change="matchingTypeListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="matchingTypeListOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部附属配套状态 -->
            <a-select
              showSearch
              placeholder="请选择附属配套状态"
              v-model="queryCondition.status"
              optionFilterProp="children"
              :style="allWidth"
              :options="statusOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <a-input
              :maxLength="30"
              v-model="queryCondition.matchingNameOrCode"
              placeholder="请输入附属配套名称"
              :style="allWidth"
            />
            </div>
            <div class="two-row-box">
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <SG-Button @click="restQuery">清除</SG-Button>
          </div>
          </div>
      </SearchContainer>
      <div>
        <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: 1400}"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="name" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="tranProgress" slot-scope="text, record">
            <div style="padding-right: 20px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_SET" @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          </template>
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
import noDataTips from "@/components/noDataTips";
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from '@/components/segiIcon.vue'
import { utils } from "@/utils/utils";
import {ASSET_MANAGEMENT} from '@/config/config.power'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes = {
  create: "/subsidiary/create",
  detail: "/subsidiary/detail",
  edit: '/subsidiary/edit'
};
const allStyle = {
  width: "170px",
  "margin-right": "10px",
  // "margin-top": "14px"
};
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px",
  height: '32px',
  overflow: 'hidden'
};
const queryCondition = {
  organId: "",
  projectId: "",
  assetType: [''], // 资产类型
  nameOrCode: '', // 资产名称或编码，模糊查询
  matchingTypeList: [''], // 附属配套类型
  status: '', // 附属配套状态
  assetStatusList: [''], // 资产状态(多选)
  matchingNameOrCode: "", // 附属配套名称
  pageNum: 1,
  pageSize: 10
};
const projectIdOpt = [{ label: "全部资产项目", value: "" }];
const matchingTypeListOpt = [{ label: "全部附属配套类型", value: "" }];
const assetTypeOpt = [{ label: "全部资产类型", value: "" }]
const assetStatusListOpt = [
  { label: "全部资产状态", value: "" },
  { label: "未生效", value: "0" },
  { label: "正常", value: "1" },
  { label: "资产报废", value: "2" },
  { label: "资产转让", value: "3" },
  { label: "资产报损", value: "4" },
  { label: "已清理", value: "5" },
  // { label: "已取消", value: "6" }
];
const statusOpt = [
  { label: "全部附属配套状态", value: "" },
  { label: "启用", value: "1" },
  { label: "停用", value: "2" },
]
let columns = [
  // {
  //   title: "附属配套编号",
  //   dataIndex: "code",
  //   width: 100
  // },
  {
    title: "所属机构",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "资产项目",
    dataIndex: "projectName",
    width: 120
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: 120
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: 120
  },
  {
    title: "附属配套名称",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
    width: 100
  },
  {
    title: "附属配套编码",
    dataIndex: "code",
    width: 100
  },
  {
    title: "类型",
    dataIndex: "typeName",
    width: 100
  },
  {
    title: "规格型号",
    dataIndex: "specificationTypeName",
    width: 120
  },
  {
    title: "价值(元)",
    dataIndex: "value",
    width: 120
  },
  {
    title: "数量",
    dataIndex: "warrantNbr",
    width: 120
  },
  {
    title: "计量单位",
    dataIndex: "unitOfMeasurementName",
    width: 100
  },
  {
    title: "是否接管前附属配套",
    dataIndex: "statusNamert",
    width: 150
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  }
];
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      toggle: true,
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      projectIdOpt,
      matchingTypeListOpt,
      assetTypeOpt,
      assetStatusListOpt,
      statusOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  created() {
    this.platformDictFn("asset_type")
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      // data.assetType = data.assetType.join(',')
      // 资产类型参数改变
      data.assetTypeList = utils.deepClone(data.assetType).filter(item => item !== '')
      data.assetStatusList = utils.deepClone(data.assetStatusList).filter(item => item !== '')
      data.matchingTypeList = utils.deepClone(data.matchingTypeList).filter(item => item !== '')
      
      this.table.loading = true;
      this.$api.subsidiary.getListPage(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.settingMethodName = item.settingMethodName || '--'
              item.kindOfRightName = item.kindOfRightName || '--'
              item.warrantNbr = item.warrantNbr || '--'
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ""
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map(item => {
            return {
              label: item.projectName,
              value: item.projectId
            };
          });
          this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...result];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    assetTypeSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeOpt)
      })
    },
    assetStatusListSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.assetStatusList = this.handleMultipleSelectValue(value, this.queryCondition.assetStatusList, this.assetStatusListOpt)
      })
    },
    matchingTypeListSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.matchingTypeList = this.handleMultipleSelectValue(value, this.queryCondition.matchingTypeList, this.matchingTypeListOpt)
      })
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = "";
      this.queryCondition.matchingTypeList = [''];
      this.getObjectKeyValueByOrganIdFn();
      this.organDict('SUBSIDIARY_MATCHING_');
      this.searchQuery();
    },
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf('') !== -1
      let len = data.length
      // 如果点击全选或者取消全选
      if (data[len-1] === '' || len === 0) {
        return data = ['']
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === (dataOptions.length-1)) {
        return data = ['']
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(''), 1)
      }
      return data
    },
    // 导出
    openExport () {},
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
    // 重置查询条件
    restQuery() {
      this.queryCondition.projectId = "";
      this.queryCondition.assetType = [''];
      this.queryCondition.nameOrCode = '';
      this.queryCondition.matchingTypeList = [''];
      this.queryCondition.status = '';
      this.queryCondition.assetStatusList = [''];
      this.queryCondition.matchingNameOrCode = "";
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item }));
          // 资产类型
          if (code === "asset_type") {
            this.assetTypeOpt = [
              ...utils.deepClone(assetTypeOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 机构字典
    organDict (code) {
      this.$api.assets.organDict({ organId: this.queryCondition.organId, code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item, key: item.value }));
          // 附属信息类型
          if (code === "SUBSIDIARY_MATCHING_ TYPE") {
            this.disposeModeOpt = [
              ...utils.deepClone(disposeModeOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    goPage(type, record) {
      let query = {
        type
      };
      if (['detail', 'edit'].includes(type)) {
        query.subsidiaryMatchingId = record.subsidiaryMatchingId
      }
      this.$router.push({ path: operationTypes[type], query });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>
<style lang="less" scoped>
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
    flex: 0 0 190px;
  }
}
</style>
