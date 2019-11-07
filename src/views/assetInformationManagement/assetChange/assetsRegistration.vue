<!--
  资产变动登记
-->
<template>
  <div class="assetsRegistration">
    <Cephalosome :rightCol="21" :leftCol="3">
      <div slot="col-l">
        <a-button icon="plus" type="primary">新建变动单</a-button>
      </div>
      <div slot="col-r">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-checkbox @change="checkboxFn">仅当前机构下资产变动单</a-checkbox>
        <a-select :style="allStyle" placeholder="全部资产项目" :defaultValue="queryCondition.projectId" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部变动类型" :defaultValue="queryCondition.changeType" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker label="创建日期" style="width: 232px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD" @change="changeDate"></SG-DatePicker>
        </div>
        <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
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
import moment from 'moment'
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
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      organName: '',
      organId: '',
      data: [],
      queryCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,               // 每页显示记录数
        projectId: '',              // 资产项目Id
        organId:1,                 // 组织机构id
        changeType: '',            // 备注：变动类型id(多个用，分割)
        startCreateDate: '',       // 备注：开始创建日期
        endCreateDate: '',         // 备注：结束创建日期
        currentOrgan: 0            // 备注：仅当前机构下资产清理单 0 否 1 是
      },
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      changeTypeData: [
        {
          name: '全部变动类型',
          value: ''
        }
      ],
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    changeTree (value, label) {
      this.organName = label
      this.organId = value
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.currentOrgan = e.target.checked ? 1 : 0
    },
    approvalStatusFn () {},
    changeDate () {},
    // 查询
    query () {}
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.assetsRegistration {
  .box {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
