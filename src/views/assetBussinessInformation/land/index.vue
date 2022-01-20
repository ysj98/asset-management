<!--
 * @Date: 2020-07-10 10:02:56
 * @Description: 土地信息
-->
<template>
  <div class="landInfo-page pb70">
    <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0, overflow: 'visible'}">
      <div slot="headerForm" class="search-content-box">
        <div class="top-search-one" style="padding: 0;">
          <div>
            <SG-Button v-if="exportPower" class="mr10" type="info" @click="exportOperationAttr">导出</SG-Button>
            <SG-Button v-if="listConfigPower" class="mr10" type="info" @click="listConfigDialogVisible=true">列表设置</SG-Button>
            <SG-Button v-if="downloadPower" class="mr10" type="info" @click="handleDownloadTemplate">下载模板</SG-Button>
            <SG-Button v-if="exportBillPower" class="mr10" type="info" @click="handleImport">导入业务信息</SG-Button>
          </div>
          <div style="overflow: visible;margin-top:-10px;">
            <!-- 公司 -->
            <treeSelect
                :typeFilter="typeFilter"
                placeholder='请选择组织机构'
                v-model="queryCondition.organId"
                :allowClear="false"
                :style="allWidth"
              @change="handleTreeChange"
            ></treeSelect>
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              :dict-options="projectDataList"
              placeholder='选择资产项目'
              v-model="queryCondition.projectId"
            />
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              placeholder='请选择资产状态'
              :dict-options="approvalStatusData"
              v-model="queryCondition.statuss"/>
            <a-input
                :maxLength="30"
                placeholder="资产名称/编码"
                v-model="queryCondition.landName"
                :style="allStyle"
            />
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <SG-Button @click="handleClear" class="mr10" type="info">清空</SG-Button>
          </div>
        </div>
      </div>
      <div slot="contentForm">
        <div class="top-search-one" style="padding: 0;">
          <div style="overflow: visible;margin-top: 10px;position: absolute;right: 155px;">
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              placeholder='全部资产分类'
              :dict-options="assetClassifyData"
              v-model="queryCondition.objectTypes"/>
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              :dict-options="landuseTypeOpt"
              placeholder='选择土地用途'
              v-model="queryCondition.useTypes"/>
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              :dict-options="[{label:'全部来源方式',value:''}]"
              menu-code="ams_source_type"
              placeholder='选择来源方式'
              v-model="queryCondition.sourceModes"/>
            <dict-select
              :style="allStyle"
              :isFilterAll="true"
              :dictOptions="operationMode"
              placeholder='选择经营方式'
              v-model="queryCondition.modeOperId"/>
          </div>
          <div style="overflow: visible;margin-top: 50px;position: absolute;right: 155px;">
            <ProvinceCityDistrict
                style="width: 530px;vertical-align: bottom;margin-right: 10px;"
                class="city"
                ref="ProvinceCityDistrict"
                v-model="provinces"
            ></ProvinceCityDistrict>
          </div>
        </div>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <div style="overflow-x: scroll;width: 100%">
        <overview-number :numList="numList"/>
    </div>
    <div class="create-form">
      <!-- 搜索框 -->
      <!-- 表格部分 -->
      <div>
        <a-table
            class="custom-table td-pd10"
            :loading="table.loading"
            :pagination="false"
            :columns="table.columns"
            :dataSource="table.dataSource"
            :locale="{emptyText: '暂无数据'}"
            :scroll="{x: 1200}"
        >
          <template slot="matchingName" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="operate" slot-scope="text, record">
            <OperationPopover
                :operationData="record.operationDataBtn"
                @operationFun="operationFun($event, record)"
            ></OperationPopover>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
            :pageLength="page.pageLength"
            :totalCount="table.totalCount"
            location="fixed"
            v-model="page.pageNo"
            @change="handleChange"
        />
      </div>
    </div>
    <list-config-dialog
      :visible="listConfigDialogVisible"
      :organ-id="queryCondition.organId"
      @submit="handleConfigSubmit"
      @close="listConfigDialogVisible = false"
    />
    <asset-manage :visible="assetManageVisible" @close="()=>assetManageVisible = false"/>
    <edit-dialog
        :visible="editVisible"
        :object="selectItem"
        @close="()=>editVisible = false"
      @submit="handleEditSubmit"
    />
    <export-doalog
      :visible= "exportVisible"
      :organ-id="queryCondition.organId"
      @close="()=>exportVisible = false"
      @submit="()=>exportVisible = false"
    />
    <!--导入-->
    <export-and-download @upload="uploadFile" showDown ref="batchImport" title="导入"/>
  </div>
