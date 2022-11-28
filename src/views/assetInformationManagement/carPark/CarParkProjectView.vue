<!-- 车场台账 - 车场项目视图 -->
<template>
  <div class="car-project-view-list">
    <SG-SearchContainer background="white">
      <div slot="headBtns">
        <SG-Button
          icon="import"
          type="primary"
          @click="handleExport"
          :loading='exportBtnLoading'
          v-power="ASSET_MANAGEMENT.CARPARK_PROJECT_VIEW_EXPORT"
        >导出</SG-Button>
      </div>
      <div slot="headRight">
        <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle" :showSearch='true' :multiple="true" :treeCheckable="true"></treeSelect>
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="assetProject"
          :options="$addTitle(assetProjectOptions)"
          :filterOption="filterOption"
        ></a-select>
        <!-- <a-select
          mode="multiple"
          :maxTagCount="1"
          v-model="status"
          :style="allStyle"
          @change="statusChange"
          :options="$addTitle(statusOptions)"
          placeholder="请选择资产状态"
        /> -->
        <a-checkbox style="line-height: 32px; margin-right: 5px" :checked="onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">仅选择当前机构下资产项目</a-checkbox>
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
    </SG-SearchContainer>
    <!--概览-->
    <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table pb70 car"
        :pagination="false"
        :scroll="scroll"
        size="middle"
        :customRow="customRow">
        <template slot="operation" slot-scope="text, record">
          <a
            v-if="record.projectCode !== '当前页-合计' && record.projectCode !== '所有页-合计'"
            class="operation-btn" @click="toDetail(record)"
          >详情</a>
        </template>
        <template slot="organName" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <span>{{text}}</span>
            </template>
            <span>{{text}}</span>
          </a-popover>
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
import TreeSelect from '@/views/common/treeSelect'
import noDataTips from '@/components/noDataTips'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import OverviewNumber from 'src/views/common/OverviewNumber'
import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
import { getFormat } from '../../../utils/utils'
import { handleTableScrollHeight } from "@/utils/share";
const columns = [
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: 160,
    fixed: 'left'
  },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
    width: 140,
    fixed: 'left'
  },
  {
    title: '接管机构',
    dataIndex: 'organName',
    width: 120,
    scopedSlots: { customRender: 'organName' },
  },
  {
    title: '来源方式',
    dataIndex: 'sourceTypeName',
    width: 120
  },
  {
    title: '来源渠道',
    dataIndex: 'souceChannelType',
    width: 120
  },
  {
    title: '接管时间',
    dataIndex: 'takeOverDate',
    width: 100
  },
  // {
  //   title: '接管人',
  //   dataIndex: 'receiver',
  //   width: 100
  // },
  {
    title: '车场面积(㎡)',
    dataIndex: 'area',
    width: 100
  },
  {
    title: '车场数量',
    dataIndex: 'placeNum',
    width: 100
  },
  {
    title: '车位数量',
    dataIndex: 'assetNum',
    width: 100
  },
  {
    title: '运营(㎡)',
    dataIndex: 'transferOperationArea',
    width: 100
  },
  {
    title: '自用(㎡)',
    dataIndex: 'selfUserArea',
    width: 100
  },
  {
    title: '闲置(㎡)',
    dataIndex: 'idleArea',
    width: 100
  },
  {
    title: '占用(㎡)',
    dataIndex: 'occupationArea',
    width: 100
  },
  {
    title: '其他(㎡)',
    dataIndex: 'otherArea',
    width: 100
  },
  {
    title: '资产原值',
    dataIndex: 'originalValue',
    width: 120
  },
  {
    title: '最新估值',
    dataIndex: 'marketValue',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
  components: {
    TreeSelect, noDataTips, OverviewNumber
  },
  data () {
    return {
      scroll: { x: 1900, y: 'calc(100vh - 336px)' },
      ASSET_MANAGEMENT, // 权限对象
      allStyle: 'width: 170px; margin-right: 10px;',
      organId: '',
      assetProject: '',
      assetProjectOptions: [],
      onlyCurrentOrgan: false,
      status: 'all',
      exportBtnLoading: false, // 导出button loading标志
      statusOptions: [
        { title: '全部资产状态', key: 'all' }, { title: '待入库', key: '0' }, { title: '正常', key: '1' },
        { title: '报废', key: '2' }, { title: '已转让', key: '3' }, { title: '报损', key: '4' },
        { title: '入库中', key: '7' }
      ], // 查询条件-资产状态选项
      numList: [
        {title: '车场数量',  key: 'placeNum', value: 0, fontColor: '#324057'},
        {title: '车场总面积(㎡)', key: 'measuredArea', value: 0, bgColor: '#4BD288'}, {title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#1890FF'},
        {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#DD81E6'}, {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#BBC8D6'},
        {title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474'}, 
        {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#4BD288'}, 
        {title: '资产原值(元)', key: 'originalValue', value: 0, bgColor: '#1890FF'}, 
        {title: '最新估值(元)', key: 'marketValue', value: 0, bgColor: '#DD81E6'}, 
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      columns,
      dataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      showNoDataTips: false,
      sumObj: {
        area: '', buildNum: '', assetNum: '', transferOperationArea: '', selfUserArea: '',
        idleArea: '', occupationArea: '', otherArea: '', originalValue: '', marketValue: ''
      }, // 求和用的对象
      formatArr: ['area', 'transferOperationArea', 'selfUserArea', 'idleArea', 'occupationArea', 'otherArea', 'originalValue', 'marketValue', 'placeNum'],
      current: null // 当前选中的概览区域下标，与后台入参一一对应
    }
  },
  methods: {
    customRow (record, index) {
      return {
        class: {
          'text_hidden':record
        },
      }    
    },
    // 导出
    handleExport () {
      this.exportBtnLoading = true
      exportDataAsExcel(
        this.queryList('export'), this.$api.carPark.carParkProjectExPort, '资产项目视图列表.xls', this
      ).finally(() => this.exportBtnLoading = false)
    },

    // 全选与其他选项互斥处理
    statusChange (value) {
      let lastIndex = value.length - 1
      this.status = value[lastIndex] === 'all' ? ['all'] : value.filter(m => m !== 'all')
    },

    // 点击总览数据块
    handleClickOverview({i}) {
      this.current = i
      // this.queryClick()
      this.queryList('click')
    },

    changeTree (value) {
      this.organId = value
      this.getAssetProjectOptions()
      this.queryClick()
    },
    // 复选框发生变化
    onOnlyCurrentOrganChange (event) {
      this.onlyCurrentOrgan = event.target.checked
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    toDetail (record) {
      this.$router.push({path: '/carPrakProjectView/detail', query: {projectId: record.projectId}})
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList('click').then(() => this.queryStatistics())
    },
    queryList (type) {
      let {assetProject, organId, sumObj, onlyCurrentOrgan, paginator: {pageNo, pageLength}, current, status} = this
      let form = {
        organIds: organId.toString(),
        pageNum: pageNo,
        pageSize: pageLength,
        projectId: assetProject,
        isCurrent: onlyCurrentOrgan,
        flag: current ? (current - 2) : null,
        statusList: status.includes('all') ? [] : status
      }
      if (type === 'export') {
        return form
      }
      return this.$api.carPark.viewGetCarParkList(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          if (data.length === 0) {
            this.showNoDataTips = true
          } else {
            this.showNoDataTips = false
          }
          let pageSum = {}
          data.forEach((item, index) => {
            item.key = index
            Object.keys(sumObj).forEach(key => {
              !pageSum[key] && (pageSum[key] = 0)
              pageSum[key] += item[key] ? Number(item[key]) : 0
              if (index === data.length - 1) { pageSum[key] = pageSum[key].toFixed(2)}
            })
            for (let key in item) {
              item[key] = item[key] || '--'
            }
          })
          this.dataSource = data.length ? data.concat({...pageSum, projectCode: '当前页-合计', key: Date.now()}) : []
          this.dataSource.forEach(item => {
            let arr = Object.keys(item)
            arr.forEach(sub => {
              if(this.formatArr.includes(sub)) {
                item[sub] = getFormat(item[sub])
              }
            })
          })
          if (type !== 'click' && this.dataSource.length) {
            this.dataSource.push({...sumObj, projectCode: '所有页-合计', key: Date.now() + 100})
          }
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    queryStatistics () {
      let form = {
        organIds: this.organId.toString(),
        projectId: this.assetProject,
        isCurrent: this.onlyCurrentOrgan,
        flag: this.current ? (this.current - 1) : null
      }
      this.$api.carPark.getAssetCarParkStatistics(form).then(res => {
        if (res.data.code === '0') {
          let temp = res.data.data || {}
          let {measuredArea} = temp
          let {numList, dataSource, sumObj} = this
          this.numList = numList.map(m => {
            return {...m, value: temp[m.key] ? temp[m.key].toFixed(2) : 0}
          })
          Object.keys(sumObj).forEach(key => sumObj[key] = temp[key] ? temp[key].toFixed(2) : 0)
          sumObj.area =  measuredArea ? measuredArea.toFixed(2) : 0
          this.sumObj = sumObj
          Object.keys(this.sumObj).forEach(item => {
            this.sumObj[item] = getFormat(this.sumObj[item])
          })
          dataSource.length && this.dataSource.push({...sumObj, projectCode: '所有页-合计', key: Date.now()})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getAssetProjectOptions () {
      let form = {
        organIds: this.organId.toString()
      }
      this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
        if (res.data.code === '0') {
          let arr = [{label: '全部资产项目', value: ''}]
          res.data.data.forEach(item => {
            let obj = {
              label: item.projectName,
              value: item.projectId
            }
            arr.push(obj)
          })
          this.assetProjectOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  },
  created (){
    //handleTableScrollHeight(this.scroll, 247)
  },
}
</script>

<style lang="less" scoped>
  .custom-table {
    //padding-bottom: 70px;
    & /deep/ table {
      tr:last-child, tr:nth-last-child(2) {
        font-weight: bold;
      }
    }
  }
  /deep/.ant-table-tbody {
  tr:nth-last-child(1){
    position: sticky;
    bottom: 0;
    background: #fff;
  }
  tr:nth-last-child(2){
    position: sticky;
    bottom: 43px;
    background: #fff;
  }
}
</style>
<style lang="less">
  .car {
    .text_hidden {
      .ant-table-row-cell-break-word {
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .car .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    height: 52px !important;
  }
</style>