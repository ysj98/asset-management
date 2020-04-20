<!--资产视图业务-资产视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="setting" @click="handleModalStatus" style="margin-right: 10px">列表设置</SG-Button>
        <SG-Button icon="import" type="primary" :loading='exportBtnLoading' @click="handleExport">
          导出
        </SG-Button>
      </div>
      <div slot="headerForm" style="margin-right: 8px">
        <a-row :gutter="8">
          <a-col :span="8" :offset="4">
            <organ-project v-model="organProjectValue" :isShowBuilding="false" :allowClear="false"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.sourceType" style="width: 100%" placeholder="请选择来源方式" :options="sourceTypeOptions"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.takeOver" style="width: 100%" placeholder="请选择接管状态" :options="takeOverOptions"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="projectStatus" :maxTagCount="1" mode="multiple" style="width: 100%" placeholder="请选择项目状态" :options="projectStatusOptions"/>
          </a-col>
        </a-row>
      </div>
      <div slot="contentForm" style="margin-top: 15px">
        <a-row :gutter="8">
          <a-col :span="4" :offset="3">
            <a-select v-model="queryObj.transferToOperation" style="width: 100%" placeholder="请选择转运营状态" :options="operateOptions"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.propertyOperation" style="width: 100%" placeholder="请选择转物业状态" :options="propertyOptions"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="queryObj.ownershipStatus" style="width: 100%" placeholder="请选择权属情况" :options="ownershipOptions"/>
          </a-col>
          <a-col :span="7">
            <a-range-picker @change="changeDate" style="width: 100%" :placeholder="['开始接管时间', '结束接管时间']"/>
          </a-col>
          <a-col :span="2">
            <SG-Button type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="projectName" slot-scope="text, record">
        <router-link :to="{path: '/projectData/assetProjectDetail', query: {projectId: record.projectId}}">
          {{text}}
        </router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--编辑列表表头-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status" @ok="handleModalOk">
      <edit-table-header :key="key" ref="tableHeader" :checkedArr="checkedHeaderArr" :columns="tableObj.initColumns"/>
    </SG-Modal>
  </div>
</template>

