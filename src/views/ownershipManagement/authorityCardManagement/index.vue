<!--
  权证管理
-->
<template>
  <div class="ownershipRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}" style=" position: relative">
      <div slot="headerBtns">
        <SG-Button icon="import" style="margin-right: 8px" @click="openImportModal" v-power="ASSET_MANAGEMENT.ASSET_ACM_INPORT">导入</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.ASSET_ACM_EXPORT" type="primary" style="margin-right: 8px" @click="exportData"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
        <SG-Button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_ACM_NEW" @click="newChangeSheetFn" style="margin-right: 8px">新建权证</SG-Button>
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_ACM_NEW" :disabled="control" @click="delBatch">批量注销权证</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.ASSET_ACM_SETTING" icon="setting" @click="changeListSettingsModal(true)" style="margin: 0 10px">列表设置</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.zcgl_asset_acm_custom_labels" :disabled="control" @click="tagsFn" style="margin: 0 10px">权证标签</SG-Button>
      </div>
      <div slot="headerForm">
      </div>
      <div slot="contentForm" class="search-content-box" style="position: absolute">
        <div class="search-from-box" style="float: right; text-align: left">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle" :showSearch='true'></treeSelect>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部权证类型"
            :tokenSeparators="[',']"
            @select="kindOfRightsDataFn"
            v-model="queryCondition.kindOfRights"
          >
            <a-select-option :title="item.name" v-for="(item, index) in kindOfRightsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :style="allStyle" showSearch :filterOption="filterOption" placeholder="全部权属人" v-model="queryCondition.obligeeId">
            <a-select-option :title="item.name" v-for="(item, index) in obligeeIdData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select
            :style="allStyle"
            showSearch
            placeholder="请选择权属形式"
            optionFilterProp="children"
            mode="multiple"
            :options="$addTitle(ownerTypeData)"
            v-model="queryCondition.ownerTypeList"
            :allowClear="true"
            :filterOption="false"
            notFoundContent="没有查询到数据"
            v-decorator="['ownerType',{ rules: [{required: true, message: '请选择权属形式'}], initialValue: ''}]"
          />
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部审批状态"
            :tokenSeparators="[',']"
            @select="statusFn"
            v-model="queryCondition.status"
          >
            <a-select-option :title="item.name" v-for="(item, index) in statusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="审批转态"
            :tokenSeparators="[',']"
            @select="approvalStatusFn"
            v-model="queryCondition.approvalStatusList"
          >
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusListData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input :style="allStyle" v-model="queryCondition.warrantNbr" placeholder="请输入权证号" maxlength="30"  />
          <a-input :style="allStyle" v-model="queryCondition.seatingPosition" placeholder="坐落位置" maxlength="30"  />
          <a-select :style="allStyle" showSearch :filterOption="filterOption" placeholder="全部附件状态" v-model="queryCondition.attachmentStatus">
            <a-select-option :title="item.name" v-for="(item, index) in attachmentStatus" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部用途"
            :tokenSeparators="[',']"
            @select="useFn"
            v-model="queryCondition.ownershipUseList"
          >
            <a-select-option :title="item.name" v-for="(item, index) in useData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select
            optionFilterProp="children"
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部权证标签"
            :tokenSeparators="[',']"
            @select="warrantTagFn"
            v-model="queryCondition.warrantTags"
          >
            <a-select-option :title="item.name" v-for="(item, index) in warrantTagsList" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="queryHandler">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList" />
    <div class="table-layout-fixed" ref="table_box">
      <a-table
        :loading="loading"
        :columns="tableObj.columns"
        :dataSource="tableData"
        :row-selection="{selectedRowKeys: idArr, 
        onChange: onChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        getCheckboxProps: record => ({
          props: {
            disabled: record.statusName === '注销', // 注销权证禁止选择
            name: record.statusName,
          },
        })}"
        class="custom-table td-pd10"
        :pagination="false"
        :rowKey='record=>record.warrantId'
        :scroll="{y: scrollHeight}"
        >
        <template slot="obligeeName" slot-scope="text, record">
          <span>{{record.obligeeName || '--'}}</span>
        </template>
        <template slot="ownerTypeName" slot-scope="text, record">
          <span>{{record.ownerTypeName || '--'}}</span>
        </template>
        <!-- <template slot="lotNoEstateUnitCode" slot-scope="text, record">
          <span>{{record.lotNoEstateUnitCode || '--'}}</span>
        </template> -->
        <template slot="useLimitDate" slot-scope="text, record">
          <span>{{record.useLimitDate || '--'}}</span>
        </template>
        <template slot="handoverDate" slot-scope="text, record">
          <span>{{record.handoverDate || '--'}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <OperationPopover :operationData="record.operationDataBtn" @operationFun="operationFn($event, record)"></OperationPopover> -->
          <div class="tab-opt">
            <span v-for="(item, index) in record.operationDataBtn" :key="index" @click="operationFn(item.editType, record)">{{item.text}}</span>
          </div>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        ref="footerPagination"
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增 -->
    <NewCard v-if="newShow" ref="newCard" :pageNum="queryCondition.pageNum" @showFn="showFn" @successQuery="successQueryFn"></NewCard>
    <!-- 详情 -->
    <CardDetails ref="cardDetails" :warrantId="warrantId"></CardDetails>
    <!--导入-->
    <batch-import @upload="uploadFile" @down="downTemplate" ref="batchImport" title="权证批量导入"/>
    <!--编辑列表表头-->
    <TableHeaderSettings v-if="listSettingFlag" :funType="funType" @cancel="changeListSettingsModal(false)" @success="handleTableHeaderSuccess" />
    <!-- 标签设置 -->
    <commonLabelComponent :listData="listData" title="权证标签设置" @commonFn="commonFn" @cancelFn="cancelFn" ref="componentRef" v-if="componentShow"></commonLabelComponent>
  </div>
</template>

<script>
import OperationPopover from '@/components/OperationPopover'
import TableHeaderSettings from "@/components/TableHeaderSettings";
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import NewCard from './newCard.vue'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import CardDetails from './cardDetails.vue'
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'
// import {utils, debounce} from '@/utils/utils.js'
import {utils} from '@/utils/utils'
import BatchImport from 'src/views/common/eportAndDownFile'
import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
import {getTableHeaders} from "utils/share";
import commonLabelComponent from '@/components/commonLabelComponent'
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
const detailColumns = [
  {
    title: '权属人',
    dataIndex: 'obligeeName',
    scopedSlots: { customRender: 'obligeeName' }
  },
  {
    title: '权属形式',
    dataIndex: 'ownerTypeName',
    scopedSlots: { customRender: 'ownerTypeName' }
  },
  {
    title: '使用期限',
    dataIndex: 'useLimitDate',
    scopedSlots: { customRender: 'useLimitDate' },
  },
  {
    title: '交接日期',
    dataIndex: 'handoverDate',
    scopedSlots: { customRender: 'handoverDate' },
  }
]
const requiredColumn = [
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    scopedSlots: { customRender: 'operation' },
  }
]
const statusData = [
  {
    name: '全部权证状态',
    value: ''
  },
  {
    name: '已注销',
    value: '0'
  },
  {
    name: '正常',
    value: '1'
  }
]
const approvalStatusListData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '草稿',
    value: '0'
  },
  {
    name: '已审批',
    value: '1'
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
    name: '已取消',
    value: '4'
  }
]
const attachmentStatus = [
  {
    name: '全部附件状态',
    value: ''
  },
  {
    name: '未上传',
    value: '0'
  },
  {
    name: '已上传',
    value: '1'
  }
]
const queryCondition =  {
    organId: '',        // 组织机构
    kindOfRights: '',   // 权证类型(多选)
    obligeeId: '',      // 权属人
    status: ['1'],         // 权证状态
    approvalStatusList: [''], // 审批状态
    attachmentStatus: '', // 附加状态
    warrantNbr: '',     // 权证号
    ownerTypeList: [],  // 权属形式
    pageNum: 1,         // 第几页
    pageSize: 10,       // 每页显示记录数
    seatingPosition: '', // 坐落位置
    ownershipUseList: [''], //用途
    warrantTags: ['']
  }
