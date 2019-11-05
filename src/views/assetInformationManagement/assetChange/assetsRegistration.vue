<!--
  资产变动登记
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
      <a-table :columns="columns" :dataSource="data" bordered>
      </a-table>
    </div>
  </div>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import TreeSelect from '../../common/treeSelect'
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
export default {
  components: {Cephalosome, TreeSelect},
  props: {},
  data () {
    return {
      columns,
      organName: '',
      organId: '',
      data: []
    }
  },
  computed: {
  },
  methods: {
    changeTree (value, label) {
      this.organName = label
      this.organId = value
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
</style>
