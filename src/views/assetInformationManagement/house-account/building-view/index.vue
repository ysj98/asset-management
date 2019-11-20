<!--楼栋视图业务-楼栋视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="10">
        <a-col :span="8">
          <SG-Button
            icon="import"
            type="primary"
            @click="handleExport"
            :loading="exportBtnLoading"
            :disabled="!tableObj.dataSource.length"
            :title="tableObj.dataSource.length ? '' : '无可导出数据'"
          >导出楼栋视图</SG-Button>
        </a-col>
        <a-col :span="13">
          <organ-project-building v-model="organProjectBuildingValue" mode="multiple"/>
        </a-col>
        <a-col :span="3" style="text-align: right">
          <SG-Button
            icon="search"
            type="primary"
            @click="queryTableData({type: 'search'})"
          >查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="assetNum" slot-scope="text">
        <span style="color: #0084FF; cursor: pointer">{{text}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <span style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  export default {
    name: 'index',
    components: { OverviewNumber, OrganProjectBuilding },
    data () {
      return {
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        exportBtnLoading: false, // 导出按钮loading
        organProjectBuildingValue: {}, // 查询条件-组织机构-资产项目-楼栋对象
        numList: [
          {title: '所有资产(㎡)', key: 'totalArea', value: 0, fontColor: '#324057'}, {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'}, {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: true },
          rowKey: 'assetHouseId',
          columns: [
            { title: '楼栋名称', dataIndex: 'assetName', key: 'assetName', fixed: 'left', width: 80 },
            { title: '楼栋编号', dataIndex: 'assetCode', key: 'assetCode' },
            { title: '资产项目名称', dataIndex: 'projectName', key: 'projectName' }, { title: '丘地号', dataIndex: 'addressNo', key: 'addressNo' },
            { title: '建筑年代', dataIndex: 'years', key: 'years' },
            { title: '建筑面积(㎡)', dataIndex: 'area', key: 'area', align: 'right' },
            { title: '楼高', dataIndex: 'buildHeight', key: 'buildHeight' }, { title: '层数', dataIndex: 'floorNum', key: 'floorNum' },
            { title: '地上层数', dataIndex: 'upFloorNum', key: 'upFloorNum' }, { title: '地下层数', dataIndex: 'downFloorNum', key: 'downFloorNum' },
            { title: '资产数量', dataIndex: 'assetNum', key: 'assetNum', scopedSlots: { customRender: 'assetNum' } },
            { title: '运营(㎡)', dataIndex: 'transferOperationArea', key: 'transferOperationArea' },
            { title: '自用(㎡)', dataIndex: 'selfUserArea', key: 'selfUserArea' },
            { title: '闲置(㎡)', dataIndex: 'idleArea', key: 'idleArea' },
            { title: '占用(㎡)', dataIndex: 'occupationArea', key: 'occupationArea' },
            { title: '其它(㎡)', dataIndex: 'otherArea', key: 'otherArea' },
            { title: '资产原值(元)', dataIndex: 'originalValue', key: 'originalValue' },
            { title: '最新估值(元)', dataIndex: 'assetValuation', key: 'assetValuation' },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 60 }
          ]
        },
        paginationObj: { pageNo: 0, totalCount: 0, pageLength: 10, location: 'absolute' }
      }
    },

    methods: {
      // 查看楼栋视图详情
      handleViewDetail (record) {
        // const { organId } = this.organProjectBuildingValue
        // router name模式式不支持详情页面刷新,如需要刷新页面请使用router query或vuex
        const { projectId, assetHouseId } = record
        assetHouseId && this.$router.push({ path: '/buildingViewDetail', query: {organId: 1111, projectId, assetHouseId }})
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: houseIdList } } = this
        if (!houseIdList || !projectIdList || !organId) { return this.$message.info('请选择搜索条件') }
        this.tableObj.loading = true
        this.$api.assets.queryBuildingViewPage({ organId, houseIdList, projectIdList, pageSize: pageLength, pageNum: pageNo }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            // 查询楼栋面积统计数据
            if (type === 'search') { this.queryAreaInfo() }
            return false
          }
          throw res.message || '查询资产项目接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产项目接口出错')
        })
      },

      // 查询楼栋视图面积概览数据
      queryAreaInfo () {
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: houseIdList }, numList } = this
        this.overviewNumSpinning = true
        this.$api.assets.queryBuildingViewFloorArea({ organId, houseIdList, projectIdList }).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = numList.map(m => {
              return {
                ...m,
                value: res.data[m.key]
              }
            })
          }
          throw res.message || '查询楼栋视图面积使用统计出错'
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询楼栋视图面积使用统计出错')
        })
      },

      // 导出数据
      handleExport () {
        this.exportBtnLoading = true
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: houseIdList } } = this
        this.$api.assets.exportBuildingViewExcel({organId, houseIdList, projectIdList}).then(res => {
          this.exportBtnLoading = false
          if (res && String(res.code) === '0') {
            return false
          }
          throw res.message || '导出楼栋视图失败'
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '导出楼栋视图失败')
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .custom-table {
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table-thead th, .ant-table td {
      white-space: nowrap;
    }
    & /deep/ .ant-table-body {
      &::-webkit-scrollbar {
        height: 8px !important;
      }
    }
  }
</style>
