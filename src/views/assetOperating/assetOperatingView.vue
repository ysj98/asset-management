<!--
  资产转运营一览表
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_OPERATING_VIEW_EXPORT_FILE" @click="exportFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle" :showSearch='true'></treeSelect>
          <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"
            @select="assetTypeDataFn" v-model="queryCondition.assetType">
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" show-search :filter-option="filterOption" placeholder="全部运营项目" :tokenSeparators="[',']" @select="operatingObjFn" v-model="queryCondition.operatingObject">
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="queryCondition.assetNameCode" placeholder="资产名称/编码" :maxLength="30" style="width: 140px; height: 32px; margin-right: 10px;" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <ProvinceCityDistrict
          class="city"
          ref="ProvinceCityDistrict"
          v-model="provinces"
        ></ProvinceCityDistrict>
        <a-select style="width: 160px; margin-right: 10px;" placeholder="选择状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatus">
          <a-select-option :title="item.name" v-for="(item, index) in operating" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="box">
          <SG-DatePicker :allowClear="false" label="创建日期" style="width: 200px;"  pickerType="RangePicker" :defaultValue="defaultValue" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
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
        <template slot="assetOperationRegisterId" slot-scope="text, record">
          {{record.assetOperationRegisterId}}
          <!-- <router-link :to="{ path: '/assetOperating/detail', query: { assetOperationRegisterId: record.assetOperationRegisterId, approvalStatus: record.approvalStatus, organId: queryCondition.organId, fromType: 'detail', relatedOrganId: record.organId} }" class="action_text">{{record.assetOperationRegisterId}}</router-link> -->
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
import ProvinceCityDistrict from '@/views/common/ProvinceCityDistrict'
import TreeSelect from '@/views/common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {querySourceType} from "@/views/common/commonQueryApi";
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
const approvalStatusData = [
  {
    name: '全部运营项目',
    value: ''
  }
]
const operating = [
  {
    name: '全部',
    value: '',
  },
  {
    name: '已转运营',
    value: '1',
  },
  {
    name: '未转运营',
    value: '0',
  },
]
const columns = [
  // {
  //   title: '登记编号',
  //   dataIndex: 'assetId'
  // },
  {
    title: '资产编码',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '所属机构',
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
    title: '资产分类',
    dataIndex: 'objectTypeName'
  },
  {
    title: '资产位置',
    dataIndex: 'address'
  },
  {
    title: '运营项目',
    dataIndex: 'communityName'
  },
  {
    title: '创建日期',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    dataIndex: 'operationStatusName'
  },
  {
    title: '运营单编号',
    key: 'assetOperationRegisterId',
    scopedSlots: {
      customRender: 'assetOperationRegisterId'
    }
  },
  // {
  //   title: '管理机构',
  //   dataIndex: 'organName'
  // },
  // {
  //   title: '资产面积(㎡)',
  //   key: 'area',
  //   scopedSlots: {
  //     customRender: 'area'
  //   }
  // },
  // {
  //   title: '来源方式',
  //   dataIndex: 'sourceModeName'
  // },  
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName'
  // },
  // {
  //   title: '核实时间',
  //   dataIndex: 'verifierTime'
  // },
  // {
  //   title: '核实人',
  //   dataIndex: 'verifierByName'
  // },
  // {
  //   title: '入库时间',
  //   dataIndex: 'storageTime'
  // },
  // {
  //   title: '入库人',
  //   dataIndex: 'storageByName'
  // },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   scopedSlots: { customRender: 'operation' },
  // }
]

