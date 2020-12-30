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
      <a-col :span="8" v-if="type == 'approval' || type == 'detail'">
        <a-form-item label="领用单编号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input  v-decorator="['receiveId']" disabled/>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="领用单名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input
            placeholder="请填写领用登记单名称"
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="[ 'receiveName', {  rules: [{ required: true, message: '请填写领用登记单名称' }, {max: 30, message: '最多30个字符'}] } ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="type == 'approval' || type == 'detail'">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="领用单状态">
          <a-input v-decorator="['approvalStatusName']" :disabled="true"/>
        </a-form-item>
        </a-col>
      <a-col :span="8">
        <a-form-item label="所属组织机构" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="organName" disabled/>
          <!--<span style="margin-left: 12px">{{organName}}</span>-->
        </a-form-item>
      </a-col>
       <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产项目">
          <a-select
            showSearch
            :filterOption="filterOption"
            v-decorator="['projectId', { rules: [{ required: true, message: '请选择资产项目' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            @change="setData($event, 'projectId')"
            placeholder="请选择资产项目"
            :options="projectOptions"
          />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产类型">
          <a-select
            v-decorator="['assetType', { rules: [{ required: true, message: '请选择资产类型' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            placeholder="请选择资产类型"
            :options="typeOptions"
            @change="value => setData(value, 'assetType')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="领用时间" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择领用时间"
            @change="(date, dateString) => setData(dateString, 'receiveDate')"
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="['receiveDate', { rules: [{ required: true, message: '请选择领用时间' }] }]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="预计归还时间" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择预计归还时间"
            @change="(date, dateString) => setData(dateString, 'returnDate')"
            :disabled="type == 'approval' || type == 'detail'"
             v-decorator="[ 'returnDate']"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" >
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="领用部门">
          <treeSelect @changeTree="setData(arguments, 'receiveOrganName')"  placeholder='请选择领用部门' :allowClear="false" style="width: 100%" v-decorator="['receiveOrganName', { rules: [{ required: true, message: '请选择领用部门' }] }]"
            :disabled="type == 'approval' || type == 'detail'" ></treeSelect>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="领用人">
          <a-select
            v-decorator="['receiveUserName', { rules: [{ required: true, message: '请选择领用人' }] }]"
            :disabled="type == 'approval' || type == 'detail'"
            @change="setData($event, 'receiveUserName')"
            placeholder="请选择领用人"
            :options="staffList"
          />
        </a-form-item>
      </a-col>
       <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="提交人" v-if="type == 'approval' || type == 'detail'">
          <a-input v-decorator="[ 'createByName']" disabled/>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="提交时间" v-if="type == 'approval' || type == 'detail'">
          <a-input v-decorator="[ 'createTime']"  disabled/>
        </a-form-item>
      </a-col>
      </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item
          label="领用说明"
          :label-col="type == 'approval' || type == 'detail' ? {span: 1} : {span: 2}"
          :wrapper-col="type == 'approval' || type == 'detail' ? {span: 23} : {span: 21}"
        >
          <a-textarea
            :rows="type == 'approval' || type == 'detail' ? '' : 4"
            style="resize: none"
            placeholder="请输入领用说明"
            :disabled="type == 'approval' || type == 'detail'"
            v-decorator="['remark', { rules: [{max: 200, message: '最多200个字符'}] }]"
          />
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
            type="all"
            v-model="attachment"
            :maxSize="5120"
            :show="type == 'approval' || type == 'detail'"
            v-if="type == 'edit' || type == 'add' || attachment.length"
          />
          <span v-else style="margin-left: 12px">无</span>
        </a-form-item>
      </a-col>
    </a-row>
    
  </a-form>
  </div>
</template>

