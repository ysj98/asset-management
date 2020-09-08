<!--资产项目管理业务-资产项目管理详情页面-基础信息组件-->
<template>
  <a-spin :spinning="spinning">
  <a-form :class="['detail_info', isEdit ? '' : 'disabled_form']" :form="form" :layout="layout">
    <SG-Title title="基础信息" noMargin/>
    <div :class="{'title_div': !type || type == 'approval'}" style="margin-top: 10px; margin-bottom: 15px">
      <a-row>
        <a-col :span="colSpan">
          <a-form-item label="管理机构" :label-col="labelCol" :wrapper-col="wrapperCol">
            <span style="margin-left: 11px">{{organName}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入资产项目名称"
              v-decorator="['projectName', {initialValue, rules: [{required: true, message: '请输入资产项目名称'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产项目编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入资产项目编码"
              v-decorator="['projectCode', {initialValue, rules: [{required: true, message: '请输入资产项目编码'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源渠道" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入来源渠道"
              v-decorator="['souceChannelType', {initialValue, rules: [{required: true, message: '请输入来源渠道'}, {max: 40, message: '最多40个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="来源方式" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              :disabled="!isEdit" style="width: 100%;" :placeholder="isEdit ? '请选择来源方式' : ''"
              :options="typeOptions" @change="getSourceType"
              v-decorator="['sourceType', {initialValue: undefined, rules: [{required: true, message: '请选择来源方式'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="是否接管" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              :disabled="!isEdit" style="width: 100%;" :placeholder="isEdit ? '请选择是否接管' : ''"
              :options="takeOverOptions" @change="getTakeOver"
              v-decorator="['takeOver', {initialValue: undefined, rules: [{required: true, message: '请选择是否接管'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan" v-if="takeOver === '1'">
          <a-form-item label="接管日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择接管日期' : ''"
              v-decorator="['takeOverDate', { rules: [{required: true, message: '请选择接管日期'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan" v-if="takeOver === '1'">
          <a-form-item label="接管时资产状态" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              :disabled="!isEdit" style="width: 100%;" :placeholder="isEdit ? '请选择资产状态' : ''"
              :options="takeOverStatusOptions" v-decorator="['takeoverAssetStatus', {initialValue: undefined}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注" :label-col="type ? {span:4} : {}" :wrapper-col="type ? {span: 20} : {}">
            <a-textarea
              :disabled="!isEdit" style="resize: none" :autosize="{maxRows: 3}" placeholder="请输入备注"
              v-decorator="['remark', { initialValue, rules: [{max: 200, message: '最多200个字符'}] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan === 12 ? 24 : 8">
          <a-form-item label="附件" :label-col="{span: colSpan === 12 ? 4 : ''}" :wrapper-col="{span: colSpan === 12 ? 19 : ''}">
            <SG-UploadFile v-if="isEdit || attachment.length" type="all" :show="!isEdit" v-model="attachment"/>
            <span v-else style="margin-left: 12px">无</span>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <SG-Title title="其他信息" noMargin/>
    <div :class="{'title_div': !type || type == 'approval'}" style="margin-top: 10px; margin-bottom: 15px">
      <!--当来源方式为 划转 字典值1-->
      <a-row v-if="sourceType === '1'">
        <a-col :span="colSpan">
          <a-form-item label="上报基础情况表时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择上报基础情况表时间' : ''"
              v-decorator="['reportBasicInfoDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="资产核实时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择房屋核实时间' : ''"
              v-decorator="['houseVerificationDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报资产划转请示时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择划上报房屋划转请示时间' : ''"
              v-decorator="['reportHouseTransferReqDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="上报核实报告时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择上报核实报告时间' : ''"
              v-decorator="['reportingVerificationReportDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="划转批复下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择划转批复下发时间' : ''"
              v-decorator="['transferApprovalDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="协议签署时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择协议签署时间' : ''"
              v-decorator="['agreementSignDate']"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--当来源方式为 外购 字典值2-->
      <a-row v-else-if="sourceType === '2'">
        <a-col :span="colSpan">
          <a-form-item label="购买日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择购买日期' : ''"
              v-decorator="['purchaseDate']"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--当来源方式为 自建 字典值3-->
      <a-row v-else-if="sourceType === '3'">
        <a-col :span="colSpan">
          <a-form-item label="开发商" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入开发商"
              v-decorator="['developers', {initialValue, rules: [{message: '请输入开发商'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="承建商" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入承建商"
              v-decorator="['contractor', {initialValue, rules: [{message: '请输入承建商'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="竣工日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择竣工日期' : ''"
              v-decorator="['completionDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="交付日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择交付日期' : ''"
              v-decorator="['deliveryDate']"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--当来源方式为 租入 字典值4-->
      <a-row v-else-if="sourceType === '4'">
        <a-col :span="colSpan">
          <a-form-item label="租入开始日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择租入开始日期' : ''"
              v-decorator="['leaseInStartDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="租入结束日期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择租入结束日期' : ''"
              v-decorator="['leaseInEndDate']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="colSpan">
          <a-form-item label="租入合同编号" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit" placeholder="请输入租入合同编号"
              v-decorator="['leaseInContractNo', {initialValue, rules: [{message: '请输入租入合同编号'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="权属办理中存在问题" :label-col="type ? {span:4} : {}" :wrapper-col="type ? {span: 20} : {}">
            <a-textarea
              :disabled="!isEdit" style="resize: none" :autosize="{maxRows: 3}" placeholder="请输入权属办理中存在问题"
              v-decorator="['ownershipHandleProblems', { initialValue, rules: [{max: 200, message: '最多200个字符'}]  }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="历史遗留问题" :label-col="type ? {span:4} : {}" :wrapper-col="type ? {span: 20} : {}">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 3}"
              placeholder="请输入历史遗留问题"
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
  import { queryPlatformDict } from 'src/views/common/commonQueryApi'
  export default {
  name: 'BaseInfo',
  props: ['type', 'projectId', 'organTitle', 'organId', 'sourceTypeOptions'],
  data () {
    return {
      colSpan: 8,
      layout: 'horizontal',
      isEdit: false, // 是否可编辑
      labelCol: {span: 8},
      wrapperCol: {span: 16},
      initialValue: '无', // 表单控件初始值
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      attachment: [], // 附件
      organName: '', // 管理机构
      organKey: '', // 管理机构
      takeOver: '', // 是否接管，否 0，是 1
      sourceType: '', // 来源方式字典值，其他 99，租入 4，自建 3，外购 2，划转 1
      typeOptions: (this.sourceTypeOptions || []).slice(1), // 删除"全部"的选项
      takeOverOptions: [{title: '是', key: '1'}, {title: '否', key: '0'}], // 是否接管的选项
      takeOverStatusOptions: [], // 接管时资产状态选项
      objBySourceType: {
        1: [
          'reportBasicInfoDate', 'houseVerificationDate', 'reportHouseTransferReqDate',
          'transferApprovalDate', 'agreementSignDate', 'reportingVerificationReportDate'
        ],
        2: ['purchaseDate'],
        3: ['deliveryDate', 'completionDate'],
        4: ['leaseInStartDate', 'leaseInEndDate']
      }, // 根据来源方式动态展示的日期格式的字段,用于处理详情和提交操作中格式转换
    }
  },
  
  methods: {
    // 获取来源方式，动态展示其他信息模块中的字段
    getSourceType (value) {
      this.sourceType = String(value)
    },

    // 获取接管状态，动态展示其他字段
    getTakeOver (value) {
      this.takeOver = String(value)
    },

    // 提交数据
    handleSubmit (resolve, reject) {
      const api = {
        add: 'saveProjectManageNewProject',
        edit: 'saveProjectManageEditProject'
      }
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.spinning = true
          const { attachment, organId, type, projectId, objBySourceType, sourceType, takeOver } = this
          // 转换日期格式为string
          let dateKeys = objBySourceType[sourceType] || []
          dateKeys.forEach(key => {
            let dateValue = values[key]
            values[key] = dateValue ?  moment(dateValue).format('YYYY-MM-DD') : ''
          })
          if (String(takeOver) === '1') {
            values.takeOverDate = values.takeOverDate ? moment(values.takeOverDate).format('YYYY-MM-DD') : ''
          }
          let attachArr = attachment.map(m => {
            const { url: attachmentPath, suffix, name } = m
            return { attachmentPath, attachmentSuffix: suffix || name.split('.')[1], oldAttachmentName: name, newAttachmentName: name }
          }) // 处理附件格式
          let form = Object.assign({}, { attachment: attachArr, organId }, values)
          type === 'edit' ? form.projectId = projectId : '' // 编辑时传入projectId
          this.$api.assets[api[type]](form).then(({data: res}) => {
            this.spinning = false
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
        } else {
          reject()
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
      this.$api.assets[api[type]]({projectId: this.projectId}).then(({data: res}) => {
        this.spinning = false
        if (res && String(res.code) === '0') {
          let {
            attachment, organName, organId, projectName, sourceType, souceChannelType, projectCode,
            takeoverAssetStatus, takeOver, ownershipHandleProblems, remark, houseTransferHisProblem,
            sourceTypeName, takeOverDate, takeoverAssetStatusName, contractor, developers, leaseInContractNo, ...others
          } = res.data
          // 处理附件格式
          let attachArr = attachment.map(m => {
            return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix }
          })
          takeOver = String(takeOver)
          sourceType = String(sourceType)
          Object.assign(this, {
            takeOver,
            sourceType,
            attachment: attachArr,
            organKey: organId, // 保存管理机构id
            organName: organName // 展示管理机构名称
          })
          // 转换日期格式为moment
          let formData = {
            ownershipHandleProblems: type === 'show' ? (ownershipHandleProblems || '无') : ownershipHandleProblems,
            houseTransferHisProblem: type === 'show' ? (houseTransferHisProblem || '无') : houseTransferHisProblem,
            projectName, sourceType: type === 'show' ? sourceTypeName : sourceType,
            takeOver, remark: type === 'show' ? (remark || '无') : remark, souceChannelType, projectCode
          }
          if (takeOver === '1') {
            formData.takeoverAssetStatus = type === 'show' ? (takeoverAssetStatusName || '无') : String(takeoverAssetStatus)
            formData.takeOverDate = takeOverDate ?  moment(takeOverDate, 'YYYY-MM-DD') : null
          }
          if (sourceType === '3') {
            formData.developers = type === 'show' ? (developers || '无') : ''
            formData.contractor = type === 'show' ? (contractor || '无') : ''
          }
          if (sourceType === '4') {
            formData.leaseInContractNo = type === 'show' ? (leaseInContractNo || '无') : ''
          }
          // 转换日期格式为string
          let dateKeys = this.objBySourceType[sourceType] || []
          dateKeys.forEach(key => {
            let dateValue = others[key]
            formData[key] = dateValue ?  moment(dateValue, 'YYYY-MM-DD') : null
          })
          return this.$nextTick(function () {
            this.form.setFieldsValue(formData)
          })
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
      if (type == 'add' || type == 'edit') {
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
          colSpan: type == 'approval' ? 12 : 8,
          labelCol: type == 'approval' ? {span: 8} : {},
          wrapperCol: type == 'approval' ? {span: 16} : {},
          isEdit: false,
          layout: type == 'approval' ? 'horizontal' : 'inline',
          initialValue: '无'
        })
        this.queryDetail('show')
      }
    }
  },

  created () {
    this.initAction(this.type || 'show')
    queryPlatformDict('TAKEOVER_ASSET_STATUS').then(list => this.takeOverStatusOptions = list)
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
      .ant-form-item-required:before {
        content: none;
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
