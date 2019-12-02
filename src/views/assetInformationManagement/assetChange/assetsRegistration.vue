<!--
  资产变动登记
-->
<template>
  <div class="assetsRegistration">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-l">
        <a-button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_NEW" @click="newChangeSheetFn">新建变动单</a-button>
      </div>
      <div slot="col-r">
        <div class="nav">
          <a-checkbox :checked="queryCondition.currentOrgan" @change="checkboxFn">仅当前机构下资产变动单</a-checkbox>
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select :style="allStyle" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
            <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部变动类型" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.changeType">
            <a-select-option v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <!-- <SG-DatePicker label="创建日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker> -->
        <div class="box">
          <segi-range-picker label="创建日期" :defaultValue="[moment(queryCondition.startCreateDate, 'YYYY-MM-DD'), moment(queryCondition.endCreateDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>
        </div>
        <div class="nav">
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
    <div class="table-layout-fixed">
      <!--  ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
     <a-table
      :loading="loading"
      :columns="columns"
      :dataSource="tableData"
      class="custom-table td-pd10"
      :pagination="false"
      >
      <template slot="operation" slot-scope="text, record">
        <!-- <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover> -->
        <div class="tab-opt">
          <span @click="operationFn(record, 'particulars')">详情</span>
          <span @click="operationFn(record, 'edit')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_EDIT">编辑</span>
          <span @click="operationFn(record, 'delete')" v-if="+record.approvalStatus === 0 || +record.approvalStatus === 3" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_DELETE">删除</span>
          <span v-if="record.approvalStatus === '2'" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_AUDIT">审核</span>
          <span @click="operationFn(record, 'delivery')" v-if="+record.changeType === 1 && !record.expiryDate || +record.changeType === 2 && !record.expiryDate" v-power="ASSET_MANAGEMENT.ASSET_CHANGE_END_DELIVERY">终止交付</span>
        </div>
      </template>
    </a-table>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      :location="location"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
    </div>
  </div>
</template>

