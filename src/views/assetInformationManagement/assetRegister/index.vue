<!--
  资产变动登记
-->
<template>
  <div class="assetRegister">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-l">
        <a-button icon="plus" type="primary" @click="newChangeSheetFn">新建登记单</a-button>
      </div>
      <div slot="col-r">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-checkbox :value="queryCondition.isCurrent" @change="checkboxFn">仅当前机构下资产变动单</a-checkbox>
        <a-select :style="allStyle" placeholder="全部资产项目" :defaultValue="queryCondition.projectId" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部变动类型" :defaultValue="queryCondition.assetType" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :defaultValue="queryCondition.approvalStatus" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker label="创建日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
      </div>
    </Cephalosome>
    <div class="table-layout-fixed">
     <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="tableData"
      class="custom-table td-pd10"
      :pagination="false"
      >
      <template slot="operation" slot-scope="text, record">
        <div class="tab-opt">
          <span @click="operationFn(record, 'particulars')">详情</span>
          <span @click="operationFn(record, 'edit')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3">编辑</span>
          <span @click="operationFn(record, 'delete')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3">删除</span>
          <span v-if="+record.approvalStatus === 2">审核</span>
          <span @click="operationFn(record, 'theAudit')" v-if="+record.approvalStatus === 1">反审核</span>
        </div>
      </template>
    </a-table>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      :location="location"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
    </div>
    <SG-Modal
      width="400px"
      v-model="commonShow"
      :title="commonTitle"
      @ok="commonFn"
    >
      <div v-if="judge === 'delete'">确认要删除该资产登记单吗？</div>
      <div v-else>确认要反审核该资产登记单吗？</div>
    </SG-Modal>
  </div>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
const approvalStatusData = [
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
const columns = [
  {
    title: '登记单编号',
    dataIndex: 'registerOrderCode'
  },
  {
    title: '管理机构',
    dataIndex: 'organName'
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetType'
  },
  {
    title: '资产数量',
    dataIndex: 'assetNum'
  },
  {
    title: '创建日期',
    dataIndex: 'createDate'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatus'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    scopedSlots: { customRender: 'operation' },
  }
]
export default {
  components: {Cephalosome, TreeSelect},
  props: {},
  data () {
    return {
      commonShow: false,
      commonTitle: '',
      judge: '',
      loading: false,
      noPageTools: true,
      location: 'absolute',
      approvalStatusData: [...approvalStatusData],
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {
        approvalStatus: ['0', '1', '2', '3', '4'],  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        pageNum: 1,                // 当前页
        pageSize: 10,               // 每页显示记录数
        projectId: '',              // 资产项目Id
        organId:1,                 // 组织机构id
        assetType: '',            // 备注：变动类型id(多个用，分割)
        createDateS: '',       // 备注：开始创建日期
        crateDateE: '',         // 备注：结束创建日期
        isCurrent: false            // 备注：仅当前机构下资产清理单 0 否 1 是
      },
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      count: '',
      assetTypeData: [
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
    // 新建变动单
    newChangeSheetFn () {
      let recordData = JSON.stringify([{value: this.queryCondition.organId, name: this.organName}])
      this.$router.push({path: '/assetRegister/newEditSingle', query: { record: recordData, setType: 'new' }})
    },
    // 操作
    operationFn (val, str) {
      // 详情
      if (str === 'particulars') {
        let particularsData = JSON.stringify([val])
        this.$router.push({path: '/assetRegister/particulars', query: { record: particularsData, setType: 'particulars' }})
      } else if (str === 'delete') {  // 删除
        this.commonTitle = '删除'
        this.registerOrderId = val.registerOrderId
        this.judge = 'delete'
        this.commonShow = true
      } else if (str === 'theAudit') {   // 反审核
        this.commonTitle = '反审核'
        this.judge = 'theAudit'
        this.registerOrderId = val.registerOrderId
        this.commonShow = true
      } else if (str === 'edit') {
        let recordData = JSON.stringify([{value: this.queryCondition.organId, name: this.organName}])
        let enitData = JSON.stringify([val])
        this.$router.push({path: '/assetRegister/newEditSingle', query: { record: recordData, enitData: enitData, setType: 'edit' }})
      }
    },
    commonFn () {
      // 删除
      if (this.judge === 'delete') {
        let obj = {
          registerOrderId: this.registerOrderId
        }
        this.$api.assets.deleteByRegisterOrderId(obj).then(res => {
          if (Number(res.data.code) === 0) {
            this.$message.error('删除成功')
            this.commonShow = false
            this.query()
          } else {
            this.$message.error(res.data.message)
            this.commonShow = false
          }
        })
      // 反审核
      } else if (this.judge === 'theAudit') {
        let obj = {
          registerOrderId: this.registerOrderId
        }
        this.$api.assets.registerOrderReAudit(obj).then(res => {
          if (Number(res.data.code) === 0) {
            this.$message.error('反审核成功')
            this.commonShow = false
            this.query()
          } else {
            this.$message.error(res.data.message)
            this.commonShow = false
          }
        })
      }
    },
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.isCurrent = e.target.checked
    },
    approvalStatusFn () {},
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 查询
    query () {
      console.log(this.defaultValue, '909090')
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        approvalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectId: this.queryCondition.projectId,            // 资产项目Id
        organId: this.queryCondition.organId,                // 组织机构id
        assetType: this.queryCondition.assetType > 0 ? this.queryCondition.assetType.join(',') : '',  // 资产类型id(多个用，分割)
        createDateS: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        crateDateE: moment(this.defaultValue[1]).format('YYYY-MM-DD'),             // 结束创建日期
        isCurrent: this.queryCondition.isCurrent               // 仅当前机构下资产清理单 0 否 1 是
      }
      this.$api.assets.getProjectListPage(obj).then(res => {
        console.log(res, '拿到的数据')
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.query()
  }
}
</script>
<style lang="less" scoped>
.assetRegister {
  .box {
    display: inline-block;
    margin-right: 10px;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
  }
}
</style>
