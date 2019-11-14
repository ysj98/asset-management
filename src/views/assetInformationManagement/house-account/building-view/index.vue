<!--楼栋视图业务-楼栋视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 19px 30px">
      <a-row :gutter="10">
        <a-col :span="8">
          <SG-Button icon="import" type="primary" :loading="exportBtnLoading" @click="handleExport">导出资产项目</SG-Button>
        </a-col>
        <a-col :span="13">
          <organ-project-building/>
        </a-col>
        <a-col :span="3" style="text-align: right">
          <SG-Button icon="search" type="primary" @click="queryTableData">查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <div class="overview">
      <overview-number :numList="numList"/>
    </div>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table">
      <span slot="assetAmount" slot-scope="text">
        <span style="color: #0084FF">{{text}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <router-link :to="{ path: 'buildingViewDetail', query: { id: record.id }}" class="btn-text">详情</router-link>
        <!--<span class="btn-text" @click="handleViewDetail(record.id)">详情</span>-->
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <router-link :to="{ name: '楼栋视图详情', params: { id: 123 }}" class="btn-text">
      <button class="btn btn-primary">详情</button>
    </router-link>
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
        exportBtnLoading: false, // 导出按钮loading
        organId: '', // 查询条件-组织机构Id
        projectIds: [], // 查询条件-资产项目Id
        projectOptions: [
          {key: 121, title: '老李'}, {key: 311, title: '小松鼠'}, {key: 141, title: '老王'}
        ], // 查询条件-资产项目选项
        buildingIds: [], // 查询条件-楼栋Id
        buildingOptions: [
          {key: 121, title: '老李'}, {key: 311, title: '小松鼠'}, {key: 141, title: '老王'}
        ], // 查询条件-楼栋选项
        numList: [
          {title: '所有资产(㎡)', value: 0, fontColor: '#324057'}, {title: '运营(㎡)', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', value: 0, bgColor: '#FD7474'}, {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        tableObj: {
          rowKey: 'assetHouseId',
          loading: false,
          dataSource: [],
          scroll: { x: 1500, y: 300 },
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
      // handleViewDetail (id) {
      //   // 如果不使用vuex,考虑替换为router-link
      //   id && this.$router.push('id')
      // },

      // 获取选择的组织机构
      changeTree (organId) {
        this.organId = organId
        this.queryProjectsById(organId)
      },

      // 查询所选组织机构下所有的资产项目
      queryProjectsById (organId) {
        // 清空旧资产项目数据
        this.projectIds = []
        this.projectOptions = []
        new Promise.reject({organId}).then(res => {
          if (res && String(res.code) === '0') {
            return res.data
          }
          throw res.message || '查询资产项目接口出错'
        }).catch(err => {
          this.$message.error(err || '查询资产项目接口出错')
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageSize = 10}) {
        const { organId, projectIds: projectIdList, buildingIds: houseIdList} = this
        if (!organId) {
          this.$message.info('请选择组织机构!')
          return false
        }
        this.tableObj.loading = true
        new Promise.reject({organId, projectIdList, houseIdList, currentOrgan: false, pageSize, pageNum: pageNo}).then(res => {
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

      // 导出数据
      handleExport () {
        this.exportBtnLoading = true
        debugger
      }
    },

    watch: {
      projectIds: function (projectIds) {
        projectIds.length && this.queryTableData({})
      },
      buildingIds: function (buildingIds) {
        buildingIds.length && this.queryTableData({})
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
