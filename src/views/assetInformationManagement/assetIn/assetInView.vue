<!--
  资产入库一览表
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button type="primary" @click="exportFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
            <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType">
            <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatus">
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="queryCondition.assetNameCode" placeholder="资产名称/编码" maxlength="30" style="width: 140px; margin-right: 10px;" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="queryCondition.assetClassify"
          :options="assetClassifyOptions"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetClassify"
        ></a-select>
        <div class="box">
          <SG-DatePicker :allowClear="false" label="创建日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
          <a-input-search v-model="queryCondition.registerOrderNameOrId" placeholder="入库单编码" maxlength="30" style="width: 140px; margin-right: 10px;" @search="allQuery" />
      </div>
    </SG-SearchContainer>
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="table-layout-fixed">
      <!-- ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <router-link :to="{ path: '/assetInView/detail', query: { storeId: record.storeId, assetId: record.assetId, assetType: record.assetType } }" class="action_text">详情</router-link>
        </template>
      </a-table>
    </div>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'

const approvalStatusData = [
  { name: '全部状态', value: '' }, { name: '待审批', value: '0' }, { name: '已驳回', value: '1' }, { name: '已审批', value: '2' }, { name: '已取消', value: '3' }
]

const columns = [
  {
    title: '入库编号',
    dataIndex: 'storeId'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName'
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
    title: '入库单编号',
    dataIndex: 'storeCode'
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'area'
  },
  {
    title: '资产位置',
    dataIndex: 'location'
  },
  {
    title: '入库日期',
    dataIndex: 'createDate'
  },
  {
    title: '入库人',
    dataIndex: 'createUserName'
  },
  {
    title: '状态',
    dataIndex: 'storeStatusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
  components: {TreeSelect, OverviewNumber, noDataTips, segiIcon},
  data () {
    return {
      toggle: false,
      loading: false,
      columns,
      organName: '',
      organId: '',
      allStyle: 'width: 150px; margin-right: 10px;',
      approvalStatusData: [...approvalStatusData],
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      tableData: [],
      count: '',
      noPageTools: false,
      queryCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectId: undefined,             // 资产项目Id
        organId:1,                 // 组织机构id
        assetType: [''],           // 资产类型id(多个用，分割)
        approvalStatus: '',        // 状态
        assetNameCode: '',         // 资产名称/编码
        assetClassify: [''],        // 资产分类
        registerOrderNameOrId: ''     // 登记单编号
      },
      numList: [
        {title: '全部', key: 'assetTotal', value: 0, fontColor: '#324057'},
        {title: '待审批', key: 'awaitTotal', value: 0, bgColor: '#4BD288'},
        {title: '已驳回', key: 'refuseTotal', value: 0, bgColor: '#1890FF'},
        {title: '已审批', key: 'finishTotal', value: 0, bgColor: '#DD81E6'},
        {title: '已取消', key: 'cancelTotal', value: 0, bgColor: '#FD7474'}
      ],  // 概览数字数据, title 标题，value 数值，bgColor 背景色
      assetClassifyOptions: [{label: '全部资产分类', value: ''}],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      projectData: []
    }
  },
  watch: {
    'queryCondition.assetType' () {
      console.log('queryCondition.assetType', this.queryCondition.assetType)
      this.getAssetClassifyOptions()
    }
  },
  mounted () {
    this.platformDictFn('asset_type')
  },
  methods: {
    exportFn () {
      let obj = {
        pageNum: 1,
        pageSize: 1,
        statusList: this.alljudge(this.queryCondition.approvalStatus),      // 入库单状态
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        objectTypeList: this.alljudge(this.queryCondition.assetClassify),  // 资产分类id(多个用，分割)
        assetName: this.queryCondition.assetNameCode,         // 资产名称/编码
        minDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        maxDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),          // 结束创建日期
        storeName: this.queryCondition.registerOrderNameOrId                                // 入库单编码
      }
      this.$api.assets.getGeneralSurveyExport(obj).then(res => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产入库一览表.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = undefined
      this.getAssetClassifyOptions()
      this.query()
      this.getObjectKeyValueByOrganIdFn()
    },
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        statusList: this.alljudge(this.queryCondition.approvalStatus),      // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        objectTypeList: this.alljudge(this.queryCondition.assetClassify),  // 资产分类id(多个用，分割)
        assetName: this.queryCondition.assetNameCode,         // 资产名称/编码
        minDate: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        maxDate: moment(this.defaultValue[1]).format('YYYY-MM-DD'),          // 结束创建日期
        storeName: this.queryCondition.registerOrderNameOrId                                // 入库单编码
      }
      this.$api.assets.getGeneralSurvey(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.loading = false
          if (this.queryCondition.pageNum === 1) {
            this.pageListStatistics(obj)
          }
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    allQuery () {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
      this.query()
    },
    alljudge (val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return []
        } else {
          return val
        }
      } else {
        return []
      }
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 查询统计信息
    pageListStatistics (form) {
      this.$api.assets.getGeneralSurveyTotal(form).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          let { numList } = this
          return this.numList = numList.map(m => {
            return { ...m, value: (res.data || {})[m.key] }
          })
        }
        throw res.message
      }).catch(err => {
        this.$message.error(err || '查询统计信息出错')
      })
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions () {
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetType.length === 1 ? this.queryCondition.assetType.join(',') : ''
      }
      if (!obj.assetType) {
        this.queryCondition.assetClassify = ['']
        this.assetClassifyOptions = [{label: '全部资产分类', value: ''}]
        return
      }
      this.$api.assets.getList(obj).then(res => {
        if (res.data.code === '0') {
          let arr = [{label: '全部资产分类', value: ''}]
          res.data.data.forEach(item => {
            let obj = {
              label: item.professionName,
              value: item.professionCode
            }
            arr.push(obj)
          })
          this.assetClassifyOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类发生变化
    changeAssetClassify (value) {
      this.$nextTick(function () {
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, this.assetClassifyOptions)
      })
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
          this.projectData = arr
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
          if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
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
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
  }
}
</script>

<style lang="less" scoped>
.assetRegister {
  .box {
    display: inline-block;
    // vertical-align: middle;
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
  .formCon {
    display: flex;
    width: 100%;
    justify-content:flex-end;
    flex-wrap: wrap;
    > * {
      margin-right:10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
}
</style>
