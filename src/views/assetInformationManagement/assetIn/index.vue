<!--资产入库-入口列表页-->
<template>
  <div class="asset_in">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="import" @click="newAsset" style="margin-right: 8px">入库登记</SG-Button>
        <SG-Button
          icon="export"
          @click="handleExport"
          :loading="exportBtnLoading"
          v-power="ASSET_MANAGEMENT.ASSET_IN_LIST_EXPORT"
        >导出</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <tree-select @changeTree="changeTree" style="width: 240px"/>
        <a-input placeholder="入库单名称或编号" @pressEnter="queryTableData" v-model.trim="storeName" style="width: 240px; margin: 0 10px"/>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              :options="$addTitle(projectOptions)"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              v-model="organProjectType.projectId"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              placeholder="请选择资产类型"
              :options="$addTitle(assetTypeOptions)"
              :filterOption="filterOption"
              v-model="organProjectType.assetType"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              mode="multiple"
              v-bind="properties"
              v-model="status"
              :options="$addTitle(statusOptions)"
              @change="queryTableData"
              placeholder="请选择入库单状态"
            />
          </a-col>
          <a-col :span="8">
            <span class="prefix_style" style="width: 69px">创建日期</span>
            <a-range-picker
              format="YYYY-MM-DD"
              class="date_picker_style"
              style="margin-left: 69px"
              @change="changeCreateDate"
            />
          </a-col>
          <a-col :span="4" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <template slot="action" slot-scope="text, record">
        <!--['0 待审批', '1 已驳回', '2 已审批', '3 已取消']-->
        <SG-PopoverMore trigger="hover">
          <div slot="content">
            <router-link style="color: #6D7585; line-height: 35px; display: block; "
              :to="{ path: '/assetIn/detail', query: {id: record.storeId}}"
            >
              <a-icon type="read" style="color: #a7adb8; font-size: 15px"/>
              <span style="margin-left: 12px; color: #49505E; font-size: 15px">详情</span>
            </router-link>
            <router-link
              v-if="String(record.status) === '1'"
              v-power="ASSET_MANAGEMENT.ASSET_IN_EDIT"
              style="color: #6D7585; line-height: 35px; display: block; "
              :to="{ path: '/assetIn/edit', query: {id: record.storeId}}"
            >
              <a-icon type="edit" style="color: #a7adb8; font-size: 15px"/>
              <span style="margin-left: 12px; color: #49505E; font-size: 15px">编辑</span>
            </router-link>
            <a
              v-if="String(record.status) === '1'"
              style="display: block; line-height: 35px"
              @click="deleteAsset(record.storeId)"
              v-power="ASSET_MANAGEMENT.ASSET_IN_DELETE"
            >
              <a-icon type="delete" style="color: #a7adb8; font-size: 15px"/>
              <span style="margin-left: 12px; color: #49505E; font-size: 15px">删除</span>
            </a>
            <router-link
              v-if="String(record.status) === '0'"
              v-power="ASSET_MANAGEMENT.ASSET_IN_APPROVE"
              style="display: block; color: #6D7585; line-height: 35px"
              :to="{ path: '/assetIn/approve', query: {id: record.storeId}}"
            >
              <a-icon type="audit" style="color: #a7adb8; font-size: 15px"/>
              <span style="margin-left: 12px; color: #49505E; font-size: 15px">审批</span>
            </router-link>
          </div>
        </SG-PopoverMore>
      </template>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength, type: 'page' })"/>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import TreeSelect from 'src/views/common/treeSelect'
  import {ASSET_MANAGEMENT} from 'src/config/config.power'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import SearchContainer from 'src/views/common/SearchContainer'
  import {queryProjectListByOrganId, filterOption, queryAssetTypeList, exportDataAsExcel} from 'src/views/common/commonQueryApi'
  export default {
    name: 'index',
    components: { SearchContainer, TreeSelect, NoDataTip, OverviewNumber },
    data () {
      return {
        ASSET_MANAGEMENT, // 权限对象
        fold: false, // 查询条件折叠按钮
        exportBtnLoading: false, // 导出按钮
        storeName: '', // 查询条件-名称或编号
        minCreateDate: '', // 创建开始时间
        maxCreateDate: '', // 创建结束时间
        organProjectType: {
          organId: '',
          organName: '',
          projectId: [],
          assetType: []
        }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        status: [], // 查询条件-登记状态
        projectOptions: [], // 资产项目选项
        assetTypeOptions: [], // 资产类型选项
        statusOptions: [
          { title: '全部', key: '-1' }, { title: '待审批', key: '0' },
          { title: '已驳回', key: '1' }, { title: '已审批', key: '2' }, { title: '已取消', key: '3' }
        ], // 查询条件-状态选项
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          rowKey: 'storeCode',
          columns: [
            { title: '入库单编号', dataIndex: 'storeCode' },
            { title: '入库单名称', dataIndex: 'storeName', width: 200 },
            { title: '管理机构', dataIndex: 'organName' },
            { title: '资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产数量', dataIndex: 'assetCount' },
            { title: '创建日期', dataIndex: 'createDate' },
            { title: '创建人', dataIndex: 'createUserName' },
            { title: '状态', dataIndex: 'statusName' },
            { title: '备注', dataIndex: 'remark', width: 150 },
            { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 80 }
          ]
        },
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        numList: [
          {title: '全部', key: 'total', value: 0, fontColor: '#324057'},
          {title: '待审批', key: 'pendingTotal', value: 0, bgColor: '#4BD288'},
          {title: '已驳回', key: 'approvedTotal', value: 0, bgColor: '#1890FF'},
          {title: '已审批', key: 'haveApprovedTotal', value: 0, bgColor: '#DD81E6'},
          {title: '已取消', key: 'cancelTotal', value: 0, bgColor: '#FD7474'}
        ], // 概览数据，title 标题，value 数值，color 背景色
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'fixed' },
        properties: { allowClear: true, showSearch: true, maxTagCount: 1, style: "width: 100%" } // 查询表单控件公共属性
      }
    },

    methods: {
      // 下拉搜索筛选
      filterOption,

      // 新建入库登记单
      newAsset () {
        const {organProjectType: {organId}} = this
        organId ? this.$router.push({path: './assetIn/edit', query: {organId}}) : this.$message.warn('请选择组织机构')
      },

      // 查询统计数据
      queryStatistics (form) {
        this.overviewNumSpinning = true
        this.$api.assets.getAssetStoreCount(form).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = this.numList.map(m => {
              return { ...m, value: res.data[m.key] }
            })
          }
          throw res.message || '查询统计出错'
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询统计出错')
        })
      },

      // 资产删除
      deleteAsset (storeId) {
        let _this = this
        _this.$confirm({
          title: '提示',
          content: '确认要删除该登记单吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: function () {
            _this.tableObj.loading = true
            _this.$api.assets.auditAssetStore({ storeId, advice: '', status: 3 }).then(({data: res}) => {
              if (res && String(res.code) === '0') {
                _this.$message.success('删除成功')
                return _this.queryTableData({})
              }
              throw res.message
            }).catch(err => {
              _this.$message.error(err || '删除失败')
            }).finally(() => _this.tableObj.loading = false)
          }
        })
      },

      // 获取日期
      changeCreateDate (date, dateStrings) {
        let [minCreateDate, maxCreateDate] = dateStrings || []
        Object.assign(this, {minCreateDate, maxCreateDate})
      },

      // 获取选择的组织机构
      changeTree (organId, organName) {
        Object.assign(this.organProjectType, {
          projectId: [],
          organName, organId
        })
        this.projectOptions = [] // 清空
        this.queryProjectByOrganId(organId)
        organId && this.queryTableData({})
      },

      // 根据organId查询资产项目
      queryProjectByOrganId (organId) {
        organId && queryProjectListByOrganId(organId).then(list =>
          list ? this.projectOptions = list : this.$message.error('查询资产项目失败')
        )
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        queryAssetTypeList().then(list => {
          list ? this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list) : this.$message.error('查询楼栋失败')
        })
      },

      // 导出
      handleExport () {
        this.exportBtnLoading = true
        let data = this.queryTableData({type: 'export'})
        exportDataAsExcel(data, this.$api.assets.exportAssetInExcel, '资产入库列表.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {
          storeName, status, minCreateDate, maxCreateDate,
          organProjectType, organProjectType: { assetType, projectId, organId }
        } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        let form = {
          ...organProjectType, organId,
          pageSize: pageLength, pageNum: pageNo, storeName,
          projectId: projectId.join(','), minCreateDate, maxCreateDate,
          assetType: (!assetType || assetType.includes('-1')) ? undefined : assetType.join(','),
          status: (!status || status.includes('-1')) ? undefined : status.join(',')
        }
        if (type === 'export') { return form }
        this.tableObj.loading = true
        type !== 'page' && this.queryStatistics(form)
        this.$api.assets.queryAssetStoreList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            let nameList = ['待审批', '已驳回', '已审批', '已取消']
            this.tableObj.dataSource = data.map(m => {
              return {
                ...m, statusName: nameList[m.status]
              }
            })
            Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询列表出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询列表出错')
        })
      }
    },

    // 路由卫士，用于新建、编辑、审批成功后刷新列表
    beforeRouteEnter ({query: {refresh}}, {path}, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if ((path === '/assetIn/edit' || path === '/assetIn/new' || path === '/assetIn/approve') && refresh) {
          const { paginationObj: { pageNo, pageLength } } = vm
          vm.queryTableData({pageNo, pageLength})
        }
      })
    },

    created () {
      this.queryAssetType()
    },

    watch: {
      // 全选与其他选项互斥处理
      status: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.status = ['-1']
        }
      },

      // 长度不能超过30字符
      storeName: function (val, pre) {
        if (val && val.length > 30) {
          this.$message.warn("不能超30个字符")
          this.storeName = pre
        }
      },

      'organProjectType.projectId': function () {
        this.queryTableData({})
      },

      'organProjectType.assetType': function (assetType) {
        if (assetType && assetType.length !== 1 && assetType.includes('-1')) {
          this.organProjectType.assetType = ['-1']
        }
        this.queryTableData({})
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_in {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
    .prefix_style {
      float: left;
      color: #C0C7D1;
      /*width: 69px;*/
      line-height: 30px;
      text-align: center;
      border: 1px solid #d9d9d9;
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .date_picker_style {
      display: block;
      & /deep/ .ant-calendar-picker-input {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
  }
</style>
