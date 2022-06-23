<!--资产视图业务-资产视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          icon="import"
          type="primary"
          :loading='exportAssetBtn'
          @click="handleExport('exportAssetBtn')"
          v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_AV_EXPORT"
        >导出资产视图</SG-Button>
        <!--二期开发-->
        <!--<SG-Button-->
          <!--icon="import"-->
          <!--style="margin: 0 10px"-->
          <!--:loading="exportHouseBtn"-->
          <!--@click="handleExport('exportHouseBtn')"-->
          <!--:disabled="!tableObj.dataSource.length"-->
          <!--:title="tableObj.dataSource.length ? '' : '无可导出数据'"-->
        <!--&gt;导出房屋卡片</SG-Button>-->
        <!--<SG-Button icon="sync" @click="handleTransform('tenement')">转物业</SG-Button>-->
        <!--<SG-Button icon="home" style="margin: 0 10px" @click="handleTransform('operation')">转运营</SG-Button>-->
        <SG-Button icon="setting" @click="handleModalStatus(true)" style="margin: 0 10px">列表设置</SG-Button>
        <SG-Button type="default" @click="clickAsset" v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_AV_ASSET_LABEL" v-if="organProjectBuildingValue.organId && organProjectBuildingValue.organId.split(',').length === 1" style="margin: 0 10px">资产标签</SG-Button>
        <SG-Button type="default" @click="modalObj.status=true;modalType=3" v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_AV_ASSET_PLEDGE">质押情况</SG-Button>
      </div>
      <div slot="headerForm">
        <div style="width: 55%; float: right; margin-right: 8px; text-align: left">
          <organ-project-building v-model="organProjectBuildingValue" mode="multiple" :multiple="true" :isShowBuilding="false"/>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="12">
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              v-model="sourceModes"
              option-filter-prop="title"
              placeholder="请选择来源方式"
              :options="$addTitle(sourceOptions)"
              @change="changeSource"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="status"
              @change="statusChange"
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              placeholder="请选择资产状态"
              :options="$addTitle(statusOptions)"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              v-model="categoryId"
              option-filter-prop="title"
              placeholder="请选择资产分类"
              :options="$addTitle(categoryOptions)"
              @change="categoryChange"
            />
          </a-col>
          <a-col :span="4">
            <a-input placeholder="请输入资产名称或编码" v-model="assetName"/>
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              v-model="useType"
              style="width: 100%"
              @change="useTypeChange"
              option-filter-prop="title"
              :options="$addTitle(useTypeOptions)"
              placeholder="请选择用途"
            />
          </a-col>
          <a-col :span="3" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleClick('import')">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 14px">
          <a-col :span="12">
            <province-city-district v-model="provinceCityDistrictValue"/>
          </a-col>
          <a-col :span="4">
            <a-input placeholder="详细地址" v-model="address" :maxLength="20"/>
          </a-col>
          <a-col :span="4">
            <a-input placeholder="公安门牌号" v-model="houseNumber"/>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 14px">
          <a-col :span="4">
            <a-select
              :filter-option="filterOption"
              show-search
              v-model="ownershipUse"
              style="width: 100%"
              :options="$addTitle(ownershipUseOPt)"
              placeholder="权属用途"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="supportMaterial"
              style="width: 100%"
              :options="$addTitle(supportMaterialOpt)"
              placeholder="权属用途"
            />
          </a-col>
          <a-col :span="4" v-if="organProjectBuildingValue.organId && organProjectBuildingValue.organId.split(',').length === 1">
            <a-select
              v-model="label"
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              @select="assetLabelFn"
              :options="$addTitle(assetLabelSelect)"
              placeholder="资产标签"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="uploadAttachment"
              style="width: 100%"
              @select="attachmentStatusFn"
              :options="$addTitle(attachmentStatus)"
              placeholder="全部附件状态"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              :allowClear="true"
              v-model="pledge"
              style="width: 100%"
              :options="$addTitle(pledgeList)"
              placeholder="请选择质押情况"
            />
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
    </a-spin>
    <!--列表Table-->
    <a-table
      v-bind="tableObj"
      class="custom-table td-pd10"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelectAll: onSelectAll,
      getCheckboxProps: record => ({
        props: {
          disabled: record.assetName === '所有页-合计', // Column configuration not to be checked
          name: record.assetName,
        },
      }) }">>
      <template slot="assetName" slot-scope="text">
        <!-- <tooltip-text :text="text"/> -->
        <span :title="text">
          {{text}}
        </span>
      </template>
      <span slot="action" slot-scope="text, record">
        <router-link v-if="record.assetName !== '所有页-合计'" :to="{ path: '/assetView/assetViewDetail', query: { houseId: record.assetHouseId, assetId: record.assetId } }">详情</router-link>
      </span>
      <template slot="fireMaterial" slot-scope="text, record">
        <span v-if="record.assetName !== '所有页-合计'">
           {{+text===1?'是':'否'}}
        </span>
      </template>
      <!-- <template slot="uploadAttachment" slot-scope="text, record">
        <span v-if="record.assetName !== '所有页-合计'">
          {{ +text === 1 ? '已上传' : '未上传' }}
        </span>
      </template> -->
      <template slot="area" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="transferOperationArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="selfUserArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="idleArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="occupationArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="otherArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="originalValue" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="marketValue" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="organFee" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="rentedArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
      <template slot="unRentedArea" slot-scope="text">
       {{getFormat(text)}}
      </template>
    </a-table>
    <div style="height: 70px;">

    </div>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--编辑列表表头-->
    <!-- <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="handleModalStatus(false)"
      width="800px"
    >
      <edit-table-header
        v-if="modalType === 1"
        :key="key"
        ref="tableHeader"
        :checkedArr="checkedHeaderArr"
        :columns="tableObj.initColumns"
      />
      <edit-tag v-if="modalType === 2 && modalObj.status" :options="assetLabelOpt" ref="editTagRef"/>
      <edit-pledge v-if="modalType === 3 && modalObj.status" :options="pledgeList" ref="pledgeRef"/>
    </SG-Modal> -->
    <TableHeaderSettings v-if="modalObj.status" :funType="funType" @cancel="changeListSettingsModal(false)" @success="handleTableHeaderSuccess" />
  </div>
