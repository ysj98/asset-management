<!--
  资产变动一览表
-->
<template>
  <div class="assetsRegistration">
    <Cephalosome>
      <div slot="col-l">
        <a-button icon="plus" type="primary">新建变动单</a-button>
      </div>
      <div slot="col-r">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 150px"></treeSelect>
      </div>
    </Cephalosome>
    <div>
      <a-table
        :columns="columns"
        :dataSource="data"
        class="custom-table"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import TreeSelect from '../../common/treeSelect'
import OperationPopover from '@/components/OperationPopover'
const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%'
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%'
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
const operationData = [
  {iconType: 'form', text: '修改', editType: 'edit'},
  {iconType: 'delete', text: '删除', editType: 'delete'}
]
export default {
  components: {Cephalosome, TreeSelect, OperationPopover},
  props: {},
  data () {
    return {
      columns,
      organName: '',
      organId: '',
      data: [
        {
          key: '1',
          name: 'name',
          age: 'age',
          address: 'address'
        }
      ],
      operationData: [...operationData]
    }
  },
  computed: {
  },
  methods: {
    changeTree (value, label) {
      this.organName = label
      this.organId = value
    },
    operationFun () {}
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
</style>
