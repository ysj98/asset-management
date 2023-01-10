<!--
 * @Author: L
 * @Date: 2020-11-05 13:45:32
 * @LastEditTime: 2020-11-10 17:43:09
 * @Description: 资产交付记录
-->
<template>
  <div class="assetDeliveryRecord">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button
          type="primary"
          @click="downloadFn"
          v-power="ASSET_MANAGEMENT.ASSET_DELIVERY_RECORD"
        >
          <segiIcon type="#icon-ziyuan10" class="icon-right"/>导出
        </SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
        <a-input-search v-model="queryCondition.assetName" placeholder="资产名称/编码" :maxLength="40" style="width: 140px; margin-right: 10px;" @search="onSearch" />
        <a-input-search v-model="queryCondition.deliveryCodeName" @search="onSearch" placeholder="交付单名称/编号" :maxLength="40" style="width: 140px; margin-right: 10px;"/>
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn" v-model="queryCondition.approvalStatus">
            <a-select-option :title="item.name" v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部变更类型" :tokenSeparators="[',']"  @select="changeStatus" v-model="queryCondition.changeType">
            <a-select-option :title="item.name" v-for="(item, index) in changeTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :style="allStyle" :showSearch="true" :filterOption="filterOption" placeholder="全部资产项目" v-model="queryCondition.projectId">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部资产类型" :tokenSeparators="[',']" @change="assetTypeDataFn" v-model="queryCondition.assetType">
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <EquipmentSelectTree
            v-if="isSelectedEquipment"
            :style="allStyle"
            :top-organ-id="queryCondition.organId"
            :multiple="true"
            v-model="queryCondition.assetClassify"
            :options-data-format="(data)=>{
                  return [{label: '全部资产分类', value: '', isLeaf: true},...data]
                }"
            @select="assetClassifyDataFn($event,true)"
          />
          <a-select v-else :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部分类"
                    :tokenSeparators="[',']"  @select="assetClassifyDataFn" v-model="queryCondition.assetClassify">
            <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <div class="box sg-datePicker" :style="dateWidth">
            <SG-DatePicker label="交付日期" style="width: 232px;"  pickerType="RangePicker" v-model="alterationDate" format="YYYY-MM-DD"></SG-DatePicker>
          </div>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
      >
        <template #assetArea="text,record">
          {{ String(record.assetType)=== $store.state.ASSET_TYPE_CODE.EQUIPMENT ?'/' : record.assetArea}}
        </template>
        <template #deliveryArea="text,record">
          {{ String(record.assetType)=== $store.state.ASSET_TYPE_CODE.EQUIPMENT ?'/' : record.deliveryArea}}
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
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import { ASSET_MANAGEMENT } from "@/config/config.power"
import segiIcon from '@/components/segiIcon.vue'
import noDataTips from '@/components/noDataTips'
const allWidth = {width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const dateWidth = {width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const columns = [
  {
    title: '交付ID',
    dataIndex: 'deliveryDetailId'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '资产编号',
    dataIndex: 'assetCode'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName'
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
    title: '资产面积(㎡)',
    key: 'assetArea',
    scopedSlots:{
      customRender:'assetArea'
    }
  },
  {
    title: '规格型号',
    dataIndex: 'modelSpecification'
  },
  {
    title: '交付单ID',
    dataIndex: 'deliveryId'
  },
  {
    title: '交付单名称',
    dataIndex: 'deliveryName'
  },
  {
    title: '交付类型',
    dataIndex: 'deliveryTypeName'
  },
  {
    title: '交付单位',
    dataIndex: 'deliveryCompany'
  },
  {
    title: '交付面积(㎡)',
    key: 'deliveryArea',
    scopedSlots:{
      customRender:'deliveryArea'
    }
  },
  {
    title: '交付日期',
    dataIndex: 'deliveryDate'
  },
  {
    title: '结束日期',
    dataIndex: 'endDate'
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatusName'
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
const queryCondition =  {
  organId: '',           // 组织机构id
  approvalStatus: '',    // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
  projectId: '',         // 资产项目Id
  changeType: '',        // 变更类型
  assetType: '',         // 资产类型Id
  assetClassify: '',     // 资产分类
  startDate: '',         // 创建日期开始日期
  endDate: '',           // 创建日期结束日期
  changStartDate: '',    // 变更日期开始
  changEndDate: '',      // 变更日期结束
  // currentOrganId: '',    //0 否 1 是
  assetName: '',         // 资产名称/编码模糊查询
  deliveryCodeName: '',  // 交付单号
  pageNum: 1,            // 当前页
  pageSize: 10           // 每页显示记录数
}
export default {
  components: {SearchContainer, TreeSelect, segiIcon, noDataTips, EquipmentSelectTree},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      dateWidth,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      operationData: [...operationData],
      approvalStatusData: [...approvalStatusData],
      queryCondition: {...queryCondition},
      count: '',
      projectData: [
        { name: '全部资产项目', value: '' }
      ],
      changeTypeData: [
        { name: '全部交付类型', value: ''},
        { name: '交付物业', value: '1'},
        { name: '交付运营', value: '2'},
      ],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部资产分类',
          value: ''
        }
      ],
      defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      alterationDate: []
    }
  },
  computed: {
    isSelectedEquipment(){
      const assetTypeArr = this.queryCondition.assetType
      return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    }
  },
  methods: {
    // 导出
    downloadFn () {
      let obj = {

        deliveryCodeName: this.queryCondition.deliveryCodeName,
        projectId: this.queryCondition.projectId,               // 资产项目Id
        organId: Number(this.queryCondition.organId),           // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',       // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        // currentOrganId: this.queryCondition.currentOrganId,     // 仅当前机构下资产清理单 0 否 1 是
        multiDeliveryType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '',          // 变更类型
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetCodeName: this.queryCondition.assetName,           // 资产名称/编码模糊查询
        startDeliveryDate: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '',           // 变更日期开始
        endDeliveryDate: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : ''              // 变更日期结束
      }
      this.$api.delivery.deliveryExportChangeScheduleList(obj).then(res => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产交付记录.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.assetClassify = ''
      this.getObjectKeyValueByOrganIdFn()
      this.getListFn()
      this.query()
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
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
    // 平台字典获取变更类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_change_type') {
            // this.changeTypeData = [{name: '全部变更类型', value: ''}, ...data]
          } else if (str === 'asset_type') {
            this.assetTypeData = [{name: '全部资产类型', value: ''}, ...data]
            this.getListFn()
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : ''
      }

      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = [{name: '全部资产分类', value: ''}, ...arr]
        }
      })
    },
    // 资产类别
    assetTypeFn () {

    },
    // 资产分类
    assetClassifyDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetClassify = this.handleMultipleSelectValue(value, this.queryCondition.assetClassify, this.assetClassifyData)
      })
    },
    // 资产类型变化
    assetTypeDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData)
        if (!this.queryCondition.assetType[0] || this.queryCondition.assetType.length > 1 ) {
          this.assetClassifyData = [{name: '全部资产分类', value: ''}]
          this.queryCondition.assetClassify = ['']
        }else {
          this.getListFn()
        }
      })
    },
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      this.alterationDate = []
      this.defaultValue = [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())]
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.query()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        deliveryCodeName: this.queryCondition.deliveryCodeName,
        projectId: this.queryCondition.projectId,               // 资产项目Id
        organId: Number(this.queryCondition.organId),           // 组织机构id
        multiAssetType: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '',       // 资产类型Id
        multiApprovalStatus: this.queryCondition.approvalStatus.length > 0 ? this.queryCondition.approvalStatus.join(',') : '',  // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        // currentOrganId: this.queryCondition.currentOrganId,     // 仅当前机构下资产清理单 0 否 1 是
        pageNum: this.queryCondition.pageNum,                   // 当前页
        pageSize: this.queryCondition.pageSize,                 // 每页显示记录数
        multiDeliveryType: this.queryCondition.changeType.length > 0 ? this.queryCondition.changeType.join(',') : '',          // 变更类型
        multiAssetCategory: this.queryCondition.assetClassify.length > 0 ? this.queryCondition.assetClassify.join(',') : '', // 资产分类
        assetCodeName: this.queryCondition.assetName,           // 资产名称/编码模糊查询
        startDeliveryDate: this.alterationDate.length > 0 ? moment(this.alterationDate[0]).format('YYYY-MM-DD') : '',           // 变更日期开始
        endDeliveryDate: this.alterationDate.length > 0 ? moment(this.alterationDate[1]).format('YYYY-MM-DD') : ''              // 变更日期结束
      }
      this.$api.delivery.deliveryGetChangeSchedulePage(obj).then(res => {
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
          this.getTotalDeliveryArea(obj)
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    getTotalDeliveryArea (obj) {
      this.$api.delivery.getTotalDeliveryArea(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let obj = {key: data + '10000', deliveryArea: data, deliveryCompany: '交付总面积:'}
          this.tableData.push(obj)
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
    // 获取变更类型
    // this.platformDictFn('asset_change_type')
    // 资产类型
    this.platformDictFn('asset_type')
  }
}
</script>
<style lang="less" scoped>
.assetDeliveryRecord {
  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    padding-bottom: 60px;
  }
}
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
    flex-wrap: wrap;
    text-align: left;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
