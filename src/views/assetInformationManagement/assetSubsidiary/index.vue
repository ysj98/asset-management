<!--
 * @Description: 
 * @Date: 2020-02-17 18:49:15
 * @LastEditTime: 2020-03-11 09:59:25
 -->
<!--
资产信息 附属配套信息 管理
-->
<template>
  <div>
    <div class="pb70">
      <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0}">
        <div slot="headerBtns">
          <SG-Button v-power="ASSET_MANAGEMENT.ASSET_CREATE_SUBSI"  @click="goPage('create')" class="mr10" icon="plus" type="primary">新增</SG-Button>
          <SG-Button class="mr10"  @click="openImportModal"><segiIcon type="#icon-ziyuan4" class="mr10"/>批量导入</SG-Button>
          <SG-Button type="primary" @click="exportData"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
        </div>
        <div slot="headerForm">
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
              :options="projectIdOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部资产类型 -->
            <a-select
              showSearch
              placeholder="请选择资产类型"
              v-model="queryCondition.assetTypeList"
              optionFilterProp="children"
              @change="assetTypeListSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allStyle"
              :options="assetTypeListOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 资产名称或编码 -->
            <a-input
              :maxLength="30"
              placeholder="输入资产名称/编码"
              v-model="queryCondition.assetNameOrCode"
              :style="allStyle"
            />
          </div>
        <div slot="contentForm" class="search-content-box">
          <div class="search-from-box">
            <!-- 全部资产状态 -->
            <a-select
              showSearch
              placeholder="请选择资产状态"
              v-model="queryCondition.assetStatusList"
              @change="assetStatusListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="assetStatusListOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部附属配套类型-->
            <a-select
              showSearch
              placeholder="请选择附属配套类型"
              v-model="queryCondition.matchingTypeList"
              @change="matchingTypeListSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="matchingTypeListOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部附属配套状态 -->
            <a-select
              showSearch
              placeholder="请选择附属配套状态"
              v-model="queryCondition.status"
              optionFilterProp="children"
              :style="allWidth"
              :options="statusOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <a-input
              :maxLength="30"
              v-model="queryCondition.matchingNameOrCode"
              placeholder="附属配套名称/编码"
              :style="allWidth"
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
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: 1400}"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="matchingName" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <OperationPopover :operationData="record.operationDataBtn"  @operationFun="operationFun($event, record)"></OperationPopover>
          </template>
        </a-table>
        <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
        <SG-FooterPagination
          :pageLength="queryCondition.pageSize"
          :totalCount="table.totalCount"
          location="absolute"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
    </div>
    <!-- 批量更新 -->
    <eportAndDownFile class="asset-subsidiary-eport" @upload="uploadModeFile" @down="downModeFile" ref="eportAndDownFile" width="800px" title="附属配套导入" >
      <div slot="upLoadModule" class="upLoad-content">
        <div class="upLoad-content-li">
          <span><i>*</i>资产项目：</span>
          <a-select
            showSearch
            placeholder="请选择资产项目"
            optionFilterProp="children"
            :style="allStyle"
            v-model="upLoadInfo.projectId"
            :options="assetProjectOptions"
            :filterOption="filterOption"></a-select>
        </div>
        <div class="upLoad-content-li">
          <span><i>*</i>资产类型：</span>
          <!-- @select="changeAssetType" -->
          <a-select
            placeholder="请选择资产类型"
            v-model="upLoadInfo.assetType"
            :options="assetTypeOptions"
            :style="allStyle"></a-select>
        </div>
        <div class="left-title">下载模板文件：</div>
        <div>
          <i class="file-background"></i>
          <span @click="downModeFile" class="down_btn" style="margin-left: 17px;">下载</span>
        </div>
      </div>
    </eportAndDownFile>
    <downErrorFile ref="downErrorFile">
      <div>{{upErrorInfo}}</div>
    </downErrorFile>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import eportAndDownFile from '@/views/common/eportAndDownFile.vue'
