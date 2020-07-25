<!--
  权证管理
-->
<template>
  <div class="ownershipRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button icon="import" style="margin-right: 8px" @click="openImportModal">导入</SG-Button>
        <SG-Button icon="plus" type="primary" v-power="ASSET_MANAGEMENT.ASSET_ACM_NEW" @click="newChangeSheetFn">新建权证</SG-Button>
        <!-- <SG-Button icon="plus" type="primary" @click="operationFn('record', 'particulars')">详情测试</SG-Button> -->
        <!-- <SG-Button icon="plus" type="primary" @click="newChangeSheetFn">新建权证</SG-Button> -->
      </div>
      <div slot="headerForm">
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部权利类型" :tokenSeparators="[',']"  @select="kindOfRightsDataFn" v-model="queryCondition.kindOfRights">
            <a-select-option v-for="(item, index) in kindOfRightsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :style="allStyle" showSearch :filterOption="filterOption" placeholder="全部权属人" v-model="queryCondition.obligeeId">
            <a-select-option v-for="(item, index) in obligeeIdData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="statusFn" v-model="queryCondition.status">
            <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input :style="allStyle" v-model="queryCondition.warrantNbr" placeholder="请输入权证号" maxlength="30"  />
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed" ref="table_box">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
        <template slot="obligeeName" slot-scope="text, record">
          <span>{{record.obligeeName || '--'}}</span>
        </template>
        <template slot="useLimitDate" slot-scope="text, record">
          <span>{{record.useLimitDate || '--'}}</span>
        </template>
        <template slot="handoverDate" slot-scope="text, record">
          <span>{{record.handoverDate || '--'}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover> -->
          <div class="tab-opt">
            <span @click="operationFn(record, 'particulars')">详情</span>
            <span @click="operationFn(record, 'edit')" v-power="ASSET_MANAGEMENT.ASSET_ACM_EDIT">编辑</span>
            <span @click="operationFn(record, 'logout')" v-show="+record.status === 1" v-power="ASSET_MANAGEMENT.ASSET_ACM_DELETE">注销</span>
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
    <!-- 新增 -->
    <NewCard v-if="newShow" ref="newCard" @showFn="showFn" @successQuery="successQueryFn"></NewCard>
    <!-- 详情 -->
    <CardDetails ref="cardDetails" :warrantId="warrantId"></CardDetails>
    <!--导入-->
    <batch-import @upload="uploadFile" @down="downTemplate" ref="batchImport" title="权证批量导入"/>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import NewCard from './newCard.vue'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import CardDetails from './cardDetails.vue'
import noDataTips from '@/components/noDataTips'
import {utils, debounce} from '@/utils/utils.js'
import BatchImport from 'src/views/common/eportAndDownFile'
import { exportDataAsExcel } from 'src/views/common/commonQueryApi'
const allWidth = {width: '170px', 'margin-right': '10px', float: 'left', 'margin-top': '14px'}
const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '权证号码',
    dataIndex: 'warrantNbr'
  },
  {
    title: '权利类型',
    dataIndex: 'kindOfRightName'
  },
  {
    title: '权属人',
    dataIndex: 'obligeeName',
    scopedSlots: { customRender: 'obligeeName' },
  },
  {
    title: '丘地号/不动产单元号',
    dataIndex: 'lotNoEstateUnitCode'
  },
  {
    title: '坐落位置',
    dataIndex: 'seatingPosition'
  },
  {
    title: '用途',
    dataIndex: 'ownershipUseName'
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'buildArea'
  },
  {
    title: '登记日期',
    dataIndex: 'rigisterDate'
  },
  {
    title: '使用期限',
    dataIndex: 'useLimitDate',
    scopedSlots: { customRender: 'useLimitDate' },
  },
  {
    title: '交接日期',
    dataIndex: 'handoverDate',
    scopedSlots: { customRender: 'handoverDate' },
  },
  {
    title: '状态',
    dataIndex: 'statusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    scopedSlots: { customRender: 'operation' },
  }
]
const operationData = [
  {iconType: 'form', text: '修改', editType: 'edit'},
  {iconType: 'delete', text: '删除', editType: 'delete'}
]
const statusData = [
  {
    name: '全部权证状态',
    value: ''
  },
  {
    name: '已注销',
    value: '0'
  },
  {
    name: '正常',
    value: '1'
  }
]
const queryCondition =  {
    organId: '',        // 组织机构
    kindOfRights: '',   // 权利类型(多选)
    obligeeId: '',      // 权属人
    status: '',         // 权证状态
    warrantNbr: '',     // 权证号
    pageNum: 1,         // 第几页
    pageSize: 10,       // 每页显示记录数
  }
