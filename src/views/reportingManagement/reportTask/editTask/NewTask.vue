<!--呈报任务-我填报的任务--新建任务页面-->
<template>
  <div class="new_task">
    <!--任务信息部分-->
    <SG-Title title="任务信息"/>
    <a-form :form="form">
      <a-row>
        <a-col :span="8">
          <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              placeholder="请输入任务名称"
              v-decorator="['taskName', { rules: [{required: true, message: '请输入任务名称'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" id="needValue">
          <a-form-item
            required
            label="所属机构"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :help="validateOrganId ? '请选择所属机构' : ''"
            :validate-status="validateOrganId ? 'error' : ''"
          >
            <tree-select style="width: 100%;" @changeTree="changeTree" :allowClear="false"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产项目" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              showSearch
              style="width: 100%;"
              :options="$addTitle(projectOptions)"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              @change="getId($event, 'projectId')"
              v-decorator="['projectId', {rules: [{required: true, message: '请选择资产项目'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="表单名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%;"
              placeholder="请选择表单"
              :options="$addTitle(billOptions)"
              @change="getId($event, 'reportBillId')"
              v-decorator="['reportBillId', {rules: [{required: true, message: '请选择表单'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="填报人" :label-col="labelCol" :wrapper-col="wrapperCol">
            <span>{{userName}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            required
            label="审核人"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :help="validateAuditUsers ? '请选择审核人' : ''"
            :validate-status="validateAuditUsers ? 'error' : ''"
          >
            <span>
              <a-tag closable v-for="m in auditUsers" :key="m.id" style="background: #fff;" @close="handleAuditUser(m)">
                {{m.name}}
              </a-tag>
              <a-tag color="#108ee9" @click="handleAuditUser('')">
                <a-icon type="user-add" style="margin-right: 3px"/>选择
              </a-tag>
            </span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注" :label-col="{span: 2}" :wrapper-col="{span: 22}">
            <a-textarea
              :rows="4"
              style="resize: none"
              placeholder="请输入备注"
              v-decorator="['remark', {rules: [{max: 200, message: '最多200个字符'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="附件" :label-col="{span: 2}" :wrapper-col="{span: 14}">
            <SG-UploadFile type="all" v-model="attachmentList"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!--填报数据部分-->
    <task-table-edit ref="taskTable" :taskInfo="taskInfo"/>
    <!--底部审批操作按钮组-->
    <form-footer location="fixed">
      <SG-Button @click="handleSubmit('draft')" :loading="submitBtnLoading" style="margin-right: 8px">暂存草稿</SG-Button>
      <SG-Button type="primary" @click="handleSubmit('')" :loading="submitBtnLoading">提交审批</SG-Button>
    </form-footer>
    <!--选择审核人Modal-->
    <select-staff ref="selectAuditUser" @change="getAuditUser" :selectOptList="auditUsers"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import FormFooter from '@/components/FormFooter.vue'
  import TreeSelect from 'src/views/common/treeSelect'
  import TaskTableEdit from '../components/TaskTableEdit'
  import SelectStaff from '@/views/common/selectStaffOrPost'
  export default {
    name: 'NewTask',
    components: { TaskTableEdit, TreeSelect, SelectStaff, FormFooter },
    data () {
      return {
        organId: '',
        organName: '',
        labelCol: {span: 6},
        wrapperCol: {span: 18},
        submitBtnLoading: false, // 提交按钮loading
        form: this.$form.createForm(this), // 注册form
        attachmentList: [], // 附件数据
        userName: '', // 当前用户名
        userId: '', // 当前用户Id
        auditUsers: [], // 审核人，多个，分隔
        validateOrganId: false, // 自定义校验organId标志
        validateAuditUsers: false, // 自定义校验auditUsers标志
        billOptions: [], // 查询条件-表单选项
        projectOptions: [], // 资产项目选项
        taskInfo: {
          organId: '', // 组织id
          projectId: '', // 项目id
          reportBillId: '' // 表单id
        }
      }
    },

    methods: {
      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 查询表单列表
      queryBillList () {
        this.$api.reportManage.queryAllReportBill().then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let arr = [];
            (res.data || []).forEach(item => {
              if (['资产运营信息', '资产收入信息', '资产费用信息', '资产折旧信息'].includes(item.billName)) {
                arr.push({ key: item.reportBillId, title: item.billName })
              }
            })
            return this.billOptions = arr
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || "查询表单列表失败")
        })
      },

      // 获取选中的审核人
      getAuditUser (list = []) {
        this.auditUsers = list
      },

      // 获取projectId,reportBillId
      getId (id, type) {
        let _this = this
        let { reportBillId } = _this.taskInfo
        if (type === 'reportBillId' && reportBillId) {
          _this.$confirm({
            title: '确定要继续吗?',
            content: '此操作会清空已填报数据列表！',
            onOk () {
              _this['taskInfo']['reportBillId'] = id
            },
            onCancel () {
              _this.form.setFieldsValue({reportBillId})
            }
          })
        } else {
          _this['taskInfo'][type] = id
        }
      },

      // 获取选择的组织机构
      changeTree (id, name) {
        this['taskInfo']['organId'] = id
        Object.assign(this, { organId: id, organName: name, projectOptions: [] })
        this.form.resetFields('projectId')
        this.getId ('', 'projectId')
        id && this.queryProjectList(id)
      },

      // 根据organId查询资产项目
      queryProjectList (organId) {
        this.$api.assets.getObjectKeyValueByOrganId({organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.projectOptions = (res.data || []).map(item => {
              return { key: item.projectId, title: item.projectName }
            })
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || "查询资产项目失败")
        })
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
          let beginDate = moment().format('YYYY-MM-DD')
          let form = {
            reportTask: { ...taskInfo, beginDate, endDate: beginDate },
            isSubmit: type ? 'N' : 'Y',
            attachment, detailList, action: 'xz'
          }
          that.submitBtnLoading = true
          that.$api.reportManage.saveTaskOrDetail(form).then(r => {
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

      // 校验必填项
      validateFields (resolve) {
        this.form.validateFieldsAndScroll((err, values) => {
          const { attachmentList, organId, userId, auditUsers } = this
          // 校验自定义必填项
          if (!organId || !auditUsers.length) {
            document.getElementById('needValue').scrollIntoView()
            this.validateAuditUsers = !auditUsers.length
            return this.validateOrganId = !organId
          }
          if (!err) {
            let { projectId, reportBillId, taskName, remark } = values
            // 处理附件格式
            let attachment = attachmentList.map(m => {
              return { attachmentPath: m.url, oldAttachmentName: m.name }
            })
            resolve({
              attachment,
              taskInfo: {
                reportBy: userId,
                auditBy: auditUsers.map(v => v.id).join(','),
                projectId, reportBillId, taskName, remark, organId
              }
            })
          }
        })
      },

      // 删除、选择审核人
      handleAuditUser (m) {
        if (m) {
          this.auditUsers = this.auditUsers.filter(v => v.id !== m.id)
        } else {
          this.$refs.selectAuditUser.visible = true
        }
      }
    },

    mounted () {
      this.queryBillList()
      // 获取当前用户信息
      let { userId, name } = this.$store.state.auth.userinfo || {}
      this.userId = userId
      this.userName = name
    },

    watch: {
      // 自定义必填项校验
      auditUsers: function (val) {
        if (val.length) {
          this.validateAuditUsers = false
        }
      },

      // 自定义必填项校验
      organId: function (val) {
        if (val) {
          this.validateOrganId = false
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .new_task {
    padding: 0 40px 80px 40px;
    // margin-bottom: 80px;
  }
</style>