import segiIcon from '@/components/segiIcon.vue'
import { utils } from "@/utils/utils";
import {ASSET_MANAGEMENT} from '@/config/config.power'
import OperationPopover from '@/components/OperationPopover'
import downErrorFile from '@/views/common/downErrorFile'
import _ from 'lodash'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes = {
  create: "/subsidiary/create",
  detail: "/subsidiary/detail",
  edit: '/subsidiary/edit'
};
let operationInfo = {
  on: {
    msg: '启用',
    status: '1'
  },
  off: {
    msg: '禁用',
    status: '0'
  },
  delete: {
    msg: '删除',
    status: '-1'
  }
}
const allStyle = {
  width: "170px",
  "margin-right": "10px",
  // "margin-top": "14px"
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
  assetTypeList: [''], // 资产类型
  assetNameOrCode: '', // 资产名称或编码，模糊查询
  matchingTypeList: [''], // 附属配套类型
  status: '', // 附属配套状态
  assetStatusList: [''], // 资产状态(多选)
  matchingNameOrCode: "", // 附属配套名称/编码
  pageNum: 1,
  pageSize: 10
};
const projectIdOpt = [{ label: "全部资产项目", value: "" }];
const matchingTypeListOpt = [{ label: "全部附属配套类型", value: "" }];
const assetTypeListOpt = [{ label: "全部资产类型", value: "" }]
const assetStatusListOpt = [
  { label: "全部资产状态", value: "" },
  { label: "未生效", value: "0" },
  { label: "正常", value: "1" },
  { label: "资产报废", value: "2" },
  { label: "资产转让", value: "3" },
  { label: "资产报损", value: "4" },
  { label: "已清理", value: "5" },
  // { label: "已取消", value: "6" }
];
const statusOpt = [
  { label: "全部附属配套状态", value: "" },
  { label: "启用", value: "1" },
  { label: "停用", value: "2" },
]
let columns = [
  {
    title: "附属配套编号",
    dataIndex: "subsidiaryMatchingId",
    width: 150
  },
  {
    title: "所属机构",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "资产项目",
    dataIndex: "projectName",
    width: 120
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: 120
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: 120
  },
  {
    title: "附属配套名称",
    dataIndex: "matchingName",
    scopedSlots: { customRender: "matchingName" },
    width: 150
  },
  {
    title: "附属配套编码",
    dataIndex: "matchingCode",
    width: 150
  },
  {
    title: "类型",
    dataIndex: "matchingTypeName",
    width: 100
  },
  {
    title: "规格型号",
    dataIndex: "specificationType",
    width: 120
  },
  {
    title: "价值(元)",
    dataIndex: "value",
    width: 120
  },
  {
    title: "数量",
    dataIndex: "number",
    width: 120
  },
  {
    title: "计量单位",
    dataIndex: "unitOfMeasurementName",
    width: 100
  },
  {
    title: "是否接管前附属配套",
    dataIndex: "isBeforeName",
    width: 150
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  }
];
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon,
    eportAndDownFile,
    OperationPopover,
    downErrorFile
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      toggle: true,
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      projectIdOpt,
      matchingTypeListOpt,
      assetTypeListOpt,
      assetStatusListOpt,
      statusOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      },
      upErrorInfo: '',
      upLoadInfo: {
        projectId: undefined,
        assetType: undefined
      },
      assetProjectOptions: [],
      assetTypeOptions: []
    };
  },
  
  watch: {
    '$route' () {
      if (this.$route.path === '/subsidiary' && this.$route.query.refresh) {
        this.queryCondition.pageNum = 1
        this.queryCondition.pageSize = 10
          this.query()
        }
    },
    projectIdOpt: {
      handler (val) {
        let assetProjectOptions = _.cloneDeep(val)
        assetProjectOptions.splice(0, 1)
        this.assetProjectOptions = [...assetProjectOptions]
      },
      immediate: true,
      deep: true
    },
    assetTypeListOpt: {
      handler (val) {
        let assetTypeOptions = _.cloneDeep(val)
        assetTypeOptions.splice(0, 1)
        this.assetTypeOptions = [...assetTypeOptions]
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.platformDictFn("asset_type")
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      // 资产类型参数改变
      data.assetTypeList = utils.deepClone(data.assetTypeList).filter(item => item !== '')
      data.assetStatusList = utils.deepClone(data.assetStatusList).filter(item => item !== '')
      data.matchingTypeList = utils.deepClone(data.matchingTypeList).filter(item => item !== '')
      
      this.table.loading = true;
      this.$api.subsidiary.getListPage(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.settingMethodName = item.settingMethodName || '--'
              item.kindOfRightName = item.kindOfRightName || '--'
              item.warrantNbr = item.warrantNbr || '--'
              item.statusName = item.statusName || '--'
              item.unitOfMeasurementName = item.unitOfMeasurementName || '--'
              item.number = item.number && item.number !== 0 ? item.number : '--'
              return {
                key: getUuid(),
                ...item,
                operationDataBtn: this.createOperationBtn(item)
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 生成操作按钮
    createOperationBtn (record) {
      // 审批状态   
      let arr = []
      if (this.$power.has(ASSET_MANAGEMENT.ASSET_EDIT_SUBSI)) {
        arr.push({iconType: 'edit', text: '编辑', editType: 'edit'})
      }
      if (String(record.status) === '0' && this.$power.has(ASSET_MANAGEMENT.ASSET_STATUS_SUBSI)) {
        arr.push({iconType: 'play-circle', text: '启用', editType: 'on'})
      }
      if (String(record.status) === '1' && this.$power.has(ASSET_MANAGEMENT.ASSET_STATUS_SUBSI)) {
        arr.push({iconType: 'close-circle', text: '禁用', editType: 'off'})
      }
      if (String(record.status) === '0' && this.$power.has(ASSET_MANAGEMENT.ASSET_DELETE_SUBSI)) {
        arr.push({iconType: 'delete', text: '删除', editType: 'delete'})
      }
      arr.push({iconType: 'file-text', text: '详情', editType: 'detail'})
      return arr
    },
    // 操作事件函数
    operationFun (type, record) {
      console.log('操作事件', type, record)
      if (['edit', 'detail'].includes(type)) {
        this.goPage(type, record)
      }
      if (['on', 'off', 'delete'].includes(type)) {
        let info = operationInfo[type]
        this.$SG_Modal.confirm({
          title: `确定${info['msg']}该附属配套吗?`,
          okText: '确定',
          cancelText: '关闭',
          onOk: () => {
            let data = {
              subsidiaryMatchingId: record.subsidiaryMatchingId,
              status: info['status']
            }
            this.$api.subsidiary.updateStatusOrDelete(data).then(res => {
              if (res.data.code === '0') {
               this.$SG_Message.success(`${info['msg']}成功！`)
               this.query()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      }
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
    assetTypeListSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypeList = this.handleMultipleSelectValue(value, this.queryCondition.assetTypeList, this.assetTypeListOpt)
      })
    },
    assetStatusListSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.assetStatusList = this.handleMultipleSelectValue(value, this.queryCondition.assetStatusList, this.assetStatusListOpt)
      })
    },
    matchingTypeListSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.matchingTypeList = this.handleMultipleSelectValue(value, this.queryCondition.matchingTypeList, this.matchingTypeListOpt)
      })
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = "";
      this.queryCondition.matchingTypeList = [''];
      this.getObjectKeyValueByOrganIdFn();
      this.organDict('SUBSIDIARY_MATCHING_TYPE');
      this.searchQuery();
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
    openExport () {},
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
      this.queryCondition.assetTypeList = [''];
      this.queryCondition.assetNameOrCode = '';
      this.queryCondition.matchingTypeList = [''];
      this.queryCondition.status = '';
      this.queryCondition.assetStatusList = [''];
      this.queryCondition.matchingNameOrCode = "";
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item }));
          // 资产类型
          if (code === "asset_type") {
            this.assetTypeListOpt = [
              ...utils.deepClone(assetTypeListOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出列表
    exportData () {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      // 资产类型参数改变
      data.assetTypeList = utils.deepClone(data.assetTypeList).filter(item => item !== '')
      data.assetStatusList = utils.deepClone(data.assetStatusList).filter(item => item !== '')
      data.matchingTypeList = utils.deepClone(data.matchingTypeList).filter(item => item !== '')
      let loadingName = this.SG_Loding('导出中...')
      this.$api.subsidiary.exportData(data).then(res => {
        this.$SG_Message.destroy(loadingName)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        // ${this.organName}
        a.download = `附属配套.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error('附属配套导出失败!')
      })
    },
    // 下载模板文件
    downModeFile () {
      if (this.upLoadInfo.projectId === '' || this.upLoadInfo.projectId === undefined) {
        this.$SG_Message.error('请选择资产项目')
        return false
      }
      if (this.upLoadInfo.assetType === '' || this.upLoadInfo.assetType === undefined) {
        this.$SG_Message.error('请选择资产类型')
        return false
      }
      let loadingName = this.SG_Loding('下载中...')
      let params = Object.assign({}, this.upLoadInfo)
      this.$api.assets.downBatchModle(params).then(res => {
        this.$SG_Message.destroy(loadingName)
        // if (Number(res.data.code) === 0) {
          
        // } else {
        //   this.$SG_Message.error(res.data.message)
        // }
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        // ${this.organName}
        a.download = `附属配套模板.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error(res.data.message)
      })
    },
    // 上传文件
    uploadModeFile (file) {
      // this.$refs.eportAndDownFile.hideModal()
      let fileData = new FormData()
      fileData.append('file', file)
      fileData.append('organId', this.queryCondition.organId)
      // fileData.append('projectId', this.queryCondition.projectId)
      let loadingName = this.SG_Loding('导入中...')
      this.$api.subsidiary.batchImport(fileData).then(res => {
        if (Number(res.data.code) === 0) {
          this.DE_Loding(loadingName).then(() => {
            this.$refs.eportAndDownFile.visible = false
            this.$SG_Message.success('导入成功！')
            this.query()
          }) 
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$refs.eportAndDownFile.visible = true
            this.upErrorInfo = res.data.message
            this.$SG_Message.error(res.data.message || '导入失败！')
          })
        }
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error(res.data.message || '导入失败！')
        })
      })
    },
    // 显示导入弹窗
    openImportModal () {
      this.$refs.eportAndDownFile.visible = true
    },
    // 机构字典
    organDict (code) {
      this.$api.assets.organDict({ organId: this.queryCondition.organId, code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item, key: item.value }));
          // 附属信息类型
          if (code === "SUBSIDIARY_MATCHING_TYPE") {
            this.matchingTypeListOpt = [
              ...utils.deepClone(matchingTypeListOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    goPage(type, record) {
      let query = {
        type,
        organName: this.organName,
        organId: this.queryCondition.organId
      };
      if (['detail', 'edit'].includes(type)) {
        query.subsidiaryMatchingId = record.subsidiaryMatchingId
        query.assetId = record.assetId
      }
      this.$router.push({ path: operationTypes[type], query });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // // 资产类型发生变化
    // changeAssetType(value) {
    //   this.$nextTick(function() {
    //     this.upLoadInfo.assetType = this.handleMultipleSelectValue(
    //       value,
    //       this.upLoadInfo.assetType,
    //       this.assetTypeOptions
    //     )
    //   })
    // }
  },
  mounted () {
    // this.platformDict("asset_type");
  }
};
</script>
<style lang="less">
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
.upLoad-content {
  padding: 20px 0 20px 50px;
  border-left: 1px solid rgba(192,199,209,1);
  .file-background{
    display: inline-block;
    width: 49px;
    height: 56px;
    background-image: url('../../../assets/image/undertake/exl.png');
    background-size: 100% 100%;
  }
  .upLoad-content-li {
    width: 100%;
    display: inline-block;
    margin-bottom: 20px;
    // .ant-select-selection__placeholder {
      // display: block!important;
    // }
    & >span > i {
      color: #ff3a3a;
    }
  }
  .left-title{
    margin-bottom: 15px;
  }
}
</style>
