<!--
 * @Author: L
 * @Date: 2022-07-16 15:16:48
 * @LastEditTime: 2022-07-28 18:17:46
 * @Description: 资产项目责任人管理
-->
<!--价值登记业务页面Tab--价值登记记录组件-->
<template>
  <div class="projectManager">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          icon="export"
          @click="handleImport"
          :loading="importBtnLoading"
        >批量导入</SG-Button>
        <SG-Button
        class="ml10"
          icon="export"
          @click="downExport"
          :loading="downBtnLoading"
        >模板下载</SG-Button>
        <SG-Button
        class="ml10"
          icon="export"
          @click="handleExport"
          :loading="exportBtnLoading"
        >批量导出</SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <tree-select @changeTree="changeTree" style="width: 180px; text-align: left;" class="mr10" :showSearch='true'/>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="5">
            <a-input allowClear placeholder="资产项目名称" v-model.trim="queryObj.projectName" style="width: 180px; margin: 0 10px"/>
          </a-col>
          <a-col :span="5">
            <a-input allowClear placeholder="项目联系人名称/电话" v-model.trim="queryObj.contractOrTel" style="width: 180px; margin: 0 10px"/>
          </a-col>
          <a-col :span="5">
            <a-input allowClear placeholder="项目经理名称/电话" v-model.trim="queryObj.responsibilityOrTel" style="width: 180px; margin: 0 10px"/>
          </a-col>
          <a-col :span="5">
            <a-input allowClear placeholder="分管领导名称/电话" v-model.trim="queryObj.leaderOrTel" style="width: 180px; margin: 0 10px"/>
          </a-col>
          <a-col :span="4" style="text-align: left">
            <SG-Button type="primary" @click="query()">查询</SG-Button>
          </a-col>
        </a-row>
        <a-row style="margin-top: 14px">
          <a-col :span="24">
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--列表部分-->
    <a-table :scroll="scroll" v-bind="tableObj" size="middle">
      <template slot="operation" slot-scope="text, record">
        <OperationPopover :operationData="operationDataBtn"  @operationFun="operationFun($event, record)"></OperationPopover>
      </template>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => footerQueryTableData({ pageNo, pageLength })"/>
      <!--导入-->
    <export-and-download @upload="uploadFile" showDown ref="batchImport" title="导入" @down="down"></export-and-download>
    <thoseResponsible :type="type" v-if="thoseResponsibleShow" ref="thoseResponsibleRef" @handleCancel="handleCancel"></thoseResponsible>
  </div>
</template>

<script>
  import ExportAndDownload from "../common/eportAndDownFile"
  import NoDataTip from 'src/components/noDataTips'
  import TreeSelect from 'src/views/common/treeSelect'
  // import {ASSET_MANAGEMENT} from 'src/config/config.power'
  import {exportDataAsExcel} from "../common/commonQueryApi";
  import SearchContainer from 'src/views/common/SearchContainer'
  import OperationPopover from '@/components/OperationPopover'
  import thoseResponsible from './thoseResponsible'
  export default {
    name: 'WorthRegisterRecord',
    components: { SearchContainer, TreeSelect, NoDataTip, OperationPopover, ExportAndDownload, thoseResponsible },
    data () {
      return {
        thoseResponsibleShow: false,
        operationDataBtn: [
          {iconType: 'edit', text: '设置责任人', editType: 'set'},
          {iconType: 'file-text', text: '详情', editType: 'details'}
        ],
        // ASSET_MANAGEMENT, // 权限对象
        fold: true, // 查询条件折叠按钮
        exportBtnLoading: false, // 导出按钮
        scroll: {y: 420},
        downBtnLoading: false,
        importBtnLoading: false,
        organProjectType: {
          organId: '',
          organName: ''
        },
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          columns: [
            { title: '所属上级机构', dataIndex: 'organName'},
            { title: '资产项目名称', dataIndex: 'projectName'},
            { title: '资产项目编码', dataIndex: 'projectCode'},
            { title: '项目联系人', dataIndex: 'contractNames'},
            { title: '项目联系人电话', dataIndex: 'contractTels'},
            { title: '项目经理', dataIndex: 'manageNames'},
            { title: '项目经理电话', dataIndex: 'manageTels'},
            { title: '分管领导', dataIndex: 'leaderNames'},
            { title: '分管领导电话', dataIndex: 'leaderTels'},
            {
              title: '操作',
              width: 120,
              dataIndex: 'operation',
              scopedSlots:{
                customRender:'operation'
              }
            }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        queryObj: {
          contractOrTel: '',
          responsibilityOrTel: '',
          leaderOrTel: '',
          organId: '',
          projectName: ''
        },
        type: ''
      }
    },

    methods: {
      handleCancel (val) {
        this.thoseResponsibleShow = false
        this.queryTableData()
      },
      operationFun (type, record) {
        this.type = type
        this.thoseResponsibleShow = true
        this.$nextTick(() => {
          this.$refs.thoseResponsibleRef.visible = true
          this.$refs.thoseResponsibleRef.basicInformation = record
          this.$refs.thoseResponsibleRef.queryProjectResponsibilityDetail()
        })
      },
      // 获取选择的组织机构
      changeTree (organId) {
        this.queryObj.organId = organId
        organId && this.query()
      },
      down () {},
      // 导入
      handleImport () {
        this.importBtnLoading = true
        this.$refs.batchImport.visible = true
      },
      // 批量导入
      uploadFile (file) {
        const { organId } = this.queryObj
        let name = this.$SG_Message.loading({ duration: 0, content: '导入中' })
        let fileData = new FormData()
        fileData.append('file', file)
        this.$api.projectManager.importProjectResponsibility(fileData, organId).then(r => {
          this.$SG_Message.destroy(name)
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$SG_Message.success(res.message || '导入成功')
            this.importBtnLoading = false
            this.$refs.batchImport.visible = false
          } else {
            this.$SG_Message.success(res.message || '批量导入失败')
            this.importBtnLoading = false
            this.$refs.batchImport.visible = false
          }
        }).catch(err => {
          this.$SG_Message.destroy(name)
          this.$SG_Message.error(err || '批量导入失败')
        })
      },
      // 导出
      handleExport () {
        this.exportBtnLoading = true
        exportDataAsExcel(this.queryObj, this.$api.projectManager.exportProjectResponsibility, '资产项目责任人管理.xls', this).then(() => {
          this.exportBtnLoading = false
        })
      },
      // 模板下载
      downExport () {
        this.downBtnLoading = true
        // this.queryObj
        exportDataAsExcel('', this.$api.projectManager.downExport, '资产项目责任人模板.xls', this).then(() => {
          this.downBtnLoading = false
        })
      },
      footerQueryTableData ({pageNo, pageLength}) {
        this.paginationObj.pageNo = pageNo
        this.paginationObj.pageLength = pageLength
        this.queryTableData()
      },
      query () {
        this.paginationObj.pageNo = 1
        this.queryTableData()
      },
      // 查询列表数据
      queryTableData () {
        let form = {
          ...this.queryObj,
          pageNum: this.paginationObj.pageNo,
          pageSize: this.paginationObj.pageLength
        }
        this.tableObj.loading = true
        this.$api.projectManager.getProjectResponsibility(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data.map((item, index) => {
              return {
                ...item,
                key: index
              }
            })
            this.paginationObj.totalCount = count
          } else {
            this.$message.error(r.data.message || '查询接口出错')
          }
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
      }
    },

    created () {
    }
  }
</script>

<style lang='less' scoped>
  .projectManager {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
  }
</style>

