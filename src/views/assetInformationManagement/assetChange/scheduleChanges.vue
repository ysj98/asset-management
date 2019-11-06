<!--
  资产变动一览表
-->
<template>
  <div class="assetsRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn">
      <div slot="headerBtns">
        <SG-Button type="primary"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-input-search placeholder="资产名称/编码" style="width: 140px; margin-right: 10px;" @search="onSearch" />
      </div>
      <div slot="contentForm">
        <div>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            :tokenSeparators="[',']"
            placeholder="全部状态"
            :defaultValue="queryCondition.approvalStatus"
            style="width: 200px"
          >
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <div>
          234
        </div>
      </div>
    </SearchContainer>
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
// import Cephalosome from '@/components/Cephalosome'
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import OperationPopover from '@/components/OperationPopover'
import segiIcon from '@/components/segiIcon.vue'
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
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '草稿',
    value: '0'
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已驳回',
    value: '3'
  },
  {
    name: '已审批',
    value: '1'
  },
  {
    name: '已取消',
    value: '4'
  }
]
export default {
  components: {SearchContainer, TreeSelect, OperationPopover, segiIcon},
  props: {},
  data () {
    return {
      allStyle: 'width: 170px; margin-right: 10px;',
      toggle: true,
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
      operationData: [...operationData],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {
        approvalStatus: ['']
      }
    }
  },
  computed: {
  },
  methods: {
    changeTree (value, label) {
      this.organName = label
      this.organId = value
    },
    // 详情
    operationFun () {},
    // 搜索
    onSearch () {},
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
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