<script>
import SegiRangePicker from '@/components/SegiRangePicker'
import Cephalosome from '@/components/Cephalosome'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {utils, debounce} from '@/utils/utils.js'
import {getCurrentDate, getThreeMonthsAgoDate} from 'utils/formatTime'
import noDataTips from '@/components/noDataTips'
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
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '变动类型',
    dataIndex: 'changeTypeName'
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName'
  },
  {
    title: '变动资产数量',
    dataIndex: 'assetChangeCount'
  },
  {
    title: '创建日期',
    dataIndex: 'createTime'
  },
  {
    title: '创建人',
    dataIndex: 'createByName'
  },
  {
    title: '变动日期',
    dataIndex: 'changeDate'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    scopedSlots: { customRender: 'operation' },
  }
]
export default {
  components: {Cephalosome, TreeSelect, SegiRangePicker, noDataTips},
  props: {},
  data () {
    return {
      // scrollHeight: {y: 0},
      ASSET_MANAGEMENT,
      isChild: false,
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
        changeType: '',            // 备注：变动类型id(多个用，分割)
        startCreateDate: getThreeMonthsAgoDate(),       // 备注：开始创建日期
        endCreateDate: getCurrentDate(),         // 备注：结束创建日期
        currentOrgan: false            // 备注：仅当前机构下资产清理单 0 否 1 是
      },
      // defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      count: '',
      changeTypeData: [],
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
    moment,
    // 起止日期发生变化
    onDateChange (val) {
      this.queryCondition.startCreateDate = val[0]
      this.queryCondition.endCreateDate = val[1]
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 新建变动单
    newChangeSheetFn () {
      let recordData = JSON.stringify([{value: this.queryCondition.organId, name: this.organName}])
      this.$router.push({path: '/assetChange/newEditSingle', query: { record: recordData, setType: 'new' }})
    },
    // 操作
    operationFn (val, str) {
      // 详情
      if (str === 'particulars') {
        let particularsData = JSON.stringify([val])
        // this.goPage()
        this.$router.push({path: '/assetChange/particulars', query: { record: particularsData }})
      } else if (str === 'delete') {  // 删除
        this.commonFn('delete', val.changeOrderId)
      } else if (str === 'delivery') {   // 终止交付
        this.commonFn('delivery', val.changeOrderId)
      } else if (str === 'edit') {
        let recordData = JSON.stringify([{value: this.queryCondition.organId, name: this.organName}])
        let enitData = JSON.stringify([val])
        // this.goPage()
        this.$router.push({path: '/assetChange/newEditSingle', query: { record: recordData, enitData: enitData, setType: 'edit' }})
      }
    },
    // 页面跳转
    // goPage (type, record) {
    //   // 存储缓存搜索缓存数据
    //   let o = {
    //     ...this.queryCondition,
    //     isChild: true
    //   }
    //   this.SET_ROUTE_QUERY(this.$route.path, o)
    // },
    // 状态发生变化
    changeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.changeType = this.handleMultipleSelectValue(value, this.queryCondition.changeType, this.changeTypeData)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
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
    commonFn (str, id) {
      let _this = this
      // 删除
      if (str === 'delete') {
        this.$confirm({
        title: '提示',
        content: '确认要删除该资产登记单吗？',
        onOk() {
        let obj = {
          changeOrderId: id
        }
        _this.$api.assets.deleteChange(obj).then(res => {
          if (Number(res.data.code) === 0) {
            _this.$message.info('删除成功')
            _this.query()
          } else {
            _this.$message.error(res.data.message)
          }
        })
        }
      })
      // 终止交付
      } else if (str === 'delivery') {
        this.$confirm({
        title: '提示',
        content: '确认要终止交付该资产交付单吗？',
        onOk() {
          let obj = {
            changeOrderId: id
          }
          _this.$api.assets.stopDelivery(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.$message.info('终止交付成功')
              _this.query()
            } else {
              _this.$message.error(res.data.message)
            }
          })
        }
      })
      }
    },
    // 选择组织机构
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.query()
      this.getObjectKeyValueByOrganIdFn()
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
          if (str === 'asset_change_type') {
            this.changeTypeData = [{name: '全部资产项目', value: ''}, ...data]
          } else if (str === 'approval_status_type') {
            this.approvalStatusData = [...data]
            let status = []
            this.approvalStatusData.forEach(item => {
              status.push(item.value)
            })
            this.queryCondition.approvalStatus = status
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.currentOrgan = e.target.checked
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // // 计算滚动条宽度
    // computedHeight () {
    //   let elem = this.$refs.table_box
    //   if (!elem) {
    //     return
    //   }
    //   let height = utils.AdjustHeight(elem)
    //   let y = parseFloat(height) < 200 || !height ? 200 : parseFloat(height)
    //   this.scrollHeight = {y: y - 70 - 40}
    //   console.log(this.scrollHeight, '-=-=-=')
    // },
    // // 防抖函数
    // debounceMothed: debounce(function () {
    //   this.computedHeight()
    // }, 200),
    // 查询
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectId: this.queryCondition.projectId,            // 资产项目Id
        organId: this.queryCondition.organId,                // 组织机构id this.queryCondition.organId,
        multiChangeType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '',  // 变动类型id(多个用，分割)
        startCreateDate: this.queryCondition.startCreateDate,         // 开始创建日期
        endCreateDate: this.queryCondition.endCreateDate,             // 结束创建日期
        currentOrganId: this.queryCondition.currentOrgan ? 1 : 0                // 仅当前机构下资产清理单 0 否 1 是
      }
      this.$api.assets.getChangePage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
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
      if (this.$route.path === '/assetChange' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
      // // 每次进来获取页面高度
      // if (this.$route.path === '/assetChange') {
      //   this.computedHeight()
      //   window.addEventListener('resize', () => {
      //     this.debounceMothed()
      //   })
      // }
    }
  },
  // created () {
  //   let query = this.GET_ROUTE_QUERY(this.$route.path)
  //   if (Object.keys(query).length > 0) {
  //     this.queryCondition.approvalStatus = query.approvalStatus
  //     this.queryCondition.pageNum = query.pageNum
  //     this.queryCondition.pageSize = query.pageSize
  //     this.queryCondition.projectId = query.projectId
  //     this.queryCondition.changeType = query.changeType
  //     this.queryCondition.startCreateDate = query.startCreateDate
  //     this.queryCondition.endCreateDate = query.endCreateDate
  //     this.queryCondition.currentOrgan = query.currentOrgan
  //     this.queryCondition.organId = query.organId
  //     this.isChild = query.isChild
  //     this.query()
  //   }
  // },
  mounted () {
    // this.computedHeight()
    // window.addEventListener('resize', () => {
    //   this.debounceMothed()
    // })
    // 获取变动类型
    this.platformDictFn('asset_change_type')
    // 获取状态
    // this.platformDictFn('approval_status_type')
  }
}
</script>
<style lang="less" scoped>
.assetsRegistration {
  .box {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
}
</style>
