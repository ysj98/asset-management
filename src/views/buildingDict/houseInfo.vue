<!--
 * @Date: 2019-11-05 16:16:34
 * @Author: chen han
 * @Description: 房间信息
 -->
<template>
  <div class="houseInfo-page pb70">
    <SearchContainer v-model="toggle">
      <div slot="headerBtns">
        <SG-Button class="mr10" icon="plus" @click="goPage('create')" type="primary">新增</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan4" class="icon-right"/>房间资料导入</SG-Button>
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
          @change="watchBuildChange"
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
           @change="watchUnitChange"
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
            @change="watchHouseCategory"
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
        class="custom-table operation"
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
// 页面跳转
const operationTypes = {
  create: '/buildingDict/createHouse',
  edit: '/buildingDict/editHouse',
  detail: '/buildingDict/detailHouse',
  copy: '/buildingDict/createHouse'
}
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
  mounted () {
    this.queryNodesByRootCode('20')
    this.queryNodesByRootCode('60')
  },
  methods: {
    // 查询房屋列表
    query () {
      let data = {
        ...this.queryCondition
      }
      // 处理数据提取typeCode
      let keys = ['houseCategory', 'houseType', 'resType']
      keys.forEach(item => {
        data[item] = data[item] ? (data[item].split(',')[0]) : data[item]
      })
      this.table.loading = true
      this.$api.building.queryHouseByPage(data).then(res => {
        this.table.loading = false
        if (res.data.code === '0') {
          this.table.dataSource = res.data.data.data.map(item => {
            return {
              key: getUuid(),
              ...item
            }
          })
          this.table.totalCount = res.data.data.count || '' 
        }
      }, () => {
        this.table.loading = false
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
      this.watchOrganChange()
      this.searchQuery()
    },
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 监听楼栋变化
    watchBuildChange (value) {
      console.log('楼栋变化=>', value)
      this.unitOpt = utils.deepClone(unitOpt)
      this.houseOpt = utils.deepClone(houseOpt)
      this.queryCondition.houseId = ''
      this.queryCondition.unitId = ''
      this.getOptions('getUnitByBuildId', '39')
    },
    // 监听单元变化
    watchUnitChange (value) {
      this.houseOpt = utils.deepClone(houseOpt)
      this.queryCondition.houseId = ''
      if (!value) {
        return
      }
      this.getOptions('getHouseByUnitId', value)
    },
    // 请求楼栋
    watchOrganChange () {
      this.buildOpt = utils.deepClone(buildOpt)
      this.unitOpt = utils.deepClone(unitOpt)
      this.houseOpt = utils.deepClone(houseOpt)
      this.queryCondition.houseId = ''
      this.queryCondition.unitId = ''
      this.queryCondition.buildId = ''
      let data = {
        organId: this.queryCondition.organId
      }
      console.log('请求楼栋=>', getUuid(), data)
      this.buildOpt = utils.deepClone(buildOpt).concat([{label: '1栋', value: '1'}, {label: '2栋', value: '2'},])
    },
    // 监听建筑形态变化
    watchHouseCategory (value) {
      console.log('建筑形态变化=>', value)
      this.queryCondition.houseType = ''
      this.houseTypeOpt = utils.deepClone(houseTypeOpt)
      if (!value) {
        return
      }
      let typeId = value.split(',')[1]
      this.queryChildNodesById(typeId)
    },
    // 获取项目楼栋单元房号
    getOptions (type, value = '') {
      if (!type) {
        return
      }
      let PARAMS = ''
      let resetArr = []
      // 请求单元
      if (type === 'getUnitByBuildId') {
        PARAMS = '#BUILD_ID:' + value
        resetArr = utils.deepClone(unitOpt)
        this.unitOpt = resetArr
      }
      // 以单元请求房号
      if (type === 'getHouseByUnitId') {
        PARAMS = '#UNIT_ID:' + value
        resetArr = utils.deepClone(houseOpt)
        this.houseOpt = resetArr
      }
      // 以楼栋请求房号
      if (type === 'getHouseByBuildId') {
        PARAMS = '#BUILD_ID:' + value
        resetArr = utils.deepClone(houseOpt)
        this.houseOpt = resetArr
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      }
      this.$api.basics.getOptions(data).then(res => {
        if (res.data.code === '0') {
          // 房号可以直接挂在楼栋下当没有单元是，以楼栋id取请求房号
          if (!res.data.data.length && type === 'getUnitByBuildId') {
            this.getOptions('getHouseByBuildId', value)
            return
          }
          let result = res.data.data || []
          resetArr.push(...result.map(item => {
            return {
              label: item.C_TEXT,
              value: item.C_VALUE
            }
          }))
        }
      })
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode (code) {
      /**
       * 20  建筑形态
       * 30  房间类型
       * 40  生命周期
       * 50  房间状态
       * 60  房间用途
      */
      let data = {
        categoryCode: code
      }
      this.$api.basics.queryNodesByRootCode(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode + ',' + item.typeId,
              ...item
            }
          })
          // 建筑类型
          if (code === '20') {
            this.houseCategoryOpt = [...utils.deepClone(houseCategoryOpt), ...resultArr]
          }
          // 房间用途
          if (code === '60') {
            this.resTypeOpt = [...utils.deepClone(resTypeOpt), ...resultArr]
          }
        }
      })
    },
    // 根据业态Id 获取下面的子节点 请求房间类型
    queryChildNodesById (typeId) {
      let data = {typeId}
      this.$api.basics.queryChildNodesById(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode + ',' + item.typeId,
              ...item
            }
          })
          this.houseTypeOpt = [...utils.deepClone(houseTypeOpt), ...resultArr]
        }
      })
    },
    // 操作事件函数
    operationFun (type, record) {
      console.log('操作事件', type, record)
      if (['edit', 'copy', 'detail'].includes(type)) {
        this.goPage(type, record)
      }
      if (['on', 'off'].includes(type)) {
        this.$SG_Modal.confirm({
          title: `确定${type==='on' ? '启用' : '禁用'}该房间吗?`,
          okText: '确定',
          cancelText: '关闭',
          onOk: () => {
            let data = {
              houseId: record.houseId,
              status: type === 'on' ? '1' : '0'
            }
            this.$api.building.updateHouseStatus(data).then(res => {
              if (res.data.code === '0') {
               this.$SG_Message.success(`${type==='on' ? '启用' : '禁用'}成功！`)
               this.query()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      }
    },
    // 页面跳转
    goPage (type, record) {
      let query = {type}
      if (['edit', 'copy', 'detail'].includes(type)) {
        query.houseId = record.houseId
      }
      this.$router.push({path: operationTypes[type], query: query || {}})
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style lang="less" scoped>
.two-row{
  margin-top: 14px;
  text-align: right;
  padding-right: 190px;
}
</style>
