<!--价值登记页面--资产价值登记Tab页面-->
<template>
  <div class="asset_worth_register">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          icon="plus"
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_AWR_ADD"
          @click="handleBtnAction({type: 'add'})"
        >新建价值登记单</SG-Button>
        <SG-Button
          icon="export"
          :loading="exportBtnLoading"
          style="margin-left: 10px"
          @click="handleExport"
          v-power="ASSET_MANAGEMENT.WORTH_REGISTER_ASSET_EXPORT"
        >导出</SG-Button>
        <SG-Button
          icon="export"
          :loading="bulkImportLoading"
          style="margin-left: 10px"
          @click="bulkImport"
          v-power="ASSET_MANAGEMENT.ASSET_AWR_IMPORT"
        >批量导入</SG-Button>
      </div>
      <div slot="headerForm">
        <tree-select @changeTree="changeTree" style="width: 180px"/>
        <a-input placeholder="请输入登记名称" @pressEnter="queryTableData" v-model.trim="registerName" style="width: 180px; margin: 0 10px"/>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-select
              v-bind="properties"
              :options="projectOptions"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              v-model="organProjectType.projectId"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              v-bind="properties"
              placeholder="请选择资产类型"
              :options="assetTypeOptions"
              :filterOption="filterOption"
              v-model="organProjectType.assetType"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              v-bind="properties"
              @change="queryTableData"
              v-model="approvalStatus"
              :options="statusOptions"
              placeholder="请选择登记单状态"
              :filterOption="filterOption"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              v-bind="properties"
              :options="methodOptions"
              class="assess_method_style"
              placeholder="请选择评估方法"
              :filterOption="filterOption"
              v-model="assessmentMethod"
            />
          </a-col>
          <a-col :span="3" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row style="margin-top: 14px">
          <a-col :span="24">
            <date-method-organ v-model="dateMethodOrgan" :organId="organProjectType.organId"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--数据总览-->
    <overview-number :numList="numList" style="margin-bottom: 8px"/>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          okText="确定"
          cancelText="取消"
          title="确定要删除该资产项目吗?"
          v-power="ASSET_MANAGEMENT.ASSET_AWR_DELETE"
          @confirm="confirmDelete(record.registerId)"
          v-if="Number(record.approvalStatus) === 0 || Number(record.approvalStatus) === 3"
        >
          <span class="action_text">删除</span>
        </a-popconfirm>
        <router-link
          class="action_text"
          :to="{name: '价值登记详情', params: {registerId: record.registerId, type: 'detail'}}"
        >详情</router-link>
        <router-link
          class="action_text"
          v-if="Number(record.approvalStatus) === 2"
          v-power="ASSET_MANAGEMENT.ASSET_AWR_APPROVAL"
          :to="{name: '价值登记审批', params: {registerId: record.registerId, type: 'approval'}}"
        >审批</router-link>
        <router-link
          class="action_text"
          v-power="ASSET_MANAGEMENT.ASSET_AWR_EDIT"
          v-if="Number(record.approvalStatus) === 0 || Number(record.approvalStatus) === 3"
          :to="{name: '价值登记编辑', params: {registerId: record.registerId, type: 'edit'}}"
        >编辑</router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <!-- 批量更新 -->
    <batch-import class="asset-subsidiary-eport" @upload="uploadFile" @down="downTemplate" ref="batchImport" width="800px" title="价值登记批量导入">
      <div slot="upLoadModule" class="upLoad-content">
        <div class="upLoad-content-li">
          <span><i>*</i>资产项目：</span>
          <a-select
            showSearch
            placeholder="请选择资产项目"
            optionFilterProp="children"
            :style="allStyle"
            v-model="fileProjectId"
            :options="projectOptions"
            :filterOption="filterOption"></a-select>
        </div>
        <div class="left-title">下载模板文件：</div>
        <div>
          <i class="file-background"></i>
          <span @click="downTemplate" class="down_btn" style="margin-left: 17px;">下载</span>
        </div>
      </div>
    </batch-import>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import NoDataTip from 'src/components/noDataTips'
  import TreeSelect from 'src/views/common/treeSelect'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import DateMethodOrgan from '../components/DateMethodOrgan'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import SearchContainer from 'src/views/common/SearchContainer'
  import BatchImport from 'src/views/common/eportAndDownFile'
  import {queryProjectListByOrganId, filterOption, queryAssetTypeList, queryAssetMethodList, exportDataAsExcel} from 'src/views/common/commonQueryApi'
  const allStyle = { width: "170px", "margin-right": "10px"};
  export default {
    name: 'index',
    props: ['refreshKey'],
    components: { SearchContainer, DateMethodOrgan, NoDataTip, TreeSelect, OverviewNumber, BatchImport },
    data () {
      return {
        allStyle: allStyle,
        fileProjectId: '',
        ASSET_MANAGEMENT, // 权限对象
        fold: true, // 查询条件折叠按钮
        registerName: '', // 查询条件-登记名称
        exportBtnLoading: false, // 导出按钮loading
        bulkImportLoading: false,   // 批量导入
        organProjectType: {
          organId: '',
          organName: '',
          projectId: undefined,
          assetType: undefined
        }, // 查询条件：组织机构-资产项目-资产类型 { organId, organName, projectId, assetType }
        projectOptions: [], // 资产项目选项
        assetTypeOptions: [], // 资产类型选项
        dateMethodOrgan: {
          beginDate: moment().add(-180, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD') // 默认查询最近半年的提交数据
        }, // { assessOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate, assessMethod }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        assessmentMethod: undefined, // 评估方法
        methodOptions: [], // 评估方法选项
        approvalStatus: undefined, // 查询条件-登记状态
        statusOptions: [
          { title: '全部状态', key: '-1' }, { title: '草稿', key: '0' }, { title: '待审批', key: '2' },
          { title: '已驳回', key: '3' }, { title: '已审批', key: '1' }, { title: '已取消', key: '4' }
        ], // 查询条件-状态选项
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 1600 },
          pagination: false,
          rowKey: 'registerId',
          columns: [
            { title: '登记单ID', dataIndex: 'registerId', fixed: 'left', width: 150  },
            { title: '所属机构', dataIndex: 'organName', fixed: 'left', width: 180  },
            { title: '价值登记单名称', dataIndex: 'registerName' }, { title: '资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '评估方法', dataIndex: 'assessmentMethodName' },
            { title: '评估机构', dataIndex: 'assessmentOrganName' }, { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '资产数量', dataIndex: 'num' }, { title: '提交人', dataIndex: 'createByName' },
            { title: '提交时间', dataIndex: 'createTime' }, { title: '状态', dataIndex: 'approvalStatusName' },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 220 }
          ]
        },
        numList: [
          {title: '全部', key: 'total', value: 0, fontColor: '#324057'},
          {title: '草稿', key: 'draft', value: 0, fontColor: '#324057'},
          {title: '待审批', key: 'await', value: 0, fontColor: '#324057'},
          {title: '已驳回', key: 'reject', value: 0, fontColor: '#324057'},
          {title: '已审批', key: 'complete', value: 0, fontColor: '#324057'},
          {title: '已取消', key: 'cancel', value: 0, fontColor: '#324057'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        properties: { allowClear: true, showSearch: true, maxTagCount: 1, style: "width: 100%" } // 查询表单控件公共属性
      }
    },

    methods: {
      // 下拉搜索筛选
      filterOption,

      // 查询统计信息
      querySumInfo (form) {
        this.$api.worthRegister.queryValueRegisterPageListSum(form).then(({data: res}) => {
          if (res && String(res.code) === '0') {
            let { numList } = this
            let obj = res.data || {}
            return this.numList = numList.map(m => {
              return { ...m, value: obj[m.key] || 0 }
            })
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询汇总接口出错')
        })
      },

      // 获取选择的组织机构
      changeTree (organId, organName) {
        Object.assign(this.organProjectType, {
          projectId: undefined,
          organName, organId
        })
        this.projectOptions = [] // 清空
        this.queryProjectByOrganId(organId)
        organId && this.queryTableData({})
      },
      
      // 根据organId查询资产项目
      queryProjectByOrganId (organId) {
        organId && queryProjectListByOrganId(organId).then(list =>
          list ? this.projectOptions = list : this.$message.error('查询资产项目失败')
        )
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        queryAssetTypeList().then(list => {
          list ? this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list) : this.$message.error('查询楼栋失败')
        })
      },

      // 查询评估方法--平台字典
      queryAssetMethod () {
        queryAssetMethodList().then(list => {
          list ? this.methodOptions = [{title: '全部评估方法', key: '-1'}].concat(list) : this.$message.error('查询评估方法失败')
        })
      },

      // 处理新增add、编辑edit、详情detail、审批approval操作
      handleBtnAction ({id, type}) {
        if (type === 'add') {
          const { organProjectType: { organId, organName } } = this
          // if (!organId) { return this.$message.info('请选择组织机构') }
          this.$router.push({ name: '价值登记新增', params: { organId, organName, type: 'add' }})
        } else {
          console.log(id)
        }
      },

      // 导出
      handleExport () {
        this.exportBtnLoading = true
        let data = this.queryTableData({type: 'export'})
        exportDataAsExcel(data, this.$api.tableManage.exportRegisterExcel, '资产价值登记列表.xlsx', this).then(() => {
          this.exportBtnLoading = false
        })
      },
      // 导入
      bulkImport () {
        this.$refs.batchImport.visible = true
      },
      // 下载导入模板文件
      downTemplate () {
        if (this.fileProjectId === '' || this.fileProjectId === undefined) {
          this.$SG_Message.error('请选择资产项目')
          return false
        }
        let obj = {
          organId: this.organProjectType.organId,
          projectId: this.fileProjectId
        }
        exportDataAsExcel(obj, this.$api.worthRegister.downloadValueTemplate, '资产项目批量导入模板.xlsx', this)
      },
      // 批量导入
      uploadFile (file) {
        if (this.fileProjectId === '' || this.fileProjectId === undefined) {
          this.$SG_Message.error('请选择资产项目')
          return false
        }
        let name = this.$SG_Message.loading({ duration: 0, content: '批量导入中' })
        let fileData = new FormData()
        fileData.append('file', file)
        fileData.append('organId', this.organProjectType.organId)
        fileData.append('projectId', this.fileProjectId || '')
        this.$api.worthRegister.importValueTemplate(fileData).then(r => {
          this.$SG_Message.destroy(name)
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$SG_Message.success(res.message || '导入成功')
            this.$refs.batchImport.visible = false
            return this.queryTableData({type: 'search'})
          }
          throw res.message
        }).catch(err => {
          this.$SG_Message.destroy(name)
          this.$SG_Message.error(err || '批量导入失败')
        })
      },
      // 删除项目
      confirmDelete (registerId) {
        this.tableObj.loading = true
        this.$api.worthRegister.updateStatus({registerId, approvalStatus: 4}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('删除成功')
            // 更新列表
            const { pageNo, pageLength } = this.paginationObj
            return this.queryTableData({pageNo, pageLength})
          }
          throw res.message || '删除失败'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '删除失败')
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const {
          registerName, approvalStatus, organProjectType, organProjectType: { assetType },
          dateMethodOrgan, assessmentMethod, dateMethodOrgan: { assessmentOrgan }
        } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        let form = {
          ...organProjectType, ...dateMethodOrgan,
          registerName, pageSize: pageLength, pageNum: pageNo,
          assetType: (!assetType || assetType.includes('-1')) ? undefined : assetType.join(','),
          approvalStatus: (!approvalStatus || approvalStatus.includes('-1')) ? undefined : approvalStatus.join(','),
          assessmentOrgan: (!assessmentOrgan || assessmentOrgan.includes('-1')) ? undefined : assessmentOrgan.join(','),
          assessmentMethod: (!assessmentMethod || assessmentMethod.includes('-1')) ? undefined : assessmentMethod.join(',')
        }
        if (type === 'export') { return form }
        this.querySumInfo(form)
        this.tableObj.loading = true
        this.$api.worthRegister.queryRegisterList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询资产价值登记接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产价值登记接口出错')
        })
      },
    },
    
    created () {
      this.queryAssetType()
      this.queryAssetMethod()
    },

    watch: {
      // 全选与其他选项互斥处理
      approvalStatus: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.approvalStatus = ['-1']
        }
      },

      // 全选与其他选项互斥处理
      // sourceTypeList: function (val) {
      //   if (val && val.length !== 1 && val.includes('allType')) {
      //     this.sourceTypeList = ['allType']
      //   }
      // },

      // 长度不能超过30字符
      registerName: function (val, pre) {
        if (val && val.length > 40) {
          this.$message.warn("登记名称不能超40个字符")
          this.registerName = pre
        }
      },

      'organProjectType.projectId': function () {
        this.queryTableData({})
      },

      'organProjectType.assetType': function (assetType) {
        if (assetType && assetType.length !== 1 && assetType.includes('-1')) {
          this.organProjectType.assetType = ['-1']
        }
        this.queryTableData({})
      },

      assessmentMethod: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.assessmentMethod = ['-1']
        }
        this.queryTableData({})
      },

      dateMethodOrgan: function () {
        this.queryTableData({})
      },

      // 刷新页面
      refreshKey: function (key, preKey) {
        const { paginationObj: { pageNo, pageLength }} = this
        key !== preKey && this.queryTableData ({pageNo, pageLength})
      }
    }
    
  }
</script>

<style lang='less' scoped>
  .asset_worth_register {
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
    .action_text {
      color: #0084FF;
      cursor: pointer;
      margin-right: 12px;
      white-space: nowrap;
    }
  }
</style>

<style lang='less'>
  .upLoad-content {
    padding: 20px 0 20px 50px;
    border-left: 1px solid rgba(192,199,209,1);
    .file-background{
      display: inline-block;
      width: 49px;
      height: 56px;
      background-image: url('../../../../assets/image/undertake/exl.png');
      background-size: 100% 100%;
    }
    .upLoad-content-li {
      width: 100%;
      display: inline-block;
      margin-bottom: 20px;
      & >span > i {
        color: #ff3a3a;
      }
    }
    .left-title{
      margin-bottom: 15px;
    }
  }
</style>