<!--资产项目管理业务-资产项目管理详情页面-基础信息组件-->
<template>
  <a-spin :spinning="spinning">
  <a-form :class="['detail_info', isEdit ? '' : 'disabled_form']" :form="form" layout="horizontal">
    <SG-Title title="基础信息" noMargin/>
    <div>
      <a-row>
        <a-col :span="colSpan">
          <a-form-item label="管理机构" :label-col="labelCol" :wrapper-col="wrapperCol">
            <span style="margin-left: 11px">{{organName}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目名称"
              v-decorator="['projectName', {initialValue, rules: [{required: true, message: '请输入资产项目名称'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源方式" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              :disabled="!isEdit"
              style="width: 100%;"
              :placeholder="isEdit ? '请选择来源方式' : ''"
              :options="sourceTypeOptions || []"
              v-decorator="['sourceType', {initialValue: undefined, rules: [{required: true, message: '请选择来源方式'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源渠道" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入来源渠道"
              v-decorator="['sourceChannelType', {initialValue, rules: [{required: true, message: '请输入来源渠道'}, {max: 40, message: '最多40个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目编码"
              v-decorator="['projectCode', {initialValue, rules: [{required: true, message: '请输入资产项目编码'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 3}"
              placeholder="请输入备注"
              v-decorator="['remark', { initialValue, rules: [{max: 200, message: '最多200个字符'}] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan === 12 ? 24 : 21">
          <a-form-item label="附件" :label-col="{span: colSpan === 12 ? 4 : 3}" :wrapper-col="{span: colSpan === 12 ? 19 : 21}">
            <SG-UploadFile
              v-if="isEdit || attachment.length"
              :show="!isEdit"
              v-decorator="['attachment']"
            />
            <span v-else style="margin-left: 12px">无</span>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <SG-Title title="其他信息" noMargin/>
    <div>
      <a-row>
        <a-col :span="colSpan">
          <a-form-item label="划转批复下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              style="width: 100%"
              :placeholder="isEdit ? '请选择划转批复下发时间' : ''"
              v-decorator="['transferApprovalDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="协议签署时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              style="width: 100%"
              :placeholder="isEdit ? '请选择协议签署时间' : ''"
              v-decorator="['agreementSignDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报基础情况表时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              style="width: 100%"
              :placeholder="isEdit ? '请选择上报基础情况表时间' : ''"
              v-decorator="['reportBasicInfoDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报房屋划转请示时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              style="width: 100%"
              :placeholder="isEdit ? '请选择划上报房屋划转请示时间' : ''"
              v-decorator="['reportHouseTransferReqDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="房屋核实时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              style="width: 100%"
              :placeholder="isEdit ? '请选择房屋核实时间' : ''"
              v-decorator="['houseVerificationDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="权属办理中存在问题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 3}"
              placeholder="请输入权属办理中存在问题"
              v-decorator="['ownershipHandleProblems', { initialValue, rules: [{max: 200, message: '最多200个字符'}]  }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="房屋划转历史遗留问题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 3}"
              placeholder="请输入房屋划转历史遗留问题"
              v-decorator="['houseTransferHisProblem', { initialValue, rules: [{max: 200, message: '最多200个字符'}]  }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </a-form>
  </a-spin>
</template>

