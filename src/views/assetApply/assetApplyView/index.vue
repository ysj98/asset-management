<!--
  领用登记一览表
-->
<template>
  <div class="assetRegister">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <div class="box" style="margin-left: 16px"><SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_APPLY_VIEW_EXPORT" @click="exportFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button></div>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectIdList" :filterOption="filterOption" @select="getObjectKeyValueByOrganIdFn" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']"  @select="assetTypeDataFn" v-model="queryCondition.assetType" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatusList" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value" :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          ">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="queryCondition.assetName" placeholder="资产名称/编号" :maxLength="30" style="width: 140px; height: 32px; margin-right: 10px;" @search="allQuery" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="allQuery">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <EquipmentSelectTree
          v-if="isSelectedEquipment"
          :multiple="true"
          style="width: 190px; margin-right: 10px;"
          :top-organ-id="queryCondition.organId"
          v-model="queryCondition.objectTypeList"
          :options-data-format="(data)=>{
            return [{label: '全部资产分类', value: '', isLeaf: true},...data]
          }"
          @select="changeAssetClassify"
        />
        <a-select
          v-else
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="queryCondition.objectTypeList"
          :options="$addTitle(assetClassifyOptions)"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetClassify"
          :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          "
        ></a-select>
        <treeSelect @changeTree="changeLeaf"  placeholder='全部领用部门' :allowClear="true" :style="allStyle" :default="false"></treeSelect>
        <div class="box">
            <SG-DatePicker :allowClear="false" label="领用日期" style="width: 200px;"  pickerType="RangePicker" v-model="applyValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="box">
            <a-input placeholder="领用单编号" v-model="queryCondition.receiveName" :maxLength="30"></a-input>
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
        <template slot="operation" slot-scope="text, record">
          <div class="opt">
          <router-link :to="{name: '资产领用一览表详情', params: {registerId: record.receiveDetailId, type: 'detail', organId, organName}}" class="action_text">详情</router-link>
          </div>
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
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
import TreeSelect from '../../common/treeSelect'
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import { generateTableAreaByAssetTypeString} from '@/utils/utils'

  const approvalStatusData = [
  { name: '全部状态', value: '' }, { name: '领用中', value: '0' }, { name: '未归还', value: '1' }, { name: '已归还', value: '2' }
]


const columns = [
  {
    title: '领用编号',
    dataIndex: 'receiveDetailId',
    width: 100
  },
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
    title: '资产项目',
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
    title: '资产面积（㎡）',
    key: 'area',
    customRender(record){
      return generateTableAreaByAssetTypeString({
        record,
        keyStr:'area',
        assetTypeName: record.assetTypeName
      })
    }
  },
  {
    title: '领用单号',
    dataIndex: 'receiveId'
  },
  {
    title: '领用日期',
    dataIndex: 'receiveDate'
  },
  {
    title: '领用部门',
    dataIndex: 'receiveOrganName'
  },
  {
    title: '领用人',
    dataIndex: 'receiveUserName',
    width: 120
  },
  {
    title: '领用面积（m²）',
    key: 'receiveArea',
    customRender(record){
      return generateTableAreaByAssetTypeString({
        record,
        keyStr:'receiveArea',
        assetTypeName: record.assetTypeName
      })
    }
  },
  {
    title: '归还日期',
    dataIndex: 'returnDate'
  },
  {
    title: '已归还面积(㎡)',
    key: 'returnArea',
    customRender(record){
      return generateTableAreaByAssetTypeString({
        record,
        keyStr:'returnArea',
        assetTypeName: record.assetTypeName
      })
    }
  },
  {
    title: '未归还面积(㎡)',
    key: 'unReturnArea',
    customRender(record){
      return generateTableAreaByAssetTypeString({
        record,
        keyStr:'unReturnArea',
        assetTypeName: record.assetTypeName
      })
    }
  },
  {
    title: '状态',
    dataIndex: 'statusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
  {
    title: 'key值',
    dataIndex: 'key',
    width: 0
  }
]

