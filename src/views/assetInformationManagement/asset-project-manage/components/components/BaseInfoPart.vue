<!--资产项目管理业务-资产项目管理详情页面-基础信息组件-->
<template>
  <a-spin :spinning="spinning">
  <a-form :class="['detail_info', isEdit ? '' : 'disabled_form']" :form="form" layout="horizontal">
    <SG-Title title="基础信息" noMargin/>
    <div>
      <a-row>
        <a-col :span="colSpan">
          <a-form-item label="管理机构" :label-col="labelCol" :wrapper-col="wrapperCol">
            <span>{{organName}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目名称"
              v-decorator="['projectName', {initialValue, rules: [{required: true, message: '请输入资产项目名称'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源方式" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择来源方式"
              v-decorator="['sourceType', {initialValue, rules: [{required: true, message: '请选择来源方式'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源渠道" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入来源渠道"
              v-decorator="['sourceChannelType', {initialValue, rules: [{required: true, message: '请输入来源渠道'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目编码"
              v-decorator="['projectCode', {initialValue, rules: [{required: true, message: '请输入资产项目编码'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入备注"
              v-decorator="['remark', { initialValue }]"
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
            <span v-else style="margin-left: 11px">无</span>
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
              placeholder="请选择划转批复下发时间"
              v-decorator="['transferApprovalDate', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="协议签署时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              placeholder="请选择协议签署时间"
              v-decorator="['agreementSignDate', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报基础情况表时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              placeholder="请选择上报基础情况表时间"
              v-decorator="['reportBasicInfoDate', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报房屋划转请示时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              placeholder="请选择划上报房屋划转请示时间"
              v-decorator="['reportHouseTransferReqDate', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="房屋核实时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit"
              placeholder="请选择房屋核实时间"
              v-decorator="['houseVerificationDate', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="权属办理中存在问题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入权属办理中存在问题"
              v-decorator="['ownershipHandleProblems', { initialValue }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="房屋划转历史遗留问题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入房屋划转历史遗留问题"
              v-decorator="['houseTransferHisProblem', { initialValue }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </a-form>
  </a-spin>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: ['type', 'projectId', 'organTitle', 'organId'],
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
      initData: {} // 编辑时保存用作入参
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
          const { initData, attachment, organId, type } = this
          let form = Object.assign({}, initData, attachment, values)
          type === 'add' && (form.organId = organId) // 当为新增时organId取自props，编辑时取自initData
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
          const { attachment, organName,  ...others} = res.data
          let attachArr = attachment.map(m => {
            return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix }
          })
          this.attachment = attachArr
          this.organName = organName  // 展示管理机构名称
          this.initData = others // 复制当前接口数据，保存时用
          return this.form.setFieldsValue({...others, attachment: attachArr})
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
