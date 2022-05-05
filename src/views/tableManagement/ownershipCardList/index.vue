<!--报表管理-权属证件一览表页面-->
<template>
  <div class="ownership_card">
    <!--查询调件-->
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="import" :loading='exportBtnLoading' @click="handleExport" v-power="ASSET_MANAGEMENT.TM_OL_EXPORT">导出</SG-Button>
        <SG-Button @click="changeListSettingsModal(true)" v-power="ASSET_MANAGEMENT.TM_OL_TABLE_HEADERS_SETTING">列表设置</SG-Button>
        <div style="width: 310px; position:absolute; top: 20px; right: 76px; display:flex;">
          <organ-project class="organ-class" v-model="organProjectValue" :isShowBuilding="false" mode="multiple"/>
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="queryTableData">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select v-model="queryObj.kindOfRight" :style="allStyle" placeholder="请选择权属类型" :options="$addTitle(typeOptions)"/>
        <a-select v-model="queryObj.obligeeId" allowClear :style="allStyle" placeholder="请选择权属人" :options="$addTitle(ownerOptions)"/>
        <a-select v-model="queryObj.status" :style="allStyle" placeholder="请选择权属状态" :options="$addTitle(statusOptions)"/>
        <a-select v-model="queryObj.ownerFlag" :style="allStyle" placeholder="请选择权证归属" :options="$addTitle(ownerFlagOptions)"/>
        <a-input v-model.trim="queryObj.warrantNbr" :style="allStyle" placeholder="请输入权证号"/>
      </div>
    </SG-SearchContainer>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="td-pd10 custom-scroll custom-total" ref="table">
      <template slot="buildArea" slot-scope="text">
        {{ getFormat(text) }}
      </template>
      <template slot="exclusiveBuildArea" slot-scope="text">
        {{ getFormat(text) }}
      </template>
      <template slot="apportionArea" slot-scope="text">
        {{ getFormat(text) }}
      </template>
      <template slot="landArea" slot-scope="text">
        {{ getFormat(text) }}
      </template>
      <template slot="warrantNbr" slot-scope="text, record, index">
        <span v-if="index < tableObj.dataSource.length - 2" style="cursor: pointer; color: #0084FF" @click="viewDetail(record)" :title="record.warrantNbr">{{record.warrantNbr}}</span>
        <span v-else :title="record.warrantNbr">{{record.warrantNbr}}</span>
      </template>
      <!-- <template slot="lotNo" slot-scope="text, record">
        <span>{{`${'--'}/${record.lotNo || '--'}/${record.estateUnitCode || '--'}`}}</span>
      </template> -->
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <div style="height: 100px;"></div>
    <SG-FooterPagination style="z-index:10" v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength, searchType: 'page' })"/>
    <!-- 复用权证管理查看详情页面 -->
    <CardDetails ref="cardDetails"/>
    <TableHeaderSettings v-if="listSettingFlag" :funType="funType" width="1200px" @cancel="changeListSettingsModal(false)" @success="handleTableHeaderSuccess" />
  </div>
</template>

