<!--
  资产项目视图列表页-戚思婷
-->
<template>
  <div class="asset-project-view-list" style="overflow-x: hidden">
    <a-row :gutter="8" style="padding: 20px 30px">
      <a-col :span="10">
        <SG-Button
          icon="import"
          type="primary"
          @click="handleExport"
          v-power="ASSET_MANAGEMENT.LAND_PROJECT_EXPORT"
          :loading="exportBtnLoading"
        >导出资产项目视图</SG-Button>
      </a-col>
      <a-col :span="3">
        <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
      </a-col>
      <a-col :span="3">
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="assetProject"
          :options="assetProjectOptions"
          :filterOption="filterOption"
        ></a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          v-model="statusList"
          mode="multiple"
          :maxTagCount="1"
          style="width: 100%"
          placeholder="请选择资产状态"
          :options="statusListOpt"
        />
      </a-col>
      <a-col :span="3">
        <a-checkbox style="line-height: 32px; margin-right: 5px" :checked="onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">仅选择当前机构下资产项目</a-checkbox>
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </a-col>
    </a-row>
    <!--概览-->
    <overview-number :numList="numList" isEmit @click="handleClickOverview"/>
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
import { ASSET_MANAGEMENT } from "@/config/config.power";
import TreeSelect from '../../common/treeSelect'
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'

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
    title: '管理机构',
    dataIndex: 'organName',
    width: 150
  },
  {
    title: '来源方式',
    dataIndex: 'sourceTypeName',
    width: 130
  },
  {
    title: '来源渠道',
    dataIndex: 'souceChannelType',
    width: 130
  },
  {
    title: '接管时间',
    dataIndex: 'takeOverDate',
    width: 130
  },
  {
    title: '土地面积(㎡)',
    dataIndex: 'landArea',
    width: 130
  },
  {
    title: '土地数量',
    dataIndex: 'landCount',
    width: 130
  },
  {
    title: '运营(㎡)',
    dataIndex: 'transferOperationArea',
    width: 130
  },
  {
    title: '自用(㎡)',
    dataIndex: 'selfUserArea',
    width: 130
  },
  {
    title: '闲置(㎡)',
    dataIndex: 'idleArea',
    width: 130
  },
  {
    title: '占用(㎡)',
    dataIndex: 'occupationArea',
    width: 130
  },
  {
    title: '其他(㎡)',
    dataIndex: 'otherArea',
    width: 130
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
    TreeSelect, noDataTips, OverviewNumber
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      allStyle: 'width: 100%; margin-right: 10px;',
      organId: '',
      assetProject: '',
      assetProjectOptions: [],
      onlyCurrentOrgan: false,
      exportBtnLoading: false, // 导出按钮
      numList: [
        {title: '土地数量', key: 'landCount', value: 0, fontColor: '#324057'}, {title: '土地面积(㎡)', key: 'measuredArea', value: 0, bgColor: '#FD7474'}, {title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288'},
        {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
        {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'}
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
      current: null, // 当前选中的概览区域下标，与后台入参一一对应
      statusList: [], // 资产分类
      statusListOpt: [
        { title: "全部状态", key: "all" },
        { title: "待入库", key: "0" },
        { title: "正常", key: "1" },
        { title: "报废", key: "2" },
        { title: "转让", key: "3" },
        { title: "报损", key: "4" },
      ],
    }
  },
  watch: {
    // 全选与其他选项互斥处理
    statusList: function (val) {
      if (val && val.length !== 1 && val.includes("all")) {
        this.statusList = ["all"];
      }
    },
  },
  methods: {
    // 点击总览数据块
    handleClickOverview({i}) {
      let currentTemp = 0
      if (i === 1) {
        currentTemp = 5
      } else if (i > 1) {
        currentTemp = i - 1
      }
      this.current = currentTemp
      this.queryClick()
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
      this.$router.push({path: '/landProjectView/detail', query: {projectId: record.projectId}})
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
      let {assetProject, organId, sumObj, onlyCurrentOrgan, paginator: {pageNo, pageLength}, current} = this
      let form = {
        organId,
        pageNum: pageNo,
        pageSize: pageLength,
        projectId: assetProject,
        isCurrent: onlyCurrentOrgan,
        flag: current ? (current - 1) : null,
        statusList: this.statusList.includes("all") ? [] : this.statusList
      }
      return this.$api.land.viewGetAssetLandList(form).then(res => {
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
          if (type !== 'click' && this.dataSource.length) {
            this.dataSource.push({...sumObj, projectCode: '所有页-合计', key: Date.now() + 100})
          }
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询汇总信息
    queryStatistics () {
      let form = {
        statusList: this.statusList.includes("all") ? [] : this.statusList,
        organId: this.organId,
        projectId: this.assetProject,
        isCurrent: this.onlyCurrentOrgan,
        flag: this.current ? (this.current - 1) : null
      }
      this.$api.land.viewGetAssetLandStatistics(form).then(res => {
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
          dataSource.length && this.dataSource.push({...sumObj, projectCode: '所有页-合计', key: Date.now()})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 导出数据
    handleExport() {
      this.exportBtnLoading = true;
      const { organId, current, assetProject, onlyCurrentOrgan } = this;
      this.$api.land
        .viewGetAssetLandExport({
          organId,
          projectId: assetProject,
          isCurrent: onlyCurrentOrgan,
          statusList: this.statusList.includes("all") ? [] : this.statusList,
          flag: current ? current - 1 : ""
        })
        .then((res) => {
          this.exportBtnLoading = false;
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([res.data]));
            a.download = "资产项目视图导出列表.xls";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            return a.remove();
          }
          throw res.message || "导出资产项目视图失败";
        })
        .catch((err) => {
          this.exportBtnLoading = false;
          this.$message.error(err || "导出资产项目视图失败");
        });
    },
    // 查询项目
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
  .custom-table {
    padding-bottom: 50px;
    & /deep/ table {
      tr:last-child, tr:nth-last-child(2) {
        font-weight: bold;
      }
    }
  }
</style>
