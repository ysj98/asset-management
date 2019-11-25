<!--
  资产变动登记
-->
<template>
  <div class="assetRegister">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-l">
        <a-button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_NEW" @click="newChangeSheetFn">新建登记单</a-button>
      </div>
      <div slot="col-r">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-checkbox :checked="queryCondition.isCurrent" @change="checkboxFn">仅当前机构下资产变动单</a-checkbox>
        <a-select :style="allStyle" placeholder="全部资产项目" v-model="queryCondition.projectId">
          <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType">
          <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatus">
          <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker label="创建日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
      </div>
    </Cephalosome>
    <div class="table-layout-fixed" ref="table_box">
     <a-table
      :loading="loading"
      :scroll="scrollHeight"
      :columns="columns"
      :dataSource="tableData"
      class="custom-table td-pd10"
      :pagination="false"
      >
      <template slot="operation" slot-scope="text, record">
        <div class="tab-opt">
          <span @click="operationFn(record, 'particulars')">详情</span>
          <span @click="operationFn(record, 'edit')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_EDIT">编辑</span>
          <span @click="operationFn(record, 'delete')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_DELETE">删除</span>
          <span v-if="+record.approvalStatus === 2" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_AUDIT">审核</span>
          <span @click="operationFn(record, 'theAudit')" v-if="+record.approvalStatus === 1" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_REVERSE_AUDIT">反审核</span>
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
import {ASSET_MANAGEMENT} from '@/config/config.power'
import moment from 'moment'
import {utils, debounce} from '@/utils/utils.js'
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
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产数量',
    dataIndex: 'assetNum'
  },
  {
    title: '创建日期',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName'
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
      scrollHeight: {y: 0},
      ASSET_MANAGEMENT,
      isChild: false,
      commonShow: false,
      commonTitle: '',
      judge: '',
      loading: false,
      noPageTools: false,
      location: 'absolute',
      approvalStatusData: [...approvalStatusData],
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      organName: '',
      organId: '',
      tableData: [],
      queryCondition: {
        approvalStatus: '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
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
          name: '全部资产类型',
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
            this.$message.info('删除成功')
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
            this.$message.info('反审核成功')
            this.commonShow = false
            this.query()
          } else {
            this.$message.error(res.data.message)
            this.commonShow = false
          }
        })
      }
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
      })
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = ['']
      } else {
        let totalIndex = data.indexOf('')
        if (totalIndex > -1) {
          data.splice(totalIndex, 1)
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['']
          }
        }
      }
      return data
    },
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.getObjectKeyValueByOrganIdFn()
      if (!this.isChild) {
        this.queryCondition.pageNum = 1
        this.query()
      } else {
        this.isChild = false
      }
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.isCurrent = e.target.checked
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectData = [{name: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
       // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'approval_status_type') {
            this.approvalStatusData = [...data]
            let status = []
            this.approvalStatusData.forEach(item => {
              status.push(item.value)
            })
            this.queryCondition.approvalStatus = status
          } else if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 计算滚动条宽度
    computedHeight () {
      let elem = this.$refs.table_box
      if (!elem) {
        return
      }
      let height = utils.AdjustHeight(elem)
      let y = parseFloat(height) < 200 || !height ? 200 : parseFloat(height)
      this.scrollHeight = {y: y - 70 - 40}
      console.log(this.scrollHeight, '-=-=-=')
    },
    // 防抖函数
    debounceMothed: debounce(function () {
      this.computedHeight()
    }, 200),
    // 查询
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        approvalStatuss: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectId: this.queryCondition.projectId,            // 资产项目Id
        organId: Number(this.queryCondition.organId),                // 组织机构id
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',  // 资产类型id(多个用，分割)
        createDateS: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        crateDateE: moment(this.defaultValue[1]).format('YYYY-MM-DD'),             // 结束创建日期
        isCurrent: this.queryCondition.isCurrent               // 仅当前机构下资产清理单 0 否 1 是
      }
      this.$api.assets.getRegisterOrderListPage(obj).then(res => {
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
  watch: {
    '$route' () {
      if (this.$route.path === '/assetRegister' && this.$route.query.refresh) {
        this.query()
      }
    }
  },
  // created () {
  //   let query = this.GET_ROUTE_QUERY(this.$route.path)
  //   console.log(query, 'jiss')
  //   if (Object.keys(query).length > 0) {
  //     this.queryCondition.approvalStatus = query.approvalStatus
  //     this.queryCondition.assetType = query.assetType
  //     this.queryCondition.crateDateE = query.crateDateE
  //     this.queryCondition.createDateS = query.createDateS
  //     this.queryCondition.isCurrent = query.isCurrent
  //     this.queryCondition.organId = query.organId
  //     this.queryCondition.pageNum = query.pageNum
  //     this.queryCondition.pageSize = query.pageSize
  //     this.queryCondition.projectId = query.projectId
  //     this.isChild = query.isChild
  //     this.query()
  //   }
  // },
  // beforeRouteLeave (to, from, next) {
  //   let o = {key: this.$route.path, data: {}}
  //   if (to.path.indexOf(from.path) !== -1) {
  //     o = {
  //       key: from.path,
  //       data: {
  //         ...this.queryCondition,
  //         ...this.defaultValue,
  //         isChild: true
  //       }
  //     }
  //   }
  //   this.$store.commit('pro/SET_ROUTE_QUERY', o)
  //   next()
  // },
  mounted () {
    this.computedHeight()
    window.addEventListener('resize', () => {
      this.debounceMothed()
    })
    // 获取状态
    // this.platformDictFn('approval_status_type')
    // 资产类型
    this.platformDictFn('asset_type')
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
