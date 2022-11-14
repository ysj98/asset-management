<!--
  权属人管理
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="headRight" class="search-content-box">
        <a-input placeholder="请输入权证号码" :style="allStyle" v-model="warrantNbr"  />
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle" :showSearch='true'></treeSelect>
        <a-input placeholder="请输入操作人名称" :style="allStyle" v-model="createByName"  />
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :pagination="false"
        :scroll="{y: 510}"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" @click="operationFun(record)">详情</a>
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
import {ASSET_MANAGEMENT} from '@/config/config.power'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 70
  },
  {
    title: '权证号码',
    dataIndex: 'warrantNbr',
    width: 150
  },
  {
    title: '权证类型',
    dataIndex: 'kindOfRightName',
    width: 120
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 120
  },
  {
    title: '操作人名称',
    dataIndex: 'createByName',
    width: 100
  },
  {
    title: '手机号',
    dataIndex: 'createAccount',
    width: 120
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 70,
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  components: {
   noDataTips, TreeSelect
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      warrantNbr: '',
      createByName: '',
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      organName: '',
      ownerName: '', // 权属人名称
      columns,
      dataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      modalType: 'new', // 弹窗类型
      ownerId: '', // 权属人id
      showNoDataTips: false,
      exportBtnLoading: false // 导出按钮loading
    }
  },
  methods: {
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.organId = value
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (page) {
      console.log(page, 'pagepagepage')
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 操作回调
    operationFun (record) {
      this.$router.push({path: '/ownershipChangeLog/detail', query: {warrantNbr: record.warrantNbr, kindOfRightName: record.kindOfRightName, logId: record.logId}})
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    // 查询列表
    queryList (type) {
      let form = {
        organId: this.organId,
        warrantNbr: this.warrantNbr,
        createByName: this.createByName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.ownership.logList(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data || []
          if (data.length === 0) {
            this.showNoDataTips = true
          } else {
            this.showNoDataTips = false
          }
          data.forEach((item, index) => {
            item.key = index
            item.index = index + 1 + ((this.paginator.pageNo - 1) * this.paginator.pageLength)
            for (let key in item) {
              if (item[key] === '') {
                item[key] = '--'
              }
            }
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
  .custom-table {
    padding-bottom: 50px;
  }
  .search-content-box {
    div {
      display: inline-block;
    }
  }
</style>
