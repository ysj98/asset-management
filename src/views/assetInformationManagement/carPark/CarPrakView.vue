<!-- 车场台账 - 车场视图 -->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="8">
        <a-col :span="3">
          <SG-Button
            icon="import"
            type="primary"
            @click="handleExport"
            :loading="exportBtnLoading"
            v-power="ASSET_MANAGEMENT.CARPARK_VIEW_EXPORT"
          >导出车场视图</SG-Button>
        </a-col>
        <a-col :span="3">
          <SG-Button
            v-power="ASSET_MANAGEMENT.CARPARK_VIEW_LABEL_SET"
            type="default"
            @click="clickAsset"
          >资产标签</SG-Button>
        </a-col>
        <!--<a-col :span="15">-->
          <!--<organ-project-building v-model="organProjectBuildingValue" mode="multiple"/>-->
        <!--</a-col>-->
        <a-col :span="4">
          <a-select
            showSearch
            style="width: 100%"
            :options="$addTitle(organOptions)"
            @change="queryBuildingList"
            :filterOption="filterOption"
            placeholder="请选择组织机构"
            v-model="organProjectBuildingValue.organId"
          ></a-select>
        </a-col>
        <a-col :span="4">
         <AssetProject :organId="organProjectBuildingValue.organId" @projectChange="projectChange" modeStr="multiple"/>
        </a-col>
        <a-col :span="4">
          <a-select
            allowClear
            showSearch
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择车场"
            :options="$addTitle(buildingOptions)"
            :filterOption="filterOption"
            v-model="organProjectBuildingValue.placeId"
            @select="placeFun"
          ></a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model="label"
            mode="multiple"
            :maxTagCount="1"
            @select="assetLabelFn"
            style="width: 100%"
            placeholder="请选择资产标签"
            :options="$addTitle(assetLabelSelect)"
          />
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
      <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
    </a-spin>
    <!--列表部分-->
    <a-table 
      v-bind="tableObj" 
      class="custom-table td-pd10"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelectAll: onSelectAll }">
      <!-- <template slot="buildName" slot-scope="text">
        <tooltip-text :text="text"/>
      </template> -->
      <span slot="action" slot-scope="text, record">
        <span style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
      <!-- <template slot="fireMaterial" slot-scope="text">
        {{+text===1?'是':'否'}}
      </template> -->
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--编辑资产标签-->
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="modalObj.status = false"
    >
      <edit-tag ref="editTagRef" :options="assetLabelOpt"/>
    </SG-Modal>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import TooltipText from 'src/views/common/TooltipText'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import AssetProject from './components/assetProject.vue'
  import {queryAssetLabelConfig} from '@/api/publicCode.js'
  import EditTag from './components/editTag.vue'
  import { throttle, getFormat } from '@/utils/utils'
  // import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  const assetLabelOpt = [
    // { label: "全部资产标签  ", value: "" },
  ]
  export default {
    name: 'index',
    components: { OverviewNumber, NoDataTip, TooltipText, AssetProject, EditTag },
    data () {
      return {
        assetLabelOpt,
        assetLabelSelect: [],
        label: [],
        selectedRowKeys: [],
        modalObj: { title: '资产设置', status: false, okText: '确定', width: 605 },
        ASSET_MANAGEMENT, // 权限对象
        overviewNumSpinning: false, // 查询视图面积概览数据loading
        exportBtnLoading: false, // 导出按钮loading
        organOptions: [], // 组织机构选项
        buildingOptions: [], // 车场选项
        organProjectBuildingValue: {
          organId: undefined,
          projectId: undefined, // 用不到，暂存，临时需求隐藏处理
          placeId: [''],
          statusList: []
        }, // 查询条件-组织机构-资产项目-车场对象
        numList: [
          {title: '车场数量', key: 'placeNums', value: 0, fontColor: '#324057'}, 
          {title: '车场总面积(㎡)', key: 'totalArea', value: 0, bgColor: '#FD7474'},
          {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'}, 
          {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#4BD288'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 2500 },
          pagination: false,
          rowKey: 'placeId',
          columns: [
            { title: '车场名称', dataIndex: 'placeName', scopedSlots: { customRender: 'placeName' }, fixed: 'left', width: 250 },
            { title: '车场编号', dataIndex: 'placeCode', width: 200},
            { title: '管理机构', dataIndex: 'communityName', width: 200},
            { title: '资产项目名称', dataIndex: 'projectName', width: 200 },
            { title: '车场面积(㎡)', dataIndex: 'area', width: 150 },
            { title: '车场类型', dataIndex: 'objectType', width: 150 },
            { title: '所在位置', dataIndex: 'address', width: 150 },
            { title: '车位数量', dataIndex: 'placeNum', scopedSlots: { customRender: 'placeNum' }, width: 150 },
            { title: '运营(㎡)', dataIndex: 'transferOperationArea', width: 150 },
            { title: '自用(㎡)', dataIndex: 'selfUserArea', width: 150 },
            { title: '闲置(㎡)', dataIndex: 'idleArea', width: 150 },
            { title: '占用(㎡)', dataIndex: 'occupationArea', width: 150 },
            { title: '其它(㎡)', dataIndex: 'otherArea', width: 150 },
            { title: '资产原值(元)', dataIndex: 'originalValue', width: 150 },
            { title: '最新估值(元)', dataIndex: 'marketValue', width: 150 },
            { title: '资产标签', dataIndex: 'label', width: 150 },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        current: null, // 当前选中的概览区域下标，与后台入参一一对应
        options: [],
        formatArr: ['buildBuiltArea' ,'transferOperationArea', 'selfUserArea', 'idleArea', 'otherArea', 'originalValue', 'marketValue', 'area', 'placeNum', 'occupationArea'],
        onlyCurrentOrgan: false,
        projectId: '',
      }
    },

    methods: {
      projectChange (val) {
        this.projectId = val
        this.queryBuildingList('project')
      },
      // 仅选择当前机构下资产项目
      onOnlyCurrentOrganChange (e) {
        this.onlyCurrentOrgan = e.target.checked
        this.queryTableData({type: 'search'})
      },
      placeFun (value){
        this.$nextTick(function () {
          this.organProjectBuildingValue.placeId = this.handleMultipleSelectValue(
            value,
            this.organProjectBuildingValue.placeId,
            this.buildingOptions
          );
        });
      },
      assetLabelFn(value){
        this.$nextTick(function () {
          this.label = this.handleMultipleSelectValue(
            value,
            this.label,
            this.assetLabelSelect
          );
        });
      },
      // 处理多选下拉框有全选时的数组
      handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === "") {
        data = [""];
      } else {
        let totalIndex = data.indexOf("");
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [""];
          }
        }
      }
      return data;
    },
      getAssetLabel (id){
        queryAssetLabelConfig({organId: id}).then(res => {
          let {data, code} = res.data
          if(!data) this.assetLabelOpt = []
          if(code === '0'){
            this.assetLabelOpt = data.data.map(item => {
              return ({label: item.labelName, value: item.labelValue})
            })
            this.assetLabelSelect = this.assetLabelOpt.length > 0 ? [{ label: "全部资产标签", value: "" },...this.assetLabelOpt] : undefined
            this.label = this.assetLabelOpt.length > 0 ? '' : undefined
          }
        }).catch(err =>{
          this.$message.error(err || '当前组织机构下无资产标签')
        })
      },
      // 多选
      onSelectChange (selectedRowKeys){
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelectAll (selected){
        // console.log(this.selectedRowKeys)
      },
      clickAsset () {
        if(this.assetLabelOpt.length === 0) return this.$message.error('该组织机构下暂无资产标签')
        // if(this.selectedRowKeys.length <= 0) return this.$message.error('请选择要操作的车场')
        this.modalObj.status = true
      },
      // 资产设置
      handleModalOk: throttle(function() {
        let arr = this.$refs.editTagRef.checkedList
        if( this.selectedRowKeys.length <= 0){
          return this.$message.error('请选择需要设置标签的车场')
        }
        let data = {
          placeIds: this.selectedRowKeys.join(','),
          labelCode:arr.join('、')
        }
        if(!data.label) delete data.label
        this.$api.assets.updateAssetLabelConfig(data).then(res =>{
          if(res.data.code === '0'){
            this.selectedRowKeys = []
            this.queryTableData({type: ''})
            // this.$refs.editTagRef.checkedList = []
            // this.$refs.editTagRef.change()
          }
        })
        this.modalObj.status = false
      }, 3000), 
      // 点击总览数据块
      handleClickOverview ({i}) {
        this.current = i
        this.queryTableData({type: ''})
      },
      // 查看车场视图详情
      handleViewDetail (record) {
        const { organProjectBuildingValue: { organId } } = this
        const resObj = this.organOptions.filter(ele=>ele.vaslukeye = organId)[0]
        const organName = resObj ? resObj.title : ''
        record.placeId && this.$router.push({ path: '/carPrakView/detail', query: {organId, assetIds: JSON.stringify(record.assetIds), placeId: record.placeId,organName:organName }})
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        let labelName = ''
        if(this.label.length > 0 && this.assetLabelSelect.length > 0){
          labelName = this.label.map(item => {
            return this.assetLabelSelect.find(sub => sub.value === item).value
          })
          labelName = labelName.length > 0 ? labelName.join('、') : ''
        }
        const { organProjectBuildingValue: { organId, projectId: projectIdList, placeId: placeIdList }, current } = this
        
        // let statusList = this.organProjectBuildingValue.statusList.includes('all') ? [] : this.organProjectBuildingValue.statusList
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let data = {
          currentOrgan: this.onlyCurrentOrgan,
          organId, 
          placeIdList, 
          // statusList, 
          projectIdList, pageSize: pageLength,
          label: labelName, pageNum: pageNo, flag: current ? (current - 1) : ''
        }
        data.placeIdList = data.placeIdList.length === 1 && !data.placeIdList[0] ? [] : data.placeIdList
        if(labelName === '全部资产标签' || !labelName){
          delete data.label
        }
        this.$api.carPark.carParkViewPage(data).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            this.tableObj.dataSource.forEach(item => {
              let arr = Object.keys(item)
              arr.forEach(sub => {
                if(this.formatArr.includes(sub)){
                  item[sub] = getFormat(item[sub])
                }
              })
            })
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询出错')
        })
        // 查询车场面积统计数据
        if (type === 'search') { this.queryAreaInfo() }
      },

      // 查询车场视图面积概览数据
      queryAreaInfo () {
        const { organProjectBuildingValue: { organId, projectId: projectIdList }, numList, onlyCurrentOrgan } = this
        // let statusList = this.organProjectBuildingValue.statusList.includes('all') ? [] : this.organProjectBuildingValue.statusList
        this.overviewNumSpinning = true
        let ids = this.organProjectBuildingValue.placeId
        ids = ids.length === 1 && !ids[0] ? [] : ids

        this.$api.carPark.carParkViewArea({ organId , placeIdList: ids, projectIdList, currentOrgan: onlyCurrentOrgan}).then(r => {
          this.overviewNumSpinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.numList = numList.map(m => {
              return { ...m, value: res.data[m.key] }
            })
          }
          throw res.message || '查询车场视图面积使用统计出错'
        }).catch(err => {
          console.log(err)
          this.overviewNumSpinning = false
          this.$message.error(err || '查询车场视图面积使用统计出错')
        })
      },

      // 导出数据
      handleExport () {
        if (!this.tableObj.dataSource.length) {
          return this.$message.info('无可导出数据')
        }
        let labelName = ''
        if(this.label.length > 0 && this.assetLabelSelect.length > 0){
          labelName = this.label.map(item => {
            return this.assetLabelSelect.find(sub => sub.value === item).value
          })
          labelName = labelName.length > 0 ? labelName.join('、') : ''
        }

        this.exportBtnLoading = true
        const { organProjectBuildingValue: { organId, projectId: projectIdList, placeId: placeIdList}, current } = this
        // let statusList = this.organProjectBuildingValue.statusList.includes('all') ? [] : this.organProjectBuildingValue.statusList
        let data = {organId, placeIdList, projectIdList, label: labelName, flag: current ? (current - 1) : ''}
        if(labelName === '全部资产标签' || !labelName){
          delete data.label
        }
        this.$api.carPark.carParkViewExcel(data ).then(res => {
          this.exportBtnLoading = false
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = '车场视图导出列表.xls'
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message || '导出车场视图失败'
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '导出车场视图失败')
        })
      },

      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 查询组织机构对应的车场数据
      queryBuildingList (val) {
        const { organProjectBuildingValue: { organId } , projectId} = this
        // 清空组织机构，重置车场选项
        if (!organId) { return this.$message.warn('组织机构不存在') }
        this.buildingOptions = []
        this.organProjectBuildingValue.buildingId = undefined      
        if(val !== 'project') this.getAssetLabel(organId)
        this.$api.carPark.organPlace({organId,projectIds: projectId ? projectId.join(',') : ''})
        .then(r => { // 查询当前组织机构下所有的楼栋 后面改成查询所有车场
          let res = r.data
          if (res && String(res.code) === '0') {
            this.buildingOptions = (res.data || []).map(item => {
              return {
                key: item.placeId,
                title: item.placeName
              }
            })
            this.buildingOptions.unshift({key: '', title: '全部车场'})
            this.queryTableData({type: 'search'})
            return false
          }
          throw res.message || '查询车场失败'
        }).catch(err => {
          this.$message.error(err || '查询车场失败')
        })
      },

      // 查询一级组织机构
      queryOrganList (init) {
        this.$api.assets.queryAsynOrganByUserId({parentOrganId: '', typeFilter: ''}).then(res => {
          if (Number(res.data.code) === 0) {
            let list = res.data.data || []
            let id = list[0] ? list[0].organId : undefined
            this.organProjectBuildingValue.organId = id

            // this.getAssetLabel(this.organProjectBuildingValue.organId)
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
    // watch: {
    //   organProjectBuildingValue: {
    //     handler: function (val) {
    //       val && val.organId && this.queryTableData({type: 'search'})
    //     },
    //     deep: true
    //   }
    // }
  }
</script>

<style lang='less' scoped>
  .custom-table {
    padding-bottom: 70px;
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
  }
  /deep/ .sg-FooterPagination{
    z-index: 2;
  }
</style>