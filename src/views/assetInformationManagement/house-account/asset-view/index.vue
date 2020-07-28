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
      </div>
      <div slot="headerForm">
        <div style="width: 55%; float: right; margin-right: 8px">
          <organ-project-building v-model="organProjectBuildingValue" mode="multiple" :isShowBuilding="false"/>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="5" :offset="6">
            <a-select
              v-model="status"
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              placeholder="请选择资产状态"
              :options="statusOptions"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              v-model="categoryId"
              placeholder="请选择资产分类"
              :options="categoryOptions"
            />
          </a-col>
          <a-col :span="5">
            <a-input placeholder="请输入资产名称或编码" v-model="assetName"/>
          </a-col>
          <a-col :span="3" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleClick('import')">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row :gutter="8" style="margin-top: 14px">
          <a-col :span="15" :offset="6">
            <province-city-district v-model="provinceCityDistrictValue"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
    </a-spin>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <!--<span slot="projectName" slot-scope="text, record">-->
        <!--<router-link :to="{ path: '/assetViewDetail', query: { houseId: record.assetHouseId } }">{{text}}</router-link>-->
      <!--</span>-->
      <!--<span slot="buildName" slot-scope="text, record">-->
        <!--<router-link :to="{ path: '/assetViewDetail', query: { houseId: record.assetHouseId } }">{{text}}</router-link>-->
      <!--</span>-->
      <span slot="action" slot-scope="text, record">
        <router-link :to="{ path: '/assetView/assetViewDetail', query: { houseId: record.assetHouseId, assetId: record.assetId } }">详情</router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--编辑列表表头-->
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="handleModalStatus(false)"
    >
      <edit-table-header
        :key="key"
        ref="tableHeader"
        :checkedArr="checkedHeaderArr"
        :columns="tableObj.initColumns"
      />
    </SG-Modal>
  </div>
</template>

<script>
  import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import EditTableHeader from './components/EditTableHeader'
  import NoDataTip from 'src/components/noDataTips'
  export default {
    name: 'index',
    components: { EditTableHeader, OverviewNumber, SearchContainer, ProvinceCityDistrict, OrganProjectBuilding, NoDataTip },
    data () {
      return {
        fold: true,
        assetName: '', // 查询条件-资产名称
        status: undefined, // 查询条件-资产状态值
        categoryId: [], // 查询条件-资产分类
        categoryOptions: [], // 查询条件-资产分类选项
        statusOptions: [
          { title: '全部状态', key: '-1' }, { title: '未入库', key: '0' }, { title: '正常', key: '1' },
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
          scroll: { x: 2900 },
          columns: [
            { title: 'xxxxxx资产名称', dataIndex: 'assetName', width: 250, fixed: 'left' },
            { title: '资产编码', dataIndex: 'assetCode' },
            { title: '接管机构', dataIndex: 'ownerOrganName', width: 150 },
            { title: '丘地号', dataIndex: 'addressNo' },
            { title: '建筑面积(㎡)', dataIndex: 'area' },
            { title: '资产项目名称', dataIndex: 'projectName', scopedSlots: { customRender: 'projectName' }, width: 200 },
            { title: '楼栋名称', dataIndex: 'buildName', scopedSlots: { customRender: 'buildName' }, width: 150 },
            { title: '单元', dataIndex: 'unitName' },
            { title: '楼层', dataIndex: 'floor' },
            { title: '层高', dataIndex: 'floorHeight' },
            { title: '分类', dataIndex: 'objectTypeName' },
            { title: '用途', dataIndex: 'useType' },
            { title: '资产形态', dataIndex: 'typeName' },
            { title: '权属类型', dataIndex: 'kindOfRightName' },
            { title: '权属状态', dataIndex: 'ownershipStatusName' },
            { title: '权证号', dataIndex: 'warrantNbr' },
            { title: '接管时间', dataIndex: 'startDate' },
            { title: '运营(㎡)', dataIndex: 'transferOperationArea' },
            { title: '自用(㎡)', dataIndex: 'selfUserArea' },
            { title: '闲置(㎡)', dataIndex: 'idleArea' },
            { title: '占用(㎡)', dataIndex: 'occupationArea' },
            { title: '其它(㎡)', dataIndex: 'otherArea' },
            { title: '财务卡片编码', dataIndex: 'financialCode' },
            { title: '资产原值(元)', dataIndex: 'originalValue' },
            { title: '最新估值(元)', dataIndex: 'marketValue' },
            { title: '资产状态', dataIndex: 'statusName' },
            { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 60 }
          ]
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
        current: null // 当前选中的概览区域下标，与后台入参一一对应
      }
    },

    methods: {
      // 点击总览数据块
      handleClickOverview ({i}) {
        this.current = i
        this.queryTableData({type: 'search'})
      },

      // 根据organId查询资产分类选项
      queryCategoryOptions (organId) {
        this.categoryId = []
        this.categoryOptions = []
        this.$api.assets.getList({organId, assetType: 1}).then(({data: res}) => {
          if (res && String(res.code) === '0') {
            const arr = (res.data || []).map(m => {
              return { title: m.assetTypeName, key: m.categoryConfId }
            })
            return this.categoryOptions = [{ title: '全部分类', key: 'all' }].concat(arr)
          }
          throw res.message || '查询资产分类出错'
        }).catch(err => this.$message.error(err || '查询资产分类出错'))
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
        let columns = initColumns.filter(n => arr.includes(n.dataIndex) || n.dataIndex === 'action')
        this.tableObj.scroll = { x: columns.length * 100 } // 防止较少列时出现滚动
        this.tableObj.columns = columns
      },

      // 打开/关闭列表列头编辑Modal
      handleModalStatus (status) {
        this.modalObj.status = status
        status && (this.key = new Date().getTime())
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {
          organProjectBuildingValue: { organId, projectId: projectIdList, buildingId: buildIdList },
          provinceCityDistrictValue: { province, city, district: region }, assetName, status, current
        } = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          organId, buildIdList, projectIdList, pageSize: pageLength,
          province, city, region, assetName, pageNum: pageNo,
          statusList: status === -1 ? [] : status, flag: current ? (current - 1) : ''
        }
        this.$api.assets.queryAssetViewPage(form).then(r => {
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
          throw res.message || '查询接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
        // 查询楼栋面积统计数据
        if (type === 'search') { this.queryAssetAreaInfo(form) }
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
          provinceCityDistrictValue: { province, city, district: region }, assetName, status,
          tableObj: { columns }, current
        } = this
        let form = type === 'exportHouseBtn' ? {
          assetHouseId: buildIdList.join(',')
        } : {
          organId, buildIdList, projectIdList, flag: current ? (current - 1) : '',
          province, city, region, assetName, status: status || null,
          display: columns.map(m => m.dataIndex).filter(n => n !== 'action')
        }
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
      },
      
      // 转物业、转运营
      handleTransform (type) {
        // type && this.$router.push('www.baidu.com')
        type && this.$message.info('暂不支持该操作')
      }
    },

    created () {
      // 初始化Table列头
      let{ columns } = this.tableObj
      this.tableObj.initColumns = columns
      // 初始化被选中的列头数据
      this.checkedHeaderArr = columns.map(m => m.dataIndex).filter(n => n !== 'action')
    },

    watch: {
      organProjectBuildingValue: function (val, pre) {
        this.queryTableData({type: 'search'})
        val.organId !== pre.organId && this.queryCategoryOptions(val.organId)
      },

      // 全选与其他选项互斥处理
      status: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.status = ['-1']
        }
      },

      categoryId: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.categoryId = ['-1']
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
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
  }
</style>
