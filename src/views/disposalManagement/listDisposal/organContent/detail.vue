<template>
  <div class="detail">
    <SG-Title title="资产项目处置详情" />
    <overview-number :numList="numList" />
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="tableInfo.columns"
        :dataSource="tableInfo.tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
      </a-table>
      <no-data-tips v-show="tableInfo.tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="queryCondition.count"
        :location="tableInfo.location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
const columns = [
  {
    title: '管理机构',
    dataIndex: 'organName'
  },
  {
    title: '处置数量',
    dataIndex: 'dispNum'
  },
  {
    title: '处置面积(㎡)',
    dataIndex: 'dispArea'
  },
  {
    title: '处置收入(元)',
    dataIndex: 'disposeReceive'
  },
  {
    title: '处置成本(元)',
    dataIndex: 'disposeCost'
  }
]
export default {
  name: 'organDetail',
  components: {
    OverviewNumber,
    noDataTips
  },
  props: {
    // queryInfo: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data () {
    return {
      loading: false,
      noPageTools: false,
      tableInfo: {
        location: 'absolute',
        columns,
        tableData: []
      },
      queryCondition: {
        pageNum: 1,     // 当前页
        pageSize: 10,
        count: 0    // 每页显示记录数
      },
      numList: [
        {title: '资产数量(个)', key: 'assetCount', value: 0, fontColor: '#324057'},
        {title: '处置面积(㎡)', key: 'area', value: 0, bgColor: '#4BD288'},
        {title: '处置收入(元)', key: 'transferOperationArea', value: 0, bgColor: '#1890FF'},
        {title: '处置成本(元)', key: 'idleArea', value: 0, bgColor: '#DD81E6'}
      ],  // 概览数字数据, title 标题，value 数值，bgColor 背景色
      queryInfo: {}
    }
  },
  watch: {
    queryInfo: {
      handler (val) {
        if (val.organId) {
          this.query()
          this.getDispOrgStatProDetail()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    judgmentMethodFn (val) {
      if (val === '') {
        return []
      } else if (val.length > 0 && val[0] !== '') {
        return val
      } else if (val.length === 1 && val[0] === '') {
        return []
      } else {
        return val
      }
    },
    // 查询
    query (type) {
      this.loading = true
      let params = Object.assign({}, this.queryInfo)
      params.pageNum = this.queryCondition.pageNum
      params.pageSize = this.queryCondition.pageSize
      this.$api.disposalManagement.getDispOrgProDetListPage(params).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
            })
            this.tableInfo.tableData = data
            this.queryCondition.count = res.data.data.count
          } else {
            this.tableInfo.tableData = []
            this.queryCondition.count = 0
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.queryCondition.count = 0
          this.loading = false
        }
      })
    },
    // 查询概况
    getDispOrgStatProDetail () {
      this.numList[0].value = 0
      this.numList[1].value = 0
      this.numList[2].value = 0
      this.numList[3].value = 0
      // let params = {
      //   organId: Number(this.queryInfo.organId),      // 组织机构id
      //   approvalStatusList: this.queryInfo.approvalStatusList,        // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
      //   disposeDateStart: this.queryInfo.disposeDateStart,   // 处置日期,开始
      //   disposeDateEnd: this.queryInfo.disposeDateEnd,     // 处置日期,结束
      //   assetTypeList: this.queryInfo.assetTypeList,                  //类型：String  可有字段  资产类型Id
      //   disposeModeList: this.queryInfo.disposeModeList,              // 处置方式
      //   disposeTypeList: this.queryInfo.disposeTypeList
      // }
      this.$api.disposalManagement.getDispOrgStatProDetail(this.queryInfo).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.numList[0].value = data.dispNum ? data.dispNum : 0
          this.numList[1].value = data.dispArea ? data.dispArea : 0
          this.numList[2].value = data.disposeReceive ? data.disposeReceive : 0
          this.numList[3].value = data.disposeCost ? data.disposeCost : 0
        } else {
          this.$message.error(res.data.message)
        }
      }, res => {
        this.$message.error(res.data.message)
      })
    }
  },
  created () {
    this.queryInfo = this.$route.query.queryInfo ? JSON.parse(this.$route.query.queryInfo) : {}
  }
}
</script>

<style lang="less">
  .sg-title {
    padding-left: 30px;
  }
</style>
