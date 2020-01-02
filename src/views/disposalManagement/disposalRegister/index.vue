<!--
 * @Date: 2020-01-02 09:46:38
 * @Description: 处置登记首页
 -->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
       <div slot="headerBtns">
        <SG-Button icon="plus" @click="goPage('create')" type="primary">
          新增处置登记
        </SG-Button>
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <div class="box sg-datePicker" :style="dateWidth">
          <SG-DatePicker label="提交日期" style="width: 232px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <a-input-search v-model="queryCondition.assetName" placeholder="资产名称/编码" maxlength="30" style="width: 140px; margin-right: 10px;" @search="onSearch" />
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <!-- 全部资产项目 -->
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
            <!-- 全部状态 -->
            <a-select
              showSearch
              placeholder="请选择状态"
              v-model="queryCondition.approvalStatus"
              optionFilterProp="children"
              @change="approvalStatusSelectChange"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="approvalStatusOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 处置日期 -->
            <div class="box sg-datePicker" :style="dateWidth">
              <SG-DatePicker label="处置日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD"></SG-DatePicker>
            </div>
            <!-- 全部资产类型 -->
            <a-select
              showSearch
              placeholder="请选择资产类型"
              v-model="queryCondition.assetType"
              optionFilterProp="children"
              @change="assetTypeSelectChange"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="assetTypeOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部处置类型 -->
            <a-select
              showSearch
              placeholder="请选择处置类型"
              v-model="queryCondition.disposeType"
              optionFilterProp="children"
              @change="disposeTypeSelectChange"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="disposeTypeOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部处置方式 -->
            <a-select
              showSearch
              placeholder="请选择处置方式"
              v-model="queryCondition.disposeMode"
              optionFilterProp="children"
              @change="disposeModeSelectChange"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="disposeModeOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="restQuery">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
    </div>
  </div>
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import noDataTips from '@/components/noDataTips'
import {utils, debounce} from '@/utils/utils.js'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes  = {
  detail: "/disposalRegister/detail",
  create: '/disposalRegister/create',
  edit: '/disposalRegister/edit',
  approval: '/disposalRegister/approval' // 待审核
};
const allStyle = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px"
};
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px",
  height: '32px',
  overflow: 'hidden'
};
const dateWidth = {width: '300px', 'margin-right': '10px', 'display': 'inline-block', 'vertical-align': 'middle'}
const columns = [
  {
    title: '处置编号',
    dataIndex: 'disposeRegisterDetailId'
  },
  {
    title: '资产编号',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类11',
    dataIndex: 'projectName11'
  },
  {
    title: '登记单号',
    dataIndex: 'disposeRegisterOrderId'
  },
  {
    title: '处置类型',
    dataIndex: 'disposeTypeName'
  },
  {
    title: '处置方式',
    dataIndex: 'disposeMode'
  },
  {
    title: '处置日期',
    dataIndex: 'disposeDate'
  },
  {
    title: '处置原因',
    dataIndex: 'disposeReason'
  },
  {
    title: '处置成本(元)',
    dataIndex: 'disposeCost'
  },
  {
    title: '处置收入(元)',
    dataIndex: 'disposeReceive'
  },
  {
    title: '接收方',
    dataIndex: 'assetReceiver'
  },
  {
    title: '提交人',
    dataIndex: 'createByName'
  },
  {
    title: '提交时间',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName'
  }
]
const approvalStatusOpt = [
  {
    label: '全部状态',
    key: ''
  },
  {
    label: '草稿',
    key: '0'
  },
  {
    label: '待审批',
    key: '2'
  },
  {
    label: '已驳回',
    key: '3'
  },
  {
    label: '已审批',
    key: '1'
  },
  {
    label: '已取消',
    key: '4'
  }
]
const projectIdOpt = [{ label: "全部资产项目", value: "" }];
const assetTypeOpt = [{ label: "全部资产类型", value: "" }];
const disposeTypeOpt = [{ label: "全部处置类型", value: "" }];
const disposeModeOpt = [{ label: "全部处置方式", value: "" }];
const queryCondition =  {
    disposeName: '',    // 处置单名称
    pageNum: 1,     // 当前页
    pageSize: 10,    // 每页显示记录数
    projectId: '',   // 资产项目Id
    approvalStatus: [''],  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
    assetType: [''],    // 资产类型Id
    disposeType: [''],   // 处置类型
    disposeMode: [''],    // 处置方式
  }
export default {
  components: {SearchContainer, TreeSelect, segiIcon, noDataTips},
  props: {},
  data () {
    return {
      organId: '',   // 组织机构id
      organName: '', // 组织机构名称
      toggle: true, // 开关
      queryCondition: utils.deepClone(queryCondition),
      operationTypes,
      allStyle,
      allWidth,
      dateWidth,
      approvalStatusOpt,
      projectIdOpt,
      assetTypeOpt,
      disposeTypeOpt,
      disposeModeOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      },
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      alterationDate: []
    }
  },
  created () {
    this.platformDict('asset_type')
    this.platformDict('AMS_DISPOSE_TYPE')
  },
  methods: {
    query () {},
    // 重置查询条件
    restQuery() {
      let projectId = this.queryCondition.projectId
      this.queryCondition = utils.deepClone(queryCondition)
      this.defaultValue = [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      this.alterationDate = []
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    assetTypeSelectChange (value) {
      this.$nextTick(() => {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeOpt)
      })
    },
    approvalStatusSelectChange (value) {
      this.$nextTick(() => {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusOpt)
      })
    },
    disposeTypeSelectChange (value) {
      this.$nextTick(() => {
        this.queryCondition.disposeType = this.handleMultipleSelectValue(value, this.queryCondition.disposeType, this.disposeTypeOpt)
      })
    },
    disposeModeSelectChange (value) {
      this.$nextTick(() => {
        this.queryCondition.disposeMode = this.handleMultipleSelectValue(value, this.queryCondition.disposeMode, this.disposeModeOpt)
      })
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
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.getObjectKeyValueByOrganIdFn()
      this.organDict('AMS_DISPOSE_MODE')
      this.query()
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.organId,
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
    // 平台字典获取变动类型
    platformDict(code) {
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
          // 处置类型
          if (code === "AMS_DISPOSE_TYPE") {
            this.disposeTypeOpt = [
              ...utils.deepClone(disposeTypeOpt),
              ...arr
            ]
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 机构字典
    organDict (code) {
      this.$api.assets.organDict({ organId: this.organId, code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item, key: item.value }));
          // 处置方式
          if (code === "AMS_DISPOSE_MODE") {
            this.disposeModeOpt = [
              ...utils.deepClone(disposeModeOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    goPage(type, record) {
      let query = {
        type,
        organId: this.organId,
        organName: this.organName
      };
      this.$router.push({ path: operationTypes[type], query });
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
}
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
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
    flex-wrap: wrap;
    text-align: left;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