<script>
  import moment from 'moment'
  import TreeSelect from '../../../common/treeSelect'
  export default {
    name: 'BaseInfoPart',
    props: ['type', 'details', 'defaultOrganName', 'defaultOrganId'],
    components: {TreeSelect},
    data () {
      return {
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        attachment: [], // 附件
        organId: '', // 组织机构Id,
        organName: '', // 组织机构Name,
        typeOptions: [], // 资产类型选项,
        taskOptions: [],  // 评估任务选项
        organOptions: [], // 评估机构选项
        form: this.$form.createForm(this),
        methodOptions: [], // 评估方法选项
        projectOptions: [], // 资产项目选项
        createTime: '', // 提交时间
        createByName: '', // 提交人
        receiveId: '', // 领用单Id
        staffList: [], // 部门人员列表
        receiveUserId: ''// 领用人id
      }
    },

    methods: {
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
            let receiveDate = values.receiveDate ? moment(values.receiveDate).format('YYYY-MM-DD') : ''
            let returnDate = values.returnDate ? moment(values.returnDate).format('YYYY-MM-DD') : ''
            let form = Object.assign({}, values, { attachmentList: attachArr, organId, receiveDate: receiveDate, receiveDate:receiveDate, returnDate:returnDate, receiveUserId: this.receiveUserId })
            return resolve(form)
          }
          reject('数据不完整')
        })
      },
      
      // 渲染数据
      renderDetail () {
        const {type, details} = this
        const {
          approvalStatusName,  assetType,  assetTypeName, attachmentList, createByName, createTime,
          detaList, organId, organName, projectId,  projectName, receiveArea, receiveDate, receiveId, 
          receiveName, receiveOrganId, receiveOrganName, receiveUserName, remark, returnDate, receiveUserId
        } = details
        let attachArr = (attachmentList || []).map(m => {
          return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.oldAttachmentName.split('.')[0] }
        }) // 处理附件格式
        Object.assign(this, { attachment: attachArr, organName })
        let formatDetails = { receiveName, receiveDate: moment(receiveDate || new Date(), 'YYYY-MM-DD'), returnDate: moment(returnDate || new Date(), 'YYYY-MM-DD')  }
        !receiveDate && this.setData(moment(new Date()).format('YYYY-MM-DD'), 'receiveDate')
        // 展示状态下转换数据
        if (type === 'approval' || type === 'detail') {
         formatDetails = Object.assign({}, formatDetails, {
            remark: remark || '无',
            projectId: projectName,
            assetType: assetTypeName,
            receiveId,
            createByName, approvalStatusName, createTime, receiveUserName, receiveOrganName
          })
        } else {
         formatDetails = Object.assign({}, formatDetails, {
            remark: remark || '', 
            projectId: projectName,
            assetType: assetTypeName,
             receiveUserName, receiveOrganName
          })
        }
        console.log(formatDetails)
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
        let id = ''
        if (type === 'receiveDate' || type === 'assetType' || type === 'projectId' || type === 'returnDate') {
          value = val
          this.form.setFieldsValue({ [type]: value })
          this.$emit('setData', { [type]: value})
        } else if (type === 'receiveOrganName') {
          const { organOptions } = this
          value = val[1]
          id = val[0]
         this.form.setFieldsValue({ receiveOrganName: value })
         this.receiveUserId = id
          // value = organOptions.filter(m => m.key === val)[0]['title']
          // id = organOptions.filter(m => m.key === val)[0]['key']
          this.queryStaff(id)
          this.$emit('setData', { [type]: value, receiveOrganId: +id} )
        } else if (type === 'receiveUserName') {
          const { staffList } = this
          value = staffList.filter(m => m.key === val)[0]['title']
          id = staffList.filter(m => m.key === val)[0]['key']
          this.form.setFieldsValue({ receiveUserName: value, receiveUserId: id })
          this.$emit('setData', { [type]: value, receiveUserId: +id})
        }
        
      },
      
      // 单独校验资产项目是否选择
      validateProject () {
        this.form.validateFieldsAndScroll(['projectId', 'assetType'], () => {
          this.$message.warn('请先选择数据')
        })
      },

      // 查询部门人员
      queryStaff(id) {
        this.$api.basics.queryUserPageList({organId: id, pageNo:1, pageLength:5}).then(res => {
          this.staffList = res.data.data.map(r => {
            return {key: r.userId, title:r.name}
          })
           return //this.form.setFieldsValue({ receiveUserName: this.staffList[0].title })
        })
      } 
    },
    mounted () {
      this.renderDetail()
      if (this.type == 'add' || this.type == 'edit') {
        this.queryDict()
        this.queryOrganOptions()
        this.queryProjectOptions()
        this.queryStaff(this.details.organId)
        
        
      } else {
        // 修改布局
        this.formItemLayout = { labelCol: {span: 6}, wrapperCol: {span: 18} }
      }
    },
    watch: {
      details: function () {
        this.renderDetail()
        if (this.type == 'add' || this.type == 'edit') {
          this.queryOrganOptions()
          this.queryProjectOptions()
        }
      },

    },
    created() {
      this.organName = this.defaultOrganName
      this.organId = +this.defaultOrganId
      console.log(this.details)
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
