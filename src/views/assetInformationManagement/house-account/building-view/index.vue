<!--楼栋视图业务-楼栋视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="8">
        <a-col :span="10">
          <SG-Button
            icon="import"
            type="primary"
            @click="handleExport"
            :loading="exportBtnLoading"
          >导出楼栋视图</SG-Button>
        </a-col>
        <!--<a-col :span="15">-->
          <!--<organ-project-building v-model="organProjectBuildingValue" mode="multiple"/>-->
        <!--</a-col>-->
        <a-col :span="6">
          <a-select
            showSearch
            style="width: 100%"
            :options="organOptions"
            @change="queryBuildingList"
            :filterOption="filterOption"
            placeholder="请选择组织机构"
            v-model="organProjectBuildingValue.organId"
          ></a-select>
        </a-col>
        <a-col :span="6">
          <a-select
            allowClear
            showSearch
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择楼栋"
            :options="buildingOptions"
            :filterOption="filterOption"
            v-model="organProjectBuildingValue.buildingId"
          ></a-select>
        </a-col>
        <a-col :span="2">
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
        <span style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record.buildId)">详情</span>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  // import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  export default {
    name: 'index',
    components: { OverviewNumber, NoDataTip },
    data () {
      return {
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        exportBtnLoading: false, // 导出按钮loading
        organOptions: [], // 组织机构选项
        buildingOptions: [], // 楼栋选项
        organProjectBuildingValue: {
          organId: undefined,
          projectId: undefined, // 用不到，暂存，临时需求隐藏处理
          buildingId: undefined
        }, // 查询条件-组织机构-资产项目-楼栋对象
        numList: [
          {title: '所有资产(㎡)', key: 'totalArea', value: 0, fontColor: '#324057'}, {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'}, {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 2500 },
          pagination: false,
          rowKey: 'buildId',
          columns: [
            { title: '楼栋名称', dataIndex: 'buildName', width: 150, fixed: 'left' },
            { title: '楼栋编号', dataIndex: 'buildCode', width: 150, fixed: 'left' },
            { title: '资产项目名称', dataIndex: 'projectName' },
            { title: '丘地号', dataIndex: 'addressNo' },
            { title: '建筑年代', dataIndex: 'years' },
            { title: '建筑面积(㎡)', dataIndex: 'area' },
            { title: '楼高', dataIndex: 'buildHeight' },
            { title: '层数', dataIndex: 'floorNum' },
            { title: '地上层数', dataIndex: 'upFloorNum' },
            { title: '地下层数', dataIndex: 'downFloorNum' },
            { title: '资产数量', dataIndex: 'assetNum', scopedSlots: { customRender: 'assetNum' } },
            { title: '运营(㎡)', dataIndex: 'transferOperationArea' },
            { title: '自用(㎡)', dataIndex: 'selfUserArea' },
            { title: '闲置(㎡)', dataIndex: 'idleArea' },
            { title: '占用(㎡)', dataIndex: 'occupationArea' },
            { title: '其它(㎡)', dataIndex: 'otherArea' },
            { title: '资产原值(元)', dataIndex: 'originalValue' },
            { title: '最新估值(元)', dataIndex: 'marketValue' },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 60, fixed: 'right' }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' }
      }
    },

    methods: {
      // 查看楼栋视图详情
      handleViewDetail (buildId) {
        const { organProjectBuildingValue: { organId } } = this
        buildId && this.$router.push({ path: '/houseStandingBook/buildingViewDetail', query: {organId, buildId }})
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList } } = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        this.$api.assets.queryBuildingViewPage({ organId, buildIdList, projectIdList, pageSize: pageLength, pageNum: pageNo }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询资产项目接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产项目接口出错')
        })
        // 查询楼栋面积统计数据
        if (type === 'search') { this.queryAreaInfo() }
      },

      // 查询楼栋视图面积概览数据
      queryAreaInfo () {
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList }, numList } = this
        this.overviewNumSpinning = true
        this.$api.assets.queryBuildingViewFloorArea({ organId, buildIdList, projectIdList }).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = numList.map(m => {
              return { ...m, value: res.data[m.key] }
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
        if (!this.tableObj.dataSource.length) {
          return this.$message.info('无可导出数据')
        }
        this.exportBtnLoading = true
        const { organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList } } = this
        this.$api.assets.exportBuildingViewExcel({organId, buildIdList, projectIdList}).then(res => {
          this.exportBtnLoading = false
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = '楼栋视图导出列表.xls'
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message || '导出楼栋视图失败'
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '导出楼栋视图失败')
        })
      },

      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 查询组织机构对应的楼栋数据
      queryBuildingList () {
        const { organProjectBuildingValue: { organId } } = this
        // 清空组织机构，重置楼栋选项
        if (!organId) { return this.$message.warn('组织机构不存在') }
        this.buildingOptions = []
        this.organProjectBuildingValue.buildingId = undefined
        this.$api.assets.queryBuildingByOrganId({organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            this.buildingOptions = (res.data || []).map(item => {
              return {
                key: item.buildId,
                title: item.buildName
              }
            })
            return false
          }
          throw res.message || '查询楼栋失败'
        }).catch(err => {
          this.$message.error(err || '查询楼栋失败')
        })
      },
      
      // 查询一级组织机构
      queryOrganList () {
        this.$api.assets.queryAsynOrganByUserId({parentOrganId: '', typeFilter: ''}).then(res => {
          if (Number(res.data.code) === 0) {
            let list = res.data.data || []
            let id = list[0] ? list[0].organId : undefined
            this.organProjectBuildingValue.organId = id
            id && this.queryBuildingList()
            this.organOptions = list.map(item => {
              return {
                key: item.organId,
                title: item.name
              }
            })
            return false
          }
          throw res.message || '查询组织机构失败'
        }).catch(err => {
          this.$message.error(err || '查询组织机构失败')
        })
      }
    },
    
    created () {
      this.queryOrganList()
    },

    watch: {
      organProjectBuildingValue: {
        handler: function (val) {
          val && val.organId && this.queryTableData({type: 'search'})
        },
        deep: true
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
      .ant-table-thead th, td {
        white-space: nowrap;
      }
    }
  }
</style>