</template>
<script>
import ExportAndDownload from "../../common/eportAndDownFile"
import SearchContainer from "@/views/common/SearchContainer";
import noDataTips from "@/components/noDataTips";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from "@/components/segiIcon.vue";
import { utils } from "@/utils/utils";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import {
  allStyle,
  columns,
  queryCondition,
  approvalStatusData,
} from "./dict.js";
import DictSelect from "../../common/DictSelect";
import ProvinceCityDistrict from "../../common/ProvinceCityDistrict";
import ListConfigDialog from "./components/ListConfigDialog";
import AssetManage from "./components/AssetManage";
import OverviewNumber from "./components/OverviewNumber";
import EditDialog from "./components/EditDialog";
import ExportDoalog from "./components/ExportDoalog";
import {exportOperationAttr} from "../../../api/assetBussinessInformation";
import ImportDoalog from "./components/ImportDoalog";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
    ImportDoalog,
    ExportDoalog,
    EditDialog,
    OverviewNumber,
    AssetManage,
    ListConfigDialog,
    ProvinceCityDistrict,
    DictSelect,
    TreeSelect,
    noDataTips,
    segiIcon,
    OperationPopover,
    SearchContainer,
    ExportAndDownload
  },
  data() {
    return {
      exportPower: false,
      listConfigPower: false,
      downloadPower: false,
      exportBillPower: false,
      selectItem: {},
      typeFilter,
      ASSET_MANAGEMENT,
      listConfigDialogVisible: false, // 列表设置标志位
      assetManageVisible: false,
      exportVisible: false, // 导出标志位
      importVisible: false, // 导入标志位
      installValue: [], // 安装日期
      operationMode: [], // 经营方式
      landuseTypeOpt: [], // 土地用途
      assetClassifyData: [], // 资产分类
      projectDataList: [], // 资产项目
      editVisible: false, // 编辑按钮
      allStyle,
      allWidth,
      approvalStatusData,
      provinces: {
        province: undefined,
        city: undefined,
        district: undefined
      },
      page: {
        pageNo: 1,         // 当前页
        pageLength: 10,       // 每页显示记录数
      },
      queryCondition: utils.deepClone(queryCondition),
      numList: [
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      table: {
        columns: [],
        dataSource: [{}],
        loading: false,
        totalCount: 0,
      },
      tableCache: [],
      colorList: [
        { bgColor: "#5b8ff9", fontColor: '#ffffff' },
        { bgColor: "#d48265", fontColor: '#ffffff' },
        { bgColor: "#4BD288", fontColor: '#ffffff' },
        { bgColor: "#1890FF", fontColor: '#ffffff' },
        { bgColor: "#DD81E6", fontColor: '#ffffff' }
      ],
      toggle: false
    };
  },
  watch: {
    $route() {
      if (
          this.$route.path === "/buildingDict" &&
          this.$route.query.refresh &&
          this.$route.query.showKey === "equipment"
      ) {
        this.queryCondition.pageN0 = 1;
        this.queryCondition.pageLength = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    handleDownloadTemplate () {
      this.exportVisible = true
    },
    init () {
      this.handlePower()
      this.queryModeOperList()
      this.queryLandUseTypeList()
    },
    handlePower() {
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BILL_MANAGEMENT_LAND_EXPORT)) {
        this.exportPower = true
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BILL_MANAGEMENT_LAND_LIST_CONFIG)) {
        this.listConfigPower = true
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BILL_MANAGEMENT_LAND_DOWNLOAD)) {
        this.downloadPower = true
      }
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BILL_MANAGEMENT_LAND_EXPORT_BILL)) {
        this.exportBillPower = true
      }
    },
    handleClear () {
      this.provinces = {
        province: undefined,
        city: undefined,
        district: undefined
      }
      this.$refs.ProvinceCityDistrict.allClearFn()
      const organId = this.queryCondition.organId
      this.queryCondition = utils.deepClone(queryCondition)
    },
    handleImport () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      this.$refs.batchImport.visible = true
    },
    handleTreeChange () {
      console.log('handleTreeChange')
      this.$nextTick(async ()=>{
        this.getListFn()
        this.getObjectKeyValueByOrganIdFn()
        await this.assetRolList()
        await this.query();
      })
    },
    async query() {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      const params = {
        ...this.page,
        ...this.queryCondition,
        city: this.provinces.city,
        region: this.provinces.district,
        province: this.provinces.province,
        statuss: this.queryCondition.statuss.join(","),
        useTypes: this.queryCondition.useTypes.join(","),
        projectId: this.queryCondition.projectId.join(","),
        modeOperId: this.queryCondition.modeOperId,
        sourceModes: this.queryCondition.sourceModes.join(","),
        objectTypes: this.queryCondition.objectTypes.join(","),
      };
      this.table.dataSource = []
      this.table.totalCount = 0
      try {
        this.table.loading = true;
        this.queryAssetAttrViewTotal(params)
        await this.queryAssetAttr(params)
        this.page.pageNo = 1;
        this.page.pageLength = 10;
        this.firstPageSlice(this.page.pageNo,this.page.pageLength)
      } finally {
        this.table.loading = false;
      }
    },
    // 重置分页查询
    searchQuery() {
      this.page.pageNo = 1;
      this.$nextTick(async ()=>{
        if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
        await this.assetRolList()
        await this.query();
      })
    },
    // 操作事件函数
    handleChange(data) {
      this.page.pageNo = data.pageNo;
      this.page.pageLength = data.pageLength;
      this.firstPageSlice(this.page.pageNo,this.page.pageLength)
    },
    firstPageSlice(pageNo, pageSize){
      let start = (pageNo-1)*pageSize
      let end = pageNo*pageSize
      end = end>this.table.totalCount? this.table.totalCount: end;
      this.table.dataSource = (this.tableCache || []).slice(start,end)
    },
    handleEditSubmit () {
      this.selectItem = {}
      this.editVisible = false
      this.query()
    },
    // 搜索
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleSelect (){
      console.log(2)
    },
    handleConfigSubmit () {
      this.listConfigDialogVisible = false;
      this.assetRolList()
    },
    operationFun (type, record) {
      switch (type) {
        case "edit":
          this.selectItem = record;
          this.editVisible = true
          break;
        case "enable":
          break;
        case "disable":
          break
      }
    },
    // 生成操作按钮
    createOperationBtn() {
      // 审批状态
      let arr = [];
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_BILL_MANAGEMENT_LAND_EDIT)) {
        arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      }
      return arr;
    },
    //////////////////////////////////////////////////////////////////
    async queryAssetAttr (params) {
      try {
        const {data: res} = await this.$api.assetBussinessInformation.queryAssetAttr(params)
        if (String(res.code) === '0') {
          this.tableCache = (res.data.data || []).map(item=> {
            // 将assetId添加入 内部自定义参数数组
            item.assetAttrList = (item.assetAttrList || []).map(node => ({
              ...node,
              objectId: item.assetId
            }))
            // 混合自定义参数
            const attrObj = (item.assetAttrList || []).reduce((obj,node) => {
              obj[node.attrCode] = node.attrValue
              return obj;
            }, {})
            return {...item,...attrObj}
          }).map(item => {
            return {
              ...item,
              operationDataBtn: this.createOperationBtn(),
            }
          });
          this.table.totalCount = res.data.count
        } else {
          this.$SG_Message.error(res.message)
        }
      } finally {
      }
    },
    async assetRolList () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      try {
        const params = {
          assetType: this.$store.state.ASSET_TYPE_CODE.LAND,
          organId: this.queryCondition.organId
        }
        const {data: res} = await this.$api.assetBussinessInformation.assetRolList(params)
        if (String(res.code) === '0') {
          this.generatorOptions(res.data)
        } else {
          this.$SG_Message.error(res.message)
        }
      } finally {
      }
    },
    /**
     *
     * @param customChose 默认列表
     * @param customShow 用户配置数据列表
     * @param templeCode 全量数据列表
     */
    generatorOptions ({customChose=[],customShow = [],templeCode = []}) {
      this.table.columns = []
      const itemList = templeCode.map(item => {
        return {
          ...item,
          label: item.colName,
          value: item.colCode
        }
      });
      itemList.forEach(item =>{ // 处理默认表格
        const choseNum = customChose.some(n=>n.colCode == item.colCode)
        const userShow = customShow.some(n=>n.colCode == item.colCode)
        if (choseNum || userShow) {
          this.table.columns.push({
            align: "center",
            title: item.label,
            dataIndex: item.value,
            width: 100
          })
        }
      })
      this.table.columns.push(...columns)
    },
    // 取全部经营方式
    queryModeOperList() {
      let data = {
        dictCode: "OCM_MODE_OPER",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_MODE_OPER",
        organId: this.organIdMain,
      }
      this.$api.basics.organDict(data).then((res) => {
        this.operationMode=[{label: '全部经营方式',value: ''}]
        if (res.data.code === "0") {
          let data = res.data.data
          this.operationMode = data.map((item) => ({
            value: item["value"],
            label: item["name"],
          }))
          this.operationMode.unshift({label: '全部经营方式',value: ''})
        }
      })
    },
    // 查询土地用途分类列表
    queryLandUseTypeList() {
      let data = {
        dictCode: "OCM_LANDUSE_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LANDUSE_TYPE",
        organId: this.organIdMain,
      }
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.landuseTypeOpt = data.map((item) => ({
            value: item["value"],
            label: item["name"],
          }))
          this.landuseTypeOpt.unshift({label:'全部土地用途',value:''})
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
        assetType: '4'
      }
      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              label: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = [{label: '全部资产分类', value: ''}, ...arr]
        }
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
              label: item.projectName,
              value: item.projectId
            })
          })
          this.projectDataList = [{label: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    async queryAssetAttrViewTotal (params) {
      const {data: res} = await this.$api.assetBussinessInformation.queryAssetAttrViewTotal(params)
      if (String(res.code) === '0') {
        // let asstNum = 0
        this.numList = (res.data.data || []).map((item, index)=>{
          console.log(item)
          return {
            title: item.attrName,
            key: item.attrName,
            value: item.landArea,
            fontColor: '#000',
            bgColor: '#fff'
          }
        })
        /**
         * assetNum: 1
         attrName: "assetNum"
         landArea: null
         */
      } else {
        this.$SG_Message.error(res.message)
      }
    },
    // 下载
    async exportOperationAttr () {
      if (!this.queryCondition.organId) { return this.$message.info('请选择组织机构') }
      const params = {
        organId: this.queryCondition.organId
      }
      try{
        const {data: res} = await this.$api.assetBussinessInformation.exportOperationAttr(params)
        let blob = new Blob([res])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `资产土地经营导出.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.$emit("submit")
      } catch (e) {
        this.$SG_Message.error("下载失败")
      }finally {
      }
    },
    // 批量导入
    uploadFile (file) {
      const { organId } = this.queryCondition
      let name = this.$SG_Message.loading({ duration: 0, content: '导入中' })
      let fileData = new FormData()
      fileData.append('attrModelFile', file)
      fileData.append("organId",organId)
      this.$api.assetBussinessInformation.readExcelModel(fileData).then(r => {
        this.$SG_Message.destroy(name)
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$SG_Message.success(res.message || '导入成功')
          this.$refs.batchImport.visible = false
        }
        throw res.message
      }).catch(err => {
        this.$SG_Message.destroy(name)
        this.$SG_Message.error(err || '批量导入失败')
      })
    }
  },
};
</script>
<style lang="less" scoped>
.custom-table {
  padding-bottom: 40px;
}
.top-search-one {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
</style>

