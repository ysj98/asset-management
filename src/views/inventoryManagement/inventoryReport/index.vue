<!--
  盘点报告-列表页
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="headBtns">
        <SG-Button icon="export" :loading="exportBtnLoading" style="margin-right: 8px" v-power="ASSET_MANAGEMENT.ASSET_INVENTORY_REPORT_EXPORT" @click="handleExport">导出</SG-Button>
        <SG-Button icon="plus" type="primary" @click="newInventoryReport" v-power="ASSET_MANAGEMENT.ASSET_INVENTORY_REPORT_NEW">新建盘点报告</SG-Button>
      </div>
      <div slot="headRight">
        <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <segi-range-picker label="提交时间" style="margin-right: 10px;" :defaultValue="[moment(queryCondition.beginDate, 'YYYY-MM-DD'), moment(queryCondition.endDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部状态"
          v-model="queryCondition.approvalStatus"
          :options="$addTitle(approvalStatusData)"
          @select="changeStatus"
        ></a-select>
        <a-input-search placeholder="报告名称" :style="allStyle" v-model="queryCondition.reportName" @search="queryClick" />
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" v-show="+record.approvalStatus === 2" @click="handleOperation('audit', record)" v-power="ASSET_MANAGEMENT.ASSET_INVENTORY__REPORT_AUDIT">审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 1" @click="handleStatus(record, 0)" v-power="ASSET_MANAGEMENT.ASSET_INVENTORY_REPORT_REVERSE_AUDIT">反审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="handleOperation('edit', record)"  v-power="ASSET_MANAGEMENT.ASSET_INVENTORY_REPORT_EDIT">编辑</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="handleStatus(record, 4)" v-power="ASSET_MANAGEMENT.ASSET_INVENTORY_REPORT_DELETE">删除</a>
          <a class="operation-btn" @click="handleOperation('detail', record)">详情</a>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import SegiRangePicker from '@/components/SegiRangePicker'
import {getCurrentDate, getThreeMonthsAgoDate} from 'utils/formatTime'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {exportDataAsExcel} from 'src/views/common/commonQueryApi'

const columns = [
  {
    title: '报告编号',
    dataIndex: 'reportId',
    width: 160
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 160
  },
  {
    title: '报告名称',
    dataIndex: 'reportName',
    width: 200
  },
  {
    title: '所属盘点任务',
    dataIndex: 'taskName',
    width: 200
  },
  {
    title: '提交人',
    dataIndex: 'createByName',
    width: 120
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 160
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
    width: 120
  },
  {
    title: '操作',
    width: 160,
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]

const approvalStatusData = [
  {
    label: '全部状态',
    value: ''
  },
  {
    label: '草稿',
    value: '0'
  },
  {
    label: '待审批',
    value: '2'
  },
  {
    label: '已驳回',
    value: '3'
  },
  {
    label: '已审批',
    value: '1'
  },
  {
    label: '已取消',
    value: '4'
  }
]

export default {
  components: {
    TreeSelect, SegiRangePicker, noDataTips
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      exportBtnLoading: false, // 导出按钮loading
      allStyle: 'width: 170px; margin-right: 10px;',
      toggle: false,
      organName: '',
      organId: '',
      columns,
      dataSource: [],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {
        approvalStatus: [''],
        beginDate: getThreeMonthsAgoDate(),
        endDate: getCurrentDate(),
        reportName: ''
      },
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      showNoDataTips: false
    }
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/inventoryManagement/inventoryReport' && this.$route.query.refresh) {
        this.queryClick()
      }
    }
  },
  methods: {
    moment,
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val
    },
    changeTree(value, label) {
      this.organName = label
      this.organId = value
      this.queryClick()
    },
    // 状态发生变化
    changeStatus(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 起止日期发生变化
    onDateChange (val) {
      this.queryCondition.beginDate = val[0]
      this.queryCondition.endDate = val[1]
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 新增盘点报告
    newInventoryReport () {
      this.$router.push({path: '/inventoryManagement/inventoryReport/new', query: {pageType: 'new', organId: this.organId, organName: this.organName}})
    },
    handleStatus (record, status) {
      let self = this
      switch (status) {
        // 反审核-变成草稿状态
        case 0:
          this.$confirm({
            title: '提示',
            content: '确认要反审核该盘点报告吗？',
            onOk() {
              self.updateReportStatus(status, record.reportId)
            }
          })
          break
        // 删除-变成已取消状态
        case 4:
          this.$confirm({
            title: '提示',
            content: '确认要删除该盘点报告吗？',
            onOk() {
              self.deleteReport(record.reportId)
            }
          })
          break
        default: break
      }
    },
    // 改变报告状态
    updateReportStatus (status, reportId) {
      let form = {
        approvalStatus: status,
        reportId: reportId
      }
      this.$api.inventoryManagementApi.saveOrUpdate(form).then(res => {
        if (res.data.code === '0') {
          this.$message.success('操作成功')
          this.queryList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 删除盘点报告
    deleteReport (reportId) {
      let form = {
        reportId: reportId
      }
      this.$api.inventoryManagementApi.deleteReport(form).then(res => {
        if (res.data.code === '0') {
          this.$message.success('删除成功')
          this.queryList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleOperation (pageType, record) {
      this.$router.push({path: '/inventoryManagement/inventoryReport/' + pageType, query: {pageType: pageType, reportId: record.reportId, organId: this.organId, organName: this.organName}})
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    queryList (type) {
      let form = {
        organId: this.organId,
        startDate: this.queryCondition.beginDate,
        endDate: this.queryCondition.endDate,
        approvalStatuss: this.queryCondition.approvalStatus.join(','),
        reportName: this.queryCondition.reportName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      if (type === 'export') { return form }
      this.$api.inventoryManagementApi.checkReportList(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          if (data.length === 0) {
            this.showNoDataTips = true
          } else {
            this.showNoDataTips = false
          }
          data.forEach((item, index) => {
            item.key = index
            for (let key in item) {
              if (item[key] === '' || item[key] === null) {
                item[key] = '--'
              }
            }
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    // 导出
    handleExport () {
      this.exportBtnLoading = true
      let data = this.queryList('export')
      exportDataAsExcel(data, this.$api.tableManage.exportReportExcel, '盘点报告列表.xlsx', this).then(() => {
        this.exportBtnLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
  .custom-table {
    padding-bottom: 50px;
  }
</style>
