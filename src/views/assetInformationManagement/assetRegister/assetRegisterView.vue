<!--
  资产登记一览表
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button v-power="ASSET_MANAGEMENT.ASSET_REGISTER_SET_TABLE_HEADER" @click="changeListSettingsModal(true)">列表设置</SG-Button>
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_REGISTER_VIEW_EXPORT" @click="exportFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle" :showSearch='true'></treeSelect>
          <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"
                    @change="assetTypeDataFn" v-model="queryCondition.assetType">
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatus">
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="queryCondition.assetNameCode" placeholder="资产名称/编码" :maxLength="30" style="width: 140px; height: 32px; margin-right: 10px;" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          mode="multiple"
          :tokenSeparators="[',']"
          :maxTagCount="1"
          style="width: 190px; margin-right: 10px;"
          v-model="queryCondition.sourceModes"
          option-filter-prop="title"
          placeholder="请选择来源方式"
          :options="$addTitle(sourceOptions)"
          @select="changeSource"
        />
        <EquipmentSelectTree
          v-if="isSelectedEquipment"
          style="width: 300px"
          :top-organ-id="queryCondition.organId"
          :multiple="true"
          v-model="queryCondition.assetClassify"
          :options-data-format="(data)=>{
            return [{label: '全部资产分类', value: '', isLeaf: true},...data]
          }"
          @select="changeAssetClassify($event,true)"
        />
        <a-select
          v-else
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="queryCondition.assetClassify"
          :options="$addTitle(assetClassifyOptions)"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetClassify"
        ></a-select>
        <div class="box">
          <SG-DatePicker label="创建日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <a-input-search v-model="queryCondition.registerOrderNameOrId" placeholder="登记单编码" :maxLength="30" style="width: 140px; height: 32px; margin-right: 10px;" @search="allQuery" />
        <ProvinceCityDistrict
          class="city"
          ref="ProvinceCityDistrict"
          v-model="provinces"
        ></ProvinceCityDistrict>
        <a-input-search v-model="queryCondition.address" placeholder="请输入地址" :maxLength="30" style="width: 140px; height: 32px; margin-right: 10px;" @search="allQuery" />
        <a-input-search v-model="queryCondition.originSource" placeholder="请输入资产原始来源方" :maxLength="100" style="width: 170px; height: 32px; margin-right: 10px;" @search="allQuery" />
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
          <router-link :to="{ path: '/assetCheckInView/detail', query: { registerOrderId: record.registerOrderId, assetId: record.assetId, assetType: record.assetType } }" class="action_text">详情</router-link>
        </template>
        <!-- 资产面积 -->
        <template #area="text,record">
          {{record.assetTypeName === '设备设施'? '/' : record.area}}
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
    <TableHeaderSettings v-if="listSettingFlag" :funType="funType" @cancel="changeListSettingsModal(false)" @success="handleTableHeaderSuccess" />
  </div>
</template>

<script>
import TableHeaderSettings from "@/components/TableHeaderSettings";
import ProvinceCityDistrict from '@/views/common/ProvinceCityDistrict'
import TreeSelect from '../../common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {querySourceType} from "@/views/common/commonQueryApi";
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
import {getTableHeaders} from "utils/share";

const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '未核实',
    value: '0'
  },
  {
    name: '待入库',
    value: '1'
  },
  {
    name: '已入库',
    value: '2'
  }
]