<script>
  import {math as $math} from '@/utils/math'
  import NoDataTip from 'src/components/noDataTips'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import { exportDataAsExcel, queryPlatformDict } from 'src/views/common/commonQueryApi'
  import CardDetails from 'src/views/ownershipManagement/authorityCardManagement/cardDetails'
  import { getFormat } from '@/utils/utils'
  import {handleTableHeaderScrollHeight, handleTableScrollHeight, initTableColumns} from "utils/share";
  import TableHeaderSettings from "@/components/TableHeaderSettings";
  // 需要合计的列
  const totalKeyArr = ['buildArea',"exclusiveBuildArea", "apportionArea", "landArea"]
  const detailColumns = [
    { title: '权证号', key: 'warrantNbr', scopedSlots: { customRender: 'warrantNbr' }, width: 200, fixed:"left" },
    { title: '所属机构', dataIndex: 'organName', width: 200 },
    { title: '资产项目', dataIndex: 'projectName', width: 150 },
    { title: '权属类型', dataIndex: 'kindOfRightName', width: 150 },
    { title: '房屋所有权人', dataIndex: 'houseOwner', width: 150 },
    { title: '权属人', dataIndex: 'obligeeName', width: 200, ellipsis: true },
    { title: '委托管理单位', dataIndex: 'entrustOrganization', width: 200 },
    { title: '房屋号/丘地号/不动产单元号', dataIndex: 'combinationCode', width: 200 },
    { title: '坐落位置', dataIndex: 'seatingPosition', width: 200 },
    { title: '权属用途', dataIndex: 'ownershipUseName', width: 150 },
    { title: '建筑面积', dataIndex: 'buildArea', width: 150, scopedSlots: { customRender: 'buildArea' } },
    { title: '专有建筑面积', dataIndex: 'exclusiveBuildArea', width: 150, scopedSlots: { customRender: 'exclusiveBuildArea' } },
    { title: '分摊面积', dataIndex: 'apportionArea', width: 150, scopedSlots: { customRender: 'apportionArea' } },
    { title: '产别', dataIndex: 'antenatal', width: 150 },
    { title: '结构', dataIndex: 'structureName', width: 150 },
    { title: '总层数', dataIndex: 'totalFloor', width: 150 },
    { title: '所在层', dataIndex: 'placeFloor', width: 150 },
    { title: '土地面积', dataIndex: 'landArea', width: 150, scopedSlots: { customRender: 'landArea' } },
    { title: '权利性质', dataIndex: 'qualityOfRightName', width: 150 },
    { title: '登记日期', dataIndex: 'rigisterDate', width: 100 },
    { title: '使用期限', dataIndex: 'useLimitDate', width: 100 },
    { title: '交接日期', dataIndex: 'handoverDate', width: 100 },
    { title: '状态', dataIndex: 'statusName',width: 150 },
    { title: '使用权合同期限', dataIndex: 'contractData', width: 120 },
    { title: '附加说明', dataIndex: 'excursus', width: 200, ellipsis: true },
    { title: '备注', dataIndex: 'remark', width: 200 }
  ]
  export default {
    name: 'index',
    components: { NoDataTip, OrganProject, CardDetails, OverviewNumber, TableHeaderSettings },
    data () {
      return {
        funType: 7,
        listSettingFlag: false,
        getFormat,
        styleSet: 'min-width: 150px !important;',
        toggle: false,
        allStyle: 'width: 150px; margin-right: 10px;',
        ASSET_MANAGEMENT, // 权限对象
        queryObj: {
          ownerFlag: '',  // 权证归属
          status: '', // 查询条件-权属状态
          warrantNbr: '', // 查询条件-权证号
          kindOfRight: '', // 查询条件-权属类型
          obligeeId: '', // 查询条件-权属人
        },
        organProjectValue: {}, // 查询条件-组织机构及项目值
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        ownerOptions: [{title: '全部权属人', key: ''}], // 查询条件-权属人选项
        typeOptions: [{ title: '全部权属类型', key: '' }], // 查询条件-权属类型选项
        statusOptions: [
          { title: '全部权属状态', key: '' }, { title: '正常', key: '1' }, { title: '已注销', key: '0' }
        ], // 查询条件-权属状态选项
        ownerFlagOptions: [
          { title: '全部权证归属', key: '' }, { title: '本单位权证', key: '1' }, { title: '其他单位权证', key: '0' }
        ],
        exportBtnLoading: false, // 导出按钮loading
        numList: [
          {title: '权证数量', key: 'total', value: 0, bgColor: '#4BD288'},
          {title: '土地面积', key: 'landAreaCount', value: 0, bgColor: '#808080'},
          {title: '建筑面积(㎡)', key: 'buildArea', value: 0, bgColor: '#1890FF'},
          {title: '产权证', key: 'cqzTotal', value: 0, bgColor: '#DD81E6'},
          {title: '使用权证', key: 'syqzTotal', value: 0, bgColor: '#FD7474'},
        ], // 概览数据，title 标题，value 数值，color 背景色
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        tableObj: {
          scroll: { x: "100%", y: 600 },
          pagination: false,
          rowKey: 'warrantId',
          loading: false,
          dataSource: [],
          columns: []
        },
      }
    },
    created () {
      this.queryType()
      handleTableScrollHeight(this.tableObj.scroll)
      initTableColumns({columns:this.tableObj.columns,detailColumns,funType: this.funType})
    },
    mounted() {
      handleTableHeaderScrollHeight(this.$refs.table.$el)
    },
    methods: {
      handleTableHeaderSuccess(){
        this.changeListSettingsModal(false)
        initTableColumns({columns:this.tableObj.columns,detailColumns,funType: this.funType})
      },
      changeListSettingsModal(flag){
        this.listSettingFlag = flag
      },

      // 高级搜索控制
      searchContainerFn (val) {
        this.toggle = val
      },
      queryOwnershipCardTableTotal(form){
        this.$api.tableManage.queryOwnershipCardTableTotal(form).then(({data:{code,message,data}})=>{
          if (code==="0"){
            console.log({data})
            const temp = this.tableObj.dataSource.pop()
            this.tableObj.dataSource.push({...temp,...data})
          }else {
            this.$message.error(message)
          }
        })
      },
      // 查询统计数据
      queryStatisticsInfo (form) {
        this.overviewNumSpinning = true
        this.$api.tableManage.queryOwnershipCardSumInfo(form).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return res.data ? this.numList = this.numList.map(m => {
              return { ...m, value: res.data[m.key] || 0 }
            }) : false
          }
          throw res.message
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询统计出错')
        })
      },

      // 查看权证详情
      viewDetail (record) {
        this.$refs['cardDetails'].query({ warrantId:record.warrantId })
      },

      // 查询平台权属类型字典
      queryType () {
        queryPlatformDict('AMS_KIND_OF_RIGHT').then(list =>
          this.typeOptions = [{title: '全部权属类型', key: ''}, ...list]
        )
      },

      // 根据organId查询权属人
      queryOwner (organId) {
        this.ownerOptions = [{name: '全部权属人', value: ''}]
        this.obligeeId = undefined
        if (!organId) { return false }
        this.$api.assets.select({organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let list = (res.data || []).map(m => {
              return { title: m.obligeeName, key: m.obligeeId }
            })
            return this.ownerOptions = [{title: '全部权属人', key: ''}, ...list]
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询权属人接口出错')
        })
      },

      // 导出
      handleExport () {
        const {queryObj, tableObj, organProjectValue: {organId, projectId}} = this
        if (!tableObj.dataSource.length) { return this.$message.info('暂无导出数据') }
        this.exportBtnLoading = true
        let form = {...queryObj, organId, projectIdList: projectId || []}
        exportDataAsExcel(form, this.$api.tableManage.exportOwnershipCardList, '权属证件一览表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },
      /*
      * 处理 合计行
      * */
      handleTableTotalRow(){
        const currentPageTotalData = {
          // 保证 rowKey 有值
          warrantId: Math.random()
        }
        const allPageTotalData = {
          // 保证 rowKey 有值
          warrantId: Math.random()
        }
        this.tableObj.columns.forEach((ele,index)=>{
          const keyStr = ele.dataIndex || ele.key
          if (totalKeyArr.includes(keyStr)){
            const data = this.tableObj.dataSource.reduce((pre,cur)=>{
              return $math.simplify(`${pre}+${cur[keyStr]||0}`).toString()
            },0)
            currentPageTotalData[keyStr] = isNaN(data) ? "" : Number(data)
          }
          if (index === 0){
            currentPageTotalData[keyStr] = '当前页-合计'
            allPageTotalData[keyStr] = '所有页-合计'
          }
        })
        this.tableObj.dataSource.push(
          currentPageTotalData,
          allPageTotalData
        )
      },
      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, searchType}) {
        const {queryObj, organProjectValue: {organId, projectId}} = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {pageSize: pageLength, pageNum: pageNo, ...queryObj, organId, projectIdList: projectId || []}
        this.$api.tableManage.queryWarrantList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const {count, data} = res.data
            this.tableObj.dataSource = data || []
            this.handleTableTotalRow()
            this.queryOwnershipCardTableTotal(form)
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
        if (!searchType) { this.queryStatisticsInfo(form) }
      }
    },

    watch: {
      organProjectValue: function (val, pre) {
        val.organId !== pre.organId && this.queryOwner(val.organId)
        this.queryTableData({})
      },

      'queryObj.warrantNbr': function (val) {
        if (val.length > 60) {
          this.queryObj.warrantNbr = val.slice(0, 60)
          return this.$message.warn('最多支持60字符')
        }
      },

      queryObj: {
        handler: function () {
          this.queryTableData({})
        },
        deep: true
      }
    }
  }
</script>

<style lang='less' scoped>
  .organ-class {
    .project_style {
      width: 150px;
    }
  }
</style>

<style lang='less'>
  .organ-class {
    .project_style, .tree-select, .building_style {
      width: 150px !important;
    }
  }
</style>