<script>
  import moment from 'moment'
  export default {
  name: 'BaseInfo',
  props: ['type', 'projectId', 'organTitle', 'organId', 'sourceTypeOptions'],
  data () {
    return {
      colSpan: 8,
      isEdit: false, // 是否可编辑
      labelCol: {span: 8},
      wrapperCol: {span: 16},
      initialValue: '无', // 表单控件初始值
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      attachment: [], // 附件
      organName: '', // 管理机构
      organKey: '', // 管理机构
    }
  },
  
  methods: {
    // 提交数据
    handleSubmit (resolve, reject) {
      const api = {
        add: 'saveProjectManageNewProject',
        edit: 'saveProjectManageEditProject'
      }
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.spinning = true
          const { attachment, organId, type, projectId } = this
          let attachArr = attachment.map(m => {
            const { url: attachmentPath, suffix: attachmentSuffix, name: oldAttachmentName } = m
            return { attachmentPath, attachmentSuffix, oldAttachmentName, newAttachmentName: name }
          }) // 处理附件格式
          let {
            agreementSignDate, reportBasicInfoDate, reportHouseTransferReqDate, houseVerificationDate, transferApprovalDate
          } = values
          let dateObj = {
            agreementSignDate: agreementSignDate ? moment(agreementSignDate).format('YYYY-MM-DD') : '',
            reportBasicInfoDate: reportBasicInfoDate ? moment(reportBasicInfoDate).format('YYYY-MM-DD') : '',
            transferApprovalDate: transferApprovalDate ? moment(transferApprovalDate).format('YYYY-MM-DD') : '',
            houseVerificationDate: houseVerificationDate ? moment(houseVerificationDate).format('YYYY-MM-DD') : '',
            reportHouseTransferReqDate: reportHouseTransferReqDate ? moment(reportHouseTransferReqDate).format('YYYY-MM-DD') : ''
          } // 转换日期格式为string
          let form = Object.assign({}, { attachment: attachArr, organId }, values, dateObj)
          type === 'saveProjectManageEditProject' ? form.projectId = projectId : '' // 编辑时传入projectId
          this.$api.assets[api[type]](form).then(r => {
            this.spinning = false
            let res = r.data
            if (res && String(res.code) === '0') {
              this.$message.success('保存成功')
              return resolve()
            }
            throw res.message || '保存失败'
          }).catch(err => {
            this.spinning = false
            this.$message.error(err || '保存失败')
            return reject()
          })
        }
      })
    },

    // 获取编辑时资产项目详情
    queryDetail (type) {
      const api = {
        show: 'queryProjectManageDetailById',
        edit: 'queryProjectManageEditDetailById'
      }
      this.spinning = true
      this.$api.assets[api[type]]({projectId: this.projectId}).then(r => {
        this.spinning = false
        let res = r.data
        if (res && String(res.code) === '0') {
          const {
            attachment, organName, organId, projectName, sourceType, sourceChannelType, projectCode,
            agreementSignDate, reportBasicInfoDate, reportHouseTransferReqDate, houseVerificationDate,
            ownershipHandleProblems, transferApprovalDate, remark
          } = res.data
          let attachArr = attachment.map(m => {
            return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix }
          }) // 处理附件格式
          Object.assign(this, {
            attachment: attachArr,
            organKey: organId, // 保存管理机构id
            organName: organName // 展示管理机构名称
          })
          // 转换日期格式为moment
          let formData = {
            attachment: attachArr,
            agreementSignDate: moment(agreementSignDate || null, 'YYYY-MM-DD'),
            reportBasicInfoDate: moment(reportBasicInfoDate || null, 'YYYY-MM-DD'),
            transferApprovalDate: moment(transferApprovalDate || null, 'YYYY-MM-DD'),
            houseVerificationDate: moment(houseVerificationDate || null, 'YYYY-MM-DD'),
            reportHouseTransferReqDate: moment(reportHouseTransferReqDate || null, 'YYYY-MM-DD'),
            projectName, sourceType, sourceChannelType, projectCode, remark, ownershipHandleProblems
          }
          return this.form.setFieldsValue(formData)
        }
        throw res.message || '查询资产项目详情出错'
      }).catch(err => {
        this.spinning = false
        this.$message.error(err || '查询资产项目详情出错')
      })
    },
    
    // 初始化复制
    initAction (type) {
      if (!type) { return false }
      if (type != 'approval') {
        Object.assign(this, {
          colSpan: 12,
          isEdit: true,
          initialValue: '' // 编辑时不展示‘无’
        })
        if (type == 'add') {
          // 新增时管理机构名称和Id取自props
          this.organName = this.organTitle
          this.organKey = this.organId
        } else {
          // 编辑时调用接口查询详情
          this.queryDetail('edit')
        }
      } else {
        Object.assign(this, {
          colSpan: 12,
          isEdit: false,
          initialValue: '无'
        })
        this.queryDetail('show')
      }
    }
  },

  created () {
    this.initAction(this.type)
  },
  
  watch: {
    // 防止审核和编辑操作权限同时存在时切换页面不刷新编辑状态
    type: function (type) {
      this.initAction(type)
    }
  }
}
</script>

<style lang='less' scoped>
  .detail_info {}
  .disabled_form {
    /*不可以编辑时覆盖表单组件的默认样式*/
    & /deep/ .ant-form-item {
      margin-bottom: 8px !important;
      textarea.ant-input-disabled {
        margin-top: 5px;
      }
      .ant-input:disabled {
        border: none;
        color: #49505E;
        cursor: default;
        background-color: #fff;
      }
      .ant-calendar-picker-icon {
        display: none;
      }
      .ant-select-disabled {
        .ant-select-selection {
          border: none;
          background-color: #fff;
          .ant-select-arrow {
            display: none;
          }
          .ant-select-selection-selected-value {
            color: #49505E;
            cursor: default;
          }
        }
      }
    }
  }
</style>
