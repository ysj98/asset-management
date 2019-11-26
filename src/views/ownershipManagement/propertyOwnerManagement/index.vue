<!--
  权属人管理
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="btns">
        <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="icon-right"/>新建权属人</SG-Button>
      </div>
      <div slot="form">
        <topOrganByUser @change="organIdChange" :formStyle="allStyle" v-model="organId" :hasAll="false" :selectFirst="true"/>
        <a-input-search placeholder="权属人名称" :style="allStyle" v-model="ownerName" @search="queryClick" />
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <!--<OperationPopover :operationData="record.operationData" :record="record" @operationFun="operationFun"></OperationPopover>-->
          <a class="operation-btn" @click="operationFun('edit', record)">编辑</a>
          <a class="operation-btn" @click="operationFun('detail', record)">详情</a>
          <a class="operation-btn" @click="operationFun('delete', record)">删除</a>
        </template>
      </a-table>
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
import segiIcon from '@/components/segiIcon.vue'
import topOrganByUser from '@/views/common/topOrganByUser'

const columns = [
  {
    title: '分类编号',
    dataIndex: 'professionId',
    width: 160
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 200
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 160
  },
  {
    title: '分类名称',
    dataIndex: 'professionName',
    width: 160
  },
  {
    title: '分类编码',
    dataIndex: 'professionCode',
    width: 160
  },
  {
    title: '计量单位',
    dataIndex: 'unitName',
    width: 160
  },
  {
    title: '净残值率(%)',
    dataIndex: 'netSalvageRate',
    width: 160
  },
  {
    title: '折旧方法',
    dataIndex: 'depreciationMethodName',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: 180,
    scopedSlots: { customRender: 'statusName' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
  components: {
    segiIcon, topOrganByUser
  },
  data () {
    return {
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      ownerName: '', // 权属人名称
      columns,
      dataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
    }
  },
  methods: {
    organIdChange (value) {
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 操作回调
    operationFun (editType, record) {
      console.log(editType)
      console.log(record)
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    // 查询列表
    queryList () {
    }
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
</style>