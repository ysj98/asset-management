<template>
  <div class="barcodeManagement">
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button v-power="ASSET_MANAGEMENT.BARCODE_MANAGEMENT_PRINT" @click="printBarcode">条码打印</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.BARCODE_MANAGEMENT_EXPORT" style="margin-left:15px;" @click="exportLabel"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
        <SG-Button v-power="ASSET_MANAGEMENT.BARCODE_MANAGEMENT_UPDATE" style="margin-left:15px;" @click="showDataImport">批量更新标签</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select :maxTagCount="1" mode="multiple" :style="allStyle" :allowClear="true" placeholder="全部资产项目" v-model="queryCondition.projectId" :showSearch="true" :filterOption="filterOption">
          <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          placeholder="全部资产类型"
          :tokenSeparators="[',']"
          @select="changeAssetType"
          v-model="queryCondition.assetTypeList">
          <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-input-search v-model="queryCondition.assetNameOrCode" placeholder="请输入资产名称/编码" maxlength="30" :style="allStyle" @search="onSearch"/>
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <EquipmentSelectTree
              v-if="isSelectedEquipment"
              :style="allStyle"
              style="margin-top: 14px;"
              :top-organ-id="queryCondition.organId"
              :multiple="true"
              v-model="queryCondition.objectTypeList"
              :options-data-format="(data)=>{
                return [{label: '全部资产分类', value: '', isLeaf: true},...data]
              }"
              @select="assetClassifyDataFn($event,true)"
            />
          <a-select v-else :maxTagCount="1" :style="allStyle" style="margin-top: 14px;" mode="multiple" placeholder="全部分类" :tokenSeparators="[',']"  @select="assetClassifyDataFn" v-model="queryCondition.objectTypeList">
            <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input v-model="queryCondition.labelCode" placeholder="请输入标签编码" maxlength="30" :style="allStyle" style="margin-top: 14px;"/>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="onSearch">查询</SG-Button>
        </div>
      </div>
    </search-container>
    <div class="table-layout-fixed">
      <a-table
        rowKey="assetId"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        :rowSelection="{selectedRowKeys, onChange: handleSelectChange}"
        >
        <template slot="operation" slot-scope="text, record">
          <a-button v-power="ASSET_MANAGEMENT.BARCODE_MANAGEMENT_EDIT" type="link" @click="editLabel(record)">编辑标签</a-button>
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
    <labelCodeModal ref="showlabelCodeModal" :assetsData="assetsData" @cancel="cancel"></labelCodeModal>
    <labelcodeDataImport ref="labelcodeDataImport" :projectData="projectData" :labelTemp="labelTemp" @success="query" @hiddeModal="cancelDataImport"></labelcodeDataImport>
  </div>
</template>

<script>
import SearchContainer from 'src/views/common/SearchContainer'
import TreeSelect from '../common/treeSelect.vue'
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
import noDataTips from '@/components/noDataTips'
import labelCodeModal from './labelCodeModal.vue'
import labelcodeDataImport from './labelcodeDataImport.vue'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import segiIcon from '@/components/segiIcon.vue'

