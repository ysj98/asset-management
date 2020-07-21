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
              <a-tag closable v-for="m in selectedList" :key="m.id" style="background: #fff;" @close="handleAddAsset(m)">
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
      <!--<span slot="registerOrderId" slot-scope="text, record">-->
        <!--<router-link-->
          <!--class="action_text"-->
          <!--:to="{path: '/reportTask/taskDetail', query: {taskId: record.registerOrderId}}"-->
        <!--&gt;{{text}}</router-link>-->
      <!--</span>-->
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
        v-model="addAssetList"
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
          rowKey: 'registerOrderId',
          columns: [
            { title: '登记单编号', dataIndex: 'registerOrderId', scopedSlots: { customRender: 'registerOrderId' }, width: 150 },
            { title: '资产名称', dataIndex: 'assetName'}, { title: '资产编码', dataIndex: 'assetCode' },
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'objectTypeName' },
             { title: '管理机构', dataIndex: 'organName' }, { title: '资产项目名称', dataIndex: 'projectName' },
            { title: '资产面积(㎡)', dataIndex: 'executeDate' }, { title: '资产位置', dataIndex: 'pasitionString', width: 150 },
            { title: '创建日期', dataIndex: 'createTime' }, { title: '创建人', dataIndex: 'createByName' },
            { title: '核实时间', dataIndex: 'verifierTime' }, { title: '核实人', dataIndex: 'verifierByName' }
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
          list ? this.typeOptions = list : this.$message.error('查询资产类型失败')
        })
      },

      // 处理资产登记单Modal关闭/保存
      handleModalAction (type) {
        if (type) {
          this.selectedList = this.addAssetList
          this.queryAssetByRegistId({})
        }
        this.modalObj.isShow = false
        this.addAssetList = this.selectedList
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
          this.selectedList = this.selectedList.filter(v => v.id !== m.id)
        } else {
          let {projectId, assetType} = this.form.getFieldsValue(['projectId', 'assetType'])
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
        const { selectedList } = this
        this.tableObj.loading = true
        this.$api.assets.getRegisterOrderDetailsPageByIdList({
          registerOrderIdList: selectedList, pageNum: pageNo, pageSize: pageLength
        }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message || '查询资产明细列表出错'
        }).catch(err => {
          this.$message.error(err || '查询资产明细列表出错')
        }).finally(() => this.tableObj.loading = false)
      },

      // 查询入库单详情
      queryDetail (storeId) {
        this.spinning = true
        this.$api.assets.queryAssetStoreDetail({storeId}).then(({data: res}) => {
          if (res && String(res.code) === '0') {
            const {storeName, projectId, assetType, remark, organId, attachmentList} = res.data
            this.attachmentList = (attachmentList || []).map(m => {
              return { url: m.attachmentPath, name: m.oldAttachmentName }
            })
            this.organId = organId
            return this.form.setFieldsValue({
              storeName, projectId, assetType, remark
            })
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询入库单信息出错')
        }).finally(() => this.spinning = false)
      },

      // 提交
      handleSubmit (type) {
        if (type === 'cancel') {
          return this.$router.go(-1)
        }
        this.form.validateFieldsAndScroll((err, values) => {
          const { attachmentList, organId, selectedList, storeId } = this
          this.validateAssets = !selectedList.length
          if (err || !selectedList.length) { return false }
          let form = {
            ...values, organId, status: 'debugger', storeId,
            assetRegisterId: selectedList.join(','),
            attachmentList: attachmentList.map(m => {
              return { attachmentPath: m.url, oldAttachmentName: m.name }
            })
          }
          this.submitBtnLoading = true
          this.$api.assets.addOrUpdateAssetStore(form).then(({data: res}) => {
            if (res && String(res.code) === '0') {
              this.$message.success(`${storeId ? '修改' : '提交'}成功`)
              // 跳回列表路由
              return this.$router.push({ path: '/assetIn', query: { refresh: true } })
            }
            throw res.message
          }).catch(err => {
            this.$message.error(err || `${storeId ? '修改' : '提交'}失败`)
          }).finally(() => this.submitBtnLoading = false)
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
      selectedList: function (val) {
        if (val.length) {
          this.validateAssets = false
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
