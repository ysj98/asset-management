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
        <a-col :span="8">
          <a-form-item
            required
            label="所属机构"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :help="validateOrganId ? '请选择所属机构' : ''"
            :validate-status="validateOrganId ? 'error' : ''"
          >
            <tree-select style="width: 100%;" @changeTree="changeTree"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产项目" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%;"
              placeholder="请选择资产项目"
              :options="projectOptions"
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
              :options="billOptions"
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
    <task-table-edit :taskInfo="taskInfo"/>
    <!--选择审核人Modal-->
    <select-staff ref="selectAuditUser" @change="getAuditUser" :selectOptList="auditUsers"/>
  </div>
</template>

<script>
  import TreeSelect from 'src/views/common/treeSelect'
  import TaskTableEdit from '../components/TaskTableEdit'
  import SelectStaff from '@/views/common/selectStaffOrPost'
  export default {
    name: 'NewTask',
    components: { TaskTableEdit, TreeSelect, SelectStaff },
    data () {
      return {
        organId: '',
        organName: '',
        labelCol: {span: 6},
        wrapperCol: {span: 18},
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
          projectId: '', // 项目id
          billId: '', // 表单id
        }
      }
    },

    methods: {
      // 查询表单列表
      queryBillList () {
        this.$api.reportManage.queryAllReportBill().then(r => {
          let res = r.data
          let arr = []
          if (res && String(res.code) === '0') {
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
        this['taskInfo'][type] = id
      },

      // 获取选择的组织机构
      changeTree (id, name) {
        Object.assign(this, { organId: id, organName: name, projectOptions: [] })
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
      handleSubmit (resolve) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const { attachmentList, organId, userId, auditUsers } = this
            let { projectId, reportBillId, taskName, remark } = values
            // 校验必填
            if (!organId || !auditUsers) {
              this.validateAuditUsers = !auditUsers
              return this.validateOrganId = !organId
            }
            let attachment = attachmentList.map(m => {
              return { attachmentPath: m.url, oldAttachmentName: m.name }
            }) // 处理附件格式
            resolve({
              attachment,
              reportTask: {
                auditBy: auditUsers.map(v => v.id).join(','),
                projectId, reportBillId, taskName, remark, reportBy: userId
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

      organId: function (val) {
        if (val.length) {
          this.validateOrganId = false
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .new_task {
    padding: 0 40px;
  }
</style>