export default {
  components: {OperationPopover, SearchContainer, TreeSelect, segiIcon, NewCard, CardDetails, noDataTips, BatchImport, OverviewNumber, TableHeaderSettings, commonLabelComponent},
  props: {},
  data () {
    return {
      warrantTagsList: [],
      listData: [],
      componentShow: false,
      warrantTags: '',
      scrollHeight: 260,
      useData: [],
      funType: 5,
      listSettingFlag: false,
      ASSET_MANAGEMENT,
      newShow: false,
      warrantId: '',
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      organName: '',
      organId: '',
      tableData: [],
      kindOfRightsData: [],
      statusData: [...statusData],
      approvalStatusListData: [...approvalStatusListData],
      attachmentStatus: [...attachmentStatus],
      queryCondition: {...queryCondition},
      count: '',
      obligeeIdData: [],
      control:true,
      idArr: [],
      numList: [
        {title: '权证数量', key: 'assetCount', value: 0, fontColor: '#324057',info:'权证数量'},
        {title: '权证面积(㎡)', key: 'area', value: 0, bgColor: '#4BD288',info:'权证面积(㎡)'},
        {title: '不动产权证', key: 'transferOperationArea', value: 0, bgColor: '#1890FF',info:'不动产权证'},
        {title: '土地使用权证', key: 'idleArea', value: 0, bgColor: '#DD81E6',info:'土地使用权证'},
        {title: '使用权证', key: 'selfUserArea', value: 0, bgColor: '#FD7474',info:'使用权证'},
        {title: '房屋产权', key: 'houseWarrantCount', value: 0, bgColor: 'gray',info:'房屋产权'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      ownerTypeData: [], // 权属形式
      key: 0, // 更新Modal包裹的子组件
      tableObj: {
        initColumns: [],
        scroll: { x: 3500 },
        columns:[]
      },
      // rowSelection: {
        
      // }
    }
  },
  computed: {
  },
  methods: {
    cancelFn () {
      this.componentShow = false
    },
    // 标签提交
    commonFn (val, name) {
      console.log(val, '90909')
      if (!val) {
        this.$message.info('请选择权证标签')
        return
      }
      let obj = {
        warrantIds: this.idArr.join(','),
        warrantTags: val,
        warrantTagNames: name
      }
      this.$api.ownership.updateWarrantTag(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.$message.info('保存成功')
          this.cancelFn()
          this.query()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 标签方法
    tagsFn () {
      this.componentShow = true
      this.$nextTick(() => {
        this.$refs.componentRef.show = true
      })
    },
     // 查询评估机构-机构字典
      queryUseOptions (val) {
        this.queryCondition.ownershipUseList = ['']
        const { organId } = this.queryCondition
        if (!organId) { return false }
        this.$api.basics.organDict({ code: val, organId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            if (val === 'OWNERSHIP_USE') {
              res.data.unshift({
                name: '全部用途',
                value: ''
              })
              this.useData = res.data
            }
            if (val === 'AMS_WARRANT_TAG') {
              let arr = utils.deepClone(res.data)
              // 查询标签
              arr.unshift({
                name: '全部权证标签',
                value: ''
              })
              this.warrantTagsList = arr
              this.listData = res.data
            }
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
    async initTableColumns(){
      // 暂不考虑固定表头顺序问题，目前只有操作列
      const res = await getTableHeaders({funType:this.funType})
      this.tableObj.columns = res.customShow.map( ele =>{
        let mapRes = {}
        // 匹配用户预设表头，使用前端代码对应表头配置
        const temp = detailColumns.find(item=>[item.key,item.dataIndex].includes(ele.colCode))
        if (temp){
          mapRes = temp
        }else {
          mapRes =  {
            title: ele.colName,
            dataIndex: ele.colCode
          }
        }
        return mapRes
      })
      requiredColumn.forEach(ele=>{
        this.tableObj.columns.splice(this.tableObj.columns.length,0,ele)
      })
    },
    handleTableHeaderSuccess(){
      this.changeListSettingsModal(false)
      this.initTableColumns()
    },
    changeListSettingsModal(flag){
      this.listSettingFlag = flag
    },
    onChange (selectedRowKeys, selectedRows) {
      this.idArr = []
      this.idArr = selectedRows.map(item => {
          return item.warrantId
      })
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, this.idArr);
    },
    onSelect (record, selected, selectedRows) {
      console.log(record, selected, selectedRows);
      if(selectedRows.length==0){
        this.control = true
      }else{
        this.control = false
      }

    },
    onSelectAll (selected, selectedRows, changeRows) {
      if(selectedRows.length==0){
        this.control = true
      }else{
        this.control = false
      }

      console.log(selected, selectedRows, changeRows);
    },
    // 新建权证
    newChangeSheetFn () {
      this.newShow = true
      this.$nextTick(() => {
        this.$refs.newCard.show = true
        this.$refs.newCard.newFn('new', this.queryCondition.organId, this.organName)
        this.$refs.newCard.selectFn()
      })
    },
    // 操作
    operationFn (type, record) {
      if (type === 'particulars') {
        this.$refs.cardDetails.initData({warrantNbr: record.warrantNbr})
        this.$refs.cardDetails.query({ warrantId: record.warrantId})
        this.$refs.cardDetails.type = 'particulars'
      } else if (type === 'approval') {
        this.$refs.cardDetails.initData({warrantNbr: record.warrantNbr})
        this.$refs.cardDetails.query({ warrantId: record.warrantId})
        this.$refs.cardDetails.type = 'approval'
      } else if (type === 'edit') {
        this.newShow = true
        this.$nextTick(() => {
          this.$refs.newCard.show = true
          this.$refs.newCard.newFn('edit', record.organId, record.organName)
          this.$refs.newCard.selectFn()
          this.$refs.newCard.query( {warrantId: record.warrantId, warrantNbr: record.warrantNbr})
        })
      } else if (type === 'logout') {
        let _this = this
        this.$confirm({
          title: '提示',
          content: '确认要注销该权证吗？',
          onOk() {
          let obj = {
            warrantId: record.warrantId
          }
          _this.$api.ownership.warrantDelete(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.$message.info('注销成功')
              _this.query()
            } else {
              _this.$message.error(res.data.message)
            }
          })
          }
        })
      }
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.obligeeId = ''
      this.selectFn()
      this.queryHandler()
      this.queryUseOptions('OWNERSHIP_USE')
      this.queryUseOptions('AMS_WARRANT_TAG')
      this.platformDictFn(value)
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.flag = e.target.checked
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
    // 权属人
    selectFn () {
      let obj = {
        organId: this.queryCondition.organId,
        obligeeName: ''
      }
      this.$api.assets.select(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.obligeeName,
              value: item.obligeeId
            })
          })
          this.obligeeIdData = [{name: '全部权属人', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权证类型
    platformDictFn (val) {
      let obj = {
        code: 'AMS_KIND_OF_RIGHT',
        organId: val
      }
      this.$api.assets.organDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.kindOfRightsData = [{name: '全部权证类型', value: ''}, ...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权证类型变化
    kindOfRightsDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.kindOfRights = this.handleMultipleSelectValue(value, this.queryCondition.kindOfRights, this.kindOfRightsData)
      })
    },
    // 状态发生变化
    statusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.status = this.handleMultipleSelectValue(value, this.queryCondition.status, this.statusData)
      })
    },
    // 审批状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatusList, this.approvalStatusListData)
      })
    },
    // 权证标签
    warrantTagFn (value) {
      this.$nextTick(function () {
        this.queryCondition.warrantTags = this.handleMultipleSelectValue(value, this.queryCondition.warrantTags, this.warrantTagsList)
      })
    },
    // 用途发生变化
    useFn (value) {
      this.$nextTick(function () {
        this.queryCondition.ownershipUseList = this.handleMultipleSelectValue(value, this.queryCondition.ownershipUseList, this.useData)
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      this.alterationDate = []
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.queryCondition.ownerTypeList = []
      this.queryCondition.ownershipUseList = ['']
      this.queryCondition.warrantTags = ['']
      this.queryHandler()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    showFn (val) {
      this.newShow = val
    },
    successQueryFn (val) {
      this.queryCondition.pageNum = val
      this.queryCondition.pageSize = 10
      this.query()
    },
    handleSearchReq(){
      return {
        organId: Number(this.queryCondition.organId),        // 组织机构
        kindOfRights: this.queryCondition.kindOfRights.length > 0 ? this.queryCondition.kindOfRights.join(',') : '',   // 权证类型(多选)
        obligeeId: this.queryCondition.obligeeId,       // 权属人
        ownerTypeList: this.queryCondition.ownerTypeList, // 权属形式
        status: this.queryCondition.status.length > 0 ? this.queryCondition.status.join(',') : '',         // 权证状态
        approvalStatusList: this.queryCondition.approvalStatusList[0] ? this.queryCondition.approvalStatusList : [],    // 审批状态
        warrantNbr: this.queryCondition.warrantNbr,     // 权证号
        seatingPosition: this.queryCondition.seatingPosition, // 坐落位置
        uploadAttachment: this.queryCondition.attachmentStatus,
        warrantTags: this.queryCondition.warrantTags.length > 0 ? this.queryCondition.warrantTags.join(',') : '', 
        ownershipUseList: this.queryCondition.ownershipUseList[0] ? this.queryCondition.ownershipUseList : []
      }
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,     // 当前页
        pageSize: this.queryCondition.pageSize,    // 每页显示记录数
        ...this.handleSearchReq()
      }
      this.$api.ownership.warrantList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.lotNoEstateUnitCode = `${item.houseNo || '--'}/${item.lotNo || '--'}/${item.estateUnitCode || '--'}`
              item.operationDataBtn = this.createOperationBtn(item.approvalStatus) // 操作按钮
            })
            data.forEach(item => {
              if (Number(item.uploadAttachment) === 1) {
                item.uploadAttachment = '已上传'
              } else {
                item.uploadAttachment = '未上传'
              }
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
     // 生成操作按钮
    createOperationBtn (type) {
      // 审批状态  0草稿   2待审批、已驳回3、已审批1  已取消4
      let arr = []
      // 草稿 已驳回
      // if (['0', '3'].includes(String(type))) {
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_ACM_EDIT)) {
        arr.push({iconType: 'edit', text: '编辑', editType: 'edit'})
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_ACM_DELETE)) {
        arr.push({iconType: 'delete', text: '注销', editType: 'logout'})
      }
      // }
      // 待审批
      if (['2'].includes(String(type))) {
        arr.push({iconType: 'edit', text: '审批', editType: 'approval'})
      }
      arr.push({iconType: 'file-text', text: '详情', editType: 'particulars'})
      return arr
    },
    // 点击查询按钮
    queryHandler () {
      this.queryCondition.pageNum = 1
      this.query()
      this.warrantTotal()
    },
    warrantTotal () {
      //this.loading = true
      let obj = {
        organId: Number(this.queryCondition.organId),        // 组织机构
        kindOfRights: this.queryCondition.kindOfRights.length > 0 ? this.queryCondition.kindOfRights.join(',') : '',   // 权证类型(多选)
        obligeeId: this.queryCondition.obligeeId ? this.queryCondition.obligeeId : '',       // 权属人
        ownerTypeList: this.queryCondition.ownerTypeList.length === 0 ? [] : this.queryCondition.ownerTypeList, // 权属形式
        status: this.queryCondition.status.length > 0 ? this.queryCondition.status.join(',') : '',         // 权证状态
        approvalStatusList: this.queryCondition.approvalStatusList[0] ? this.queryCondition.approvalStatusList : [],    // 审批状态
        warrantNbr: this.queryCondition.warrantNbr ? this.queryCondition.warrantNbr : '',    // 权证号
        uploadAttachment: this.queryCondition.attachmentStatus
      }
      this.$api.ownership.warrantTotal(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.numList[0].value = data.totalWarrantCount
          this.numList[1].value = data.buildArea+'(㎡)'
          this.numList[2].value = data.assetWarrantArea+'(㎡)'
          this.numList[2].title = this.numList[2].info+'('+data.assetWarrantCount+')'
          this.numList[3].value = data.landWarrantArea+'(㎡)'
          this.numList[3].title = this.numList[3].info+'('+data.landWarrantCount+')'
          this.numList[4].value = data.useWarrantArea+'(㎡)'
          this.numList[4].title = this.numList[4].info+'('+data.useWarrantCount+')'
          this.numList[5].value = data.houseWarrantArea+'(㎡)'
          this.numList[5].title = this.numList[5].info+'('+data.houseWarrantCount+')'
          //this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.numList.forEach(item => {
            item.value = 0
          })
          //this.loading = false
        }
      })
    },
    // 资产登记-详情明细统计
    assetViewTotal () {
      let obj = {
      }
      this.$api.land.assetViewTotal(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          return this.numList = this.numList.map(m => {
            return { ...m, value: data[m.key] ? ['assetCount'].includes(m.key) ? data[m.key] : Math.round(data[m.key]*10000)/10000:  0 }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 打开批量导入Modal
    openImportModal () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      this.$refs.batchImport.visible = true
    },
    // 下载导入模板文件
    downTemplate () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      exportDataAsExcel(`import_template_qszj.xlsx?organId=${this.queryCondition.organId}`, this.$api.tableManage.downloadTemplate, '权证导入模板.xlsx', this)
    },
    // 批量导入
    uploadFile (file) {
      this.$refs.batchImport.visible = false
      const { queryCondition: {organId} } = this
      let name = this.$SG_Message.loading({ duration: 0, content: '批量导入中' })
      let fileData = new FormData()
      fileData.append('file', file)
      let query = `?organId=${organId}`
      this.$api.tableManage.importOwnCardData(query, fileData).then(r => {
        this.$SG_Message.destroy(name)
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$SG_Message.success(res.message || '导入成功')
          this.$refs.batchImport.visible = false
          return this.query()
        }
        throw res.message
      }).catch(err => {
        this.$SG_Message.destroy(name)
        this.$SG_Message.error(err || '批量导入失败')
      })
    },
    // 导出列表
    exportData () {
      let data = this.handleSearchReq()
      let loadingName = this.SG_Loding('导出中...')
      this.$api.ownership.warrantExport(data).then(res => {
        this.$SG_Message.destroy(loadingName)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        // ${this.organName}
        a.download = `权证数据导出.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error('权证管理导出失败!')
      })
    },
    // 权属形式
    platformDict () {
      this.$api.assets.platformDict({code: 'AMS_OWNER_TYPE'}).then(res => {
        if (+res.data.code === 0) {
          let data = res.data.data
          let arr = [
            // {
            //   label: '全部权属形式',
            //   value: ''
            // }
          ]
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.ownerTypeData = arr
        } else {
          this.$message.error(res.data.message)
        }
      }, res => {
        this.$message.error(res.data.message)
      })
    },
    // 权证批量删除
    delBatch () {
      let _this = this
          this.$confirm({
            title: '提示',
            content: '确认要批量注销选中权证吗？',
            onOk() {
            let obj = {
              warrantIdList: _this.idArr
            }
            _this.$api.ownership.warrantDeleteBatch(obj).then(res => {
              if (Number(res.data.code) === 0) {
                _this.$message.info('注销成功')
                _this.idArr = []
                _this.control = true 
                _this.query()
              } else {
                _this.$message.error(res.data.message)
              }
              // window.location.reload()
            })
            }
          })
    },
  },
  created () {
    // 初始化Table列头
    let{ columns } = this.tableObj
    this.tableObj.initColumns = columns
    // 默认不展示xx表头
    this.tableObj.columns = this.tableObj.columns.filter(ele=>!ele.defaultHide)
  },
  watch: {
    toggle (val) {
      this.scrollHeight = val ? 260 : 390
    },
    '$route' () {
      if (this.$route.path === '/authorityCardManagement' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.queryHandler()
      }
    }
  },
  mounted () {
    // 权证类型
    
    // 权属类型
    this.platformDict()
    // 添加可以选择不同数量分页
    this.$nextTick(function () {
      let arr = this.$refs.footerPagination.pageLists
      if (!arr.includes(200)) {
        this.$refs.footerPagination.pageLists = [10, 20, 30, 50, 100]
      }
    })
    this.initTableColumns()
  }
}
</script>
<style lang="less">
.ownershipRegistration {
  .from-second {
    padding: 26px 190px 0 0;
  }
  .box {
    display: inline-block;
  }
  .box-right {
    margin-right: 10px;
  }
  .search-content-box{
    display: flex;
    justify-content: space-between;
    .search-from-box{
      flex: 1;
    }
    .two-row-box{
      padding-top: 14px;
      flex: 0 0 190px;
    }
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
  .ant-table-header{
    height: 100% !important;
  }
}
.sg-message>.main.confirmDelete>.content, .sg-message>.main.custom>.content, .sg-message>.main.error>.content, .sg-message>.main.info>.content, .sg-message>.main.loading>.content, .sg-message>.main.loadingErr>.content, .sg-message>.main.networkErr>.content, .sg-message>.main.success>.content {
  background-position: top left;
  min-height: 233px;
  height: auto;
  padding: 10px;
}
</style>
