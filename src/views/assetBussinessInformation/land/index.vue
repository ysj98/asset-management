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
            <SG-Button class="mr10" type="info">下载模板</SG-Button>
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
              placeholder='请选择资产类型'
              :dict-options="approvalStatusData"
              v-model="queryCondition.equipmentInstNameOrCode"/>
            <a-input
                :maxLength="30"
                placeholder="资产名称/编码"
                v-model="queryCondition.equipmentInstNameOrCode"
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
                :style="allStyle"
                placeholder='全部资产分类'
                v-model="queryCondition.equipmentInstNameOrCode"/>
            <dict-select
                :style="allStyle"
                placeholder='选择土地用途'
                v-model="queryCondition.equipmentInstNameOrCode"/>
            <dict-select
                :style="allStyle"
                placeholder='选择来源方式'
                v-model="queryCondition.equipmentInstNameOrCode"/>
            <dict-select
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :isFilterAll="true"
              :dictOptions="operationMode"
              placeholder='选择经营方式'
              v-model="queryCondition.equipmentInstNameOrCode"/>
          </div>
          <div style="overflow: visible;margin-top: 50px;position: absolute;right: 155px;">
            <ProvinceCityDistrict
                style="width: 530px;vertical-align: bottom;margin-right: 10px;"
                class="city"
                ref="ProvinceCityDistrict"
                v-model="queryCondition.equipmentInstNameOrCode"
            ></ProvinceCityDistrict>
          </div>
        </div>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <div style="overflow-x: scroll;width: 100%">
      <a-spin :spinning="false">
        <overview-number :numList="numList" isEmit/>
      </a-spin>
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
          <template slot="operation" slot-scope="text, record">
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
            :pageLength="queryCondition.pageLength"
            :totalCount="table.totalCount"
            location="fixed"
            v-model="queryCondition.pageNo"
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
import OverviewNumber from "../../common/OverviewNumber";
const allWidth = {width: '170px', 'margin-right': '10px', 'margin-top': '14px'}
export default {
  components: {
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
      typeFilter,
      ASSET_MANAGEMENT,
      listConfigDialogVisible: false, // 列表设置标志位
      assetManageVisible: false,
      installValue: [], // 安装日期
      expValue: [], // 报废日期
      operationMode: [], // 经营方式
      hasPowerExport: false, // 导出按钮权限
      allStyle,
      allWidth,
      approvalStatusData,
      queryCondition: utils.deepClone(queryCondition),
      numList: [
        {title: '资产数量', key: 'assetCount', value: 0, fontColor: '#8400ff'},
        {title: '待开发用地(㎡)', key: 'area', value: 0, fontColor: '#8400ff'},
        {title: '已建成物业补地价用地(㎡)', key: 'transferOperationArea', value: 0, fontColor: '#8400ff'},
        {title: '商品房、安居房用地(㎡)', key: 'idleArea', value: 0, fontColor: '#8400ff'},
        {title: '转让用地(㎡)', key: 'selfUserArea', value: 0,  fontColor: '#8400ff'},
        {title: '已回收用地(㎡)', key: 'selfUserArea', value: 0, fontColor: '#8400ff'},
        {title: '补充协议已移交用地(㎡)', key: 'selfUserArea', value: 0,  fontColor: '#8400ff'},
        {title: '......(㎡)', key: 'otherArea', value: 0, fontColor: '#8400ff'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      table: {
        columns: [],
        dataSource: [{}],
        loading: false,
        totalCount: 0,
      },
      topOrganId: '',
      createPower: false, // 新建
      editPower: false, // 编辑
      deletePower: false, // 删除
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
    init () {
      this.queryModeOperList()
    },
    handleTreeChange () {
      console.log('handleTreeChange')
      this.$nextTick(async ()=>{
        this.table.loading = true
        await this.assetRolList()
        await this.query();
      })
    },
    async query() {
      let data = {
        ...this.queryCondition,
        // communityId: this.queryCondition.communityId.join(","),
        systemCode: "assets",
        organId: ""
      };
      let organId = ""
      data.organId = organId
      delete data.communityId
      this.table.dataSource = [{}]
      this.table.totalCount = 0
      try {
        this.table.loading = true;
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
    //////////////////////////////////////////////////////////////////
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