export default {
  components: {TreeSelect, OverviewNumber, noDataTips, segiIcon, EquipmentSelectTree,ProvinceCityDistrict},
  data () {
    return {
      provinces: {
        province: undefined,
        city: undefined,
        district: undefined
      },
      sourceOptions:[{ value:'', label: '全部来源方式' }],
      ASSET_MANAGEMENT,
      toggle: false,
      loading: false,
      columns,
      organName: '',
      organId: '',
      allStyle: 'width: 150px; margin-right: 10px;',
      approvalStatusData: [...approvalStatusData],
      operating: [...operating],
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      tableData: [],
      count: '',
      noPageTools: false,
      queryCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectId: undefined,             // 资产项目Id
        organId:'',                 // 组织机构id
        assetType: [''],           // 资产类型id(多个用，分割)
        approvalStatus: '',        // 状态
        assetNameCode: '',         // 资产名称/编码
        assetClassify: [''],        // 资产分类
        registerOrderNameOrId: '',     // 登记单编号
        sourceModes : [''],         // 来源方式
        operatingObject: '',        // 运营项目
      },
      numList: [
        {title: '全部', key: 'total', value: 0, fontColor: '#324057'},
        {title: '已转运营', key: 'alreadyOperation', value: 0, bgColor: '#FD7474'},
        {title: '未转运营', key: 'notOperation', value: 0, bgColor: '#1890FF'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      assetClassifyOptions: [{label: '全部资产分类', value: ''}],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      projectData: [],
      queryParam: {}
    }
  },
  computed:{
    isSelectedEquipment(){
      const assetTypeArr = this.queryCondition.assetType
      return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    }
  },
  watch: {
    'queryCondition.assetType' () {
      this.getAssetClassifyOptions()
    }
  },
  mounted () {
    this.platformDictFn('asset_type')
    this.getOperatingObj()
  },
  methods: {
    filterOption (){
      
    },
    // 运营项目
    getOperatingObj (){
      this.$api.basics
      .queryCommunityListByOrganId({organId: this.queryCondition.organId})
      .then(res => {
        let {code, data} = res.data
        this.approvalStatusData = [
          {
            name: '全部运营项目',
            value: ''
          }
        ]
        if(code === '0') {
          data.forEach(item => {
            this.approvalStatusData.push({
              name: item.name,
              value: item.communityId
            })
          })
        }
      })
    },
    // 根据organId查询来源方式
    async getSourceOptions(organId){
      this.sourceOptions = [{ value:'', label: '全部来源方式' }]
      this.queryCondition.sourceModes = ['']
      querySourceType(organId, this).then(list => {
        let listArr = list.map(ele=>({...ele,value:ele.value || ele.key,name:ele.name || ele.title}))
        return this.sourceOptions = [{ value:'', label: '全部来源方式' }].concat(listArr)
      })
    },
    exportFn () {
      let obj = {
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus),      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        objectTypeList: this.alljudge(this.queryCondition.assetClassify),  // 资产分类id(多个用，分割)
        assetNameCode: this.queryCondition.assetNameCode,         // 资产名称/编码
        createTimeStart: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        createTimeEnd: moment(this.defaultValue[1]).format('YYYY-MM-DD'),          // 结束创建日期
        // registerOrderNameOrId: this.queryCondition.registerOrderNameOrId,                                // 登记单编码
        sourceModeList:  this.alljudge(this.queryCondition.sourceModes)
      }
      this.$api.assets.exportOperationSchedulePage(this.queryParam).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产转运营一览表.xls'
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
      this.getSourceOptions(value)
      this.query()
      this.getObjectKeyValueByOrganIdFn()
      this.getOperatingObj()
    },
    query () {
      this.loading = true
      this.queryParam = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        assetNameOrCode: this.queryCondition.assetNameCode,         // 资产名称/编码
        createTimeStarts: moment(this.defaultValue[0]).format('YYYY-MM-DD'),         // 开始创建日期
        createTimeEnds: moment(this.defaultValue[1]).format('YYYY-MM-DD'),          // 结束创建日期
        communityId: this.queryCondition.operatingObject,
        operationStatusList: [...this.queryCondition.approvalStatus],
        province: this.provinces.province || '',
        city: this.provinces.city || '',
        region: this.provinces.district || '',
      }
      this.$api.assets.getTransferOperationSchedule(this.queryParam).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.loading = false
          if (this.queryCondition.pageNum === 1) {
            this.pageListStatistics(this.queryParam)
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
      this.$api.assets.getOperationScheduleStatistics(form).then(r => {
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
    // 状态发生变化
    approvalStatusFn (value){
      console.log(value, '运营状态')
      // this.$nextTick(function () {
      //   this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.operating)
      // })
    },
    operatingObjFn (value){
      console.log(value, 'valuevaluevaluevaluevalue')
      // this.$nextTick(function () {
      //   this.queryCondition.operatingObject = this.handleMultipleSelectValue(value, this.queryCondition.operatingObject, this.approvalStatusData)
      // })
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
      if (value === "") {
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
  .city {
    float: right;
    margin-right: 8px;
    /deep/.ant-col-8 {width: 180px;}
    /deep/.province_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
  }
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
