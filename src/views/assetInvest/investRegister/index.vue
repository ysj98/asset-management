<!--
  投资登记
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.INVEST_FORM_NEW" @click="handleBtnAction({type: 'add'})" v-if="organName.length > 0">新建投资单</SG-Button>
        <div class="box" style="margin-left: 16px"><SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_INVEST_REGISTER" @click="exportFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button></div>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectList" :filterOption="filterOption" @select="getObjectKeyValueByOrganIdFn" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部审批状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatusList" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="queryCondition.investNameOrIdOrContractCode" placeholder="投资单名称/投资单编号/合同编号" maxlength="30" style="width: 220px; height: 32px; margin-right: 10px;" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部合同状态" :tokenSeparators="[',']"  @select="investStatusFn"  v-model="queryCondition.investStatusList" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option v-for="(item, index) in investStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        <div class="box">
            <SG-DatePicker :allowClear="true" label="签订日期" style="width: 200px;"  pickerType="RangePicker" v-model="createValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="box">
            <SG-DatePicker :allowClear="true" label="投资日期" style="width: 200px;"  pickerType="RangePicker" v-model="applyValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
      </div>
    </SG-SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="table-layout-fixed">
      <!-- ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover
            :operationData="record.operationDataBtn"
            @operationFun="operationFun($event, record)"
          ></OperationPopover>
        </template>
        <template slot="key" slot-scope="text, record">
          <div v-if="false">
            {{record.investOrderId}}
          </div>
        </template>
      </a-table>
    </div>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import OperationPopover from "@/components/OperationPopover"
const approvalStatusData = [
  { name: '全部状态', value: '' }, { name: '草稿', value: '0' }, { name: '待审批', value: '2' }, { name: '已驳回', value: '3' }, { name: '已审批', value: '1' }, { name: '已取消', value: '4' }
]

const investStatusData = [
  { name: '全部状态', value: '' }, { name: '未生效', value: '0' }, { name: '待执行', value: '1' }, { name: '执行中', value: '2' }, { name: '已终止', value: '3' }, { name: '已作废', value: '4' }
]