const allWidth = {width: '170px', 'margin-right': '10px', float: 'left'}
const queryCondition = {
  organId: '', // 组织机构id
  projectId: undefined, // 资产项目Id
  assetTypeList: '', // 资产类型，多个用，分隔
  assetNameOrCode: '', // 资产名称/编码
  objectTypeList: [''], // 资产分类
  labelCode: '', // 登记单名称/编码
  pageNum: 1,     // 当前页
  pageSize: 10    // 每页显示记录数
}
const columns = [
  { title: '资产名称', dataIndex: 'assetName' },
  { title: '资产编码', dataIndex: 'assetCode' },
  { title: '资产类型', dataIndex: 'assetTypeName' },
  { title: '资产分类', dataIndex: 'objectTypeName' },
  { title: '资产项目名称', dataIndex: 'projectName' },
  { title: '管理机构', dataIndex: 'organName' },
  { title: '资产位置', dataIndex: 'address' },
  { title: '标签编码', dataIndex: 'labelCode' },
  { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {SearchContainer, TreeSelect, EquipmentSelectTree, noDataTips, labelCodeModal, labelcodeDataImport, segiIcon},
  data () {
    return {
      ASSET_MANAGEMENT,
      fold: true,
      allStyle: allWidth,
      queryCondition: {...queryCondition},
      projectData: [],
      assetTypeData: [],
      assetClassifyData: [
        {
          name: '全部资产分类',
          value: ''
        }
      ],
      loading: false,
      columns,
      tableData: [],
      noPageTools: false,
      location: 'absolute',
      count: '',
      assetsData: '',
      labelTemp: {},
      selectedRowKeys: [], // Table选中项
      assetIdList: [], //资产id列表
      barCodeInfo: {} // 打印二维码信息
    }
  },
  mounted() {
    this.query()
    // 获取资产类型
    this.platformDictFn()
  },
  computed: {
    isSelectedEquipment(){
      const assetTypeArr = this.queryCondition.assetTypeList
      return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    }
  },
  methods: {
    // 组织机构树
    changeTree (value, label) {
      this.queryCondition.organId = value
      this.getObjectKeyValueByOrganIdFn()
      this.getListFn()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ""
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
    // 平台字典获取变更类型
    platformDictFn() {
      let obj = {
        code: 'asset_type'
      };
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [{ name: "全部资产类型", value: "" }, ...data]
          this.getListFn()
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产类型变化
    changeAssetType (value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypeList = this.handleMultipleSelectValue(value, this.queryCondition.assetTypeList, this.assetTypeData)
        if (!this.queryCondition.assetTypeList[0] || this.queryCondition.assetTypeList.length > 1 ) {
          this.assetClassifyData = [{name: '全部资产分类', value: ''}]
          this.queryCondition.objectTypeList = ['']
        }else {
          this.getListFn()
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
    // 资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetTypeList.length > 0 ? this.queryCondition.assetTypeList.join(',') : ''
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
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 资产分类
    assetClassifyDataFn (value,isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyData
        this.queryCondition.objectTypeList = this.handleMultipleSelectValue(value, this.queryCondition.objectTypeList, resOptions)
      })
    },
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 分页查询
    handleChange (data) {
      console.log(data)
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    query () {
      this.loading = true
      let form = {
        organId: this.queryCondition.organId,
        projectIdList: this.queryCondition.projectId,
        assetTypes: this.queryCondition.assetTypeList.length > 0 ? this.queryCondition.assetTypeList.join(',') : '',
        objectTypes: this.queryCondition.objectTypeList.length > 0 ? this.queryCondition.objectTypeList.join(',') : '',
        labelCode: this.queryCondition.labelCode,
        assetNameOrCode: this.queryCondition.assetNameOrCode,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.barCode.queryLabelCodeList(form).then(res => {
        if (Number(res.data.code) === 0) {
          this.tableData = res.data.data.data
          this.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    exportLabel () {
      if (!this.queryCondition.projectId) {
        this.$message.error('请选择资产项目')
      } else {
        let form = {
          organId: this.queryCondition.organId,
          projectIdList: this.queryCondition.projectId,
          assetTypes: this.queryCondition.assetTypeList.length > 0 ? this.queryCondition.assetTypeList.join(',') : '',
          objectTypes: this.queryCondition.objectTypeList.length > 0 ? this.queryCondition.objectTypeList.join(',') : '',
          labelCode: this.queryCondition.labelCode,
          assetNameOrCode: this.queryCondition.assetNameOrCode,
          pageNum: this.queryCondition.pageNum,
          pageSize: this.queryCondition.pageSize
        }
        let loadingName = this.$SG_Message.loading({content: '下载中...'})
        this.$api.barCode.exportLabelData(form).then(res => {
              this.$SG_Message.destroy(loadingName)
              let blob = new Blob([res.data])
              let a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `条码管理报表.xls`
              a.style.display = 'none'
              document.body.appendChild(a)
              a.click()
              a.remove()
        }, () => {
          this.$SG_Message.destroy(loadingName)
          this.$SG_Message.error('导出条码管理报表失败!')
        })
      }
    },
    showDataImport () {
      let form = {
        organId: this.queryCondition.organId,
        assetTypes: this.queryCondition.assetTypeList.length > 0 ? this.queryCondition.assetTypeList.join(',') : '',
        objectTypes: this.queryCondition.objectTypeList.length > 0 ? this.queryCondition.objectTypeList.join(',') : '',
        labelCode: this.queryCondition.labelCode,
        assetNameOrCode: this.queryCondition.assetNameOrCode,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.labelTemp = form
      this.$refs.labelcodeDataImport.visible = true
    },
    editLabel (data) {
      this.assetsData = data
      this.$refs.showlabelCodeModal.visible = true
    },
    cancel () {
      this.$refs.showlabelCodeModal.visible = false
      this.query()
    },
    cancelDataImport () {
      this.$refs.labelcodeDataImport.visible = false
      this.query()
    },
    // 处理选中的数据
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.assetIdList = []
      this.selectedRowKeys = selectedRowKeys
      selectedRows.forEach(item => {
        this.assetIdList.push(item.assetId)
      })
    },
    printBarcode () {
      if (!this.assetIdList.length) {
        this.$message.info("请先选择要生成二维码的项目实例")
        return
      } else {
        let organId = this.queryCondition.organId
        let assetIdList = this.assetIdList
        let { href } = this.$router.resolve({
          path: "/barcodePrint", // 这里写的是要跳转的路由地址
            query:{
              organId: organId,
              assetId: assetIdList  //要传的参数
            }  // 这里写的是页面参数
        });
        window.open(href, "setTitle");
        window.getTitleFun = this.setOpenTile
      }
    }
  }
}
</script>

<style lang="less">
.barcodeManagement{
  .search-content-box{
    display: flex;
    justify-content: flex-end;
    .two-row-box{
      padding-top: 14px;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
}
</style>