<!--
  资产项目视图列表页-戚思婷
-->
<template>
  <div class="asset-project-view-list">
    <SG-SearchContainer background="white">
      <div slot="form">
        <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="assetProject"
          :options="assetProjectOptions"
          :filterOption="filterOption"
        ></a-select>
        <a-checkbox style="line-height: 32px; margin-right: 5px" :checked="onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">仅选择当前机构下资产项目</a-checkbox>
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
    </SG-SearchContainer>
    <div class="asset-project-header">
      <a-row>
        <a-col v-for="(item,index) in assetStatistics" :key="index" :span="4">
          <div class="asset-project-item">
            <div class="asset-project-item-title">{{item.title}}</div>
            <div class="asset-project-item-number">{{item.area}}</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :pagination="false"
        :scroll="{ x: 1900 }">
        <template slot="operation" slot-scope="text, record">
          <a
            v-if="record.projectCode !== '当前页-合计' && record.projectCode !== '所有页-合计'"
            class="operation-btn" @click="toDetail(record)"
          >详情</a>
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
import TreeSelect from '../../common/treeSelect'
import noDataTips from '@/components/noDataTips'

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
    width: 120
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
  {
    title: '建筑面积(㎡)',
    dataIndex: 'area',
    width: 100
  },
  {
    title: '楼栋数',
    dataIndex: 'buildNum',
    width: 100
  },
  {
    title: '资产数量',
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
    fixed: 'right'
  }
]

export default {
  components: {
    TreeSelect, noDataTips
  },
  data () {
    return {
      allStyle: 'width: 170px; margin-right: 10px;',
      organId: '',
      assetProject: '',
      assetProjectOptions: [],
      onlyCurrentOrgan: false,
      assetStatistics: [
        {title: '所有资产(㎡)', area: ''},
        {title: '运营(㎡)', area: ''},
        {title: '闲置(㎡)', area: ''},
        {title: '自用(㎡)', area: ''},
        {title: '占用(㎡)', area: ''},
        {title: '其他(㎡)', area: ''},
      ],
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
      } // 求和用的对象
    }
  },
  methods: {
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
      this.$router.push({path: '/houseStandingBook/assetProjectViewDetail', query: {projectId: record.projectId}})
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
      let {assetProject, organId, sumObj, onlyCurrentOrgan, paginator: {pageNo, pageLength}} = this
      let form = {
        organId,
        pageNum: pageNo,
        pageSize: pageLength,
        projectId: assetProject,
        isCurrent: onlyCurrentOrgan
      }
      return this.$api.assets.viewGetAssetHouseList(form).then(res => {
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
              pageSum[key] = Number(pageSum[key].toFixed(2))
            })
            for (let key in item) {
              item[key] = item[key] || '--'
            }
          })
          this.dataSource = data.length ? data.concat({...pageSum, projectCode: '当前页-合计', key: Date.now()}) : []
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
        organId: this.organId,
        projectId: this.assetProject,
        isCurrent: this.onlyCurrentOrgan
      }
      this.$api.assets.viewGetAssetHouseStatistics(form).then(res => {
        if (res.data.code === '0') {
          let temp = res.data.data || {}
          let {measuredArea, transferOperationArea, idleArea, selfUserArea, occupationArea, otherArea} = temp
          this.assetStatistics[0].area = measuredArea ? measuredArea.toFixed(2) : 0
          this.assetStatistics[1].area = transferOperationArea ? transferOperationArea.toFixed(2) : 0
          this.assetStatistics[2].area = idleArea ? idleArea.toFixed(2) : 0
          this.assetStatistics[3].area = selfUserArea ? selfUserArea.toFixed(2) : 0
          this.assetStatistics[4].area = occupationArea ? occupationArea.toFixed(2) : 0
          this.assetStatistics[5].area = otherArea ? otherArea.toFixed(2) : 0
          Object.keys(this.sumObj).forEach(key => this['sumObj'][key] = temp[key] ? temp[key].toFixed(2) : 0)
          this.dataSource.length && this.dataSource.push({...this.sumObj, projectCode: '所有页-合计', key: Date.now()})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getAssetProjectOptions () {
      let form = {
        organId: this.organId
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
  }
}
</script>

<style lang="less" scoped>
  .asset-project-header {
    border-top: 1px solid #EFF2F7;
    .asset-project-item {
      /*height: 80px;*/
      padding: 18px 0;
      text-align: center;
      color: white;
      border-right: 1px solid #EFF2F7;
      .asset-project-item-title {
        font-size: 14px;
        margin-bottom: 10px;
      }
      .asset-project-item-number {
        font-size: 20px;
        font-weight:bold;
        color: #324057 !important;
      }
    }
    .ant-col-4 {
      &:nth-child(1) .asset-project-item{
        background: white;
        color: #49505E;
      }
      &:nth-child(2) {
        background: #1EC76A;
      }
      &:nth-child(3) {
        background: #46A6FF;
      }
      &:nth-child(4) {
        background: #E49AEB;
      }
      &:nth-child(5) {
        background: #FD9090;
      }
      &:nth-child(6) {
        background: #BBC8D6;
      }
    }
  }
  .custom-table {
    padding-bottom: 50px;
    & /deep/ table {
      tr:last-child, tr:nth-last-child(2) {
        font-weight: bold;
      }
    }
  }
</style>