const columns = [
  {
    title: '投资单ID',
    dataIndex: 'investOrderId',
    width: 100
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '投资单名称',
    dataIndex: 'investName'
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
    title: '投资项目',
    dataIndex: 'investProject'
  },
  {
    title: '资产数量',
    dataIndex: 'assetSum'
  },
  {
    title: '投资面积（㎡）',
    dataIndex: 'investArea',
    width: 120
  },
  {
    title: '起投日期',
    dataIndex: 'startInvestDate'
  },
  {
    title: '止投日期',
    dataIndex: 'endInvestDate'
  },
  {
    title: '合同编号',
    dataIndex: 'contractCode'
  },
  
  {
    title: '合同状态',
    dataIndex: 'investStatusName'
  },
  {
    title: '签订日期',
    dataIndex: 'signingDate'
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
  {
    title: 'key值',
    dataIndex: 'key',
    width: 0
  }
]

export default {
  components: {TreeSelect, OverviewNumber, noDataTips, segiIcon, OperationPopover},
  data () {
    return {
      ASSET_MANAGEMENT,
      toggle: false,
      loading: false,
      columns,
      organName: '',
      organId: '',
      allStyle: 'width: 150px; margin-right: 10px;',
      approvalStatusData: [...approvalStatusData],
      investStatusData: [...investStatusData],
      applyValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      createValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      tableData: [],
      count: '',
      organProjectBuildingValue:'',
      noPageTools: false,
      listData: [{label:'编辑', value:''}],
      queryCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectList: [],             // 资产项目Id
        organId:'',                 // 组织机构id
        assetTypeList: [''],           // 资产类型id(多个用，分割)
        approvalStatusList: [],        // 状态
        investNameOrIdOrContractCode: null,            // 投资单名称/投资单编号
        signingDateStart: '',        // 开始签订日期
        endReturnDate: '',          // 结束签订日期
        startInvestDateStart: '',         // 开始投资日期
        startInvestDateEnd: '',           // 结束投资日期
        assetType: '',                // 资产类型
        investStatusList: [],            // 投资状态
        investName: ''               // 投资单名称
      },
      queryInitCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectList: [],             // 资产项目Id
        organId:'',                 // 组织机构id
        assetTypeList: [''],           // 资产类型id(多个用，分割)
        approvalStatusList: [],        // 状态
        investNameOrIdOrContractCode: null,            // 投资单名称/投资单编号
        signingDateStart: '',        // 开始签订日期
        endReturnDate: '',          // 结束签订日期
        startInvestDateStart: '',         // 开始投资日期
        startInvestDateEnd: '',           // 结束投资日期
        assetType: '',                // 资产类型
        investStatusList: [],            // 投资状态
        investName: ''               // 投资单名称
      },
      organProjectType: {
          organId: '',
          organName: this.organName,
          projectId: [],
          assetType: []
        }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
      numList: [
        {title: '全部', key: 'total', value: 0, fontColor: '#324057'},
        {title: '草稿', key: 'draft', value: 10, bgColor: '#1890FF'},
        {title: '待审批', key: 'await', value: 0, bgColor: '#DD81E6'},
        {title: '已驳回', key: 'reject', value: 0, bgColor: '#FD7474'},
        {title: '已审批', key: 'complete', value: 0, bgColor: '#4BD288'},
        {title: '已取消', key: 'cancel', value: 0, bgColor: 'gray'}
      ],  // 概览数字数据, title 标题，value 数值，bgColor 背景色
      assetClassifyOptions: [{label: '全部资产分类', value: ''}],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      projectData: [],
      refreshKey: 0, // 更新记录key
      refreshIndex: 0 // 更新记录index
    }
  },
  watch: {
    'queryCondition.assetType' () {
      this.getAssetClassifyOptions()
    },
    // 刷新页面
      refreshKey: function (key, preKey) {
        this.queryInitCondition.organId = this.$route.params.organId
        key !== preKey && this.allQueryInit()
      },
      refreshIndex: function (key, preKey) {
        this.queryCondition.organId = this.$route.params.organId
        key !== preKey && this.allQuery()
      }
  },
  mounted () {
    this.platformDictFn('asset_type')
  },
  methods: {
    // 生成操作按钮
    createOperationBtn(type) {
      // 审批状态  0草稿   2待审批、3已驳回、 已审批1  已取消4
      let arr = [];
      // 草稿 已驳回
      if (["0", "3"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_FORM_EDIT)) {
          arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
        }
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_FORM_DELETE)) {
          arr.push({ iconType: "delete", text: "删除", editType: "delete" });
        }
      }
      // 待审批
      if (["2"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_FORM_APPROVE)) {
          arr.push({ iconType: "edit", text: "审批", editType: "approval" });
        }
      }
      // 已审批
      if (["1"].includes(String(type))) {
        if (this.$power.has(ASSET_MANAGEMENT.INVEST_FORM_REVERSE_AUDIT)) {
          arr.push({
            iconType: "edit",
            text: "反审核",
            editType: "readApproval",
          });
        }
      }
      arr.push({ iconType: "file-text", text: "详情", editType: "detail" });
      return arr;
    },
    // 操作事件函数
    operationFun(type, record) {
      // 编辑
      if (["edit"].includes(type)) {
        this.$router.push({name: '投资登记编辑', params: {registerId: record.investOrderId, type: 'edit'}});
      } else if (["detail"].includes(type)) {
        this.$router.push({
          name: '投资登记详情', params: {registerId: record.investOrderId, type: 'detail',organId: record.organId, organName: record.organName, queryType:1},
        });
      } else if (["approval"].includes(type)){
         this.$router.push({name: '投资登记审批', params: {registerId: record.investOrderId, type: 'approval',organId: record.organId, organName: record.organName, queryType:1}});
      }else if (["readApproval"].includes(type)){
        let that = this;
        this.$confirm({
          title: "提示",
          content: "确认要驳回此投资单吗？",
          onOk() {
             that.loading = true
        that.$api.assetInvest.updateInvestOrderStatus({investOrderId: record.investOrderId, approvalStatus:0}).then(r => {
          that.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            that.$message.success('驳回成功')
            // 更新列表
            return that.allQuery ()
          }
          throw res.message || '驳回失败'
        }).catch(err => {
          that.loading = false
          that.$message.error(123 || '驳回失败')
        })
          },
        });
      }else {
        let that = this;
        this.$confirm({
          title: "提示",
          content: "确认要作废此投资单吗？",
          onOk() {
             that.loading = true
        that.$api.assetInvest.updateInvestOrderStatus({investOrderId: record.investOrderId, approvalStatus:4}).then(r => {
          that.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            that.$message.success('删除成功')
            // 更新列表
            return that.allQuery ()
          }
          throw res.message || '删除失败'
        }).catch(err => {
          that.loading = false
          that.$message.error(123 || '删除失败')
        })
          },
        });
      }
    },
      // 控制跳转至新增领用单页面
      handleBtnAction ({id, type}) {
          const { organProjectType: { organId }, organName } = this
          this.$router.push({ name: '投资登记新增', params: { organId:this.queryCondition.organId, organName, type: 'add' }})
      },
    exportFn () {
      let obj = {
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatusList),      // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        signingDateStart: moment(this.createValue[0]).format('YYYY-MM-DD'),         // 开始签订日期
        signingDateEnd: moment(this.createValue[1]).format('YYYY-MM-DD'),          // 结束签订日期
        startInvestDateStart: moment(this.applyValue[0]).format('YYYY-MM-DD'),         // 开始投资日期
        startInvestDateEnd: moment(this.applyValue[1]).format('YYYY-MM-DD'),          // 结束投资日期
        investStatusList: this.alljudge(this.queryCondition.investStatusList),        // 投资状态列表
        investNameOrIdOrContractCode: this.queryCondition.investNameOrIdOrContractCode                              // 投资单名称/编号
      }
      this.$api.assetInvest.exportInvestOrder(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '投资登记.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    changeTree (value, label) {
      this.organId = value
      console.log(this.organId)
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = undefined
      this.getObjectKeyValueByOrganIdFn()
      this.query()
    },
        queryInit() {
       this.loading = true
      let obj = {
        pageNum: this.queryInitCondition.pageNum,                // 当前页
        pageSize: this.queryInitCondition.pageSize,              // 每页显示记录数
        approvalStatusList: this.alljudge(this.queryInitCondition.approvalStatusList),      // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.alljudge(this.queryInitCondition.projectList),            // 资产项目Id
        organId: this.queryInitCondition.organId,        // 组织机构id
        assetTypeList: this.alljudge(this.queryInitCondition.assetType),  // 资产类型id(多个用，分割)
        signingDateStart: moment(this.createValue[0]).format('YYYY-MM-DD'),         // 开始签订日期
        signingDateEnd: moment(this.createValue[1]).format('YYYY-MM-DD'),          // 结束签订日期
        startInvestDateStart: moment(this.applyValue[0]).format('YYYY-MM-DD'),         // 开始投资日期
        startInvestDateEnd: moment(this.applyValue[1]).format('YYYY-MM-DD'),          // 结束投资日期
        investStatusList: this.alljudge(this.queryInitCondition.investStatusList),        // 投资状态列表
        investNameOrIdOrContractCode: this.queryInitCondition.investNameOrIdOrContractCode                             // 投资单名称/编号
      }
      this.$api.assetInvest.getInvestOrderStatistics(obj).then(res => {
        if(res.data.code == 0){
          this.numList.map((item,index) => {
            this.numList[index].value = res.data.data[item.key]
          })
          this.$api.assetInvest.getInvestOrderPageList(obj).then(r => {
            if(r.data.code == 0){
              r.data.data.data.map((item,index) => {
                r.data.data.data[index].key = item.investOrderId
                item.operationDataBtn = this.createOperationBtn(
              item.approvalStatus
            );
              })
              this.tableData = r.data.data.data
              this.count = r.data.data.count
            }
            this.loading = false
          })
        }

      })
    },
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatusList),      // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.alljudge(this.queryCondition.projectList),            // 资产项目Id
        organId: this.queryCondition.organId,        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        signingDateStart: moment(this.createValue[0]).format('YYYY-MM-DD'),         // 开始签订日期
        signingDateEnd: moment(this.createValue[1]).format('YYYY-MM-DD'),          // 结束签订日期
        startInvestDateStart: moment(this.applyValue[0]).format('YYYY-MM-DD'),         // 开始投资日期
        startInvestDateEnd: moment(this.applyValue[1]).format('YYYY-MM-DD'),          // 结束投资日期
        investStatusList: this.alljudge(this.queryCondition.investStatusList),        // 投资状态列表
        investNameOrIdOrContractCode: this.queryCondition.investNameOrIdOrContractCode                              // 投资单名称/编号
      }
      this.$api.assetInvest.getInvestOrderStatistics(obj).then(res => {
        if(res.data.code == 0){
          this.numList.map((item,index) => {
            this.numList[index].value = res.data.data[item.key]
          })
          this.$api.assetInvest.getInvestOrderPageList(obj).then(r => {
            if(r.data.code == 0){
              r.data.data.data.map((item,index) => {
                r.data.data.data[index].key = item.investOrderId
                item.operationDataBtn = this.createOperationBtn(
              item.approvalStatus
            );
              })
              this.tableData = r.data.data.data
              this.count = r.data.data.count
            }
            this.loading = false
          })
        }

      })
      
    },
     // 删除项目
      confirmDelete (registerId) {
        this.loading = true
        this.$api.assetInvest.updateInvestOrderStatus({investOrderId: registerId, approvalStatus:4}).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('删除成功')
            // 更新列表
            return this.allQuery ()
          }
          throw res.message || '删除失败'
        }).catch(err => {
          this.loading = false
          this.$message.error(123 || '删除失败')
        })
      },
    allQuery () {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
      this.query()
    },
        allQueryInit () {
      this.queryInitCondition.pageNum = 1
      this.queryInitCondition.pageSize = 10
      this.queryInit()
    },
    alljudge (val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return []
        } else {
          return val
        }
      } else {
        return []
      }
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 查询统计信息
    pageListStatistics (form) {
      this.$api.assetInvest.getInvestOrderStatistics(form).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          let { numList } = this
          return this.numList = numList.map(m => {
            return { ...m, value: (res.data || {})[m.key] }
          })
        }
        throw res.message
      }).catch(err => {
        this.$message.error(err || '查询统计信息出错')
      })
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions () {
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetType.length === 1 ? this.queryCondition.assetType.join(',') : ''
      }
      if (!obj.assetType) {
        this.queryCondition.assetClassify = ['']
        this.assetClassifyOptions = [{label: '全部资产分类', value: ''}]
        return
      }
      this.$api.assets.getList(obj).then(res => {
        if (res.data.code === '0') {
          let arr = [{label: '全部资产分类', value: ''}]
          res.data.data.forEach(item => {
            let obj = {
              label: item.professionName,
              value: item.professionCode
            }
            arr.push(obj)
          })
          this.assetClassifyOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类发生变化
    changeAssetClassify (value) {
      this.$nextTick(function () {
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, this.assetClassifyOptions)
        
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        console.log(this.queryCondition.approvalStatusList, this.approvalStatusData)
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatusList, this.approvalStatusData)
      })
    },
    // 投资状态发生变化
    investStatusFn (value) {
      this.$nextTick(function () {
        console.log(this.queryCondition.investStatusList, this.investStatusData)
        this.queryCondition.investStatusList = this.handleMultipleSelectValue(value, this.queryCondition.investStatusList, this.investStatusData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
                console.log(this.queryCondition.assetType, this.assetTypeData)
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
      })
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectData = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
      
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = ['']
      } else {
        let totalIndex = data.indexOf('')
        if (totalIndex > -1) {
          data.splice(totalIndex, 1)
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['']
          }
        }
      }
      return data
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
  },
    // 路由卫士，用于审批及提交成功后刷新列表
    beforeRouteEnter (to, from, next) {
      const { name } = from
      const { params: { refresh } } = to
      next(vm => {
        // 通过 `vm` 访问组件实例
        if ((name === '投资登记新增' || name === '投资登记审批') && refresh) {
          vm.refreshKey = new Date().getTime()
        }
        if (name === '投资登记编辑' && refresh) {
          vm.refreshIndex = new Date().getTime()
        }
      })
    }
}
</script>

<style lang="less" scoped>
.assetRegister {
  .opt{
    display: flex;
    justify-content: space-evenly;
    width: 90px;
  }
  .box {
    display: inline-block;
    // vertical-align: middle;
    margin-right: 10px;
    
  }
  .action_text{
    color: black !important;
  }  
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
  .formCon {
    display: flex;
    width: 100%;
    justify-content:flex-end;
    flex-wrap: wrap;
    > * {
      margin-right:10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
}
</style>
