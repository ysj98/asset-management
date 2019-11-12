<!--
  资产变动一览表
-->
<template>
  <div class="scheduleChanges">
    <SearchContainer v-model="toggle" @input="searchContainerFn">
      <div slot="headerBtns">
        <!-- <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button> -->
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-input-search placeholder="资产名称/编码" maxlength="40" style="width: 140px; margin-right: 10px;" @search="onSearch" />
      </div>
      <div slot="contentForm">
        <div class="form-first">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :defaultValue="queryCondition.approvalStatus" @change="approvalStatusFn">
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部变动类型" :defaultValue="queryCondition.changeType" @change="approvalStatusFn">
            <a-select-option v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :style="allStyle" placeholder="全部资产项目" :defaultValue="queryCondition.projectId" @change="approvalStatusFn">
            <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
        <div class="from-second">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :defaultValue="queryCondition.assetType" @change="approvalStatusFn">
            <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部分类" :defaultValue="queryCondition.assetClassify" @change="approvalStatusFn">
            <a-select-option v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <div class="box">
            <SG-DatePicker label="提交日期" style="width: 232px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD" @change="changeDate"></SG-DatePicker>
          </div>
          <div class="box box-left">
            <SG-DatePicker label="变更日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD" @change="alterationFn"></SG-DatePicker>
          </div>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
        <!-- <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover>
        </template> -->
      </a-table>
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
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
const columns = [
  {
    title: '变动编号',
    dataIndex: 'changeOrderCode'
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
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '所属变动单',
    dataIndex: 'changeOrderId'
  },
  {
    title: '变动类型',
    dataIndex: 'changeTypeName'
  },
  {
    title: '变动前信息',
    dataIndex: 'oldChangeInfo'
  },
  {
    title: '变动后信息',
    dataIndex: 'changeInfo'
  },
  {
    title: '变动时间',
    dataIndex: 'changeDate'
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
const operationData = [
  {iconType: 'form', text: '修改', editType: 'edit'},
  {iconType: 'delete', text: '删除', editType: 'delete'}
]
const approvalStatusData = [
  {
    name: '草稿',
    value: '0'
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已驳回',
    value: '3'
  },
  {
    name: '已审批',
    value: '1'
  },
  {
    name: '已取消',
    value: '4'
  }
]
export default {
  components: {SearchContainer, TreeSelect, segiIcon},
  props: {},
  data () {
    return {
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: 'width: 170px; margin-right: 10px;',
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      operationData: [...operationData],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {
        organId: '',   // 组织机构id
        approvalStatus: ['0', '1', '2', '3', '4'],  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectId: '',   // 资产项目Id
        changeType: [''],   // 变动类型
        assetType: [''],    // 资产类型Id
        assetClassify: [''], // 资产分类
        startDate: '',       // 创建日期开始日期
        endDate: '',    // 创建日期结束日期
        changStartDate: '',  // 变动日期开始
        changEndDate: '',   // 变动日期结束
        currentOrganId: '',   // 仅当前机构下资产清理单 0 否 1 是
        assetName: '',    // 资产名称/编码模糊查询
        pageNum: 1,     // 当前页
        pageSize: 10    // 每页显示记录数
      },
      count: '',
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ],
      changeTypeData: [
        {
          name: '全部变动类型',
          value: ''
        }
      ],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      assetClassifyData: [
        {
          name: '全部分类',
          value: ''
        }
      ],
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      alterationDate: []
    }
  },
  computed: {
  },
  methods: {
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 变动单状态
    approvalStatusFn (value) {
      this.queryCondition.approvalStatus = value
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 提交日期
    changeDate (val) {
      this.queryCondition.startDate = moment(this.defaultValue[0]).format('YYYY-MM-DD')
      this.queryCondition.endDate = moment(this.defaultValue[1]).format('YYYY-MM-DD')
    },
    // 变更日期
    alterationFn (val) {
      this.queryCondition.changStartDate = moment(this.defaultValue[0]).format('YYYY-MM-DD')
      this.queryCondition.changStartDate = moment(this.defaultValue[1]).format('YYYY-MM-DD')
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 清空
    eliminateFn () {},
    // 查询
    query () {
      this.loading = true
      let obj = {
        projectId: this.queryCondition.projectId,       // 资产项目Id
        organId: this.queryCondition.organId,         // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',       // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        startDate: this.queryCondition.startDate,       // 创建日期开始日期
        endDate: this.queryCondition.endDate,    // 创建日期结束日期
        currentOrganId: this.queryCondition.currentOrganId,   // 仅当前机构下资产清理单 0 否 1 是
        pageNum: this.queryCondition.pageNum,     // 当前页
        pageSize: this.queryCondition.pageSize,    // 每页显示记录数
        multiChangeType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '',  // 变动类型
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetName: this.queryCondition.assetName,    // 资产名称/编码模糊查询
        changStartDate: this.queryCondition.changStartDate,  // 变动日期开始
        changEndDate: this.queryCondition.changEndDate   // 变动日期结束
      }
      this.$api.assets.getChangeSchedulePage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    }
  },
  created () {
  },
  mounted () {
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
}
</style>