export default {
  components: {TreeSelect, OverviewNumber, noDataTips, segiIcon, EquipmentSelectTree},
  data () {
    return {
      ASSET_MANAGEMENT,
      toggle: false,
      loading: false,
      columns,
      organName: '',
      organId: '',
      allStyle: 'width: 150px; margin-right: 10px;',
      approvalStatusData: [...approvalStatusData],
      applyValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      createValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      tableData: [],
      count: '',
      noPageTools: false,
      queryCondition: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectIdList: [],             // 资产项目Id
        organId:1300,                 // 组织机构id
        //receiveOrganId:'',         // 领用部门id
        assetTypeList: [''],           // 资产类型id(多个用，分割)
        approvalStatusList: [],        // 状态
        receiveName: '',            // 领用单名称/编号
        startReceiveDate: '',        // 领用开始日期
        endReceiveDate: '',          // 领用结束如期
        startCreateDate: '',         // 提交开始日期
        endCreateDate: '',           // 提交结束日期
        assetType: '' ,               // 资产类型
        objectTypeList: [],           // 资产分类
        assetName: '',                // 资产名称/编号
      },
      queryInit: {
        pageNum: 1,                // 当前页
        pageSize: 10,              // 每页显示记录数
        projectIdList: [],             // 资产项目Id
        organId:1300,                 // 组织机构id
        //receiveOrganId:'',         // 领用部门id
        assetTypeList: [''],           // 资产类型id(多个用，分割)
        approvalStatusList: [],        // 状态
        receiveName: '',            // 领用单名称/编号
        startReceiveDate: '',        // 领用开始日期
        endReceiveDate: '',          // 领用结束如期
        startCreateDate: '',         // 提交开始日期
        endCreateDate: '',           // 提交结束日期
        assetType: '' ,               // 资产类型
        objectTypeList: [],           // 资产分类
        assetName: '',                // 资产名称/编号
      },
      organProjectType: {
          organId: 1300,
          organName: this.organName,
          projectId: [],
          assetType: []
        }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
      numList: [
        {title: '领用数量（个）/面积（m²）', key: 'total', value: 0, fontColor: '#324057'},
        {title: '已经归还数量（个）/面积（m²）', key: 'return', value: 10, bgColor: '#FFA500'},
        {title: '未归还数量（个）/面积（m²）', key: 'unReturn', value: 0, bgColor: '#4BD288'},
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
  },
  methods: {
      // 控制跳转至新增领用单页面
      handleBtnAction ({id, type}) {
          const { organProjectType: { organId }, organName } = this
          this.$router.push({ name: '领用登记新增', params: { organId:this.queryCondition.organId, organName, type: 'add' }})
      },
    exportFn () {
      let obj = {
        receiveOrganId: this.queryCondition.receiveOrganId, //领用部门ID
        statusList: this.alljudge(this.queryCondition.approvalStatusList),      // 领用单状态
        projectIdList: this.alljudge(this.queryCondition.projectIdList),         // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetTypeList),  // 资产类型id(多个用，分割)
        receiveName: this.queryCondition.receiveName,         // 领用单名称/编号
        startReceiveDate: moment(this.applyValue[0]).format('YYYY-MM-DD'),         // 开始领用日期
        endReceiveDate: moment(this.applyValue[1]).format('YYYY-MM-DD'),          // 结束领用日期
        assetName: this.queryCondition.assetName            // 资产名称
      }
      console.log(33)
      this.$api.useManage.exportReceiveDetail(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产领用一览表.xls'
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
      this.getObjectKeyValueByOrganIdFn()
      this.query()
    },
    changeLeaf (value) {
      this.queryCondition.receiveOrganId = value
    },
    query () {
      this.loading = true
      let obj = {
        pageNum: this.queryCondition.pageNum,                // 当前页
        pageSize: this.queryCondition.pageSize,              // 每页显示记录数
        receiveStatusList: this.alljudge(this.queryCondition.approvalStatusList),      // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.alljudge(this.queryCondition.projectIdList),            // 资产项目Id
        organId: Number(this.queryCondition.organId),        // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType),  // 资产类型id(多个用，分割)
        startReceiveDate: moment(this.applyValue[0]).format('YYYY-MM-DD'),         // 领用开始日期
        endReceiveDate: moment(this.applyValue[1]).format('YYYY-MM-DD'),          // 领用结束日期
        receiveName: this.queryCondition.receiveName,                              // 领用单名称/编号
        receiveOrganId: Number(this.queryCondition.receiveOrganId),        // 领用部门id
        objectTypeList: this.alljudge(this.queryCondition.objectTypeList), // 资产分类
        assetName: this.queryCondition.assetName                    // 资产名称/编号

      }
      this.$api.useManage.getReceiveDetailSum(obj).then(res => {
        if(res.data.code == 0){
          this.numList.map((item,index) => {
            let count = `${item.key}` + 'Count'
            let area = `${item.key}` + 'Area'
            this.numList[index].value = res.data.data[count] + '/' + res.data.data[area]

          })
          this.$api.useManage.getReceiveDetailPage(obj).then(r => {
            if(r.data.code == 0){
              r.data.data.data.map((item,index) => {
                r.data.data.data[index].key = item.receiveDetailId
              })
              this.tableData = r.data.data.data
              this.count = r.data.data.count
            }
           this.loading = false
          })
        }

      })
    },
     // 删除项目
      confirmDelete (registerId) {
        this.loading = true
        this.$api.useManage.deleteReceive({receiveId: registerId}).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('删除成功')
            // 更新列表
            const { pageNo, pageLength } = this.paginationObj
            return this.query()
            //return this.queryTableData({pageNo, pageLength})
          }
          throw res.message || '删除失败'
        }).catch(err => {
          this.loading = false
          this.$message.error(err || '删除失败')
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
      this.$api.useManage.getReceiveSum(form).then(r => {
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
        this.queryCondition.objectTypeList = ['']
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
        this.queryCondition.objectTypeList = this.handleMultipleSelectValue(value, this.queryCondition.objectTypeList, this.assetClassifyOptions)
      })
    },
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatusList, this.approvalStatusData)
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
  // .opt{
  //   display: flex;
  //   justify-content: space-evenly;
  //   width: 90px;
  // }
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
