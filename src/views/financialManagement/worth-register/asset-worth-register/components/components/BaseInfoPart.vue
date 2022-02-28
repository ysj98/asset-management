<!--价值登记页面--资产价值登记详情页面--基础信息组件-->
<template>
  <div class="base_info_form">
    <SG-Title title="基础信息"/>
    <a-form
      :form="form"
      :class="{'disabled_form': type == 'approval' || type == 'detail'}"
      :layout="type == 'approval' || type == 'detail' ? 'inline' : 'horizontal'"
      :style="`margin-left: ${(type == 'approval' || type == 'detail') ? '40px' : '20px'}`"
    >
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
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="[ 'registerName', { rules: [{ required: true, message: '请填写价值登记名称' }, {max: 30, message: '最多30个字符'}] } ]"
          />
        </a-form-item>
      </a-col>
      <!--<a-col :span="8">-->
        <!--<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属评估任务">-->
          <!--<a-select-->
            <!--v-decorator="['assessmentTask', { rules: [{ required: true, message: '请选择所属评估任务' }] }]"-->
            <!--placeholder="请选择所属评估任务"-->
            <!--:options="$addTitle(taskOptions)"-->
          <!--/>-->
        <!--</a-form-item>-->
      <!--</a-col>-->
    <!--</a-row>-->
    <!--<a-row :gutter="24">-->
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产项目">
          <a-select
            showSearch
            :filterOption="filterOption"
            v-decorator="['projectId', { rules: [{ required: true, message: '请选择资产项目' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            @change="setData($event, 'projectId')"
            placeholder="请选择资产项目"
            :options="$addTitle(projectOptions)"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产类型">
          <a-select
            v-decorator="['assetType', { rules: [{ required: true, message: '请选择资产类型' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            placeholder="请选择资产类型"
            :options="$addTitle(typeOptions)"
            @change="value => setData(value, 'assetType')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="评估基准日" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择评估基准日"
            @change="changeAssessmentOrganName"
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="['assessmenBaseDate', { rules: [{ required: true, message: '请选择评估基准日' }] }]"
          />
        </a-form-item>
      </a-col>
    <!--</a-row>-->
    <!--<a-row :gutter="24">-->
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="评估方法">
          <a-select
            v-decorator="['assessmentMethod', { rules: [{ required: true, message: '请选择评估方法' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            @change="setData($event, 'assessmentMethodName')"
            placeholder="请选择评估方法"
            :options="$addTitle(methodOptions)"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="评估机构">
          <a-select
            v-decorator="['assessmentOrgan', { rules: [{ required: true, message: '请选择评估机构' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            @change="setData($event, 'assessmentOrganName')"
            placeholder="请选择评估机构"
            :options="$addTitle(organOptions)"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="评估有效截止日" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker
            style="width: 100%"
            :placeholder="['edit','add'].includes(type) ? '请选择评估有效截止日' : ''"
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="['assessmentValidDate']"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="评估报告号">
          <a-input v-decorator="['assessmentNum']" :disabled="type == 'approval' || type == 'detail'" :maxLength="100" placeholer="请输入评估报告号" />
        </a-form-item>
      </a-col>
      <!--当type === detail || type === approval时展示审批人、提交时间、审批状态-->
      <a-col :span="8" v-if="type == 'approval' || type == 'detail'">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="状态">
          <a-input v-decorator="['approvalStatusName']" :disabled="true"/>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="type == 'approval' || type == 'detail'">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="审批人">
          <a-input v-decorator="['createByName']" :disabled="true"/>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="type == 'approval' || type == 'detail'">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="提交时间">
          <a-input v-decorator="['createTime']" :disabled="true"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item
          label="附件"
          :label-col="type == 'approval' || type == 'detail' ? {} : {span: 2}"
          :wrapper-col="type == 'approval' || type == 'detail' ? {} : {span: 21}"
        >
          <SG-UploadFile
            :max="5"
            :maxSize="51200"
            type="all"
            v-model="attachment"
            :show="type == 'approval' || type == 'detail'"
            v-if="type == 'edit' || type == 'add' || attachment.length"
          />
          <span v-else style="margin-left: 12px">无</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item
          label="备注"
          :label-col="type == 'approval' || type == 'detail' ? {span: 1} : {span: 2}"
          :wrapper-col="type == 'approval' || type == 'detail' ? {span: 23} : {span: 21}"
        >
          <a-textarea
            :rows="type == 'approval' || type == 'detail' ? '' : 4"
            style="resize: none"
            placeholder="请输入备注"
            :disabled="type == 'approval' || type == 'detail'"
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
        // organId: '', // 组织机构Id,
        organName: '', // 组织机构Name,
        typeOptions: [], // 资产类型选项,
        taskOptions: [],  // 评估任务选项
        organOptions: [], // 评估机构选项
        form: this.$form.createForm(this),
        methodOptions: [], // 评估方法选项
        projectOptions: [], // 资产项目选项
      }
    },

    methods: {
      changeAssessmentOrganName(date,dateString){
          this.form.setFieldsValue({ assessmentValidDate: moment(dateString,'YYYY-MM-DD').add(1,'y').add(-1,'day') })
          this.setData(dateString, 'assessmenBaseDate')
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      // 提交数据
      handleSubmit (resolve, reject) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const { attachment, details: { organId } } = this
            let attachArr = attachment.map(m => {
              const { url: attachmentPath, name: oldAttachmentName } = m
              return { attachmentPath, oldAttachmentName }
            }) // 处理附件格式
            // 转换日期格式为string
            let date = values.assessmenBaseDate ? moment(values.assessmenBaseDate).format('YYYY-MM-DD') : ''
            const assessmentValidDate = values.assessmentValidDate ? moment(values.assessmentValidDate).format('YYYY-MM-DD') : ''
            console.log('values',values)
            let form = Object.assign({}, values, { attachmentList: attachArr, organId, assessmenBaseDate: date, assessmentValidDate, assessmentNum: values.assessmentNum || ""})
            return resolve(form)
          }
          reject('数据不完整')
        })
      },

      // 渲染数据
      renderDetail () {
        const {type, details} = this
        const {
          approvalStatusName, createByName, registerName, createTime,
          organName, assessmenBaseDate, assessmentValidDate, remark, attachmentList, assetTypeName, assessmentMethod,
          assessmentMethodName, assessmentOrganName, projectId, assetType, assessmentOrgan, projectName, assessmentNum
        } = details
        let attachArr = (attachmentList || []).map(m => {
          return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.oldAttachmentName.split('.')[0] }
        }) // 处理附件格式
        Object.assign(this, { attachment: attachArr, organName })
        let resAssessmentValidDate = assessmentValidDate
        if (this.type == 'edit'){
          resAssessmentValidDate = assessmentValidDate ? moment(assessmentValidDate, 'YYYY-MM-DD') : moment(assessmenBaseDate || new Date(), 'YYYY-MM-DD') .add(1,'y').add(-1,'day')
        }else if (this.type == 'add') {
          resAssessmentValidDate = moment(assessmenBaseDate || new Date(), 'YYYY-MM-DD') .add(1,'y').add(-1,'day')
        }
        console.log('resAssessmentValidDate',resAssessmentValidDate)
        let formatDetails = { registerName, assessmenBaseDate: moment(assessmenBaseDate || new Date(), 'YYYY-MM-DD'), assessmentValidDate: resAssessmentValidDate  }
        !assessmenBaseDate && this.setData(moment(new Date()).format('YYYY-MM-DD'), 'assessmenBaseDate')
        !assessmentValidDate && this.setData(moment(new Date()).format('YYYY-MM-DD'), 'assessmentValidDate')
        // 展示状态下转换数据
        if (type === 'approval' || type === 'detail') {
          formatDetails = Object.assign({}, formatDetails, {
            assessmentNum: assessmentNum,
            remark: remark || '无',
            projectId: projectName,
            assetType: assetTypeName,
            // assessmentTask: assessmentTaskName,
            assessmentOrgan: assessmentOrganName,
            assessmentMethod: assessmentMethodName,
            createByName, approvalStatusName, createTime
          })
        } else {
          formatDetails = Object.assign({}, formatDetails, {
            remark: remark || '', projectId, assetType, assessmentOrgan, assessmentMethod, assessmentNum
          })
        }
        return this.form.setFieldsValue({ ...formatDetails })
      },

      // 查询平台字典
      queryDict () {
        const list = [
          { code: 'asset_type', tip: '资产类型', optionName: 'typeOptions' },
          { code: 'ASSESSMENT_METHOD', tip: '评估方法', optionName: 'methodOptions' }
        ]
        list.forEach(m => {
          const { code, tip, optionName } = m
          this.$api.basics.platformDict({code}).then(r => {
            let res = r.data
            if (res && String(res.code) === '0') {
              return this[optionName] = res.data.map(item => ({
                title: item.name, key: String(item.value)
              }))
            }
            throw res.message || `查询${tip}失败`
          }).catch(err => {
            this.$message.error(err || `查询${tip}失败`)
          })
        })
      },

      // 查询评估机构-机构字典
      queryOrganOptions () {
        const { organId } = this.details
        if (!organId) { return false }
        this.$api.basics.organDict({ code: 'ASSESSMENT_ORGAN', organId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.organOptions = res.data.map(item => ({
              title: item.name, key: String(item.value)
            }))
          }
          throw res.message || '查询评估机构失败'
        }).catch(err => {
          this.$message.error(err || '查询评估机构失败')
        })
      },

      // 查询资产项目接口
      queryProjectOptions () {
        const { organId } = this.details
        if (!organId) { return false }
        this.$api.assets.getObjectKeyValueByOrganId({organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            this.projectOptions = (res.data || []).map(item => {
              return {
                key: String(item.projectId), title: item.projectName
              }
            })
            return false
          }
          throw res.message || '查询资产项目失败'
        }).catch(err => {
          this.loading = false
          this.$message.error(err || '查询资产项目失败')
        })
      },

      // 通过父组件，设置联动项到资产价值清单组件
      setData (val, type) {
        let value = ''
        if (type === 'assessmenBaseDate' || type === 'assetType' || type === 'projectId') {
          value = val
        } else if (type === 'assessmentOrganName') {
          const { organOptions } = this
          value = organOptions.filter(m => m.key === val)[0]['title']
        } else if (type === 'assessmentMethodName') {
          const { methodOptions } = this
          value = methodOptions.filter(m => m.key === val)[0]['title']
        }
        this.$emit('setData', { [type]: value})
      },

      // 单独校验资产项目是否选择
      validateProject () {
        this.form.validateFieldsAndScroll(['projectId', 'assetType'], () => {
          this.$message.warn('请先选择数据')
        })
      }
    },

    mounted () {
      this.renderDetail()
      if (this.type == 'add' || this.type == 'edit') {
        this.queryDict()
        this.queryOrganOptions()
        this.queryProjectOptions()
      } else {
        // 修改布局
        this.formItemLayout = { labelCol: {span: 6}, wrapperCol: {span: 18} }
      }
    },
    watch: {
      'details': function () {
        this.renderDetail()
        if (this.type == 'add' || this.type == 'edit') {
          this.queryOrganOptions()
          this.queryProjectOptions()
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .base_info_form {
    /*& /deep/ .ant-form-item-label label{*/
      /*text-align: justify;*/
    /*}*/
    .disabled_form {
      /*不可以编辑时覆盖表单组件的默认样式*/
      & /deep/ .ant-form-item {
        width: 100% !important;
        margin-bottom: 8px !important;
        textarea.ant-input-disabled {
          width: 100% !important;
          margin-top: 7px;
        }
        .ant-form-item-required:before {
          content: none;
        }
        .ant-calendar-picker-icon {
          display: none;
        }
        .ant-form-item-children {
          width: 100%;
        }
        .ant-input:disabled {
          border: none;
          color: #49505E;
          cursor: default;
          background-color: #fff;
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
  }
</style>
