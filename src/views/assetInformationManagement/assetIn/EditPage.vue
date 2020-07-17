<!--资产入库-入口列表页-编辑、新建-->
<template>
  <a-spin :spinning="spinning" class="edit_page">
      <SG-Title title="基础信息"/>
      <a-form :form="form">
        <a-row>
          <a-col :span="8">
            <a-form-item label="入库单名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入入库单名称"
                v-decorator="['storeName', { rules: [{required: true, message: '请输入入库单名称'}, {max: 30, message: '最多30个字符'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="资产项目" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select showSearch style="width: 100%;" :options="projectOptions"
                placeholder="请选择资产项目" :filterOption="filterOption"
                v-decorator="['projectId', {rules: [{required: true, message: '请选择资产项目'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="资产类型" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select style="width: 100%;" placeholder="请选择资产类型" :options="typeOptions"
                v-decorator="['assetType', {rules: [{required: true, message: '请选择资产类型'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item required label="关联资产登记单" :label-col="labelCol" :wrapper-col="wrapperCol"
              :help="validateAssets ? '请选择关联资产登记单' : ''" :validate-status="validateAssets ? 'error' : ''"
            >
            <span>
              <a-tag closable v-for="m in addAssetList" :key="m.id" style="background: #fff;" @close="handleAddAsset(m)">
                {{m.name}}
              </a-tag>
              <a-tag color="#108ee9" @click="handleAddAsset('')">
                <a-icon type="select" style="margin-right: 8px"/>选择
              </a-tag>
            </span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" :label-col="{span: 2}" :wrapper-col="{span: 22}">
              <a-textarea :rows="4" style="resize: none" placeholder="请输入备注"
                v-decorator="['remark', {rules: [{max: 200, message: '最多200个字符'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="附件" :label-col="{span: 2}" :wrapper-col="{span: 22}">
              <SG-UploadFile type="all" v-model="attachmentList"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!--资产明细-->
    <SG-Title title="资产明细"/>
    <a-table v-bind="tableObj" class="custom-table td-pd10" bordered>
      <span slot="reportTaskId" slot-scope="text, record">
        <router-link
          class="action_text"
          :to="{path: '/reportTask/taskDetail', query: {taskId: record.reportTaskId}}"
        >{{text}}</router-link>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryAssetByRegistId({ pageNo, pageLength })"/>
    <!--底部审批操作按钮组-->
    <form-footer location="fixed">
      <SG-Button type="primary" @click="handleSubmit('')" :loading="submitBtnLoading">提交审批</SG-Button>
      <SG-Button @click="handleSubmit('cancel')" :loading="submitBtnLoading" style="margin-right: 8px">取消</SG-Button>
    </form-footer>
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.isShow"
      @ok="handleModalAction('ok')"
      @cancel="handleModalAction('')"
    >
      <!-- 选择资产 -->
      <select-asset
        :organId="organId"
        :projectId="projectId"
        :assetType="assetType"
        v-model="selectedList"
        :height="modalObj.height"
        :key="`${projectId}${assetType}`"
      />
    </SG-Modal>
  </a-spin>
</template>

