<!--楼栋视图业务-楼栋视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 19px 30px">
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
            @click="queryTableData"
            :disabled="!organProjectBuildingValue.organId"
            :title="organProjectBuildingValue.organId ? '' : '请先选择组织机构'"
          >查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList"/>
    </a-spin>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table">
      <span slot="assetAmount" slot-scope="text">
        <span style="color: #0084FF">{{text}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <span class="btn-text" @click="handleViewDetail(record)">详情</span>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <a-button class="btn btn-primary"  @click="handleViewDetail({id: 12, b: 343})">详情</a-button>
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
          {title: '所有资产(㎡)', value: 0, fontColor: '#324057'}, {title: '运营(㎡)', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', value: 0, bgColor: '#FD7474'}, {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        tableObj: {
          rowKey: 'assetHouseId',
          loading: false,
          dataSource: [],
          scroll: { x: true },
          columns: [
            { title: '楼栋名称', dataIndex: '', key: '', fixed: 'left' }, { title: '楼栋编号', dataIndex: '', key: '' },
            { title: '资产项目名称', dataIndex: 'assetName', key: 'assetName' }, { title: '丘地号', dataIndex: '', key: '' },
            { title: '建筑年代', dataIndex: '', key: '' },
            { title: '建筑面积(㎡)', dataIndex: '', key: '', align: 'right' },
            { title: '楼高', dataIndex: '', key: '' }, { title: '层数', dataIndex: '', key: '' },
            { title: '地上层数', dataIndex: '', key: '' }, { title: '地下层数', dataIndex: '', key: '' },
            { title: '资产数量', dataIndex: 'assetAmount', key: 'assetAmount', scopedSlots: { customRender: 'assetAmount' } },
            { title: '运营(㎡)', dataIndex: '', key: '' },
            { title: '自用(㎡)', dataIndex: 'selfUserArea', key: 'selfUserArea' },
            { title: '闲置(㎡)', dataIndex: 'idleArea', key: 'idleArea' },
            { title: '占用(㎡)', dataIndex: 'occupationArea', key: 'occupationArea' },
            { title: '其它(㎡)', dataIndex: 'otherArea', key: 'otherArea' },
            { title: '资产原值(元)', dataIndex: 'originalValue', key: 'originalValue' },
            { title: '最新估值(元)', dataIndex: 'assetValuation', key: 'assetValuation' },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
          ]
        },
        paginationObj: { pageNo: 0, totalCount: 0, pageLength: 0, location: 'absolute' }
      }
    },

    methods: {
      // 查看楼栋视图详情
      handleViewDetail (record) {
        record.id && this.$router.push({ name: '楼栋视图详情', params: { ...record }})
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageSize = 10}) {
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: houseIdList } } = this
        if (!organId) { return this.$message.info('请选择组织机构!') }
        this.tableObj.loading = true
        new Promise.reject({ organId, houseIdList, projectIdList, currentOrgan: false, pageSize, pageNum: pageNo }).then(res => {
          this.tableObj.loading = false
          if (res && String(res.code) === '0') {
            return res.data
          }
          throw res.message || '查询资产项目接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产项目接口出错')
        })
      },

      // 查询楼栋视图面积概览数据
      queryrAreaInfo () {
        const { organProjectBuildingValue: { organId, projectId } } = this
        if (!organId) { return this.$message.info('请选择组织机构!') }
        this.overviewNumSpinning = true
        new Promise.reject({ organId, projectId, currentOrgan: false }).then(res => {
          this.overviewNumSpinning = false
          if (res && String(res.code) === '0') {
            return res.data
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
        const display = [] // 需要展示的字段
        this.$api.assets.exportExcel({organId, houseIdList, projectIdList, display, currentOrgan: true}).then(res => {
          this.exportBtnLoading = false
          debugger
          if (res && String(res.code) === '0') {
            return false
          }
          throw res.message || '导出楼栋视图失败'
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '导出楼栋视图失败')
        })
      }
    },

    mounted () {
      // 获取Table表宽度
      // let { offsetWidth } = document.getElementsByClassName('custom-table')[0]
      // this.tableObj.scroll.y = offsetWidth || 1000
    },

    watch: {
      // projectIds: function (projectIds) {
      //   projectIds.length && this.queryTableData({})
      // }
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
  }
</style>
