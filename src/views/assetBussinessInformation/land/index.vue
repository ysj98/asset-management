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
            <SG-Button class="mr10" type="info">导出</SG-Button>
            <SG-Button class="mr10" type="info" @click="listConfigDialogVisible=true">列表设置</SG-Button>
            <SG-Button class="mr10" type="info" @click="handleDownloadTemplate">下载模板</SG-Button>
            <SG-Button class="mr10" type="info">导入业务信息</SG-Button>
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
              mode="multiple"
              :maxTagCount="1"
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
            :pageLength="queryCondition.pageSize"
            :totalCount="table.totalCount"
            location="fixed"
            v-model="queryCondition.pageNum"
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
  </div>
</template>
<script>
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
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
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
    SearchContainer
  },
  data() {
    return {
      selectItem: {},
      typeFilter,
      ASSET_MANAGEMENT,
      listConfigDialogVisible: false, // 列表设置标志位
      assetManageVisible: false,
      exportVisible: false, // 导出标志位
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
      queryCondition: utils.deepClone(queryCondition),
      numList: [
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      table: {
        columns: [],
        dataSource: [{}],
        loading: false,
        totalCount: 0,
      },
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
      this.queryModeOperList()
      this.queryLandUseTypeList()
    },
    handleTreeChange () {
      console.log('handleTreeChange')
      this.$nextTick(async ()=>{
        this.getListFn()
        this.getObjectKeyValueByOrganIdFn()
        this.table.loading = true
        await this.assetRolList()
        await this.query();
      })
    },
    async query() {
      const params = {
        ...this.queryCondition,
        city: this.provinces.city,
        province: this.provinces.province,
        region: this.provinces.district,
        statuss: this.queryCondition.statuss.join(","),
        projectId: this.queryCondition.projectId.join(","),
        modeOperId: this.queryCondition.modeOperId.join(","),
        useTypes: this.queryCondition.useTypes.join(""),
      };
      this.table.dataSource = []
      this.table.totalCount = 0
      try {
        this.table.loading = true;
        this.queryAssetAttrViewTotal(params)
        await this.queryAssetAttr(params)
      } finally {
        this.table.loading = false;
      }
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNo = 1;
      this.$nextTick(async ()=>{
        this.table.loading = true
        await this.assetRolList()
        await this.query();
      })
    },
    // 操作事件函数
    handleChange(data) {
      this.queryCondition.pageNo = data.pageNo;
      this.queryCondition.pageLength = data.pageLength;
      this.query();
    },
    handleEditSubmit () {
      this.selectItem = {}
      this.editVisible = false
    },
    // 搜索
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleAssetClassChange (v) {
      let list = this.queryCondition.equipmentInstNameOrCode || []
      if (v === '') {
        list = ['']
      } else {
        list = list.filter(item=>item !== '')
      }
      this.queryCondition.equipmentInstNameOrCode = [...list]
    },
    handleSelect (){
      console.log(2)
    },
    handleConfigSubmit () {
      this.listConfigDialogVisible = false;
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
      // if (this.$power.has(ASSET_MANAGEMENT.ASSET_DICT_EQUIPMENT_EDIT)) {
      arr.push({ iconType: "edit", text: "编辑", editType: "edit" });
      // }
      return arr;
    },
    //////////////////////////////////////////////////////////////////
    async queryAssetAttr (params) {
      try {
        const {data: res} = await this.$api.assetBussinessInformation.queryAssetAttr(params)
        if (String(res.code) === '0') {
          this.table.dataSource = (res.data.data || []).map(item => {
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
        let asstNum = 0
        this.numList = (res.data.data || []).map(item=>{
          if (item.assetNum) {
            asstNum += Number(item.assetNum)
          }
          return {
            title: item.attrName,
            key: item.attrName,
            value: 0,
            fontColor: '#8400ff'
          }
        })
        this.numList.unshift({title: '资产数量', key: 'assetCount', value: asstNum, fontColor: '#8400ff'})
        /**
         * assetNum: 1
         attrName: "assetNum"
         landArea: null
         */
      } else {
        this.$SG_Message.error(res.message)
      }
    }
  },
};
</script>
<style lang="less" scoped>
.top-search-one {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
</style>