const detailColumns = [
  {
    title: '资产面积(㎡)',
    key: 'area',
    scopedSlots: {
      customRender: 'area'
    }
  }
]
const requiredColumn = [
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
export default {
  components: {TreeSelect, OverviewNumber, noDataTips, segiIcon, EquipmentSelectTree,ProvinceCityDistrict, TableHeaderSettings},
  data () {
    return {
      funType: 2,
      listSettingFlag: false,
      provinces: {
        province: undefined,
        city: undefined,
        district: undefined
      },
      sourceOptions:[{ value:'', label: '全部来源方式' }],
      ASSET_MANAGEMENT,
      toggle: false,
      loading: false,
      columns:[],
      organName: '',
      organId: '',
      allStyle: 'width: 150px; margin-right: 10px;',
      approvalStatusData: [...approvalStatusData],
      defaultValue: [null, null],
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
        address:'',          //详细地址
        assetNameCode: '',         // 资产名称/编码
        assetClassify: [''],        // 资产分类
        registerOrderNameOrId: '',     // 登记单编号
        sourceModes : [''],         // 来源方式
        originSource : '' // 资产原始来源方
      },
      numList: [
        {title: '全部', key: 'whole', value: 0, fontColor: '#324057'},
        {title: '未核实', key: 'notVerified', value: 0, bgColor: '#FD7474'},
        {title: '待入库', key: 'waitStorage', value: 0, bgColor: '#1890FF'},
        {title: '已入库', key: 'alreadyStorage', value: 0, bgColor: '#DD81E6'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
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
  computed:{
    isSelectedEquipment(){
      const assetTypeArr = this.queryCondition.assetType
      return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    }
  },
  watch: {
    'queryCondition.assetType' () {
      console.log('queryCondition.assetType', this.queryCondition.assetType)
      this.getAssetClassifyOptions()
    }
  },
  mounted () {
    this.initTableColumns()
    this.platformDictFn('asset_type')
  },
  methods: {
    async initTableColumns(){
      // 暂不考虑固定表头顺序问题，目前只有操作列
      const res = await getTableHeaders({funType:this.funType})
      this.columns = res.customShow.map( ele =>{
        let mapRes = {}
        // 匹配用户预设表头，使用前端代码对应表头配置
        const temp = detailColumns.find(item=>[item.key,item.dataIndex].includes(ele.colCode))
        if (temp){
          mapRes = temp
        }else {
          mapRes =  {
            title: ele.colName,
            dataIndex: ele.colCode
          }
        }
        return mapRes
      })
      requiredColumn.forEach(ele=>{
        this.columns.splice(this.columns.length,0,ele)
      })
      // 遍历 requiredColumn，把每一个 表头插入到指定位置
      // this.columns.length 可替换城指定位置
      // this.columns.splice(this.columns.length,0,...requiredColumn)
    },
    handleTableHeaderSuccess(){
      this.changeListSettingsModal(false)
      this.initTableColumns()
    },
    changeListSettingsModal(flag){
      this.listSettingFlag = flag
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
    handleSearchReq(){
      return {
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatus),      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.queryCondition.projectId ? this.queryCondition.projectId : [],            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        objectTypeList: this.alljudge(this.queryCondition.assetClassify),  // 资产分类id(多个用，分割)
        sourceModeList: this.alljudge(this.queryCondition.sourceModes),   // 来源方式
        assetNameCode: this.queryCondition.assetNameCode,         // 资产名称/编码
        createTimeStart: this.defaultValue[0] ? moment(this.defaultValue[0]).format('YYYY-MM-DD') : '',         // 开始创建日期
        createTimeEnd: this.defaultValue[1] ? moment(this.defaultValue[1]).format('YYYY-MM-DD') : '',          // 结束创建日期
        registerOrderNameOrId: this.queryCondition.registerOrderNameOrId,                                // 登记单编码
        city: this.provinces.city ? this.provinces.city : '',               // 市
        province: this.provinces.province ? this.provinces.province : '',   // 省
        region: this.provinces.district ? this.provinces.district : '',     // 区
        address: this.queryCondition.address ? this.queryCondition.address : '',     // 区
        originSource: this.queryCondition.originSource ? this.queryCondition.originSource : '',     // 资产原始来源方
      }
    },
    exportFn () {
      let obj = this.handleSearchReq()
      this.$api.assets.assetRegListPageExport(obj).then(res => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产登记一览表.xls'
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
    },
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        ...this.handleSearchReq()
      }
      this.$api.assets.findAssetRegListPage(obj).then(res => {
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
      this.$api.assets.assetRegSta(form).then(r => {
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
    changeAssetClassify (value,isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyOptions
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, resOptions)
      })
    },
    // 来源方式
    changeSource(value){
      this.$nextTick(function () {
        this.queryCondition.sourceModes = this.handleMultipleSelectValue(value, this.queryCondition.sourceModes, this.sourceOptions)
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
