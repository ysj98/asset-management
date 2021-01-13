<!--
 * @Date: 2020-01-02 09:46:38
 * @Description: 处置登记首页
 -->
<template>
  <div class="scheduleChanges pb70">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop: toggle?'16px': 0}">
       <div slot="headerBtns">
         <SG-Button icon="export" :loading="exportBtnLoading" style="margin-right: 8px" @click="handleExport">导出</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.zcgl_dengji_create" icon="plus" @click="goPage('create')" type="primary">
          新增处置登记
        </SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <a-input-search v-model="queryCondition.disposeName" placeholder="资产处置名称" maxlength="30" style="width: 140px; margin-right: 10px;" @search="onSearch" />
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
            <!-- 处置日期 -->
            <div class="box sg-datePicker" :style="dateWidth">
              <SG-DatePicker label="处置日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD"></SG-DatePicker>
            </div>
            <div class="box sg-datePicker" :style="dateWidth">
              <SG-DatePicker label="提交日期" style="width: 232px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
            </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query('')">查询</SG-Button>
          <SG-Button @click="restQuery">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
      <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: 1400}"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="operation" slot-scope="text, record">
            <OperationPopover :operationData="record.operationDataBtn"  @operationFun="operationFun($event, record)"></OperationPopover>
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
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import noDataTips from '@/components/noDataTips'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {utils, debounce} from '@/utils/utils.js'
import OperationPopover from '@/components/OperationPopover'
import {exportDataAsExcel} from 'src/views/common/commonQueryApi'
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
const dateWidth = {width: '300px', 'margin-right': '10px', "margin-top": "14px", 'display': 'inline-block', 'vertical-align': 'middle'}
const columns = [
  {
    title: '处置单ID',
    dataIndex: 'disposeRegisterOrderId'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '资产处置名称',
    dataIndex: 'disposeName'
  },
  {
    title: '资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '处置类型',
    dataIndex: 'disposeTypeName'
  },
  {
    title: '处置方式',
    dataIndex: 'disposeModeName'
  },
  {
    title: '处置时间',
    dataIndex: 'disposeDate'
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
    title: '处置原因',
    dataIndex: 'disposeReason'
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
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
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
    approvalStatus: '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
    assetType: '',    // 资产类型Id
    disposeType: '',   // 处置类型
    disposeMode: '',    // 处置方式
  }
export default {
  components: {SearchContainer, OperationPopover, TreeSelect, segiIcon, noDataTips},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      exportBtnLoading: false, // 导出按钮loading
      organId: '',   // 组织机构id
      organName: '', // 组织机构名称
      toggle: true, // 开关
      queryCondition: utils.deepClone(queryCondition),
      operationTypes,
      allStyle,
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
  watch: {
    '$route' () {
      if (this.$route.path === '/disposalRegister' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  methods: {
    judgmentMethodFn (val) {
      if (val === '') {
        return []
      } else if (val.length > 0 && val[0] !== '') {
        return val
      } else if (val.length === 1 && val[0] === '') {
        return []
      } else {
        return val
      }
    },
    query (type) {
      let data = {
        organId: this.organId,
        disposeName: this.queryCondition.disposeName,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize,
        projectId: this.queryCondition.projectId,
        approvalStatusList: this.judgmentMethodFn(this.queryCondition.approvalStatus),
        assetTypeList: this.judgmentMethodFn(this.queryCondition.assetType),
        disposeTypeList: this.judgmentMethodFn(this.queryCondition.disposeType),
        disposeModeList: this.judgmentMethodFn(this.queryCondition.disposeMode),
        submitDateStart: this.defaultValue.length > 0 ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',
        submitDateEnd: this.defaultValue.length > 0 ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '',
        disposeDateStart: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '',
        disposeDateEnd: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : '',
      }
      if (type === 'export') { return data }
      this.table.loading = true
      this.$api.basics.getDisposeRegisterList(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.data || [];
          this.table.dataSource = result.map(item => {
            return {
              key: getUuid(),
              ...item,
              operationDataBtn: this.createOperationBtn(item.approvalStatus)
            };
          });
          this.table.totalCount = res.data.data.count || 0;
        } else {
          this.$message.error(res.data.message);
        }
      }).finally(() => {
        this.table.loading = false
      })
    },
    // 生成操作按钮
    createOperationBtn (type) {
      // 审批状态  0草稿   2待审批、已驳回3、已审批1  已取消4
      console.log('生成按钮', type)
      let arr = []
      // 草稿 已驳回
      if (['0', '3'].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.zcgl_dengji_edit)) {
          arr.push({iconType: 'edit', text: '编辑', editType: 'edit'})
        }
        if (this.$power.has(ASSET_MANAGEMENT.zcgl_dengji_delete)) {
          arr.push({iconType: 'delete', text: '删除', editType: 'delete'})
        }
      }
      // 待审批
      if (['2'].includes(type)) {
        arr.push({iconType: 'edit', text: '审批', editType: 'approval'})
      }
      // 已审批
      if (['1'].includes(type)) {
        if (this.$power.has(ASSET_MANAGEMENT.zcgl_dengji_reverseapply)) {
          arr.push({iconType: 'edit', text: '反审核', editType: 'readApproval'})
        }
      }
      arr.push({iconType: 'file-text', text: '详情', editType: 'detail'})
      return arr
    },
    operationFun (type, record) {
      if (['edit', 'detail', 'approval',].includes(type)) {
        this.goPage(type, record)
      } else if (['delete', 'readApproval'].includes(type)) {
        this.readApprovalFn(type, record)
      }
    },
    // 重置查询条件
    restQuery() {
      let projectId = this.queryCondition.projectId
      this.queryCondition = utils.deepClone(queryCondition)
      this.defaultValue = [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      this.alterationDate = []
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
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
      })
    },
    // 反审核/删除
    readApprovalFn (type, record) {
      let _this = this
      this.$confirm({
        title: '提示',
        content: `${type === 'readApproval' ? '确认要反审核该资产处置单吗？' : '确认要删除该资产处置登记单吗？'}`,
        onOk() {
          let obj = {
            disposeRegisterOrderId: record.disposeRegisterOrderId,
            approvalStatus: type === 'readApproval' ? '0' : '4',
            status: type === 'delete' ? '0' : ''
          }
          let loadingName = _this.SG_Loding('提交中...')
          _this.$api.basics.updateDisposeRegisterStatus(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.DE_Loding(loadingName).then(() => {
                _this.$SG_Message.success('提交成功')
                _this.query()
              })
            } else {
              _this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    goPage(type, record) {
      let query = {
          type,
          organId: this.organId,
          organName: this.organName,
          disposeRegisterOrderId: type === 'create' ? '' : record.disposeRegisterOrderId
        }
      this.$router.push({ path: operationTypes[type], query })
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
    },

    // 导出
    handleExport () {
      this.exportBtnLoading = true
      let data = this.query('export')
      exportDataAsExcel(data, this.$api.tableManage.exportDisposeExcel, '处置登记列表.xlsx', this).then(() => {
        this.exportBtnLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.scheduleChanges {
  //  position: relative;
  .box {
    display: inline-block;
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