<script>
  import { querySourceType, exportDataAsExcel } from 'src/views/common/commonQueryApi'
  import OrganProject from 'src/views/common/OrganProjectBuilding'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import NoDataTip from 'src/components/noDataTips'
  import EditTableHeader from './EditTableHeader'
  import moment from 'moment'
  export default {
    name: 'index',
    components: { EditTableHeader, OverviewNumber, SearchContainer, OrganProject, NoDataTip },
    data () {
      return {
        fold: true,
        queryObj: {
          takeOver: '', // 查询条件-接管状态值
          sourceType: '', // 查询条件-来源方式值
          ownershipStatus: '', // 查询条件-权属值
          propertyOperation: '', // 查询条件-转物业值
          endTakeOverDate: '', // 查询条件-结束接管时间值
          startTakeOverDate: '', // 查询条件-开始接管时间值
          transferToOperation: '' // 查询条件-转运营状态值
        },
        projectStatus: [], // 查询条件-项目状态值，多选
        organProjectValue: {}, // 查询条件-组织机构及项目值
        sourceTypeOptions: [{ title: '全部来源方式', key: '' }], // 查询条件-来源方式选项
        projectStatusOptions: [
          {key: '-1', title: '全部状态'}, {key: 0, title: '草稿'}, {key: 2, title: '待审批'},
          {key: 3, title: '已驳回'}, {key: 1, title: '已审批'}, {key: 4, title: '已取消'}
        ], // 查询条件-项目状态选项
        takeOverOptions: [
          { title: '全部接管状态', key: '' }, { title: '已接管', key: '1' }, { title: '未接管', key: '0' }
        ], // 查询条件-接管状态选项
        operateOptions: [
          { title: '全部转运营状态', key: '' }, { title: '已转运营', key: '1' }, { title: '未转运营', key: '0' }
        ], // 查询条件-转运营状态选项
        propertyOptions: [
          { title: '全部转物业状态', key: '' }, { title: '已转物业', key: '1' }, { title: '未转物业', key: '0' }
        ], // 查询条件-接管状态值
        ownershipOptions: [
          { title: '全部权属情况', key: '' }, { title: '有证', key: '1' }, { title: '无证', key: '0' }, { title: '待办证', key: '2' }
        ], // 查询条件-权属选项
        key: 0, // 更新Modal包裹的子组件
        checkedHeaderArr: [], // 格式如['name', 'age']
        exportBtnLoading: false, // 导出button loading标志
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        modalObj: { title: '展示列表设置', status: false, okText: '保存', width: 750 },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        tableObj: {
          pagination: false,
          rowKey: 'projectId',
          loading: false,
          initColumns: [],
          dataSource: [],
          scroll: { x: 4500 },
          columns: [
            { title: '资产项目名称', dataIndex: 'projectName', scopedSlots: { customRender: 'projectName' }, fixed: 'left' },
            { title: '资产项目编码', dataIndex: 'projectCode' }, { title: '接管机构', dataIndex: 'organName' },
            { title: '来源方式', dataIndex: 'sourceTypeName' }, { title: '来源渠道', dataIndex: 'souceChannelType' },
            { title: '是否接管', dataIndex: 'takeOverName' }, { title: '接管时间', dataIndex: 'takeOverDate' }, { title: '建筑面积', dataIndex: 'area' },
            { title: '楼栋数', dataIndex: 'buildCount' },{ title: '项目状态', dataIndex: 'approvalStatusName' },
            { title: '资产数量', dataIndex: 'assetCount' }, { title: '运营(㎡)', dataIndex: 'transferOperationArea' },
            { title: '自用(㎡)', dataIndex: 'selfUserArea' }, { title: '闲置(㎡)', dataIndex: 'idleArea' },
            { title: '占用(㎡)', dataIndex: 'occupationArea' }, { title: '其它(㎡)', dataIndex: 'otherArea' },
            { title: '首次评估原值', dataIndex: 'assetValuation' }, { title: '资产原值(元)', dataIndex: 'originalValue' },
            { title: '首次市场估值', dataIndex: 'firstMarketValue' }, { title: '最新估值(元)', dataIndex: 'marketValue' },
            { title: '划转前房屋状态', dataIndex: 'houseStatusName' }, { title: '上报基础情况表', dataIndex: 'reportBasicInfoDate' },
            { title: '房屋核实时间', dataIndex: 'houseVerificationDate' }, { title: '上报房屋划转请示时间', dataIndex: 'reportHouseTransferReqDate' },
            { title: '上报核实报告时间', dataIndex: 'reportHouseVerificationDate' }, { title: '划转批复下发时间', dataIndex: 'transferApprovalDate' },
            { title: '协议签署时间', dataIndex: 'agreementSignDate' }, { title: '权属办理中存在问题', dataIndex: 'ownershipHandleProblems' },
            { title: '房屋划转历史遗留问题', dataIndex: 'houseTransferHisProblem' }, { title: '房屋性质', dataIndex: 'houseTypeName' },
            { title: '划转时房屋权属', dataIndex: 'houseProperty' }, { title: '划转时权利人', dataIndex: 'houseObligee' },
            { title: '权属变更时间', dataIndex: 'propertyChangeTime' }, { title: '产权情况', dataIndex: 'ownershipStatusName' },
            { title: '能否过户', dataIndex: 'isTranster' }, { title: '是否转运营', dataIndex: 'transferToOperationName' },
            { title: '转运营时间', dataIndex: 'transferOperationTime' }, { title: '是否转物业', dataIndex: 'isPropertyName' },
            { title: '转物业时间', dataIndex: 'transferTime' },{ title: '转物业面积', dataIndex: 'transferArea' },
            { title: '备注', dataIndex: 'remark' }
          ]
        },
        numList: [
          {title: '所有资产(㎡)', key: 'areaCount', value: 0, fontColor: '#324057'},
          {title: '运营(㎡)', key: 'transferOperationAreaCount', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'idleAreaCount', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'selfUserAreaCount', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'occupationAreaCount', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'otherAreaCount', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据，title 标题，value 数值，color 背景色
      }
    },

    methods: {
      moment,

      // 处理接管时间
      changeDate (date, dateString) {
        this.queryObj.startTakeOverDate = dateString[0]
        this.queryObj.endTakeOverDate = dateString[1]
      },

      // 查询来源方式
      querySourceType (id) {
        this.sourceTypeOptions = []
        this.queryObj.sourceType = ''
        if (!id) { return false }
        querySourceType(id, this).then(list => {
          return this.sourceTypeOptions = [{ title: '全部来源方式', key: '' }].concat(list)
        })
      },

      // 列表设置Modal保存
      handleModalOk () {
        let arr = this.$refs['tableHeader'].checkedList
        if (!arr.length) {
          return this.$message.info('请至少选中一项!')
        }
        this.modalObj.status = false
        let{ initColumns } = this.tableObj
        this.checkedHeaderArr = arr
        let columns = initColumns.filter(n => arr.includes(n.dataIndex))
        this.tableObj.scroll = { x: columns.length * 120 } // 防止较少列时出现滚动
        this.tableObj.columns = columns
      },

      // 打开/关闭列表列头编辑Modal
      handleModalStatus () {
        this.key = Date.now()
        this.modalObj.status = status
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const { organProjectValue: { organId, projectId }, projectStatus, queryObj } = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        let form = {
          approvalStatusList: projectStatus.includes('-1') ? '' : projectStatus.join(','),
          organId, projectId, pageSize: pageLength, pageNum: pageNo, ...queryObj
        }
        if (type === 'export') { return form }
        this.tableObj.loading = true
        this.$api.tableManage.projectAsset(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data.map(m => {
              const { takeOver, ownershipStatus, transferToOperation, isProperty } = m
              let takeOverName = String(takeOver) === '1' ? '已接管' : '未接管'
              let isPropertyName = String(isProperty) === '1' ? '已转物业' : '未转物业'
              let ownershipStatusName = ['无证', '有证', '待办'][Number(ownershipStatus)]
              let transferToOperationName = String(transferToOperation) === '1' ? '已转运营' : '未转运营'
              return { ...m, takeOverName, transferToOperationName, ownershipStatusName, isPropertyName }
            })
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
        // 查询统计数据
        if (type === 'search') { this.queryStatisticsInfo(form) }
      },

      // 查询统计数据
      queryStatisticsInfo (form) {
        this.overviewNumSpinning = true
        this.$api.tableManage.getAssetCount(form).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = this.numList.map(m => {
              return { ...m, value: res.data[m.key] }
            })
          }
          throw res.message
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询统计出错')
        })
      },

      // 导出
      handleExport () {
        const {tableObj: { columns }} = this
        let form = this.queryTableData({type: 'export'})
        let cells = columns.map(m => {
          return { key: m.dataIndex, value: m.title}
        })
        this.exportBtnLoading = true
        exportDataAsExcel({...form, cells}, this.$api.tableManage.exportAssetProject, '资产项目查询列表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      }
    },

    created () {
      // 初始化Table列头
      let{ columns } = this.tableObj
      this.tableObj.initColumns = columns
      // 初始化被选中的列头数据
      this.checkedHeaderArr = columns.map(m => m.dataIndex)
    },

    watch: {
      organProjectValue: function (val, pre) {
        // val && val.organId && this.queryTableData({type: 'search'})
        pre.organId !== val.organId && this.querySourceType(val.organId)
      },

      // 全选与其他选项互斥处理
      projectStatus: function (val) {
        if (val.length > 1 && val.includes('-1')) {
          this.projectStatus = ['-1']
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .custom-table {
    padding-bottom: 55px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th,  td {
        white-space: nowrap;
      }
    }
  }
</style>
