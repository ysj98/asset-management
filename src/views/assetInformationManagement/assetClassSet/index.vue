<!--
  资产分类设置
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="btns">
        <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
      </div>
      <div slot="form">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select
          :style="allStyle"
          v-model="status"
          :options="statusOptions"
          @change="queryClick"
        ></a-select>
        <a-input-search placeholder="类别名称/编码" :style="allStyle" v-model="codeName" @search="queryClick" />
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="record.operationData" :record="record" @operationFun="operationFun"></OperationPopover>
        </template>
        <template slot="statusName" slot-scope="text, record, index">
          <SG-Switch disabled checked  :id="index" v-if="text === '启用'">启用</SG-Switch>
          <SG-Switch disabled :id="index" v-else>停用</SG-Switch>
        </template>
      </a-table>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @input="handlePageChange"
    />
  </div>
</template>

<script>
import segiIcon from '@/components/segiIcon.vue'
import TreeSelect from '../../common/treeSelect'

const columns = [
  {
    title: '分类编号',
    dataIndex: 'categoryConfId',
    width: '160'
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: '200'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160'
  },
  {
    title: '分类名称',
    dataIndex: 'professionName',
    width: '160'
  },
  {
    title: '分类编码',
    dataIndex: 'professionCode',
    width: '160'
  },
  {
    title: '计量单位',
    dataIndex: 'unit',
    width: '160'
  },
  {
    title: '净残值率(%)',
    dataIndex: 'netSalvageRate',
    width: '160'
  },
  {
    title: '折旧方法',
    dataIndex: 'depreciationMethod',
    width: '160'
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: '180',
    scopedSlots: { customRender: 'statusName' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
const operationData = [
  {iconType: 'form', text: '编辑', editType: 'edit'},
  {iconType: 'bars', text: '详情', editType: 'detail'}
]

export default {
  components: {
    segiIcon, TreeSelect
  },
  data () {
    return {
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      organName: '',
      status: '',
      statusOptions: [
        {label: '全部状态', value: ''},
        {label: '启用', value: '1'},
        {label: '停用', value: '2'}
      ],
      codeName: '',
      columns,
      dataSource: [],
      operationData,
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      loading: false
    }
  },
  methods: {
    changeTree (value, label) {
      this.organName = label
      this.organId = value
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (pageNo) {
      this.paginator.pageNo = pageNo
    },
    // 操作回调
    operationFun (editType) {
      console.log(editType)
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    // 查询列表
    queryList () {
      console.log('query')
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.assets.getPage(form).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>