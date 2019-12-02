<!--价值登记页面--资产价值登记详情页面--基础信息组件-->
<template>
  <div class="base_info_form">
    <SG-Title title="基础信息"/>
    <a-form :form="form" layout="horizontal">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item label="所属组织机构" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="organName" disabled/>
          <!--<span style="margin-left: 12px">{{organName}}</span>-->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="价值登记名称">
          <a-input
            placeholder="请填写价值登记名称"
            v-decorator="[ 'registerName', { rules: [{ required: true, message: '请填写价值登记名称' }, {max: 30, message: '最多30个字符'}] } ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属评估任务">
          <a-select
            v-decorator="['assessmentTask', { rules: [{ required: true, message: '请选择所属评估任务' }] }]"
            placeholder="请选择所属评估任务"
            :options="taskOptions"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产项目">
          <a-select
            v-decorator="['projectId', { rules: [{ required: true, message: '请选择资产项目' }] }]"
            placeholder="请选择资产项目"
            :options="projectOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产类型">
          <a-select
            v-decorator="['assetsType', { rules: [{ required: true, message: '请选择资产类型' }] }]"
            placeholder="请选择资产类型"
            :options="typeOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="评估基准日" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker
            :disabled="isEdit"
            style="width: 100%"
            placeholder="请选择评估基准日"
            v-decorator="['assessmenBaseDate', { rules: [{ required: true, message: '请选择评估基准日' }] }]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="评估方法">
          <a-select
            v-decorator="['assessmentMethod', { rules: [{ required: true, message: '请选择评估方法' }] }]"
            placeholder="请选择评估方法"
            :options="methodOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="评估机构">
          <a-select
            v-decorator="['assessmentOrgan', { rules: [{ required: true, message: '请选择评估机构' }] }]"
            placeholder="请选择评估机构"
            :options="organOptions"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="附件" :label-col="{span: 2}" :wrapper-col="{span: 21}">
          <SG-UploadFile
            :show="!isEdit"
            v-if="isEdit || attachment.length"
            v-model="attachment"
          />
          <span v-else style="margin-left: 12px">无</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="备注" :label-col="{span: 2}" :wrapper-col="{span: 21}">
          <a-textarea
            :rows="4"
            :disabled="isEdit"
            style="resize: none"
            placeholder="请输入备注"
            v-decorator="['remark', { rules: [{max: 200, message: '最多200个字符'}] }]"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'BaseInfoPart',
    props: ['type', 'details'],
    data () {
      return {
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        attachment: [], // 附件
        organId: '', // 组织机构Id,
        organName: '', // 组织机构Name,
        isEdit: false, // 是否编辑状态
        typeOptions: [], // 资产类型选项,
        taskOptions: [],  // 评估任务选项
        organOptions: [], // 评估机构选项
        form: this.$form.createForm(this),
        methodOptions: [], // 评估方法选项
        projectOptions: [], // 资产项目选项
      }
    },

    methods: {
      // 提交数据
      handleSubmit (resolve, reject) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const { attachment, details: { organId } } = this
            let attachArr = attachment.map(m => {
              const { url: attachmentPath, suffix, name } = m
              return { attachmentPath, attachmentSuffix: suffix || name.split('.')[1], oldAttachmentName: name, newAttachmentName: name }
            }) // 处理附件格式
            // 转换日期格式为string
            let date = values.assessmenBaseDate ? moment(values.assessmenBaseDate).format('YYYY-MM-DD') : ''
            let form = Object.assign({}, values, { attachment: attachArr, organId, assessmenBaseDate: date})
            return resolve(form)
          }
          reject('数据不完整')
        })
      },
      
      // 渲染数据
      renderDetail () {
        const {type, details} = this
        const {
          organName, assessmenBaseDate, remark, attachmentList, assessmentTaskName, projectName, assetTypeName,
          assessmentMethodName, assessmentOrganName, ...others} =details
        let attachArr = (attachmentList || []).map(m => {
          return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix }
        }) // 处理附件格式
        Object.assign(this, { attachment: attachArr, organName })
        let formatDetails = {
          assessmenBaseDate: assessmenBaseDate ? moment(assessmenBaseDate, 'YYYY-MM-DD') : null
        }
        // 转换数据
        if (type === 'approval' || type === 'detail') {
          let obj = {
            remark: remark || '无',
            projectId: projectName,
            assetsType: assetTypeName,
            assessmentTask: assessmentTaskName,
            assessmentOrgan: assessmentOrganName,
            assessmentMethod: assessmentMethodName,
            
          }
          formatDetails = Object.assign({}, formatDetails, obj)
        }
        return this.form.setFieldsValue({ ...others, ...formatDetails })
      }
    },
    
    mounted () {
      this.renderDetail()
    }
  }
</script>

<style lang='less' scoped>
  .base_info_form {
    /*& /deep/ .ant-form-item-label label{*/
      /*text-align: justify;*/
    /*}*/
  }
</style>
