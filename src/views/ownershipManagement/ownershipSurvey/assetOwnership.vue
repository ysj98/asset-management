<!--
 * @Date: 2019-11-26 16:47:09
 * @Author: chen han
 * @Description: 资产权属
 -->
<template>
  <div>
    <div class="pb70 content-active-box">
      <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0}">
        <div slot="headerBtns">
          <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_OPT_EXPORT" class="mr10" @click="openExport"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
        </div>
        <div slot="contentForm" class="search-content-box" style="text-align: left; position: absolute;">
          <!-- style="text-align: left;width: 100%; position: absolute" -->
          <div class="search-from-box">
            <treeSelect
              @changeTree="changeTree"
              placeholder="请选择组织机构"
              :allowClear="false"
              :style="allStyle"
            ></treeSelect>
            <!-- 资产项目 -->
            <a-select
              showSearch
              placeholder="请选择资产项目"
              v-model="queryCondition.projectId"
              optionFilterProp="children"
              :style="allStyle"
              :options="$addTitle(projectIdOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <a-select
              :maxTagCount="1"
              :allowClear="false"
              mode="multiple"
              :tokenSeparators="[',']"
              placeholder="全部资产类型"
              v-model="queryCondition.assetTypes"
              :options="$addTitle(assetTypeOptions)"
              :style="allStyle"
              @change="changeAssetType"
            ></a-select>
            <EquipmentSelectTree
              v-if="isSelectedEquipment"
              :style="allStyle"
              :top-organ-id="queryCondition.organId"
              :multiple="true"
              v-model="queryCondition.objectTypes"
              :options-data-format="(data)=>{
                return [{label: '全部资产分类', value: '', isLeaf: true},...data]
              }"
              @select="assetClassifyDataFn($event,true)"
            />
            <a-select
              v-else
              showSearch
              :allowClear="false"
              placeholder="全部资产分类"
              optionFilterProp="children"
              :maxTagCount="1"
              :style="allStyle"
              mode="multiple"
              v-model="queryCondition.objectTypes"
              :tokenSeparators="[',']"
              :options="$addTitle(assetClassifyData)"
              @select="assetClassifyDataFn"
            ></a-select>
            <!-- 全部权属情况 -->
            <a-select
              showSearch
              placeholder="请选择权属情况"
              v-model="queryCondition.ownershipStatuss"
              optionFilterProp="children"
              @change="ownershipStatussSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(ownershipStatussOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部权属人 -->
            <a-select
              showSearch
              placeholder="请选择权属人"
              v-model="queryCondition.obligeeId"
              optionFilterProp="children"
              :style="allStyle"
              :options="$addTitle(obligeeIdOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 权证类型 -->
            <a-select
              showSearch
              placeholder="请选择权证类型"
              v-model="queryCondition.kindOfRights"
              optionFilterProp="children"
              @change="kindOfRightsSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(kindOfRightsOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 权属类型 -->
            <a-select
              showSearch
              placeholder="请选择权属类型"
              v-model="queryCondition.shipType"
              optionFilterProp="children"
              :style="allStyle"
              :options="$addTitle(shipTypeOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部资产状态 -->
            <a-select
              showSearch
              placeholder="请选择资产状态"
              v-model="queryCondition.statuss"
              @change="statussSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="$addTitle(statussOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 证件情况 -->
            <a-select
              showSearch
              placeholder="请选择"
              v-model="queryCondition.supportMaterial"
              :style="allWidth"
              :options="$addTitle(supportMaterialOpt)"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <a-input
              :maxLength="30"
              v-model="queryCondition.name"
              placeholder="输入资产名称/权利号"
              :style="allStyle"
            />
            <a-input
              :maxLength="30"
              v-model="queryCondition.ownershipRemark"
              placeholder="权属备注"
              :style="allStyle"
            />
          </div>
          <div class="two-row-box">
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <SG-Button @click="restQuery">清除</SG-Button>
          </div>
        </div>
      </SearchContainer>
      <div>
        <a-table
          class="custom-scroll custom-total td-pd10"
          :loading="table.loading"
          :pagination="false"
          :scroll="tableScrollOptions"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
          rowKey="assetObjectId"
          ref="table"
        >
          <template slot="assetName" slot-scope="text, record, index">
            <span v-if="index < table.dataSource.length - 2" class="nav_name" @click="goPage('detail', record)">{{text}}</span>
            <span v-else :title="record.warrantNbr">{{record.assetName}}</span>
          </template>
          <template slot="tranProgress" slot-scope="text, record">
            <div style="padding-right: 20px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <span v-if="index < table.dataSource.length - 2" v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_SET" @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <div style="height: 70px;"></div>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="fixed"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from '@/components/segiIcon.vue'
import { utils } from "@/utils/utils";
import {ASSET_MANAGEMENT} from '@/config/config.power'
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
import {handleTableHeaderScrollHeight, handleTableScrollHeight, handleTableTotalRow} from "utils/share";
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes = {
  detail: "/ownershipSurvey/assetOwnershipDetail"
};
const allStyle = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px"
};
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px",
  height: '32px',
  overflow: 'hidden'
};
const queryCondition = {
  organId: "",
  projectId: "",
  ownershipStatuss: [''],  // 权属情况(多选)
  objectTypes: [''],    // 资产分类
  assetTypes: [''],     // 资产类型
  obligeeId: "",           // 权属人
  kindOfRights: [''],      // 权证类型(多选)
  shipType: '',            // 权属类型
  statuss: [''],           // 资产状态(多选)
  name: "",                // 资产名称/权证号
  ownershipRemark: "",
  pageNum: 1,
  pageSize: 10,
  supportMaterial: ''
};
const projectIdOpt = [{ label: "全部资产项目", value: "" }];
const ownershipStatussOpt = [
  { label: "全部权属情况", value: "" },
  { label: "有证", value: "1" },
  { label: "无证", value: "0" },
  { label: "待办", value: "2" }
];
const obligeeIdOpt = [{ label: "全部权属人", value: "" }];
const kindOfRightsOpt = [{ label: "全部权证类型", value: "" }];
const shipTypeOpt = [{ label: "全部权属类型", value: "" }];
const statussOpt = [
  { label: "全部资产状态", value: "" },
  { label: "待入库", value: "0" },
  { label: "正常", value: "1" },
  { label: "报废", value: "2" },
  { label: "转让", value: "3" },
  { label: "报损", value: "4" },
  { label: "已出库", value: "5" },
  { label: "已取消", value: "6" },
  { label: "入库中", value: "7" }
];
const supportMaterialOpt = [
  { label: "全部证件情况", value: "" },
  { label: "有证明材料证件", value: 1 },
  { label: "无证明材料证件", value: 0 },
]
// 需要合计的列
const totalKeyArr = ['area']
let columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    scopedSlots: { customRender: "assetName" },
    width: 200,
    fixed: 'left'
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: 300
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: 120
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
    width: 200
  },
  {
    title: "管理机构",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: 120
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: 360
  },
  {
    title: "面积(㎡)",
    dataIndex: "area",
    width: 200
  },
  {
    title: "权属情况",
    dataIndex: "ownershipStatusName",
    width: 100
  },
  {
    title: "权属类型",
    dataIndex: "shipTypeName",
    width: 100
  },
  {
    title: "权属办理方式",
    dataIndex: "settingMethodName",
    width: 120
  },
  {
    title: "权证类型",
    dataIndex: "kindOfRightName",
    width: 120
  },
  {
    title: "权证号",
    dataIndex: "warrantNbr",
    width: 120
  },
  {
    title: "资产状态",
    dataIndex: "statusName",
    width: 100
  },
  {
    title: "权属备注",
    dataIndex: "ownershipRemark",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  },
];
// 添加 根据宽度自动省略 属性
columns.forEach(ele=>ele.ellipsis = true)
columns.push({
  title:'',
})
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon,
    EquipmentSelectTree
  },
  data() {
    return {
      tableScrollOptions: { x: "100%"},
      assetClassifyData: [{label: '全部资产分类', value: ''}],
      assetTypeOptions: [],
      ASSET_MANAGEMENT,
      toggle: true,
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      projectIdOpt,
      ownershipStatussOpt,
      obligeeIdOpt,
      kindOfRightsOpt,
      shipTypeOpt,
      statussOpt,
      supportMaterialOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  computed:{
    isSelectedEquipment(){
      const assetTypeArr = this.queryCondition.assetTypes
      return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    }
  },
  created() {
    this.platformDictFn("AMS_KIND_OF_RIGHT");
    this.platformDictFn("AMS_ASSET_KIND_OF_RIGHT");
    this.platformDictFn("asset_type");
    handleTableScrollHeight(this.tableScrollOptions, 530)
  },
  mounted() {
    handleTableHeaderScrollHeight(this.$refs.table.$el)
  },
  methods: {
    queryOwnershipCardTableTotal(form){
      this.$api.basics.statistics(form).then(({data:{code,message,data}})=>{
        if (code==="0"){
          const temp = this.table.dataSource.pop()
          const resData = {
            area: data.areaCount
          }
          this.table.dataSource.push({...temp,...resData})
        }else {
          this.$message.error(message)
        }
      })
    },
    query() {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      data.ownershipStatuss = data.ownershipStatuss.join(',')
      data.kindOfRights = data.kindOfRights.join(',')
      data.statuss = data.statuss.join(',')
      data.assetTypes[0] === '' ? data.assetTypes = [] : data.assetTypes.join(',')
      data.objectTypes[0] === '' ? data.objectTypes = [] : data.objectTypes.join(',')
      // data.assetTypes = data.assetTypes.join(',')
      // data.objectTypes = data.objectTypes.join(',')
      this.table.loading = true;
      this.$api.basics.assetList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data ? res.data.data.data : [];
            this.table.dataSource = result.map(item => {
              item.settingMethodName = item.settingMethodName || '--'
              item.kindOfRightName = item.kindOfRightName || '--'
              item.warrantNbr = item.warrantNbr || '--'
              return {
                key: getUuid(),
                ...item
              };
            });
            handleTableTotalRow({
              columns: this.table.columns,
              dataSource: this.table.dataSource,
              rowKey:'assetObjectId',
              totalKeyArr,
            });
            this.queryOwnershipCardTableTotal(data)
            this.table.totalCount = res.data.data ? res.data.data.count : 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ""
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map(item => {
            return {
              label: item.projectName,
              value: item.projectId
            };
          });
          this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...result];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 权属人
    ownerShipUserSelect() {
      let data = { organId: this.queryCondition.organId };
      this.$api.basics.ownerShipUserSelect(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          result = result.map(item => {
            return {...item, value: item.obligeeId, label: item.obligeeName}
          })
          this.obligeeIdOpt = [...utils.deepClone(obligeeIdOpt), ...result]
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    ownershipStatussSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.ownershipStatuss = this.handleMultipleSelectValue(value, this.queryCondition.ownershipStatuss, this.ownershipStatussOpt)
      })
    },
    kindOfRightsSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.kindOfRights = this.handleMultipleSelectValue(value, this.queryCondition.kindOfRights, this.kindOfRightsOpt)
      })
    },
    assetClassifyDataFn (value,isSelectedEquipment) {
      this.$nextTick(function () {
        const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyData
        this.queryCondition.objectTypes = this.handleMultipleSelectValue(value, this.queryCondition.objectTypes, resOptions)
      })
    },
    changeAssetType (value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypes = this.handleMultipleSelectValue(value, this.queryCondition.assetTypes, this.assetTypeOptions)
        if (!this.queryCondition.assetTypes[0] || this.queryCondition.assetTypes.length > 1 ) {
          this.assetClassifyData = [{label: '全部资产分类', value: ''}]
          this.queryCondition.objectTypes = ['']
        }else {
          this.getListFn()
        }
      })
    },
    statussSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.statuss = this.handleMultipleSelectValue(value, this.queryCondition.statuss, this.statussOpt)
      })
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = "";
      this.queryCondition.obligeeId = "";
      this.queryCondition.objectTypes = ['']
      this.queryCondition.assetTypes = ['']
      this.getObjectKeyValueByOrganIdFn();
      this.ownerShipUserSelect();
      this.searchQuery();
      this.getListFn()
    },
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf('') !== -1
      let len = data.length
      // 如果点击全选或者取消全选
      if (data[len-1] === '' || len === 0) {
        return data = ['']
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === (dataOptions.length-1)) {
        return data = ['']
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(''), 1)
      }
      return data
    },
    // 导出
    openExport () {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      data.assetTypes[0] === '' ? data.assetTypes = [] : data.assetTypes.join(',')
      data.objectTypes[0] === '' ? data.objectTypes = [] : data.objectTypes.join(',')
      data.ownershipStatuss = data.ownershipStatuss.join(',')
      data.kindOfRights = data.kindOfRights.join(',')
      data.statuss = data.statuss.join(',')
      // data.assetTypes = data.assetTypes.join(',')
      // data.objectTypes = data.objectTypes.join(',')
      data.pageNum = 1
      data.pageSize = 1
      this.$api.basics.assetExport(data).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `资产权属表.xls`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 重置查询条件
    restQuery() {
      this.queryCondition.projectId = "";
      this.queryCondition.ownershipStatuss = [''];
      this.queryCondition.obligeeId = "";
      this.queryCondition.kindOfRights = [''];
      this.queryCondition.statuss = [''];
      this.queryCondition.name = "";
      this.queryCondition.ownershipRemark = ""
      this.queryCondition.assetTypes = ['']
      this.queryCondition.objectTypes = ['']
      this.queryCondition.shipType = "";
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item }));
          // 权证类型
          if (code === "AMS_KIND_OF_RIGHT") {
            this.kindOfRightsOpt = [
              ...utils.deepClone(kindOfRightsOpt),
              ...arr
            ];
          } else if (code === 'AMS_ASSET_KIND_OF_RIGHT') {
            // 权属类型
            this.shipTypeOpt = [
              ...utils.deepClone(shipTypeOpt),
              ...arr
            ];
          } else if (code === "asset_type") {
            this.assetTypeOptions = [
              {
                label: "全部资产类型",
                value: ""
              },
              ...arr
            ];
            this.getListFn()
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetTypes.length > 0 ? this.queryCondition.assetTypes.join(',') : ''
      }
      this.$api.assets.getList(obj).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              label: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = [{label: '全部资产分类', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    goPage(type, record) {
      let query = {
        type,
        // assetHouseId: record.assetHouseId,
        assetObjectId: record.assetObjectId,
        assetType: record.assetType,
        organId: record.organId
      };
      this.$router.push({ path: operationTypes[type], query });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>
<style lang="less" scoped>
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>

<style lang="less">
.content-active-box {
  position: relative;
  .search-content {
    height: 170px !important;
  }
}
</style>