<script>
  import FormFooter from '@/components/FormFooter'
  import SelectAsset from './components/SelectRegistAsset'
  import {queryProjectListByOrganId, filterOption, queryAssetTypeList} from 'src/views/common/commonQueryApi'
  export default {
    name: 'EditPage',
    components: {FormFooter, SelectAsset},
    data () {
      return {
        organId: '',
        labelCol: {span: 6},
        wrapperCol: {span: 18},
        storeId: '', // 入库单Id
        projectId: '', // 资产Id
        assetType: '', // 资产类型
        attachmentList: [], // 附件数据
        typeOptions: [], // 资产类型选项
        spinning: false, // 页面加载状态
        projectOptions: [], // 资产项目选项
        selectedList: [], // 选中的资产登记单
        addAssetList: [], // 添加的资产关联单数据
        submitBtnLoading: false, // 提交按钮loading
        form: this.$form.createForm(this), // 注册form
        validateAssets: false, // 自定义校验auditUsers标志
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 1600 },
          pagination: false,
          rowKey: 'reportTaskId',
          columns: [
            { title: '任务编号', dataIndex: 'reportTaskId', scopedSlots: { customRender: 'reportTaskId' }, width: 150 },
            { title: '所属机构', dataIndex: 'organName'}, { title: '资产项目', dataIndex: 'projectName' },
            { title: '任务名称', dataIndex: 'taskName' }, { title: '呈报表单', dataIndex: 'reportBillName' },
             { title: '任务类型', dataIndex: 'taskTypeName' }, { title: '填报人', dataIndex: 'reportByName' },
            { title: '计划执行日期', dataIndex: 'executeDate' }, { title: '审核人', dataIndex: 'auditByName' },
            { title: '实际填报日期', dataIndex: 'completeDate' }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        modalObj: {
          width: 1000, // Modal宽度
          height: 450, // Modal高度
          title: '选择资产',
          okText: '确定选择',
          cancelText: '取消',
          isShow: false
        },
      }
    },

    methods: {
      // 下拉搜索筛选
      filterOption,

      // 查询资产类型--平台字典
      queryAssetType () {
        queryAssetTypeList().then(list => {
          list ? this.typeOptions = list : this.$message.error('查询楼栋失败')
        })
      },

      // 处理资产登记单Modal关闭/保存
      handleModalAction (type) {
        let { isEditAll } = this
        if (type) {
          isEditAll ? this.handleAssetValueAll() : this.getAssetList()
        } else {
          isEditAll ? this.handleEditTableAll(false) : this.handleAddModal(false)
        }
      },

      // 根据organId查询资产项目
      queryProjectByOrganId (organId) {
        organId && queryProjectListByOrganId(organId).then(list =>
          list ? this.projectOptions = list : this.$message.error('查询资产项目失败')
        )
      },

      // 删除、选择关联资产登记单
      handleAddAsset (m) {
        if (m) {
          this.addAssetList = this.addAssetList.filter(v => v.id !== m.id)
        } else {
          let {projectId, assetType} = this.form.getFieldsValue(['projectId', 'assetType'])
          debugger
          if (!projectId || !assetType) {
            this.$message.warn(`请选择${!projectId ? '资产项目' : ''} ${!assetType ? '资产类型' : ''}`)
          } else {
            Object.assign(this, {projectId, assetType})
            this.modalObj.isShow = true
          }
        }
      },
      
      // 根据资产登记单查询资产明细
      queryAssetByRegistId ({pageNo = 1, pageLength = 10}) {
        debugger
      },

      // 查询入库单详情
      queryDetail (storeId) {
        debugger
      },

      // 提交
      handleSubmit (type) {
        let that = this
        Promise.all([
          new Promise(resolve => that.validateFields(resolve)),
          new Promise(resolve => that.$refs['taskTable'].handleSubmit(resolve))
        ]).then(res => {
          const [values, data] = res
          const { attachment, taskInfo } = values
          const { detailList } = data
          let beginDate = ''
          let form = {
            reportTask: { ...taskInfo, beginDate, endDate: beginDate },
            isSubmit: type ? 'N' : 'Y',
            attachment, detailList, action: 'xz'
          }
          that.submitBtnLoading = true
          Promise.reject(form).then(r => {
            that.submitBtnLoading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              that.$message.success(`${type ? '暂存草稿' : '提交审批'}成功`)
              // 跳回列表路由
              return that.$router.push({ name: '呈报任务', params: { refresh: true } })
            }
            throw res.message
          }).catch(err => {
            that.submitBtnLoading = false
            that.$message.error(err || `${type ? '暂存草稿' : '提交审批'}失败`)
          })
        })
      },
    },

    mounted () {
      // 获取当前用户信息
      let { query: {organId, storeId} } = this.$route
      Object.assign(this, { organId, storeId })
      organId && this.queryProjectByOrganId(organId)
      storeId && this.queryDetail(storeId)
      this.queryAssetType()
    },

    watch: {
      // 自定义必填项校验
      auditUsers: function (val) {
        if (val.length) {
          this.validateAuditUsers = false
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .edit_page {
    padding: 0 45px 70px 70px;
    & /deep/ .ant-table-placeholder {
      display: block;
      border-bottom: 1px solid #e8e8e8;
    }
  }
</style>