export default {
  components: {SearchContainer, TreeSelect, segiIcon, NewCard, CardDetails, noDataTips, BatchImport},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      newShow: false,
      warrantId: '',
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      kindOfRightsData: [],
      operationData: [...operationData],
      statusData: [...statusData],
      queryCondition: {...queryCondition},
      count: '',
      obligeeIdData: []
    }
  },
  computed: {
  },
  methods: {
    // 新建权证
    newChangeSheetFn () {
      this.newShow = true
      this.$nextTick(() => {
        this.$refs.newCard.show = true
        this.$refs.newCard.newFn('new', this.queryCondition.organId)
        this.$refs.newCard.selectFn()
      })
    },
    // 操作
    operationFn (val, type) {
      if (type === 'particulars') {
        this.$refs.cardDetails.query(val.warrantNbr, val.organId)
        // this.$refs.cardDetails.show = true
      } else if (type === 'edit') {
        this.newShow = true
        this.$nextTick(() => {
          this.$refs.newCard.show = true
          this.$refs.newCard.newFn('edit', val.organId)
          this.$refs.newCard.selectFn()
          this.$refs.newCard.query(val.warrantId, val.warrantNbr, val.organId)
        })
      } else if (type === 'logout') {
        let _this = this
        this.$confirm({
          title: '提示',
          content: '确认要注销该权证吗？',
          onOk() {
          let obj = {
            warrantId: val.warrantId
          }
          _this.$api.ownership.warrantDelete(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.$message.info('销该成功')
              _this.query()
            } else {
              _this.$message.error(res.data.message)
            }
          })
          }
        })
      }
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.obligeeId = ''
      this.selectFn()
      this.query()
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.flag = e.target.checked
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 权属人
    selectFn () {
      let obj = {
        organId: this.queryCondition.organId,
        obligeeName: ''
      }
      this.$api.assets.select(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.obligeeName,
              value: item.obligeeId
            })
          })
          this.obligeeIdData = [{name: '全部权属人', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权利类型
    platformDictFn () {
      let obj = {
        code: 'AMS_KIND_OF_RIGHT'
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.kindOfRightsData = [{name: '全部权利类型', value: ''}, ...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权利类型变化
    kindOfRightsDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.kindOfRights = this.handleMultipleSelectValue(value, this.queryCondition.kindOfRights, this.kindOfRightsData)
      })
    },
    // 状态发生变化
    statusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.status = this.handleMultipleSelectValue(value, this.queryCondition.status, this.statusData)
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      this.alterationDate = []
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.query()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    showFn (val) {
      this.newShow = val
    },
    successQueryFn () {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
      this.query()
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        organId: Number(this.queryCondition.organId),        // 组织机构
        kindOfRights: this.queryCondition.kindOfRights.length > 0 ? this.queryCondition.kindOfRights.join(',') : '',   // 权利类型(多选)
        obligeeId: this.queryCondition.obligeeId,       // 权属人
        status: this.queryCondition.status.length > 0 ? this.queryCondition.status.join(',') : '',         // 权证状态
        warrantNbr: this.queryCondition.warrantNbr,     // 权证号
        pageNum: this.queryCondition.pageNum,     // 当前页
        pageSize: this.queryCondition.pageSize,    // 每页显示记录数
      }
      this.$api.ownership.warrantList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.lotNoEstateUnitCode = `${item.lotNo || '--'}/${item.estateUnitCode || '--'}`
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
    },

    // 打开批量导入Modal
    openImportModal () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      this.$refs.batchImport.visible = true
    },

    // 下载导入模板文件
    downTemplate () {
      exportDataAsExcel('import_template_qszj.xlsx', this.$api.tableManage.downloadTemplate, '权证导入模板.xlsx', this)
    },

    // 批量导入
    uploadFile (file) {
      const { queryCondition: {organId} } = this
      let name = this.$SG_Message.loading({ duration: 0, content: '批量导入中' })
      let fileData = new FormData()
      fileData.append('file', file)
      let query = `?organId=${organId}`
      this.$api.tableManage.importOwnCardData(query, fileData).then(r => {
        this.$SG_Message.destroy(name)
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$SG_Message.success(res.message || '导入成功')
          this.$refs.batchImport.visible = false
          return this.query()
        }
        throw res.message
      }).catch(err => {
        this.$SG_Message.destroy(name)
        this.$SG_Message.error(err || '批量导入失败')
      })
    }
  },
  created () {
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/authorityCardManagement' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    // 权利类型
    this.platformDictFn()
  }
}
</script>
<style lang="less" scoped>
.ownershipRegistration {
  .from-second {
    padding: 26px 190px 0 0;
  }
  .box {
    display: inline-block;
  }
  .box-right {
    margin-right: 10px;
  }
  .search-content-box{
    display: flex;
    justify-content: space-between;
    .search-from-box{
      flex: 1;
    }
    .two-row-box{
      padding-top: 14px;
      flex: 0 0 190px;
    }
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
