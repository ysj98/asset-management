<!--资产视图业务-资产视图列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="plus" type="primary" :loading='exportAssetBtn' @click="handleExport('exportAssetBtn')">导出资产视图</SG-Button>
        <SG-Button icon="import" style="margin: 0 10px" :loading="exportHouseBtn" @click="handleExport('exportHouseBtn')">导出房屋卡片</SG-Button>
        <SG-Button icon="import" style="margin: 0 10px" @click="handleClick('tenement')">转物业</SG-Button>
        <SG-Button icon="import" style="margin: 0 10px" @click="handleClick('operation')">转运营</SG-Button>
        <SG-Button icon="setting" @click="handleModalStatus(true)">列表设置</SG-Button>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="12">
            <organ-project-building/>
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="buildingIds"
              mode="multiple"
              :maxTagCount="1"
              style="width: 100%"
              placeholder="请选择资产状态"
              :options="buildingOptions"
            />
          </a-col>
          <a-col :span="6">
            <SG-Button type="primary" @click="handleModalOpen('add')">查询</SG-Button>
            <SG-Button style="margin-left: 10px" @click="handleClick('import')">清空</SG-Button>
          </a-col>
        </a-row>
        <a-row :gutter="8" style="margin-top: 14px">
          <a-col :span="12">
            <province-city-district/>
          </a-col>
          <a-col :span="4">
            <a-input placeholder="请输入资产名称"/>
          </a-col>
        </a-row>
      </div>
      <div slot="btns">
        <SG-Button icon="search" type="primary">查询</SG-Button>
      </div>
    </search-container>
    <!--数据概览信息-->
    <overview-number :numList="numList"/>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table">
      <span slot="action" slot-scope="text, record">
        <span class="btn-text">详情</span>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="handleChangePage"/>
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
    <!--<router-link to="/assetViewDetail" class="btn-primary">戳我看详情</router-link>-->
  </div>
</template>

<script>
  import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  import ProvinceCityDistrict from 'src/views/common/ProvinceCityDistrict'
  import SearchContainer from 'src/views/common/SearchContainer'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import EditTableHeader from './components/EditTableHeader'
  export default {
    name: 'index',
    components: { EditTableHeader, OverviewNumber, SearchContainer, ProvinceCityDistrict, OrganProjectBuilding },
    data () {
      return {
        fold: true,
        tableObj: {
          rowKey: 'assetCode',
          loading: false,
          columns: [],
          dataSource: [],
          scroll: { x: true },
          initColumns: [
            { title: '资产名称', dataIndex: 'name', key: 'name', fixed: 'left' },
            { title: '资产编码', dataIndex: 'age', key: 'age' },
            { title: '接管机构', dataIndex: 'address', key: 'address' },
            { title: '丘地号', key: 'tags', dataIndex: 'tags', scopedSlots: { customRender: 'tags' } },
            { title: '建筑面积', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
          ]
        },
        key: 0, // 更新Modal包裹的子组件
        numList: [
          {title: '运营(㎡)', value: 0, bgColor: '#4BD288'}, {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'}, {title: '占用(㎡)', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据，title 标题，value 数值，color 背景色
        checkedHeaderArr: ['tags'], // 格式如['name', 'age']
        exportHouseBtn: false, // 导出房屋卡片button loading标志
        exportAssetBtn: false, // 导出资产视图button loading标志
        paginationObj: { pageNo: 0, totalCount: 0, pageLength: 0, location: 'absolute' },
        modalObj: { title: '展示列表设置', details: {}, status: false, okText: '保存', width: 605 },
      }
    },

    methods: {
      // 导出资产视图/房屋卡片
      handleExport (type) {
        this[type] = true
        new Promise.reject().then(res => {
          this[type] = false
          debugger
        }).catch(err => {
          this[type] = false
        })
      },

      // 打开/关闭列表列头编辑Modal
      handleModalStatus (status) {
        this.modalObj.status = status
        status && (this.key = new Date().getTime())
      },

      // Modal提交
      handleModalOk () {
        let arr = this.$refs['tableHeader'].checkedList
        if (!arr.length) {
          arr = this.checkedHeaderArr
          return this.$message.info('请至少选中一项!')
        }
        this.modalObj.status = false
        let{ initColumns } = this.tableObj
        this.checkedHeaderArr = arr
        this.tableObj.columns = initColumns.filter(n => arr.includes(n.dataIndex) || n.dataIndex === 'action')
      }
    },

    created () {
      // 初始化Table列头
      let{ initColumns } = this.tableObj
      this.tableObj.columns = initColumns
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
