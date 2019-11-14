<!--资产项目管理业务-资产项目管理详情页面-基础信息组件-->
<template>
  <a-form :class="['detail_info', isEdit ? '' : 'disabled_form']" :form="form" layout="horizontal" :style="`max-height: ${maxHeight || 1000}px`">
    <SG-Title title="基础信息" noMargin/>
    <div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="资产项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目名称"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入资产项目名称'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="资产项目编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入资产项目编码"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入资产项目编码'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="来源方式" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择来源方式"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择来源方式'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="来源渠道" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请输入来源渠道"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入来源渠道'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注" :label-col="{span: 4}" :wrapper-col="{span: 20}">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入备注"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入资产项目编码'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <SG-Title title="其他信息" noMargin/>
    <div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="划转批复下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择划转批复下发时间"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择划转批复下发时间'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="协议签署时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择协议签署时间"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择协议签署时间'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="上报基础情况表时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择上报基础情况表时间"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择上报基础情况表时间'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="房屋核实时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择房屋核实时间"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择房屋核实时间'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="上报房屋划转请示时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :disabled="!isEdit"
              placeholder="请选择划上报房屋划转请示时间"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请选择上报房屋划转请示时间'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="权属办理中存在问题" :label-col="{span: 4}" :wrapper-col="{span: 20}">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入权属办理中存在问题"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入权属办理中存在问题'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="房屋划转历史遗留问题" :label-col="{span: 4}" :wrapper-col="{span: 20}">
            <a-textarea
              :disabled="!isEdit"
              style="resize: none"
              :autosize="{maxRows: 5}"
              placeholder="请输入房屋划转历史遗留问题"
              v-decorator="[`field-${i}`, {rules: [{required: true, message: '请输入房屋划转历史遗留问题'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </a-form>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: ['maxHeight', 'isEdit'],
  data () {
    return {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
      form: this.$form.createForm(this), // 注册form
    }
  },
  
  methods: {
    // 提交数据
    handleSubmit (resolve, reject) {
      this.form.validateFieldsAndScroll(err => {
        if (!err) {
          console.info('success');
        }
      });
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