</template>

<script>
  import TableHeaderSettings from 'src/components/TableHeaderSettings'
  import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import EditTableHeader from './components/EditTableHeader'
  import tooltipText from 'src/views/common/TooltipText'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import NoDataTip from 'src/components/noDataTips'
  import {querySourceType} from "@/views/common/commonQueryApi";
  import { getFormat } from "utils/utils";
  import EditTag from '../building-view/editTag.vue'
  import EditPledge from './components/components/EditPledge.vue'
  import {queryAssetLabelConfig} from '@/api/publicCode.js'
  import { throttle } from '@/utils/utils'
  import { handleTableScrollHeight,handleTableHeaderScrollHeight,initTableColumns } from '@/utils/share.js'
  const judgment = [undefined, null, '']
  const supportMaterialOpt = [
    { label: "全部证件情况", value: "" },
    { label: "有证明材料证件", value: 1 },
    { label: "无证明材料证件", value: 0 },
  ]
  const attachmentStatus = [
  {
    label: '全部附件状态',
    value: ''
  },
  {
    label: '未上传',
    value: '0'
  },
  {
    label: '已上传',
    value: '1'
  }
]
  const assetLabelOpt = [
    // { label: "全部资产标签  ", value: "" },
    // { label: "正常", value: 1 },
    // { label: "异常", value: 0 },
  ]
  const detailColumns = [
  { title: '资产名称', dataIndex: 'assetName', scopedSlots: { customRender: 'assetName' }, fixed: 'left', width: 300, ellipsis: true },
            { title: '资产编码', dataIndex: 'assetCode', width: 150 },
            { title: '接管机构', dataIndex: 'ownerOrganName', width: 150 },
            { title: '宗地号', dataIndex: 'addressNo', width: 150 },
            { title: '建筑面积(㎡)', dataIndex: 'area', width: 150, scopedSlots: { customRender: 'area' } },
            { title: '资产项目名称', dataIndex: 'projectName', scopedSlots: { customRender: 'projectName' }, width: 200 },
            { title: '产证附件状态', dataIndex: 'uploadAttachment', scopedSlots: { customRender: 'uploadAttachment' }, width: 120 },
            { title: '地理位置', dataIndex: 'address', width: 300 },
            { title: '楼栋名称', dataIndex: 'buildName', scopedSlots: { customRender: 'buildName' }, width: 150 },
            { title: '单元', dataIndex: 'unitName', width: 100 },
            { title: '楼层', dataIndex: 'floor', width: 100 },
            { title: '层高', dataIndex: 'floorHeight', width: 100 },
            { title: '分类', dataIndex: 'objectTypeName', width: 100 },
            { title: '权属用途', dataIndex: 'ownershipUseName', width: 100 },
            { title: '用途', dataIndex: 'useType', width: 100 },
            { title: '资产形态', dataIndex: 'typeName', width: 100 },
            { title: '权属类型', dataIndex: 'kindOfRightName', width: 100 },
            { title: '权属状态', dataIndex: 'ownershipStatusName', width: 100 },
            { title: '权证号', dataIndex: 'warrantNbr', width: 150 },
            { title: '权属人', dataIndex: 'obligeeName', width: 100 },
            { title: '资产-实际产权单位', dataIndex: 'propertyRightUnit', width: 150 },
            { title: '权证-实际保管单位', dataIndex: 'safekeepUnit', width: 150 },
            { title: '房产证起始时间', dataIndex: 'houseStartDate', width: 150 },
            { title: '房产证截止时间', dataIndex: 'houseEndDate', width: 150 },
            { title: '房产证使用年限', dataIndex: 'houseProveLife', width: 150 },
            { title: '权属备注', dataIndex: 'ownershipRemark', width: 150 },
            { title: '来源方式', dataIndex: 'sourceName', width: 150, defaultHide: true },
            { title: '接管时间', dataIndex: 'startDate', width: 150  },
            { title: '运营(㎡)', dataIndex: 'transferOperationArea', width: 150, scopedSlots: { customRender: 'transferOperationArea' } },
            { title: '自用(㎡)', dataIndex: 'selfUserArea', width: 100, scopedSlots: { customRender: 'selfUserArea' }, },
            { title: '闲置(㎡)', dataIndex: 'idleArea', width: 100, scopedSlots: { customRender: 'idleArea' }, },
            { title: '占用(㎡)', dataIndex: 'occupationArea', width: 100, scopedSlots: { customRender: 'occupationArea' }, },
            { title: '其它(㎡)', dataIndex: 'otherArea', width: 100, scopedSlots: { customRender: 'otherArea' }, },
            { title: '财务卡片编码', dataIndex: 'financialCode', width: 150 },
            { title: '资产原值(元)', dataIndex: 'originalValue', width: 100, scopedSlots: { customRender: 'originalValue' } },
            { title: '最新估值(元)', dataIndex: 'marketValue', width: 100, scopedSlots: { customRender: 'marketValue' } },
            { title: '资产状态', dataIndex: 'statusName', width: 100 },
            { title: '物业管理单位', dataIndex: 'organManagement', width: 150 },
            { title: '物业缴费期限', dataIndex: 'organPayDeadline', width: 150 },
            { title: '物业费', dataIndex: 'organFee', width: 100 },
            { title: '已租面积', dataIndex: 'rentedArea', width: 100, scopedSlots: { customRender: 'rentedArea' } },
            { title: '未租面积', dataIndex: 'unRentedArea', width: 100, scopedSlots: { customRender: 'unRentedArea' } },
            { title: '是否有消防验收材料', dataIndex: 'isFireMaterial', width: 150, scopedSlots: { customRender: 'fireMaterial' }},
            { title: '资产标签', dataIndex: 'label', width: 150},
            { title: '竣工日期', dataIndex: 'completionDate', width: 300},
            { title: '楼龄', dataIndex: 'buildAge', width: 150},
            { title: '权利性质', dataIndex: 'qualityOfRightName', width: 150},
            { title: '产权证土地面积(㎡)', dataIndex: 'landArea', width: 150},
            { title: '产权证土地用途', dataIndex: 'landUse', width: 150},
            { title: '产权证有无抵押', dataIndex: 'isMortgage', width: 150},
            { title: '公安门牌号', dataIndex: 'houseNumber', width: 150},
            { title: '质押情况', dataIndex: 'pledge', width: 120},
]
const requiredColumn = [
  { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 100 }
]
  export default {
    name: 'index',
    components: { TableHeaderSettings, EditPledge, EditTableHeader, OverviewNumber, SearchContainer, ProvinceCityDistrict, OrganProjectBuilding, NoDataTip, tooltipText, EditTag},
    data () {
      return {
        pledge: undefined, // 质押情况
        pledgeList: [
          { label: "有质押", value: 1 },
          { label: "无质押", value: 0 },
        ],
        funType: 14,
        houseNumber: '',
        uploadAttachment: '',
        attachmentStatus,
        getFormat,
        supportMaterialOpt,
        supportMaterial: '',
        selectedRowKeys: [],
        assetLabelOpt,
        assetLabelSelect: [],
        label: '',
        sourceModes:[],  // 查询条件-来源方式
        ownershipUseOPt: [],
        ownershipUse: '',
        useType: [],           // 用途
        useTypeOptions: [],    // 用途
        fold: true,
        ASSET_MANAGEMENT, // 权限对象
        assetName: '', // 查询条件-资产名称
        address:'',  // 查询条件-资产地址
        status: ['0', '1', '2', '3', '4', '7'], // 查询条件-资产状态值
        categoryId: [], // 查询条件-资产分类
        categoryOptions: [], // 查询条件-资产分类选项
        statusOptions: [
          { title: '全部状态', key: 'all' }, { title: '待入库', key: '0' }, { title: '正常', key: '1' },
          { title: '报废', key: '2' }, { title: '转让', key: '3' }, { title: '报损', key: '4' },
          { title: '已出库', key: '5' }, { title: '已取消', key: '6' }, { title: '入库中', key: '7' }
        ], // 查询条件-资产状态选项
        provinceCityDistrictValue: {}, // 查询条件-省-市-区值对象
        organProjectBuildingValue: {}, // 查询条件-组织机构-资产项目-楼栋对象
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        tableObj: {
          pagination: false,
          rowKey: 'assetHouseId',
          loading: false,
          initColumns: [],
          dataSource: [],
          scroll: { x: 'max-content', y: 236 },
          columns: []
        },
        key: 0, // 更新Modal包裹的子组件
        numList: [
          {title: '所有资产(㎡)', key: 'totalArea', value: 0, fontColor: '#324057'},
          {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据，title 标题，value 数值，color 背景色
        checkedHeaderArr: [], // 格式如['name', 'age']
        exportHouseBtn: false, // 导出房屋卡片button loading标志
        exportAssetBtn: false, // 导出资产视图button loading标志
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        modalObj: { title: '展示列表设置', status: false, okText: '保存', width: 605 },
        current: null, // 当前选中的概览区域下标，与后台入参一一对应
        totalField: {
          area: '',                    // 建筑面积
          transferOperationArea: '',   // 运营
          selfUserArea: '',            // 自用
          idleArea: '',                // 闲置
          occupationArea: '',          // 占用
          otherArea: '',               // 其他
          originalValue: '',           // 资产原值
          marketValue: '',             // 最新估值
          rentedArea: '',              // 已租面积
          unRentedArea: ''             // 未租面积
        },
        sourceOptions:[],
        modalType: 1, // 1 设置列表表头 2 设置资产标签
      }
    },
    watch: {
      fold (val) {
        this.tableObj.scroll.y = val ? 236 : 420
      },
      organProjectBuildingValue: function (val, pre) {
        this.queryTableData({type: 'search'})
        if(val.organId !== pre.organId){
          this.queryCategoryOptions(val.organId)
          this.getSourceOptions(val.organId)
          this.organDict('OWNERSHIP_USE',val.organId)
          if(val.organId.split(',').length === 1){
            this.getAssetLabel(val.organId)
          }
        }
      },

      // 全选与其他选项互斥处理
      // status: function (val) {
      //   if (val && val.length !== 1 && val.includes('all')) {
      //     this.status = ['all']
      //   }
      // },

      // categoryId: function (val) {
      //   if (val && val.length !== 1 && val.includes('all')) {
      //     this.categoryId = ['all']
      //   }
      // }
    },
    mounted () {
      this.queryNodesByRootCode()
    },
    created () {
      //this.initHeader()
      initTableColumns({columns:this.tableObj.columns,detailColumns, requiredColumn, funType: this.funType})
    },

    methods: {
    handleTableHeaderSuccess () {
      this.changeListSettingsModal(false)
      initTableColumns({columns:this.tableObj.columns,detailColumns, requiredColumn, funType: this.funType})
    },
      changeListSettingsModal (val) {
        this.modalObj.status = val
      },
      // 选择附件上传状态
      attachmentStatusFn (val){
        console.log(val)
      },
      initHeader (){
        // 初始化Table列头
        let{ columns } = this.tableObj
        this.tableObj.initColumns = columns
        // 默认不展示xx表头
        this.tableObj.columns = this.tableObj.columns.filter(ele=>!ele.defaultHide)
        // 初始化被选中的列头数据
        this.checkedHeaderArr = columns.filter(ele=>!ele.defaultHide).map(m => m.dataIndex).filter(n => n !== 'action' && n !== 'fileStatus')
      },
      assetLabelFn(value){
        this.$nextTick(function () {
        this.label = this.handleMultipleSelectValue(
          value,
          this.label,
          this.assetLabelSelect
        );
      });
      },
      // 处理多选下拉框有全选时的数组
      handleMultipleSelectValue(value, data, dataOptions) {
        // 如果选的是全部
        if (value === "") {
          data = [""];
        } else {
          let totalIndex = data.indexOf("");
          if (totalIndex > -1) {
            data.splice(totalIndex, 1);
          } else {
            // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
            if (data.length === dataOptions.length - 1) {
              data = [""];
            }
          }
        }
        return data;
      },
      getAssetLabel (id){
        queryAssetLabelConfig({organId: id}).then(res => {
          let {data, code} = res.data
          if(!data) this.assetLabelOpt = []
          if(code === '0'){
            this.assetLabelOpt = data.data.map(item => {
              return ({label: item.labelName, value: item.labelValue})
            })
            this.assetLabelSelect = this.assetLabelOpt.length > 0 ? [{ label: "全部资产标签", value: "" },...this.assetLabelOpt] : []
          }
          this.label = this.assetLabelOpt.length > 0 ? '' : undefined
        }).catch(err =>{
          this.$message.error(err || '当前组织机构下无资产标签')
        })
      },// 多选
      onSelectChange (selectedRowKeys){
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelectAll (selected){
        // console.log(this.selectedRowKeys)
      },
      // 资产标签
      clickAsset: throttle (function(){
        if(this.assetLabelOpt.length === 0) return this.$message.error('该组织机构下暂无资产标签')
        this.modalType = 2
        this.modalObj.status = true
      },3000),
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 全选与其他选项互斥处理
      useTypeChange (value) {
        let lastIndex = value.length - 1
        this.useType = value[lastIndex] === 'all' ? ['all'] : value.filter(m => m !== 'all')
      },
      // 全选与其他选项资产状态
      statusChange (value) {
        let lastIndex = value.length - 1
        this.status = value[lastIndex] === 'all' ? ['all'] : value.filter(m => m !== 'all')
      },
      // 来源方式
      changeSource(value){
        console.log('value', value)
        let lastIndex = value.length - 1
        this.sourceModes = value[lastIndex] === 'all' ? ['all'] : value.filter(m => m !== 'all')
      },
      // 全选与其他选项资产分类
      categoryChange (value) {
        let lastIndex = value.length - 1
        this.categoryId = value[lastIndex] === 'all' ? ['all'] : value.filter(m => m !== 'all')
      },
      // 点击总览数据块
      handleClickOverview ({i}) {
        this.current = i
        this.queryTableData({type: ''})
      },

      // 根据organId查询资产分类选项
      queryCategoryOptions (organId) {
        this.categoryId = []
        this.categoryOptions = []
        this.$api.assets.getList({organId: 1,organIds: organId, assetType: '1'}).then(({data: res}) => {
          if (res && String(res.code) === '0') {
            const arr = (res.data || []).map(m => {
              return { title: m.professionName, key: m.professionCode }
            })
            return this.categoryOptions = [{ title: '全部分类', key: 'all' }].concat(arr)
          }
          throw res.message || '查询资产分类出错'
        }).catch(err => this.$message.error(err || '查询资产分类出错'))
      },
      // 根据organId查询来源方式
      async getSourceOptions(organId){
        this.sourceOptions = []
        this.sourceModes = []
        querySourceType(organId, this).then(list => {
          return this.sourceOptions = [{ key: 'all', title: '全部来源方式' }].concat(list)
        })
      },
      // 列表设置Modal保存
      handleModalOk: throttle (function(){
        let arr = []
        if (this.modalType === 1){
          arr = this.$refs['tableHeader'].checkedList
        }
        if (this.modalType === 1 && !arr.length) {
          return this.$message.error('请至少选中一项!')
        }
        if(this.modalType === 2 && !this.selectedRowKeys.length){
          return this.$message.error('请选择要添加标签的资产!')
        }
        if(this.modalType === 3 && !this.selectedRowKeys.length){
          return this.$message.error('请选择要添加质押情况的资产!')
        }
        this.modalObj.status = false
        if(this.modalType === 1){
          let{ initColumns } = this.tableObj
          this.checkedHeaderArr = arr
          let columns = initColumns.filter(n => arr.includes(n.dataIndex) || n.dataIndex === 'action')
          this.tableObj.scroll = { x: columns.length * 100 } // 防止较少列时出现滚动
          this.tableObj.columns = columns
        }
        if(this.modalType === 2){
          let arr = this.$refs.editTagRef.checkedList
          let data = {
            houseIds: this.selectedRowKeys.join(','),
            label: arr.join('、')
          }
          if(!data.label) delete data.label
          this.$api.assets.updateAssetLabelConfig(data).then(res =>{
            if(res.data.code === '0'){
              this.selectedRowKeys = []
              this.queryTableData({type: ''})
              // this.$refs.editTagRef.checkedList = []
              // this.$refs.editTagRef.change()
            }
          })
        }
        if(this.modalType === 3) {
          let data  = {
            assetHouseIds: this.selectedRowKeys.join(','),
            pledge: this.$refs.pledgeRef.checked,
          }
          this.$api.assets.updateAssetPledgeConfig(data).then(res => {
            if(res.data.code === '0'){
              this.selectedRowKeys = []
              this.queryTableData({type: ''})
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }, 3000) ,
      // 打开/关闭列表列头编辑Modal
      handleModalStatus (status) {
        this.modalObj.status = status
        status ? this.modalType = 1 : ''
        status && (this.key = new Date().getTime())
      },
      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {
          organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
          provinceCityDistrictValue: { province, city, district: region }, assetName, status, ownershipUse, current, categoryId, supportMaterial,
          useType,sourceModes, address, uploadAttachment, label, houseNumber,pledge
        } = this
        // this.pledge = !this.pledge ? '' : this.pledge
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          assetType: this.$store.state.ASSET_TYPE_CODE.HOUSE,
          organId: 1, buildIdList, projectIdList, pageSize: pageLength,
          province, city, region, assetName, pageNum: pageNo, address,
          objectTypes: categoryId.includes('all') ? '' : categoryId.join(','),
          ownershipUse,
          supportMaterial,
          statusList: status.includes('all') ? [] : status, flag: current ? (current - 1) : '',
          useTypes: useType.includes('all') ? '' : useType.join(','),
          sourceModes: sourceModes.includes('all') ? '' : sourceModes.join(','),
          organIds: organId,
          label: label ? label.join('、') : '',
          uploadAttachment,houseNumber,
          pledge
        }
        if(!uploadAttachment) delete form.uploadAttachment
        if(label === '' || !label) delete form.label
        this.$api.assets.queryAssetViewPage(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            this.tableObj.dataSource.forEach(item=>{
              if(item.fireMaterial){
                //导出需使用字段
                item.isFireMaterial = item.fireMaterial
              }
            })
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            this.totalFn(form)
            return false
          }
          throw res.message || '查询接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
        // 查询楼栋面积统计数据
        if (type === 'search') { this.queryAssetAreaInfo(form) }
      },
      // 合计汇总合并
      totalFn (form) {
        this.$api.assets.assetHousePageTotal(form).then(res => {
          if (String(res.data.code) === '0') {
            let data = res.data.data
            for(let key in data){
              data[key] = getFormat(data[key])
            }
            this.totalField.area = judgment.includes(data.totalArea) ? 0 : data.totalArea                            // 建筑面积
            this.totalField.transferOperationArea = judgment.includes(data.totalOperationArea) ? 0 : data.totalOperationArea  // 运营
            this.totalField.selfUserArea = judgment.includes(data.totalSelfUserArea) ? 0 : data.totalSelfUserArea            // 自用
            this.totalField.idleArea = judgment.includes(data.totalIdleArea) ? 0 : data.totalIdleArea                    // 闲置
            this.totalField.occupationArea = judgment.includes(data.totalOccupationArea) ? 0 : data.totalOccupationArea        // 占用
            this.totalField.otherArea = judgment.includes(data.totalOtherArea) ? 0 : data.totalOtherArea                  // 其他
            this.totalField.originalValue = judgment.includes(data.totalOriginalValue) ? 0 : data.totalOriginalValue          // 资产原值
            this.totalField.marketValue = judgment.includes(data.totalMarketValue) ? 0 : data.totalMarketValue              // 最新估值
            this.totalField.rentedArea = judgment.includes(data.rentedArea) ? 0 : data.rentedArea                     // 已租面积
            this.totalField.unRentedArea = judgment.includes(data.unRentedArea) ? 0 : data.unRentedArea                  // 未租面积
            this.tableObj.dataSource.push({assetName: '所有页-合计', assetHouseId: 'assetHouseId', ...this.totalField})
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 查询楼栋视图面积概览数据
      queryAssetAreaInfo (form) {
        this.overviewNumSpinning = true
        this.$api.assets.queryAssetViewArea(form).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = this.numList.map(m => {
              return { ...m, value: res.data[m.key] }
            })
          }
          throw res.message || '查询资产视图面积使用统计出错'
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询资产视图面积使用统计出错')
        })
      },

      // 导出资产视图/房屋卡片
      handleExport (type) {
        if (!this.tableObj.dataSource.length) {
          return this.$message.info('无可导出数据')
        }
        this[type] = true
        let api = { exportHouseBtn: 'exportAssetViewHouseExcel', exportAssetBtn: 'exportAssetViewExcel' }
        const {
          organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
          provinceCityDistrictValue: { province, city, district: region }, assetName, status, useType, address,
          tableObj: { columns }, current, label
        } = this
        let form = type === 'exportHouseBtn' ? {
          assetHouseId: buildIdList.join(',')
        } : {
          assetType: this.$store.state.ASSET_TYPE_CODE.HOUSE,
          organId: 1, organIds: organId, buildIdList, projectIdList, flag: current ? (current - 1) : '',
          province, city, region, assetName,  address,
          statusList: status.includes('all') ? [] : status,
          display: columns.map(m => m.dataIndex).filter(n => n !== 'action'),
          useTypes: useType.includes('all') ? '' : useType.join(','),
          objectTypes: this.categoryId.includes('all') ? '' : this.categoryId.join(','),
          sourceModes: this.sourceModes.includes('all') ? '' : this.sourceModes.join(','),
          label: label ? label.join('、') : '',
          uploadAttachment: this.uploadAttachment
        }
        if(!this.uploadAttachment) delete form.uploadAttachment
        if(label === '全部资产标签' || !label){
          delete form.label
        }
        if(type === 'exportAssetBtn'){
          this.$api.assets.exportAssetViewExcelExam(form).then( res1 => {
            if(+res1.data.code === -1){ this[type] = false; return this.$message.error(res1.data.message) }
            if(+res1.data.code === 0){
          this.$api.assets[api[type]](form).then(res => {
          this[type] = false
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = `${type === 'exportHouseExcel' ? '房屋卡片' : '资产视图'}导出列表.xls`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message || '导出失败'
        }).catch(err => {
          this[type] = false
          this.$message.error(err || '导出失败')
        })
            }

          } )
        }else{
            this.$api.assets[api[type]](form).then(res => {
          if(+res1.data.code === -1){ this[type] = false; return this.$message.error(res.data.message) }
          this[type] = false
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = `${type === 'exportHouseExcel' ? '房屋卡片' : '资产视图'}导出列表.xls`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message || '导出失败'
        }).catch(err => {
          this[type] = false
          this.$message.error(err || '导出失败')
        })
        }

      },

      // 转物业、转运营
      handleTransform (type) {
        // type && this.$router.push('www.baidu.com')
        type && this.$message.info('暂不支持该操作')
      },
      // 楼栋用途
      queryNodesByRootCode () {
        let data = {
          categoryCode: '60'
        }
        this.$api.basics.queryNodesByRootCode(data).then(res => {
          if (res.data.code === '0') {
            let result = res.data.data || []
            let arr = [{label: '全部用途', value: 'all'}]
            result.forEach(item => {
              let obj = {
                label: item.typeName,
                value: item.typeCode
              }
              arr.push(obj)
            })
            this.useTypeOptions = arr
          }
        })
      },
      // 机构字典
      organDict (code,organId) {
        this.ownershipUse = ''
        this.ownershipUseOPt = []
        this.$api.assets.organDict({ organId: 1,organIds: organId, code }).then(res => {
          if (res.data.code === "0") {
            let result = res.data.data || [];
            let arr = result.map(item => ({ label: item.name, value: item.value }));
            // 附属信息类型
            if (code === "OWNERSHIP_USE") {
              this.ownershipUseOPt = []
              this.ownershipUseOPt = [
                ...arr
              ];
              this.ownershipUseOPt.unshift({label: '全部权属用途', value: ''})
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
    },
  }
</script>

<style lang='less' scoped>
  .custom-table {
    //padding-bottom: 55px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
    & /deep/ table {
      tr:last-child, tr:nth-last-child(1) {
        font-weight: bold;
      }
    }
    /deep/.ant-table-fixed {
      padding: 9px 0 6px 0px;
      background-color: #fff;
      color: #49505E;
    }
  }
  /deep/ .sg-FooterPagination{
    z-index: 2;
  }
</style>
