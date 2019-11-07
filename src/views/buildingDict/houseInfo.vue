<!--
 * @Date: 2019-11-05 16:16:34
 * @Author: chen han
 * @Description: 房间信息
 -->
<template>
  <div class="houseInfo-page pb70">
    <SearchContainer v-model="toggle">
      <div slot="headerBtns">
        <SG-Button class="mr10" icon="plus" type="primary">新增</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan4" class="icon-right"/>房间资料导导入</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan10" class="icon-right"/>房间导出</SG-Button>
        <SG-Button icon="sync">批量更新</SG-Button>
      </div>
      <div slot="contentForm">
        <div>
          <!-- 公司 -->
          <topOrganByUser @change="organIdChange" :formStyle="allWidth" v-model="queryCondition.organId" :hasAll="false" :selectFirst="true"/>
         <!-- 楼栋 -->
         <a-select
          showSearch
          placeholder="请选择楼栋"
          v-model="queryCondition.buildId"
          optionFilterProp="children"
          :style="allWidth"
          :options="buildOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <!-- 单元 -->
         <a-select
          showSearch
          placeholder="请选择单元"
          v-model="queryCondition.unitId"
          optionFilterProp="children"
          :style="allWidth"
          :options="unitOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <!-- 房号 -->
         <a-select
          showSearch
          placeholder="请选择房号"
          v-model="queryCondition.houseId"
          optionFilterProp="children"
          :style="allWidth"
          :options="houseOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
         <SG-Button @click="restQuery">清除</SG-Button>
        </div>
        <div class="two-row">
          <!-- 房屋建筑形态 -->
          <a-select
            showSearch
            placeholder="请选择建筑形态"
            v-model="queryCondition.houseCategory"
            optionFilterProp="children"
            :style="allWidth"
            :options="houseCategoryOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
            <!-- 房屋类型 -->
            <a-select
            showSearch
            placeholder="请选择房间类型"
            v-model="queryCondition.houseType"
            optionFilterProp="children"
            :style="allWidth"
            :options="houseTypeOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋用途 -->
          <a-select
            showSearch
            placeholder="请选择房间用途"
            v-model="queryCondition.resType"
            optionFilterProp="children"
            :style="allWidth"
            :options="resTypeOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋状态 -->
          <a-select
            showSearch
            placeholder="请输入房间状态"
            v-model="queryCondition.status"
            optionFilterProp="children"
            :style="allWidth"
            :options="statusOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
        </div>
      </div>
    </SearchContainer>
    <!-- 表格部分 -->
    <div class="table-layout-fixed">
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
        >
        <template slot="operation" slot-scope="text, record">
            <OperationPopover :operationData="operationData"  @operationFun="operationFun($event, record)"></OperationPopover>
          </template>
      </a-table>
      <SG-FooterPagination
        :pageSize="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
import segiIcon from '@/components/segiIcon.vue'
import topOrganByUser from '@/views/common/topOrganByUser'
import {utils} from '@/utils/utils'
import OperationPopover from '@/components/OperationPopover'

let getUuid = ((uuid = 1) => () => ++uuid)()
const allWidth = {width: '170px', 'margin-right': '10px'}
let queryCondition = {
  pageNum: 1,
  pageSize: 10,
  organId: '',
  buildId: '',
  unitId: '',
  houseId: '',
  houseCategory: '', //建筑形态
  houseType: '', //房间类型
  resType: '', // 房间用途
  status: '', // 房间状态
}
const buildOpt = [{label: '全部楼栋', value: ''}]
const unitOpt = [{label: '全部单元', value: ''}]
const houseOpt = [{label: '全部房号', value: ''}]
const houseCategoryOpt = [{label: '所有建筑形态', value: ''}]
const houseTypeOpt = [{label: '全部房间类型', value: ''}]
const resTypeOpt = [{label: '全部房间用途', value: ''}]
const statusOpt = [{label: '全部状态', value: ''}, {label: '有效', value: '1'}, {label: '无效', value: '0'}]
// 表格数据
let columns = [{
  title: '房间ID',
  dataIndex: 'houseId',
  width: '15%'
}, {
  title: '房间名称',
  dataIndex: 'houseName',
  scopedSlots: { customRender: 'houseName' }
}, {
  title: '房间类型',
  dataIndex: 'houseTypeName',
  width: '15%'
}, {
  title: '建筑面积(㎡)',
  dataIndex: 'area',
  width: '15%'
}, {
  title: '套内面积(㎡)',
  dataIndex: 'billArea',
  width: '15%'
}, {
  title: '房间状态',
  dataIndex: 'houseStatusName',
  width: '10%'
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
  width: '124px'
}]
// 操作按钮
const operationData = [
  {iconType: 'edit', text: '编辑', editType: 'edit'},
  {iconType: 'play-circle', text: '启用', editType: 'on'},
  {iconType: 'close-circle', text: '禁用', editType: 'off'},
  {iconType: 'file-text', text: '详情', editType: 'detail'},
  {iconType: 'copy', text: '复制', editType: 'copy'},
]
export default {
  components: {
    SearchContainer,
    segiIcon,
    topOrganByUser,
    OperationPopover
  },
  data () {
    return {
      allWidth,
      toggle: true,
      operationData,
      queryCondition: {...queryCondition},
      buildOpt: utils.deepClone(buildOpt),
      unitOpt: utils.deepClone(unitOpt),
      houseOpt: utils.deepClone(houseOpt),
      houseCategoryOpt: utils.deepClone(houseCategoryOpt),
      houseTypeOpt: utils.deepClone(houseTypeOpt),
      resTypeOpt: utils.deepClone(resTypeOpt),
      statusOpt: utils.deepClone(statusOpt),
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    }
  },
  methods: {
    // 查询房屋列表
    query () {
      let data = {
        ...this.queryCondition
      }
      this.$api.building.queryHouseByPage(data).then(res => {
        if (res.data.code === '0') {
          this.table.dataSource = res.data.data.data.map(item => {
            return {
              key: getUuid(),
              ...item
            }
          })
          this.table.totalCount = res.data.data.count || '' 
        }
      })
    },
    // 重置分页查询
    searchQuery () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 重置查询条件
    restQuery () {
      let queryCondition = {
          buildId: '',
          unitId: '',
          houseId: '',
          houseCategory: '', //建筑形态
          houseType: '', //房间类型
          resType: '', // 房间用途
          status: '', // 房间状态
        }
      this.queryCondition.buildId = ''
      this.queryCondition.unitId = ''
      this.queryCondition.houseId = ''
      this.queryCondition.houseCategory = ''
      this.queryCondition.houseType = ''
      this.queryCondition.resType = ''
      this.queryCondition.status = ''
    },
    // orangId改变
    organIdChange (o) {
      console.log('一级物业改变', o)
      this.searchQuery()
    },
    // 操作事件函数
    operationFun (type, record) {
      console.log('操作事件', type, record)
    },
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNum
      this.queryCondition.pageSize = data.pageSize
      this.query()
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style lang="less" scoped>
.two-row{
  margin-top: 14px;
  text-align: right;
  padding-right: 190px;
}
</style>
